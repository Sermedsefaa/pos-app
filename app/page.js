"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard")
  }, [status, router])
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/60 text-xs font-mono">Irak'ın modern POS sistemi</span>
        </div>

        <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
          İşletmenizi
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            {" "}dijitalleştirin
          </span>
        </h1>

        <p className="text-white/40 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Restoran, kafe ve perakende işletmeleri için bulut tabanlı POS sistemi.
          Kurulum gerektirmez, tarayıcıdan çalışır.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/kayit"
            className="bg-white text-black font-medium px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all text-sm"
          >
            Ücretsiz Deneyin →
          </Link>
          <Link
            href="/fiyatlar"
            className="border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium px-8 py-3.5 rounded-xl transition-all text-sm"
          >
            Fiyatları Gör
          </Link>
        </div>
      </div>

      {/* Özellikler */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest text-center mb-12">
          Özellikler
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { baslik: "POS Ekranı", aciklama: "Hızlı sipariş alma, kategori filtresi, sepet yönetimi", ikon: "⚡", renk: "from-violet-500/10 to-violet-500/5 border-violet-500/20" },
            { baslik: "Stok Takibi", aciklama: "Ürün bazlı stok, düşük stok uyarısı, otomatik düşüm", ikon: "📦", renk: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20" },
            { baslik: "Fiş Yazdırma", aciklama: "Termal yazıcı desteği, nakit ve para üstü hesabı", ikon: "🧾", renk: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" },
            { baslik: "Dashboard", aciklama: "Günlük ciro, sipariş sayısı, en çok satanlar", ikon: "📊", renk: "from-orange-500/10 to-orange-500/5 border-orange-500/20" },
            { baslik: "Çoklu Kullanıcı", aciklama: "Sahip ve kasiyer rolleri, ayrı erişim yönetimi", ikon: "👥", renk: "from-pink-500/10 to-pink-500/5 border-pink-500/20" },
            { baslik: "Arapça Destek", aciklama: "Tam Arapça arayüz, sağdan sola yazım desteği", ikon: "🌐", renk: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20" },
          ].map((ozellik, i) => (
            <div key={i} className={`rounded-2xl border bg-gradient-to-br ${ozellik.renk} p-6`}>
              <div className="text-2xl mb-3">{ozellik.ikon}</div>
              <h3 className="font-semibold text-white mb-2">{ozellik.baslik}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{ozellik.aciklama}</p>
            </div>
          ))}
        </div>
      </div>
{/* CTA */}
<div className="max-w-2xl mx-auto px-8 py-16 text-center">
  <div className="rounded-3xl border border-white/10 bg-white/3 p-12">
    <h2 className="text-3xl font-bold mb-4">Hemen başlayın</h2>
    <p className="text-white/40 mb-8">Kredi kartı gerekmez. 5 dakikada kurulum.</p>
    <div className="flex items-center justify-center gap-4">
      <Link
        href="/kayit"
        className="inline-block bg-white text-black font-medium px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all text-sm"
      >
        Ücretsiz Hesap Oluştur →
      </Link>
      <Link
        href="/iletisim"
        className="inline-block border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium px-8 py-3.5 rounded-xl transition-all text-sm"
      >
        Demo Talep Et
      </Link>
    </div>
  </div>
</div>

      {/* Footer */}
      <div className="border-t border-white/5 px-8 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <img src="/logo.png" alt="Logo" style={{ height: "24px" }} />
        <p className="text-white/20 text-xs">© 2026 Tüm hakları saklıdır.</p>
        <div className="flex gap-6">
          <Link href="/fiyatlar" className="text-white/30 hover:text-white text-xs transition-colors">Fiyatlar</Link>
          <Link href="/giris" className="text-white/30 hover:text-white text-xs transition-colors">Giriş</Link>
        </div>
      </div>

    </div>
  )
}