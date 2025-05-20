import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ThemeProvider as CustomThemeProvider } from "@/context/ThemeContext"
import { NextAuthProvider } from "@/context/SesssionProvider"

export const metadata = {
  title: "Sublmnl - Subliminal Audio Creation",
  description: "Create personalized subliminal audio tracks for self-improvement",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-900 text-gray-100`}>
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CustomThemeProvider>
              <NextAuthProvider>
                <AuthProvider>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <Toaster />
                </AuthProvider>
              </NextAuthProvider>
            </CustomThemeProvider>
          </ThemeProvider>
      </body>
    </html>
  )
}

