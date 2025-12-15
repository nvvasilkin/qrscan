import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Message for you',
  description: 'Listen to a personalized message from the restaurant',
  icons: {
    icon: [
      {
        url: 'https://orderbyte.io/api/v1/download/brands/85854185-aaf6-4780-ba06-d4b988a0452e.png',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://orderbyte.io/api/v1/download/brands/85854185-aaf6-4780-ba06-d4b988a0452e.png',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DWN0B2MRCV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DWN0B2MRCV');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}

