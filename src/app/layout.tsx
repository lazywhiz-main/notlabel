import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ME≠LABEL | わたしは病名じゃない。",
  description: "病気や肩書きによって人が社会からラベリングされ、排除される構造に抗い、\"ただのわたし\"として生きることを応援するメディア",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="min-h-screen bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
