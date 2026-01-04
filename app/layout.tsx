import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
