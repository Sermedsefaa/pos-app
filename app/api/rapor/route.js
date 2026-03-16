import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const tarih = searchParams.get("tarih") || new Date().toISOString().split("T")[0]

  const baslangic = new Date(tarih)
  baslangic.setHours(0, 0, 0, 0)

  const bitis = new Date(tarih)
  bitis.setHours(23, 59, 59, 999)

  const isletmeId = session.user.isletmeId

  const { data: siparisler } = await supabase
    .from("siparisler")
    .select("*")
    .eq("isletme_id", isletmeId)
    .gte("created_at", baslangic.toISOString())
    .lte("created_at", bitis.toISOString())
    .order("created_at")

  const { data: kalemler } = await supabase
    .from("siparis_kalemleri")
    .select("*, siparisler!inner(isletme_id, created_at)")
    .eq("siparisler.isletme_id", isletmeId)
    .gte("siparisler.created_at", baslangic.toISOString())
    .lte("siparisler.created_at", bitis.toISOString())

  // En çok satanlar
  const urunSayac = {}
  kalemler?.forEach((k) => {
    if (!urunSayac[k.urun_adi]) urunSayac[k.urun_adi] = { adet: 0, ciro: 0 }
    urunSayac[k.urun_adi].adet += k.adet
    urunSayac[k.urun_adi].ciro += k.fiyat * k.adet
  })

  const enCokSatanlar = Object.entries(urunSayac)
    .sort((a, b) => b[1].adet - a[1].adet)
    .slice(0, 10)
    .map(([ad, { adet, ciro }]) => ({ ad, adet, ciro }))

  // Saatlik dağılım
  const saatlikDagilim = Array.from({ length: 24 }, (_, i) => ({
    saat: i,
    siparisSayisi: 0,
    ciro: 0,
  }))

  siparisler?.forEach((s) => {
    const saat = new Date(s.created_at).getHours()
    saatlikDagilim[saat].siparisSayisi++
    saatlikDagilim[saat].ciro += s.toplam
  })

  const toplamCiro = siparisler?.reduce((acc, s) => acc + s.toplam, 0) || 0
  const toplamSiparis = siparisler?.length || 0
  const ortalamaFiyat = toplamSiparis > 0 ? Math.round(toplamCiro / toplamSiparis) : 0

  return Response.json({
    tarih,
    isletmeAdi: session.user.isletmeAdi,
    toplamCiro,
    toplamSiparis,
    ortalamaFiyat,
    siparisler: siparisler || [],
    enCokSatanlar,
    saatlikDagilim: saatlikDagilim.filter((s) => s.siparisSayisi > 0),
  })
}