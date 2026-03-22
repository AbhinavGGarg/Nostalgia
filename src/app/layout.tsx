import type { Metadata } from "next";
import { Bangers, Fredoka, VT323 } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-bubble",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bangers = Bangers({
  variable: "--font-chaos",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "NOSTALGIA — The 2016 Internet Search Engine",
  description:
    "Search like it's 2016 with delayed loading, old-web result styling, injected nostalgia content, and chaotic internet popups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${bangers.variable} ${vt323.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#120531] text-zinc-100">{children}</body>
    </html>
  );
}
