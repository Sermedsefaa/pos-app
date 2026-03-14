import "./globals.css"
import Navbar from "./components/Navbar"
import Providers from "./components/Providers"

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}