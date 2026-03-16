"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RaporPage() {
  const { status } = useSession()
  const router = useRouter()
  const [veri, setVeri] = useState(null)
  const [tarih, setTarih] = useState(new Date().toISOString().split("T")[0])
  const [yukleniyor, setYukleniyor] = useState(false)
  const raporRef = useRef()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") raporGetir()
  }, [status, tarih])

  async function raporGetir() {
    setYukleniyor(true)
    const res = await fetch(`/api/rapor?tarih=${tarih}`)
    const data = await res.json()
    setVeri(data)
    setYukleniyor(false)
  }

  function yazdir() {
    window.print()
  }

  function tarihFormat(tarihStr) {
    return new Date(tarihStr).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] p-8">

      {/* Kontroller — baskıda gizlenir */}
      <div className="no-print flex items-center justify-between mb-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Günlük Rapor</h1>
          <p className="text-white/30 text-sm mt-0.5">{veri?.isletmeAdi}</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/20"
          />
          <button
            onClick={yazdir}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
          >
            PDF İndir
          </button>
        </div>
      </div>

      {yukleniyor ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : !veri || veri.toplamSiparis === 0 ? (
        <div className="max-w-4xl">
          <div className="rounded-2xl border border-white/5 bg-white/3 p-12 text-center">
            <p className="text-white/30">Bu tarihte sipariş bulunamadı.</p>
          </div>
        </div>
      ) : (
        <div ref={raporRef} id="rapor-icerik" className="max-w-4xl">

          {/* Baskı başlığı */}
          <div className="print-only hidden mb-6 pb-4 border-b border-gray-300">
            <h2 className="text-xl font-bold text-black">{veri.isletmeAdi} — Günlük Rapor</h2>
            <p className="text-gray-500 text-sm">{tarih}</p>
          </div>

          {/* Özet */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">
                Toplam Ciro
              </p>
              <p className="text-3xl font-bold text-violet-400 tabular-nums">
                {veri.toplamCiro.toLocaleString()}
              </p>
              <p className="text-white/30 text-xs mt-1">IQD</p>
            </div>
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">
                Sipariş Sayısı
              </p>
              <p className="text-3xl font-bold text-cyan-400 tabular-nums">
                {veri.toplamSiparis}
              </p>
              <p className="text-white/30 text-xs mt-1">sipariş</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">
                Ortalama Sipariş
              </p>
              <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                {veri.ortalamaFiyat.toLocaleString()}
              </p>
              <p className="text-white/30 text-xs mt-1">IQD</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* En çok satanlar */}
            <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-4">
                En Çok Satılan Ürünler
              </p>
              <div className="flex flex-col gap-2.5">
                {veri.enCokSatanlar.map((urun, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-white/20 text-xs font-mono w-5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white/70 text-sm">{urun.ad}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-violet-400 text-xs font-mono block">
                        {urun.adet} adet
                      </span>
                      <span className="text-white/30 text-xs font-mono">
                        {urun.ciro.toLocaleString()} IQD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saatlik dağılım */}
            <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-4">
                Saatlik Dağılım
              </p>
              <div className="flex flex-col gap-2">
                {veri.saatlikDagilim.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-white/30 text-xs font-mono w-12">
                      {String(s.saat).padStart(2, "0")}:00
                    </span>
                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                      <div
                        className="bg-cyan-400 h-1.5 rounded-full"
                        style={{
                          width: `${(s.ciro / veri.toplamCiro) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-white/40 text-xs font-mono w-24 text-right">
                      {s.ciro.toLocaleString()} IQD
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sipariş listesi */}
          <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-4">
              Tüm Siparişler
            </p>
            <div className="flex flex-col gap-2">
              {veri.siparisler.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/20 text-xs font-mono">#{s.id}</span>
                    <span className="text-white/50 text-xs">
                      {tarihFormat(s.created_at)}
                    </span>
                  </div>
                  <span className="text-white/70 text-sm font-mono">
                    {s.toplam.toLocaleString()} IQD
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}