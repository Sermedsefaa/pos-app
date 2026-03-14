import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("urunler")
    .select("*")
    .eq("aktif", true)
    .order("ad")

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from("urunler")
    .insert([
      {
        ad: body.ad,
        fiyat: body.fiyat,
        kategori: body.kategori,
      },
    ])
    .select()

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json(data[0], { status: 201 })
}