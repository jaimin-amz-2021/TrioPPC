import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrioPerspective | Bulk Amazon PPC Campaign Launcher',
  description: 'Create bulk Amazon Sponsored Products campaigns in seconds. Upload ASINs, configure targeting, and download your bulk sheet.',
  keywords: 'Amazon PPC, Bulk Campaign, Sponsored Products, Amazon Advertising, PPC Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
