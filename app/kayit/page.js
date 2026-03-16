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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Hesap Oluştur
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          İşletmeniz için ücretsiz deneyin
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">İşletme adı</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Kafe Bağdat"
              value={form.isletme_adi}
              onChange={(e) => setForm({ ...form, isletme_adi: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kullanıcı adı</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="kafebagdat"
              value={form.kullanici_adi}
              onChange={(e) => setForm({ ...form, kullanici_adi: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Şifre</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="En az 6 karakter"
              type="password"
              value={form.sifre}
              onChange={(e) => setForm({ ...form, sifre: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Şifre tekrar</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Şifrenizi tekrar girin"
              type="password"
              value={form.sifre_tekrar}
              onChange={(e) => setForm({ ...form, sifre_tekrar: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && kayitOl()}
            />
          </div>

          {hata && (
            <p className="text-red-500 text-sm">{hata}</p>
          )}

          <button
            onClick={kayitOl}
            disabled={yukleniyor}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-3 font-medium hover:opacity-80 disabled:opacity-40 transition-opacity mt-1"
          >
            {yukleniyor ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="text-gray-900 dark:text-gray-100 font-medium hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}