import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/theme-override.css'
import ThemeWrapper from '@/components/ThemeWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NestFin',
  description: 'Sistema de gestão financeira',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              background-color: #122112 !important;
              color: white !important;
            }
            html, body, #__next {
              background-color: #122112 !important;
              color: white !important;
              margin: 0 !important;
              padding: 0 !important;
              min-height: 100vh !important;
            }
            .bg-white, .bg-gray-50, .bg-gray-100, .bg-background {
              background-color: #122112 !important;
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
} 