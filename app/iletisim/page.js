"use client"

import { useState } from "react"
import Link from "next/link"

export default function IletisimPage() {
  const [form, setForm] = useState({
    ad: "",
    telefon: "",
    isletme: "",
    mesaj: "",
  })
  const [gonderildi, setGonderildi] = useState(false)

  async function gonder() {
    if (!form.ad || !form.telefon) return
    setGonderildi(true)
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/">
          <img src="/logo.png" alt="Logo" style={{ height: "32px" }} />
        </Link>
        <Link
          href="/kayit"
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
        >
          Ücretsiz Başla
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-8 pt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Demo Talep Et</h1>
          <p className="text-white/40">
            Size özel demo gösterimi için bilgilerinizi bırakın, en kısa sürede ulaşalım.
          </p>
        </div>

        {gonderildi ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="font-semibold text-emerald-400 mb-2">Talebiniz alındı</h3>
            <p className="text-white/40 text-sm">
              En kısa sürede WhatsApp veya telefon ile ulaşacağız.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-sm text-white/40 hover:text-white transition-colors"
            >
              Ana sayfaya dön →
            </Link>
          </div>
        ) : (
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
              className="w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-white/90 disabled:opacity-30 transition-all mt-1"
            >
              Talep Gönder
            </button>

            <p className="text-white/20 text-xs text-center">
              Bilgileriniz üçüncü taraflarla paylaşılmaz.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}