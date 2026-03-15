"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDil } from "../components/DilContext"

export default function UrunlerPage() {
  const { status } = useSession()
  const router = useRouter()
  const { t } = useDil()
  const [urunler, setUrunler] = useState([])
  const [form, setForm] = useState({ ad: "", fiyat: "", kategori: "" })
  const [duzenle, setDuzenle] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") urunleriGetir()
  }, [status])

  async function urunleriGetir() {
    const res = await fetch("/api/urunler")
    const data = await res.json()
    setUrunler(data)
  }

  async function urunEkle() {
    if (!form.ad || !form.fiyat) return
    setYukleniyor(true)
    await fetch("/api/urunler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ ad: "", fiyat: "", kategori: "" })
    await urunleriGetir()
    setYukleniyor(false)
  }

  async function urunSil(id) {
    if (!confirm(t.eminMisin)) return
    await fetch("/api/urunler", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await urunleriGetir()
  }

  async function urunGuncelle() {
    if (!duzenle.ad || !duzenle.fiyat) return
    setYukleniyor(true)
    await fetch("/api/urunler", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duzenle),
    })
    setDuzenle(null)
    await urunleriGetir()
    setYukleniyor(false)
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-8 text-gray-500">{t.yukleniyor}</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {t.urunler}
      </h1>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-8 flex flex-col gap-3">
        <h2 className="font-medium text-gray-900 dark:text-gray-100">
          {t.yeniUrunEkle}
        </h2>
        <input
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder={t.urunAdi}
          value={form.ad}
          onChange={(e) => setForm({ ...form, ad: e.target.value })}
        />
        <input
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder={t.fiyat}
          type="number"
          value={form.fiyat}
          onChange={(e) => setForm({ ...form, fiyat: e.target.value })}
        />
        <input
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder={t.kategori}
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
        />
        <button
          onClick={urunEkle}
          disabled={yukleniyor}
          className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-3 font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {yukleniyor ? t.ekleniyor : t.ekle}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {urunler.map((urun) => (
          <div
            key={urun.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            {duzenle?.id === urun.id ? (
              <div className="p-4 flex flex-col gap-3">
                <input
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  value={duzenle.ad}
                  onChange={(e) => setDuzenle({ ...duzenle, ad: e.target.value })}
                />
                <input
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  type="number"
                  value={duzenle.fiyat}
                  onChange={(e) => setDuzenle({ ...duzenle, fiyat: e.target.value })}
                />
                <input
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  value={duzenle.kategori || ""}
                  onChange={(e) => setDuzenle({ ...duzenle, kategori: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={urunGuncelle}
                    disabled={yukleniyor}
                    className="flex-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-2 text-sm font-medium hover:opacity-80 disabled:opacity-40"
                  >
                    {yukleniyor ? t.kaydediliyor : t.kaydet}
                  </button>
                  <button
                    onClick={() => setDuzenle(null)}
                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t.iptal}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {urun.ad}
                  </span>
                  {urun.kategori && (
                    <span className="text-xs text-gray-400 ml-2">{urun.kategori}</span>
                  )}
                  <div className="text-sm text-gray-500 mt-0.5">{urun.fiyat} IQD</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDuzenle(urun)}
                    className="text-sm text-blue-500 hover:text-blue-700 px-3 py-1 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
                  >
                    {t.duzenle}
                  </button>
                  <button
                    onClick={() => urunSil(urun.id)}
                    className="text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded-lg border border-red-200 hover:border-red-400 transition-colors"
                  >
                    {t.sil}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}