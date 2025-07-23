import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Script from 'next/script'
import "../styles/globals.css";

let title = "Pro Headshot Generator";
let description = "Generate your professional headshot instantly.";
let ogimage = "/og-image.png";
let sitename = "proHeadshot.pics";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: "https://proheadshot.vercel.app",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-black">
        {children}
        <Analytics />
        <Script defer data-domain="proheadshot.pics" src="https://data.lucata.co/js/script.js" />
      </body>
    </html>
  );
}
