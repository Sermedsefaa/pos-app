"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useDil } from "./DilContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { dil, setDil, t } = useDil()
  const rol = session?.user?.rol

  return (
    <nav
      className="bg-gray-900 text-white p-4 flex items-center justify-between"
      dir={dil === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex gap-6 items-center">
        <img src="/logo.png" alt="Logo" style={{ height: "40px", width: "auto" }} />
        {rol === "sahip" && (
          <Link href="/" className="hover:text-gray-300">{t.anaSayfa}</Link>
        )}
        <Link href="/pos" className="hover:text-gray-300">{t.pos}</Link>
        {rol === "sahip" && (
          <Link href="/urunler" className="hover:text-gray-300">{t.urunler}</Link>
        )}
        {rol === "sahip" && (
          <Link href="/siparisler" className="hover:text-gray-300">{t.siparisler}</Link>
        )}
        {rol === "sahip" && (
          <Link href="/kullanicilar" className="hover:text-gray-300">Kullanıcılar</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDil(dil === "tr" ? "ar" : "tr")}
          className="text-xs border border-gray-600 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-colors"
        >
          {dil === "tr" ? "العربية" : "Türkçe"}
        </button>
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/giris" })}
              className="text-gray-300 hover:text-white text-sm"
            >
              {t.cikisYap}
            </button>
          </div>
        ) : (
          <Link href="/giris" className="text-gray-300 hover:text-white text-sm">
            {t.girisYap}
          </Link>
        )}
      </div>
    </nav>
  )
}