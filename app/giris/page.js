"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDil } from "../components/DilContext"
import Link from "next/link"

export default function GirisPage() {
  const { t } = useDil()
  const [form, setForm] = useState({ username: "", password: "" })
  const [hata, setHata] = useState("")
  const [yukleniyor, setYukleniyor] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const kayitBasarili = searchParams.get("kayit") === "basarili"

  async function girisYap() {
    if (!form.username || !form.password) return
    setYukleniyor(true)
    setHata("")

    const sonuc = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    })

    if (sonuc.ok) {
      router.push("/pos")
    } else {
      setHata(t.hataliGiris)
    }
    setYukleniyor(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white">{t.giris}</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {kayitBasarili && (
            <div className="bg-green-950 border border-green-800 rounded-xl p-3 mb-4">
              <p className="text-green-400 text-sm">✓ Kayıt başarılı, giriş yapabilirsiniz.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm focus:border-gray-500"
              placeholder={t.kullaniciAdi}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm"
              placeholder={t.sifre}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && girisYap()}
            />

            {hata && (
              <p className="text-red-400 text-sm">{hata}</p>
            )}

            <button
              onClick={girisYap}
              disabled={yukleniyor}
              className="w-full bg-white text-black rounded-xl p-3 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 transition-all mt-1"
            >
              {yukleniyor ? t.girisYapiliyor : t.giris}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="text-white hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}