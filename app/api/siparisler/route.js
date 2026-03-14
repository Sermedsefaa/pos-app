import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("siparisler")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const body = await request.json()
  // Önce siparişi kaydet
  const { data: siparis, error: siparisHata } = await supabase
    .from("siparisler")
    .insert([{ toplam: body.toplam, notlar: body.notlar || "" }])
    .select()
    .single()

  if (siparisHata) {
    return Response.json({ hata: siparisHata.message }, { status: 500 })
  }

  // Sonra kalemleri kaydet
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

  if (kalemHata) {
    return Response.json({ hata: kalemHata.message }, { status: 500 })
  }

  return Response.json(siparis, { status: 201 })
}