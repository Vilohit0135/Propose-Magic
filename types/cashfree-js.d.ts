// Ambient types for @cashfreepayments/cashfree-js. The package ships no
// .d.ts files of its own, so we declare only the surface we use in
// creation-flow.tsx. Full SDK reference: docs.cashfree.com (Drop-in
// integration → JS SDK).

declare module '@cashfreepayments/cashfree-js' {
  export type CashfreeMode = 'sandbox' | 'production';

  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_modal' | '_top' | '_parent';
    returnUrl?: string;
  }

  export interface CheckoutResult {
    error?: { code?: string; message?: string };
    redirect?: boolean;
    paymentDetails?: { paymentMessage?: string };
  }

  export interface Cashfree {
    checkout(options: CheckoutOptions): Promise<CheckoutResult>;
  }

  export function load(opts: { mode: CashfreeMode }): Promise<Cashfree>;
}
