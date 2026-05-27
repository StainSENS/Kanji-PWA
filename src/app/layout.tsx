import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanji Deck",
  description: "Kanji flashcard PWA with spaced repetition",
  applicationName: "Kanji Deck",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kanji Deck",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2aa9a8",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,211,238,0.35),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(45,212,191,0.30),transparent_50%),linear-gradient(160deg,rgba(20,184,166,0.28),rgba(56,189,248,0.22))] bg-[#2aa9a8] text-white">
        {children}
      </body>
    </html>
  );
}
