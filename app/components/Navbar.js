"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex gap-6">
      <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <Link href="/" className="hover:text-gray-300">Ana Sayfa</Link>
        <Link href="/pos" className="hover:text-gray-300">POS</Link>
        <Link href="/urunler" className="hover:text-gray-300">Ürünler</Link>
        <Link href="/siparisler" className="hover:text-gray-300">Siparişler</Link>
      </div>

      <div>
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/giris" })}
            className="text-gray-300 hover:text-white text-sm"
          >
            Çıkış Yap
          </button>
        ) : (
          <Link href="/giris" className="text-gray-300 hover:text-white text-sm">
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  )
}