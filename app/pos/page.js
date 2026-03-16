"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDil } from "../components/DilContext"
import Fis from "../components/Fis"

export default function PosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useDil()
  const [urunler, setUrunler] = useState([])
  const [masalar, setMasalar] = useState([])
  const [secilenMasa, setSecilenMasa] = useState(null)
  const [sepet, setSepet] = useState([])
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [sonuc, setSonuc] = useState(null)
  const [secilenKategori, setSecilenKategori] = useState("Tümü")
  const [odemeModal, setOdemeModal] = useState(false)
  const [alinanPara, setAlinanPara] = useState("")
  const [fisModal, setFisModal] = useState(false)
  const [sonSiparis, setSonSiparis] = useState(null)
  const [sonKalemler, setSonKalemler] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/urunler")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setUrunler(data) })

      fetch("/api/masalar")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setMasalar(data) })
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
    if (Number(alinanPara) < toplam) return
    setKaydediliyor(true)

    const res = await fetch("/api/siparisler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toplam,
        kalemler: sepet,
        masa_id: secilenMasa?.id || null,
        masa_numara: secilenMasa?.numara || null,
      }),
    })

    if (res.ok) {
      const kaydedilenSiparis = await res.json()
      setSonSiparis(kaydedilenSiparis)
      setSonKalemler(sepet.map((k) => ({
        urun_adi: k.ad,
        fiyat: k.fiyat,
        adet: k.adet,
      })))
      setSepet([])
      setOdemeModal(false)
      setFisModal(true)
      setSonuc(t.siparisKaydedildi)

      // Masaları yenile
      fetch("/api/masalar")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setMasalar(data) })

      setTimeout(() => setSonuc(null), 3000)
    } else {
      setSonuc(t.hataOlustu)
    }

    setKaydediliyor(false)
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-8 text-white/40">{t.yukleniyor}</div>
  }

  return (
    <div className="flex gap-0 h-screen bg-[#080808]">

      {/* Sol: Ürünler */}
      <div className="flex-1 flex flex-col p-6 border-r border-white/5">

        {/* Masa seçimi */}
        {masalar.length > 0 && (
          <div className="mb-4">
            <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-2">
              Masa Seç
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSecilenMasa(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !secilenMasa
                    ? "bg-white text-black"
                    : "border border-white/10 text-white/40 hover:text-white"
                }`}
              >
                Masasız
              </button>
              {masalar.map((masa) => (
                <button
                  key={masa.id}
                  onClick={() => setSecilenMasa(masa)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    secilenMasa?.id === masa.id
                      ? "bg-white text-black"
                      : masa.durum === "dolu"
                      ? "border border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                      : "border border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  {masa.numara}
                  {masa.durum === "dolu" && " ●"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kategori filtresi */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {kategoriler.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSecilenKategori(kategori)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                secilenKategori === kategori
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Ürün grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1">
          {filtreliUrunler.map((urun) => (
            <button
              key={urun.id}
              onClick={() => urun.stok !== 0 && sepeteEkle(urun)}
              disabled={urun.stok === 0}
              className={`border rounded-xl p-4 text-left transition-all ${
                urun.stok === 0
                  ? "border-white/5 opacity-30 cursor-not-allowed"
                  : "border-white/10 hover:bg-white/5 active:scale-95"
              }`}
            >
              <div className="font-medium text-white text-sm">{urun.ad}</div>
              {urun.kategori && (
                <div className="text-xs text-white/30 mt-0.5">{urun.kategori}</div>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/60 text-sm font-mono">{urun.fiyat} IQD</span>
                {urun.stok !== 999 && (
                  <span className={`text-xs ${
                    urun.stok === 0 ? "text-red-400" :
                    urun.stok <= 5 ? "text-amber-400" : "text-white/20"
                  }`}>
                    {urun.stok === 0 ? "Tükendi" : `${urun.stok}`}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ: Sepet */}
      <div className="w-80 flex flex-col p-6">

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-bold text-white">{t.sepet}</h2>
            {secilenMasa && (
              <p className="text-xs text-white/30 mt-0.5">{secilenMasa.numara}</p>
            )}
          </div>
          {sepet.length > 0 && (
            <button
              onClick={sepetiBosalt}
              className="text-xs text-red-400 hover:text-red-300"
            >
              {t.temizle}
            </button>
          )}
        </div>

        {sepet.length === 0 ? (
          <p className="text-white/20 text-sm">{t.henuzUrunYok}</p>
        ) : (
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {sepet.map((kalem) => (
              <div key={kalem.id} className="flex justify-between items-center py-1">
                <div>
                  <div className="font-medium text-sm text-white">{kalem.ad}</div>
                  <div className="text-xs text-white/30">
                    {kalem.fiyat} × {kalem.adet}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-white/70 font-mono">
                    {kalem.fiyat * kalem.adet}
                  </span>
                  <button
                    onClick={() => sepettenCikar(kalem.id)}
                    className="text-red-400 hover:text-red-300 text-lg leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/10"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg mb-4 text-white">
            <span>{t.toplam}</span>
            <span className="font-mono">{toplam.toLocaleString()} IQD</span>
          </div>

          {sonuc && (
            <div className={`text-sm mb-3 text-center font-medium ${
              sonuc.startsWith("✓") ? "text-emerald-400" : "text-red-400"
            }`}>
              {sonuc}
            </div>
          )}

          <button
            onClick={() => setOdemeModal(true)}
            disabled={sepet.length === 0}
            className="w-full bg-white text-black rounded-xl p-3 font-medium hover:bg-white/90 disabled:opacity-20 transition-all text-sm"
          >
            {t.siparisiTamamla}
          </button>
        </div>
      </div>

      {/* Ödeme Modalı */}
      {odemeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-1 text-white">Ödeme Al</h3>
            {secilenMasa && (
              <p className="text-white/30 text-xs mb-4">{secilenMasa.numara}</p>
            )}
            <div className="flex justify-between mb-4 text-white/60">
              <span>Tutar</span>
              <span className="font-bold text-white font-mono">{toplam.toLocaleString()} IQD</span>
            </div>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-lg mb-3 outline-none focus:border-white/20 font-mono"
              placeholder="Alınan para"
              type="number"
              value={alinanPara}
              onChange={(e) => setAlinanPara(e.target.value)}
              autoFocus
            />
            {alinanPara && Number(alinanPara) >= toplam && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 flex justify-between">
                <span className="text-emerald-400 font-medium text-sm">Para üstü</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {(Number(alinanPara) - toplam).toLocaleString()} IQD
                </span>
              </div>
            )}
            {alinanPara && Number(alinanPara) < toplam && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <span className="text-red-400 text-sm">
                  Eksik — {(toplam - Number(alinanPara)).toLocaleString()} IQD
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setOdemeModal(false); setAlinanPara("") }}
                className="flex-1 border border-white/10 rounded-xl p-3 text-white/40 hover:text-white text-sm transition-colors"
              >
                {t.iptal}
              </button>
              <button
                onClick={siparisKaydet}
                disabled={!alinanPara || Number(alinanPara) < toplam || kaydediliyor}
                className="flex-1 bg-white text-black rounded-xl p-3 font-medium text-sm hover:bg-white/90 disabled:opacity-30"
              >
                {kaydediliyor ? t.kaydediliyor : "Onayla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fiş Modalı */}
      {fisModal && sonSiparis && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <Fis
              siparis={sonSiparis}
              kalemler={sonKalemler}
              isletmeAdi={session?.user?.isletmeAdi || ""}
              alinanPara={alinanPara}
            />
            <button
              onClick={() => { setFisModal(false); setAlinanPara("") }}
              className="w-full mt-4 border border-white/10 rounded-xl p-3 text-white/40 hover:text-white text-sm transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  )
}