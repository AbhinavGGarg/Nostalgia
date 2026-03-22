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
  title: "Nostalgia — A Personalized Digital Time Machine",
  description:
    "Immersive, chaotic, personalized recreation of 2016 internet culture with mixed feeds, mini-games, camera filters, and timeline collapse.",
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
