"use client"

import { useEffect, useState } from "react"

export default function UrunlerPage() {
  const [urunler, setUrunler] = useState([])
  const [form, setForm] = useState({ ad: "", fiyat: "", kategori: "" })
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    urunleriGetir()
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Ürünler</h1>

      {/* Ürün Ekleme Formu */}
      <div className="border rounded-lg p-4 mb-8 flex flex-col gap-3">
        <h2 className="font-medium">Yeni Ürün Ekle</h2>
        <input
          className="border rounded p-2"
          placeholder="Ürün adı"
          value={form.ad}
          onChange={(e) => setForm({ ...form, ad: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Fiyat (IQD)"
          type="number"
          value={form.fiyat}
          onChange={(e) => setForm({ ...form, fiyat: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Kategori (opsiyonel)"
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
        />
        <button
          onClick={urunEkle}
          disabled={yukleniyor}
          className="bg-gray-900 text-white rounded p-2 hover:bg-gray-700 disabled:opacity-50"
        >
          {yukleniyor ? "Ekleniyor..." : "Ekle"}
        </button>
      </div>

      {/* Ürün Listesi */}
      <div className="flex flex-col gap-2">
        {urunler.map((urun) => (
          <div
            key={urun.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <span className="font-medium">{urun.ad}</span>
              {urun.kategori && (
                <span className="text-xs text-gray-400 ml-2">{urun.kategori}</span>
              )}
            </div>
            <span className="text-gray-600 font-medium">{urun.fiyat} IQD</span>
          </div>
        ))}
      </div>
    </div>
  )
}