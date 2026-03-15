"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDil } from "./components/DilContext"

export default function HomePage() {
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
    return <div className="p-8 text-gray-500">{t.yukleniyor}</div>
  }

  return (
    <div className="p-8 max-w-3xl" dir={rtl ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
         {veri?.isletmeAdi} — {t.dashboard}
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">{t.bugunCiro}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {veri?.bugunCiro?.toLocaleString() || "0"} IQD
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">{t.bugunSiparis}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {veri?.bugunSiparisSayisi || "0"}
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">{t.toplamCiro}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {veri?.toplamCiro?.toLocaleString() || "0"} IQD
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">{t.toplamSiparis}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {veri?.toplamSiparisSayisi || "0"}
          </p>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">
          {t.enCokSatanlar}
        </h2>
        {veri?.enCokSatanlar?.length === 0 ? (
          <p className="text-gray-400 text-sm">{t.henuzSatisYok}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {veri?.enCokSatanlar?.map((urun, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-4">{i + 1}</span>
                  <span className="text-gray-900 dark:text-gray-100">{urun.ad}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {urun.adet} {t.adet}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}