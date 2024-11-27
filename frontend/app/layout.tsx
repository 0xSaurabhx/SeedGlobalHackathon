import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Providers from "@/components/Providers" // Ensure the import path is correct

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medical Dashboard",
  description: "A comprehensive medical dashboard with health analysis and wearable device tracking",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* Ensure Providers is correctly wrapping the content */}
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

