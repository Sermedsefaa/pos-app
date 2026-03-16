"use client"

import { useState } from "react"
import Link from "next/link"

const WHATSAPP_NUMARA = "+905316295703" // Buraya kendi numaranı yaz

export default function IletisimPage() {
  const [form, setForm] = useState({
    ad: "",
    telefon: "",
    isletme: "",
    mesaj: "",
  })

  function gonder() {
    if (!form.ad || !form.telefon) return

    const metin = `Merhaba, demo talep ediyorum.

Ad: ${form.ad}
Telefon: ${form.telefon}
İşletme: ${form.isletme || "Belirtilmedi"}
Mesaj: ${form.mesaj || "Yok"}`

    const url = `https://wa.me/${WHATSAPP_NUMARA}?text=${encodeURIComponent(metin)}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-lg mx-auto px-8 pt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Demo Talep Et</h1>
          <p className="text-white/40">
            Bilgilerinizi doldurun, WhatsApp üzerinden anında ulaşalım.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block font-mono uppercase tracking-wider">
              Adınız
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none transition-colors"
              placeholder="Ahmed Al-Rashid"
              value={form.ad}
              onChange={(e) => setForm({ ...form, ad: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block font-mono uppercase tracking-wider">
              Telefon / WhatsApp
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none transition-colors"
              placeholder="+964 7XX XXX XXXX"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block font-mono uppercase tracking-wider">
              İşletme Adı
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none transition-colors"
              placeholder="Kafe Bağdat"
              value={form.isletme}
              onChange={(e) => setForm({ ...form, isletme: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block font-mono uppercase tracking-wider">
              Mesajınız (opsiyonel)
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none transition-colors resize-none"
              placeholder="Kaç kasiyeriniz var, ne tür bir işletme..."
              rows={3}
              value={form.mesaj}
              onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
            />
          </div>

          <button
            onClick={gonder}
            disabled={!form.ad || !form.telefon}
            className="w-full bg-[#25D366] text-white font-medium py-3 rounded-xl text-sm hover:bg-[#20bd5a] disabled:opacity-30 transition-all mt-1 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp ile Gönder
          </button>

          <p className="text-white/20 text-xs text-center">
            WhatsApp uygulaması açılacak, mesajı gönderin.
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-white/30 hover:text-white text-sm transition-colors">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  )
}