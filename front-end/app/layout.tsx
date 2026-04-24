import type { Metadata } from "next";
import { Inter, Space_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Graph.sys",
  description: "Easy, plug-and-play graph analyzer service to visualize your hierarchies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${pressStart2P.variable}`}>
      <body className="font-sans antialiased bg-black text-white selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
