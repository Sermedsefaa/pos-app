import { supabase } from "@/lib/supabase"

export async function GET() {
  // Bugünün başlangıcı
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)

  // Bugünün siparişleri
  const { data: bugunSiparisler } = await supabase
    .from("siparisler")
    .select("toplam")
    .gte("created_at", bugun.toISOString())

  // Tüm zamanların siparişleri
  const { data: tumSiparisler } = await supabase
    .from("siparisler")
    .select("toplam")

  // En çok satan ürünler
  const { data: kalemler } = await supabase
    .from("siparis_kalemleri")
    .select("urun_adi, adet")

  // En çok satanları hesapla
  const urunSayac = {}
  kalemler?.forEach((k) => {
    urunSayac[k.urun_adi] = (urunSayac[k.urun_adi] || 0) + k.adet
  })
  const enCokSatanlar = Object.entries(urunSayac)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ad, adet]) => ({ ad, adet }))

  const bugunCiro = bugunSiparisler?.reduce((acc, s) => acc + s.toplam, 0) || 0
  const toplamCiro = tumSiparisler?.reduce((acc, s) => acc + s.toplam, 0) || 0
  const bugunSiparisSayisi = bugunSiparisler?.length || 0
  const toplamSiparisSayisi = tumSiparisler?.length || 0

  return Response.json({
    bugunCiro,
    toplamCiro,
    bugunSiparisSayisi,
    toplamSiparisSayisi,
    enCokSatanlar,
  })
}