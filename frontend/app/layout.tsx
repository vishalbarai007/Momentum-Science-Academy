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
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Momentum Science Academy - JEE/NEET/ICSE Coaching Excellence",
  description:
    "Premier coaching academy for 9th-12th standard and competitive exams (JEE, NEET, MHT-CET) in Vasai East. Expert faculty, proven results.",
  keywords: ["JEE coaching", "NEET preparation", "ICSE coaching", "Vasai East", "competitive exams"],
  authors: [{ name: "Momentum Science Academy" }],
  generator: "v0.app",
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
      <CircleCursor />
      <body className="font-sans antialiased">
        <CircleCursor />

        {children}
        <Analytics />
      </body>
    </html>
  )
}
