import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProposeMagic — Interactive Prototype",
  description:
    "AI-powered cinematic pages for proposals, birthdays, Valentine's, and anniversaries.",
};

const fontsHref =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Lora:ital,wght@0,400..700;1,400..700&family=Cinzel:wght@400..700&family=Bodoni+Moda:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..700&family=DM+Sans:wght@400..700&family=Work+Sans:wght@400..700&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
