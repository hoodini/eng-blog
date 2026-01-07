import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";

const GA_TRACKING_ID = "G-PB2NQPQ242";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yuval Avidani | AI Builder & Speaker",
  description: "Insights on AI, automation, and code from AWS GenAI Superstar & GitHub Star Yuval Avidani",
  keywords: ["AI", "Automation", "GenAI", "AWS", "GitHub", "Tech", "Code"],
  authors: [{ name: "Yuval Avidani" }],
  openGraph: {
    title: "Yuval Avidani | AI Builder & Speaker",
    description: "Insights on AI, automation, and code",
    url: "https://yuv.ai",
    siteName: "Yuval Avidani Blog",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuval Avidani | AI Builder & Speaker",
    description: "Insights on AI, automation, and code",
    creator: "@yuvalav",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
