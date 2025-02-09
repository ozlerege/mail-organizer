import type { Metadata } from "next";
import { Pixelify_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const pixelFont = Pixelify_Sans({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mail Organizer",
  description: "A pixel-styled mail organization app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixelFont.variable} ${geistSans.variable} ${geistMono.variable} font-pixel antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
