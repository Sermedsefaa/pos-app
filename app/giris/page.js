"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDil } from "../components/DilContext"
import Link from "next/link"

function GirisFormu() {
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
      router.push("/dashboard")
    } else {
      setHata(t.hataliGiris)
    }
    setYukleniyor(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white">{t.giris}</h1>
          <p className="text-white/30 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
          {kayitBasarili && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
              <p className="text-emerald-400 text-sm">✓ Kayıt başarılı, giriş yapabilirsiniz.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/20"
              placeholder={t.kullaniciAdi}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/20"
              placeholder={t.sifre}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && girisYap()}
            />

            {hata && <p className="text-red-400 text-sm">{hata}</p>}

            <button
              onClick={girisYap}
              disabled={yukleniyor}
              className="w-full bg-white text-black rounded-xl p-3 text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition-all mt-1"
            >
              {yukleniyor ? t.girisYapiliyor : t.giris}
            </button>
          </div>

          <p className="text-center text-sm text-white/30 mt-4">
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

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
      <GirisFormu />
    </Suspense>
  )
}