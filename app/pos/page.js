"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PosPage() {
  const { status } = useSession()
  const router = useRouter()
  const [urunler, setUrunler] = useState([])
  const [sepet, setSepet] = useState([])
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [sonuc, setSonuc] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  useEffect(() => {
    fetch("/api/urunler")
      .then((r) => r.json())
      .then(setUrunler)
  }, [])

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
      if (kalem.adet === 1) {
        return onceki.filter((k) => k.id !== urunId)
      }
      return onceki.map((k) =>
        k.id === urunId ? { ...k, adet: k.adet - 1 } : k
      )
    })
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
      setSonuc("✓ Sipariş kaydedildi")
    } else {
      setSonuc("✗ Bir hata oluştu")
    }

    setKaydediliyor(false)
    setTimeout(() => setSonuc(null), 3000)
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-8 text-gray-500">Yükleniyor...</div>
  }

  return (
    <div className="p-6 flex gap-6 h-screen">
      {/* Sol: Ürün listesi */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Ürünler
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {urunler.map((urun) => (
            <button
              key={urun.id}
              onClick={() => sepeteEkle(urun)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {urun.ad}
              </div>
              {urun.kategori && (
                <div className="text-xs text-gray-400">{urun.kategori}</div>
              )}
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {urun.fiyat} IQD
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ: Sepet */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 pl-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Sepet
        </h2>

        {sepet.length === 0 ? (
          <p className="text-gray-400 text-sm">Henüz ürün eklenmedi</p>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
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
            <span>Toplam</span>
            <span>{toplam} IQD</span>
          </div>

          {sonuc && (
            <div
              className={`text-sm mb-3 text-center font-medium ${
                sonuc.startsWith("✓") ? "text-green-600" : "text-red-500"
              }`}
            >
              {sonuc}
            </div>
          )}

          <button
            onClick={siparisKaydet}
            disabled={sepet.length === 0 || kaydediliyor}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg p-3 font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Siparişi Tamamla"}
          </button>
        </div>
      </div>
    </div>
  )
}