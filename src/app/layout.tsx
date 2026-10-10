import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PROFILE } from "@/lib/data";

const inter = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--f-inter",
  weight: "100 900",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--f-serif",
  display: "swap",
});
const mono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--f-mono",
  weight: "100 800",
  display: "swap",
});

const title = `${PROFILE.name} — ${PROFILE.heroRole}`;
const description = `${PROFILE.role}. ${PROFILE.stack}. Based in ${PROFILE.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${PROFILE.name} — ${PROFILE.role}` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}.rv-mask>.rv-in{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
