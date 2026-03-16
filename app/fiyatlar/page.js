import Link from "next/link"

export default function FiyatlarPage() {
  const planlar = [
    {
      isim: "Başlangıç",
      fiyat: "Ücretsiz",
      aciklama: "Tek kullanıcı, tek işletme",
      ozellikler: [
        "POS ekranı",
        "Ürün yönetimi",
        "Sipariş geçmişi",
        "Dashboard",
        "1 kullanıcı",
      ],
      buton: "Ücretsiz Başla",
      href: "/kayit",
      one_cikan: false,
      renk: "border-white/10",
    },
    {
      isim: "Pro",
      fiyat: "25.000",
      birim: "IQD / ay",
      aciklama: "Büyüyen işletmeler için",
      ozellikler: [
        "Her şey dahil",
        "5 kullanıcıya kadar",
        "Stok takibi",
        "Fiş yazdırma",
        "Arapça destek",
        "Öncelikli destek",
      ],
      buton: "Pro'yu Deneyin",
      href: "/kayit",
      one_cikan: true,
      renk: "border-violet-500/50",
    },
    {
      isim: "İşletme",
      fiyat: "Özel",
      aciklama: "Zincir ve büyük işletmeler",
      ozellikler: [
        "Sınırsız kullanıcı",
        "Çoklu şube",
        "Özel entegrasyonlar",
        "Dedicated destek",
        "SLA garantisi",
      ],
      buton: "İletişime Geç",
      href: "/iletisim",
      one_cikan: false,
      renk: "border-white/10",
    },
  ]

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Nav */}
     
      {/* Başlık */}
      <div className="max-w-3xl mx-auto px-8 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Şeffaf fiyatlar</h1>
        <p className="text-white/40 text-lg">
          <div className="flex items-center justify-center gap-4 mt-6">
  <Link
    href="/kayit"
    className="bg-white text-black text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
  >
    Ücretsiz Başla
  </Link>
  <Link
    href="/iletisim"
    className="border border-white/10 text-white/60 hover:text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:border-white/20 transition-colors"
  >
    Demo Talep Et
  </Link>
</div>
        </p>
      </div>

      {/* Planlar */}
      <div className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-3 gap-4">
          {planlar.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border ${plan.renk} p-6 flex flex-col ${
                plan.one_cikan ? "bg-violet-500/5" : "bg-white/3"
              }`}
            >
              {plan.one_cikan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Popüler
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-white mb-1">{plan.isim}</h3>
                <p className="text-white/40 text-sm">{plan.aciklama}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.fiyat}</span>
                {plan.birim && (
                  <span className="text-white/40 text-sm ml-1">{plan.birim}</span>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.ozellikler.map((o, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                    <span className="text-white/60 text-sm">{o}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-xl text-sm font-medium transition-all ${
                  plan.one_cikan
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                }`}
              >
                {plan.buton}
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}