import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const isletmeId = session.user.isletmeId

  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)

  const { data: bugunSiparisler } = await supabase
    .from("siparisler")
    .select("toplam")
    .eq("isletme_id", isletmeId)
    .gte("created_at", bugun.toISOString())

  const { data: tumSiparisler } = await supabase
    .from("siparisler")
    .select("toplam")
    .eq("isletme_id", isletmeId)

  const { data: kalemler } = await supabase
    .from("siparis_kalemleri")
    .select("urun_adi, adet, siparis_id, siparisler!inner(isletme_id)")
    .eq("siparisler.isletme_id", isletmeId)

  const { data: dusukStok } = await supabase
    .from("urunler")
    .select("ad, stok")
    .eq("isletme_id", isletmeId)
    .eq("aktif", true)
    .lt("stok", 6)
    .gt("stok", 0)
    .neq("stok", 999)

  const urunSayac = {}
  kalemler?.forEach((k) => {
    urunSayac[k.urun_adi] = (urunSayac[k.urun_adi] || 0) + k.adet
  })

  const enCokSatanlar = Object.entries(urunSayac)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ad, adet]) => ({ ad, adet }))

  return Response.json({
    bugunCiro: bugunSiparisler?.reduce((acc, s) => acc + s.toplam, 0) || 0,
    toplamCiro: tumSiparisler?.reduce((acc, s) => acc + s.toplam, 0) || 0,
    bugunSiparisSayisi: bugunSiparisler?.length || 0,
    toplamSiparisSayisi: tumSiparisler?.length || 0,
    enCokSatanlar,
    isletmeAdi: session.user.isletmeAdi,
    dusukStok: dusukStok || [],
  })
}