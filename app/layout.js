import "./globals.css"
import Providers from "./components/Providers"
import { DilProvider } from "./components/DilContext"
import MainLayout from "./components/MainLayout"

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
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