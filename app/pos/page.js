"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDil } from "../components/DilContext"

export default function PosPage() {
  const { status } = useSession()
  const router = useRouter()
  const { t } = useDil()
  const [urunler, setUrunler] = useState([])
  const [sepet, setSepet] = useState([])
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [sonuc, setSonuc] = useState(null)
  const [secilenKategori, setSecilenKategori] = useState("Tümü")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

 useEffect(() => {
  if (status === "authenticated") {
    fetch("/api/urunler")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUrunler(data)
        } else {
          console.error("Urunler hatasi:", data)
          setUrunler([])
        }
      })
  }
}, [status])

  const kategoriler = [
    t.tumKategoriler,
    ...new Set(urunler.map((u) => u.kategori).filter(Boolean)),
  ]

  const filtreliUrunler =
    secilenKategori === t.tumKategoriler
      ? urunler
      : urunler.filter((u) => u.kategori === secilenKategori)

  function sepeteEkle(urun) {
    setSepet((onceki) => {
      const varMi = onceki.find((k) => k.id === urun.id)
      if (varMi) {
        return onceki.map((k) =>
          k.id === urun.id ? { ...k, adet: k.adet + 1 } : k
        )
      }
      return [...onceki, { ...urun, adet: 1 }]
    })
  }

  function sepettenCikar(urunId) {
    setSepet((onceki) => {
      const kalem = onceki.find((k) => k.id === urunId)
      if (kalem.adet === 1) return onceki.filter((k) => k.id !== urunId)
      return onceki.map((k) =>
        k.id === urunId ? { ...k, adet: k.adet - 1 } : k
      )
    })
  }

  function sepetiBosalt() {
    if (!confirm(t.sepetTemizle)) return
    setSepet([])
  }

  const toplam = sepet.reduce((acc, k) => acc + k.fiyat * k.adet, 0)

  async function siparisKaydet() {
    if (sepet.length === 0) return
    setKaydediliyor(true)
    setSonuc(null)

    const res = await fetch("/api/siparisler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toplam, kalemler: sepet }),
    })

    if (res.ok) {
      setSepet([])
      setSonuc(t.siparisKaydedildi)
    } else {
      setSonuc(t.hataOlustu)
    }

    setKaydediliyor(false)
    setTimeout(() => setSonuc(null), 3000)
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-8 text-gray-500">{t.yukleniyor}</div>
  }

  return (
    <div className="flex gap-6 h-screen p-6">
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {t.urunler}
        </h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {kategoriler.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSecilenKategori(kategori)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                secilenKategori === kategori
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto">
          {filtreliUrunler.map((urun) => (
            <button
              key={urun.id}
              onClick={() => sepeteEkle(urun)}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {urun.ad}
              </div>
              {urun.kategori && (
                <div className="text-xs text-gray-400 mt-0.5">{urun.kategori}</div>
              )}
              <div className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
                {urun.fiyat} IQD
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 border-l border-gray-200 dark:border-gray-700 pl-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t.sepet}
          </h2>
          {sepet.length > 0 && (
            <button
              onClick={sepetiBosalt}
              className="text-xs text-red-400 hover:text-red-600"
            >
              {t.temizle}
            </button>
          )}
        </div>

        {sepet.length === 0 ? (
          <p className="text-gray-400 text-sm">{t.henuzUrunYok}</p>
        ) : (
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {sepet.map((kalem) => (
              <div key={kalem.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {kalem.ad}
                  </div>
                  <div className="text-xs text-gray-400">
                    {kalem.fiyat} IQD × {kalem.adet}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {kalem.fiyat * kalem.adet} IQD
                  </span>
                  <button
                    onClick={() => sepettenCikar(kalem.id)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">
            <span>{t.toplam}</span>
            <span>{toplam.toLocaleString()} IQD</span>
          </div>
          {sonuc && (
            <div className={`text-sm mb-3 text-center font-medium ${sonuc.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
              {sonuc}
            </div>
          )}
          <button
            onClick={siparisKaydet}
            disabled={sepet.length === 0 || kaydediliyor}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl p-3 font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {kaydediliyor ? t.kaydediliyor : t.siparisiTamamla}
          </button>
        </div>
      </div>
    </div>
  )
}