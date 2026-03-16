import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { data, error } = await supabase
    .from("siparisler")
    .select("*")
    .eq("isletme_id", session.user.isletmeId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const body = await request.json()

  const { data: siparis, error: siparisHata } = await supabase
    .from("siparisler")
    .insert([{
      toplam: body.toplam,
      notlar: body.notlar || "",
      isletme_id: session.user.isletmeId,
      masa_id: body.masa_id || null,
      masa_numara: body.masa_numara || null,
    }])
    .select()
    .single()

  if (siparisHata) return Response.json({ hata: siparisHata.message }, { status: 500 })

  const kalemler = body.kalemler.map((k) => ({
    siparis_id: siparis.id,
    urun_id: k.id,
    urun_adi: k.ad,
    fiyat: k.fiyat,
    adet: k.adet,
  }))

  const { error: kalemHata } = await supabase
    .from("siparis_kalemleri")
    .insert(kalemler)

  if (kalemHata) return Response.json({ hata: kalemHata.message }, { status: 500 })

  // Stokları düşür
  for (const kalem of body.kalemler) {
    await supabase.rpc("stok_dusur", {
      urun_id: kalem.id,
      miktar: kalem.adet,
    })
  }

  // Masayı dolu yap
  if (body.masa_id) {
    await supabase
      .from("masalar")
      .update({ durum: "dolu" })
      .eq("id", body.masa_id)
  }

  return Response.json(siparis, { status: 201 })
}