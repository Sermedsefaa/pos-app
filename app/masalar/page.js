"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function MasalarPage() {
  const { status } = useSession()
  const router = useRouter()
  const [masalar, setMasalar] = useState([])
  const [yeniMasa, setYeniMasa] = useState("")
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") masalariGetir()
  }, [status])

  async function masalariGetir() {
    const res = await fetch("/api/masalar")
    const data = await res.json()
    if (Array.isArray(data)) setMasalar(data)
  }

  async function masaEkle() {
    if (!yeniMasa.trim()) return
    setYukleniyor(true)

    await fetch("/api/masalar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numara: yeniMasa.trim() }),
    })

    setYeniMasa("")
    await masalariGetir()
    setYukleniyor(false)
  }

  async function masaSil(id) {
    if (!confirm("Bu masayı silmek istediğine emin misin?")) return

    await fetch("/api/masalar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    await masalariGetir()
  }

  async function masaBosalt(id) {
    await fetch(`/api/masalar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum: "bos" }),
    })

    await masalariGetir()
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Masa Yönetimi</h1>
        <p className="text-white/30 text-sm mt-1">Masaları ekle, sil, durumlarını takip et</p>
      </div>

      {/* Masa ekle */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 mb-8">
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-3">
          Yeni Masa Ekle
        </p>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/20"
            placeholder="Masa 1, VIP, Bahçe..."
            value={yeniMasa}
            onChange={(e) => setYeniMasa(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && masaEkle()}
          />
          <button
            onClick={masaEkle}
            disabled={yukleniyor || !yeniMasa.trim()}
            className="bg-white text-black text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            Ekle
          </button>
        </div>
      </div>

      {/* Masa listesi */}
      <div className="grid grid-cols-2 gap-3">
        {masalar.map((masa) => (
          <div
            key={masa.id}
            className={`rounded-2xl border p-5 ${
              masa.durum === "dolu"
                ? "border-orange-500/30 bg-orange-500/5"
                : "border-emerald-500/30 bg-emerald-500/5"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-white text-lg">{masa.numara}</h3>
                <span className={`text-xs font-mono ${
                  masa.durum === "dolu" ? "text-orange-400" : "text-emerald-400"
                }`}>
                  {masa.durum === "dolu" ? "● Dolu" : "● Boş"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              {masa.durum === "dolu" && (
                <button
                  onClick={() => masaBosalt(masa.id)}
                  className="flex-1 border border-emerald-500/30 text-emerald-400 text-xs py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                >
                  Boşalt
                </button>
              )}
              <button
                onClick={() => masaSil(masa.id)}
                className="flex-1 border border-red-500/20 text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}