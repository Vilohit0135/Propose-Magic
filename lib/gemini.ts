// Thin REST wrapper around Google's Generative Language API. We skip
// `@google/generative-ai` to avoid another npm dep — the call shape is
// trivial and this keeps edge-runtime-friendly too.
//
// Model: gemini-2.5-flash — fast, cheap, sufficient for ~500-token romantic
// letters and a few-question JSON quiz. Temperature left at the API default
// for letters; forced to low + JSON mime for quiz so responses round-trip
// cleanly through JSON.parse.

export type GeminiCallResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

type GeminiConfig = {
  maxOutputTokens?: number;
  temperature?: number;
  json?: boolean;
};

export async function callGemini(
  systemInstruction: string,
  userText: string,
  cfg: GeminiConfig = {},
): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 503, error: 'gemini_not_configured' };
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: cfg.maxOutputTokens ?? 800,
  };
  if (cfg.temperature !== undefined) generationConfig.temperature = cfg.temperature;
  if (cfg.json) generationConfig.responseMimeType = 'application/json';

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig,
      }),
    });

    const data = (await resp.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      error?: { message?: string; status?: string };
    };

    if (!resp.ok) {
      return {
        ok: false,
        status: resp.status,
        error: data.error?.message || `http_${resp.status}`,
      };
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();

    if (!text) {
      return { ok: false, status: 502, error: 'empty_response' };
    }
    return { ok: true, text };
  } catch (e) {
    return {
      ok: false,
      status: 500,
      error: e instanceof Error ? e.message : 'network_error',
    };
  }
}
