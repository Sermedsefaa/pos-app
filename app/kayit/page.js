"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function KayitPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    isletme_adi: "",
    kullanici_adi: "",
    sifre: "",
    sifre_tekrar: "",
  })
  const [hata, setHata] = useState("")
  const [yukleniyor, setYukleniyor] = useState(false)

  async function kayitOl() {
    setHata("")
    if (!form.isletme_adi || !form.kullanici_adi || !form.sifre) {
      setHata("Tüm alanlar zorunlu.")
      return
    }
    if (form.sifre !== form.sifre_tekrar) {
      setHata("Şifreler eşleşmiyor.")
      return
    }
    if (form.sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalı.")
      return
    }

    setYukleniyor(true)
    const res = await fetch("/api/kayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isletme_adi: form.isletme_adi,
        kullanici_adi: form.kullanici_adi,
        sifre: form.sifre,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push("/giris?kayit=basarili")
    } else {
      setHata(data.hata || "Bir hata oluştu.")
    }
    setYukleniyor(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white">Hesap Oluştur</h1>
          <p className="text-gray-500 text-sm mt-1">İşletmeniz için ücretsiz deneyin</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">İşletme adı</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm"
                placeholder="Kafe Bağdat"
                value={form.isletme_adi}
                onChange={(e) => setForm({ ...form, isletme_adi: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Kullanıcı adı</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm"
                placeholder="kafebagdat"
                value={form.kullanici_adi}
                onChange={(e) => setForm({ ...form, kullanici_adi: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Şifre</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm"
                placeholder="En az 6 karakter"
                type="password"
                value={form.sifre}
                onChange={(e) => setForm({ ...form, sifre: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Şifre tekrar</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 text-sm"
                placeholder="Şifrenizi tekrar girin"
                type="password"
                value={form.sifre_tekrar}
                onChange={(e) => setForm({ ...form, sifre_tekrar: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && kayitOl()}
              />
            </div>

            {hata && <p className="text-red-400 text-sm">{hata}</p>}

            <button
              onClick={kayitOl}
              disabled={yukleniyor}
              className="w-full bg-white text-black rounded-xl p-3 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 transition-all mt-1"
            >
              {yukleniyor ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="text-white hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}