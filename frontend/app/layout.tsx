import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import CircleCursor from "@/components/ui/CircleCursor"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://momentum-science-academy.vercel.app'), // Replace with actual domain
  title: {
    default: "Momentum Science Academy - JEE, NEET & ICSE Coaching",
    template: "%s | Momentum Science Academy"
  },
  description: "Top-rated coaching institute in Vasai East for JEE, NEET, MHT-CET, and Std 9-10. Proven track record with IIT & AIIMS selections.",
  keywords: ["JEE coaching", "NEET preparation", "Science Academy Vasai", "MHT-CET classes", "ICSE tuition"],
  authors: [{ name: "Momentum Science Academy" }],
  openGraph: {
    title: "Momentum Science Academy - Engineering & Medical Entrance Coaching",
    description: "Join the league of toppers. Expert faculty and personalized coaching for JEE, NEET, and Boards.",
    url: 'https://momentum-science-academy.vercel.app/',
    siteName: 'Momentum Science Academy',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1A1F6B",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <CircleCursor />

        {children}
        <Analytics />
      </body>
    </html>
  )
}
