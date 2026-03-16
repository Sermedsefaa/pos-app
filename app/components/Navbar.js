"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useDil } from "./DilContext"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const { dil, setDil, t } = useDil()
  const pathname = usePathname()

  // Giriş yapılmamış — landing navbar
  if (!session) {
    return (
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#080808]">
        <Link href="/">
          <img src="/logo.png" alt="Logo" style={{ height: "30px", width: "auto" }} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/fiyatlar" className="text-white/50 hover:text-white text-sm transition-colors">
            Fiyatlar
          </Link>
          <button
            onClick={() => setDil(dil === "tr" ? "ar" : "tr")}
            className="text-xs border border-white/10 rounded-lg px-3 py-1.5 text-white/40 hover:text-white hover:border-white/20 transition-colors"
          >
            {dil === "tr" ? "العربية" : "Türkçe"}
          </button>
          <Link href="/giris" className="text-white/50 hover:text-white text-sm transition-colors">
            {t.girisYap}
          </Link>
          <Link
            href="/kayit"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
          >
            Ücretsiz Başla
          </Link>
          <Link href="/iletisim" className="text-white/50 hover:text-white text-sm transition-colors">
  Demo
</Link>
        </div>
      </nav>
    )
  }

  // Giriş yapılmış — uygulama navbar'ı
  const linkler = [
    { href: "/dashboard", label: t.anaSayfa },
    { href: "/pos", label: t.pos },
    { href: "/urunler", label: t.urunler },
    { href: "/siparisler", label: t.siparisler },
    ...(session?.user?.rol === "sahip"
      ? [{ href: "/kullanicilar", label: t.kullanicilar }]
      : []),
  ]

  return (
    <nav className="border-b border-white/5 bg-[#080808] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">
          <img src="/logo.png" alt="Logo" style={{ height: "28px", width: "auto" }} />
        </Link>
        <div className="flex gap-1">
          {linkler.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session && (
          <span className="text-xs text-white/20 hidden md:block font-mono">
            {session.user.isletmeAdi}
          </span>
        )}
        <button
          onClick={() => setDil(dil === "tr" ? "ar" : "tr")}
          className="text-xs border border-white/10 rounded-lg px-3 py-1.5 text-white/40 hover:text-white hover:border-white/20 transition-colors"
        >
          {dil === "tr" ? "العربية" : "Türkçe"}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/giris" })}
          className="text-xs text-white/30 hover:text-white transition-colors"
        >
          {t.cikisYap}
        </button>
      </div>
    </nav>
  )
}