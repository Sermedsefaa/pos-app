"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useDil } from "./DilContext"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const { dil, setDil, t } = useDil()
  const [menuAcik, setMenuAcik] = useState(false)

  return (
    <nav className="bg-gray-900 text-white" dir={dil === "ar" ? "rtl" : "ltr"}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" style={{ height: "36px", width: "auto" }} />
          {/* Masaüstü linkler */}
          <div className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-gray-300">{t.anaSayfa}</Link>
            <Link href="/pos" className="hover:text-gray-300">{t.pos}</Link>
            <Link href="/urunler" className="hover:text-gray-300">{t.urunler}</Link>
            <Link href="/siparisler" className="hover:text-gray-300">{t.siparisler}</Link>
            {session?.user?.rol === "sahip" && (
              <Link href="/kullanicilar" className="hover:text-gray-300">
                Kullanıcılar
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDil(dil === "tr" ? "ar" : "tr")}
            className="text-xs border border-gray-600 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-colors"
          >
            {dil === "tr" ? "العربية" : "Türkçe"}
          </button>

          {/* Masaüstü çıkış */}
          <div className="hidden md:block">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/giris" })}
                className="text-gray-300 hover:text-white text-sm"
              >
                {t.cikisYap}
              </button>
            ) : (
              <Link href="/giris" className="text-gray-300 hover:text-white text-sm">
                {t.girisYap}
              </Link>
            )}
          </div>

          {/* Mobil hamburger */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuAcik ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuAcik ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuAcik ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      {menuAcik && (
        <div className="md:hidden border-t border-gray-700 px-4 pb-4 flex flex-col gap-3">
          <Link href="/" onClick={() => setMenuAcik(false)} className="hover:text-gray-300 py-2">{t.anaSayfa}</Link>
          <Link href="/pos" onClick={() => setMenuAcik(false)} className="hover:text-gray-300 py-2">{t.pos}</Link>
          <Link href="/urunler" onClick={() => setMenuAcik(false)} className="hover:text-gray-300 py-2">{t.urunler}</Link>
          <Link href="/siparisler" onClick={() => setMenuAcik(false)} className="hover:text-gray-300 py-2">{t.siparisler}</Link>
          {session?.user?.rol === "sahip" && (
            <Link href="/kullanicilar" onClick={() => setMenuAcik(false)} className="hover:text-gray-300 py-2">
              Kullanıcılar
            </Link>
          )}
          <div className="border-t border-gray-700 pt-3">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/giris" })}
                className="text-gray-300 hover:text-white text-sm"
              >
                {t.cikisYap}
              </button>
            ) : (
              <Link href="/giris" className="text-gray-300 hover:text-white text-sm">
                {t.girisYap}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}