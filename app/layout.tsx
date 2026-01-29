import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: '너, 약속 지켰어? - 3일 약속 프로젝트',
  description: '3일 뒤까지 내가 해낼 약속을 선언하고 지켜보세요',
  openGraph: {
    title: '너, 약속 지켰어?',
    description: '3일 약속 프로젝트',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
