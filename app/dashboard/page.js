"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDil } from "../components/DilContext"

export default function DashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const { t, rtl } = useDil()
  const [veri, setVeri] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then(setVeri)
    }
  }, [status])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/40 text-sm">{t.yukleniyor}</p>
        </div>
      </div>
    )
  }

  const statlar = [
    {
      label: t.bugunCiro,
      deger: veri?.bugunCiro?.toLocaleString() || "0",
      birim: "IQD",
      renk: "from-violet-500/20 to-violet-500/5",
      sinir: "border-violet-500/30",
      yaziRenk: "text-violet-400",
    },
    {
      label: t.bugunSiparis,
      deger: veri?.bugunSiparisSayisi || "0",
      birim: "",
      renk: "from-cyan-500/20 to-cyan-500/5",
      sinir: "border-cyan-500/30",
      yaziRenk: "text-cyan-400",
    },
    {
      label: t.toplamCiro,
      deger: veri?.toplamCiro?.toLocaleString() || "0",
      birim: "IQD",
      renk: "from-emerald-500/20 to-emerald-500/5",
      sinir: "border-emerald-500/30",
      yaziRenk: "text-emerald-400",
    },
    {
      label: t.toplamSiparis,
      deger: veri?.toplamSiparisSayisi || "0",
      birim: "",
      renk: "from-orange-500/20 to-orange-500/5",
      sinir: "border-orange-500/30",
      yaziRenk: "text-orange-400",
    },
  ]

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-8" dir={rtl ? "rtl" : "ltr"}>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">
            {t.canli}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {veri?.isletmeAdi}
        </h1>
        <p className="text-white/30 text-sm mt-1 font-mono">
          {new Date().toLocaleDateString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-3xl">
        {statlar.map((stat, i) => (
          <div
            key={i}
            className={`relative rounded-2xl border ${stat.sinir} bg-gradient-to-br ${stat.renk} p-6 overflow-hidden`}
          >
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-3">
              {stat.label}
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-bold ${stat.yaziRenk} tabular-nums`}>
                {stat.deger}
              </span>
              {stat.birim && (
                <span className="text-white/30 text-sm mb-1">{stat.birim}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {veri?.dusukStok?.length > 0 && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <p className="text-orange-400 text-xs font-mono uppercase tracking-wider">
                {t.dusukStok}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {veri.dusukStok.map((u, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">{u.ad}</span>
                  <span className="text-orange-400 text-xs font-mono bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    {u.stok} {t.adet}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
              {t.enCokSatanlar}
            </p>
          </div>
          {!veri?.enCokSatanlar?.length ? (
            <p className="text-white/20 text-sm">{t.henuzSatisYok}</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {veri.enCokSatanlar.map((urun, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-white/20 text-xs font-mono w-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/70 text-sm">{urun.ad}</span>
                  </div>
                  <span className="text-violet-400 text-xs font-mono">
                    {urun.adet} {t.adet}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}