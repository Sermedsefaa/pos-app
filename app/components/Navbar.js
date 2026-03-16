"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useDil } from "./DilContext"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const { dil, setDil, t } = useDil()
  const pathname = usePathname()

  const linkler = [
   { href: "/dashboard", label: t.anaSayfa },
    { href: "/pos", label: t.pos },
    { href: "/urunler", label: t.urunler },
    { href: "/siparisler", label: t.siparisler },
    ...(session?.user?.rol === "sahip"
      ? [{ href: "/kullanicilar", label: t.Kullanıcılar }]
      : []),
  ]

  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <img src="/logo.png" alt="Logo" style={{ height: "32px", width: "auto" }} />
        <div className="flex gap-1">
          {linkler.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session && (
          <span className="text-xs text-gray-500 hidden md:block">
            {session.user.isletmeAdi}
          </span>
        )}
        <button
          onClick={() => setDil(dil === "tr" ? "ar" : "tr")}
          className="text-xs border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          {dil === "tr" ? "العربية" : "Türkçe"}
        </button>
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/giris" })}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {t.cikisYap}
          </button>
        ) : (
          <Link href="/giris" className="text-xs text-gray-400 hover:text-white">
            {t.girisYap}
          </Link>
        )}
      </div>
    </nav>
  )
}