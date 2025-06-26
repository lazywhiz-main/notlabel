import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const notoSerif = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const notoSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "ME≠LABEL | わたしは病名じゃない。",
  description: "病気や肩書きによって人が社会からラベリングされ、排除される構造に抗い、\"ただのわたし\"として生きることを応援するメディア。がん研究論文のAI要約も提供。",
  keywords: ["ME≠LABEL", "医療", "がん", "病気", "患者", "研究", "AI要約", "PubMed", "論文", "医療情報"],
  authors: [{ name: "ME≠LABEL" }],
  creator: "ME≠LABEL",
  publisher: "ME≠LABEL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: process.env.SITE_URL || 'https://no-label.me',
    siteName: 'ME≠LABEL',
    title: 'ME≠LABEL | わたしは病名じゃない。',
    description: '病気や肩書きによって人が社会からラベリングされ、排除される構造に抗い、"ただのわたし"として生きることを応援するメディア。がん研究論文のAI要約も提供。',
    images: [
      {
        url: `${process.env.SITE_URL || 'https://no-label.me'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ME≠LABEL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ME≠LABEL | わたしは病名じゃない。',
    description: '病気や肩書きによって人が社会からラベリングされ、排除される構造に抗い、"ただのわたし"として生きることを応援するメディア。',
    images: [`${process.env.SITE_URL || 'https://no-label.me'}/og-image.jpg`],
    creator: '@ME_NOT_LABEL',
  },
  alternates: {
    canonical: process.env.SITE_URL || 'https://no-label.me',
    types: {
      'application/rss+xml': [
        { url: '/research/rss.xml', title: 'ME≠LABEL Research RSS Feed' },
      ],
    },
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <head>
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="ME≠LABEL Research RSS Feed"
          href="/research/rss.xml"
        />
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
