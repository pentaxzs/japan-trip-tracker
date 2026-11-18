import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Planner",
  description:
    "여행 전 / 중 / 후 3단계로 나눠 일본 여행을 완벽하게 정리하는 TODO 웹앱",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/*
          Pretendard를 직접 호스팅한다 (public/fonts/pretendard).
          dynamic subset이라 쓰는 글자 블록만 내려받는다 — 통짜 2MB 대신 100KB 남짓.
          해외 로밍에서 쓰는 앱이라 외부 CDN에 걸지 않았다.
        */}
        {/* eslint-disable-next-line @next/next/no-css-tags --
            next/font는 Google Fonts에 없는 Pretendard를 다루지 못하고,
            globals.css에서 @import하면 CSS 두 개를 직렬로 받는다.
            <link>라야 폰트 CSS와 앱 CSS를 동시에 받는다. */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendard.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
