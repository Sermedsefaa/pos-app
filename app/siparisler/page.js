"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SiparislerPage() {
  const { status } = useSession()
  const router = useRouter()
  const [siparisler, setSiparisler] = useState([])
  const [secilenId, setSecilenId] = useState(null)
  const [kalemler, setKalemler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/siparisler")
        .then((r) => r.json())
        .then(setSiparisler)
    }
  }, [status])

  async function detayGoster(id) {
    if (secilenId === id) {
      setSecilenId(null)
      setKalemler([])
      return
    }
    setSecilenId(id)
    setYukleniyor(true)
    const res = await fetch(`/api/siparisler/${id}`)
    const data = await res.json()
    setKalemler(data)
    setYukleniyor(false)
  }

  function tarihFormat(tarih) {
    return new Date(tarih).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-8 text-gray-500">Yükleniyor...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Siparişler
      </h1>

      {siparisler.length === 0 ? (
        <p className="text-gray-500">Henüz sipariş yok.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {siparisler.map((siparis) => (
            <div
              key={siparis.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => detayGoster(siparis.id)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Sipariş #{siparis.id}
                  </span>
                  <span className="text-xs text-gray-500 ml-3">
                    {tarihFormat(siparis.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {siparis.toplam} IQD
                  </span>
                  <span className="text-gray-400 text-sm">
                    {secilenId === siparis.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {secilenId === siparis.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                  {yukleniyor ? (
                    <p className="text-sm text-gray-500">Yükleniyor...</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {kalemler.map((kalem, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm text-gray-800 dark:text-gray-200"
                        >
                          <span>
                            {kalem.urun_adi}
                            <span className="text-gray-400 ml-1">
                              × {kalem.adet}
                            </span>
                          </span>
                          <span className="font-medium">
                            {kalem.fiyat * kalem.adet} IQD
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-1 flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100">
                        <span>Toplam</span>
                        <span>{siparis.toplam} IQD</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}