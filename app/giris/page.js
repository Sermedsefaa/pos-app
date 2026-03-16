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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t.giris}
        </h1>

        {kayitBasarili && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
            <p className="text-green-700 dark:text-green-300 text-sm font-medium">
              ✓ Kayıt başarılı! Giriş yapabilirsiniz.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder={t.kullaniciAdi}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder={t.sifre}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && girisYap()}
          />

          {hata && <p className="text-red-500 text-sm">{hata}</p>}

          <button
            onClick={girisYap}
            disabled={yukleniyor}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-3 font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {yukleniyor ? t.girisYapiliyor : t.giris}
          </button>

          <p className="text-center text-sm text-gray-500">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="text-gray-900 dark:text-gray-100 font-medium hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}