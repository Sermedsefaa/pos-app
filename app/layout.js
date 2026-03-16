import "./globals.css"
import Providers from "./components/Providers"
import { DilProvider } from "./components/DilContext"
import MainLayout from "./components/MainLayout"

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          <DilProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </DilProvider>
        </Providers>
      </body>
    </html>
  )
}