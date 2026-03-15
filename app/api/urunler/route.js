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
}export async function DELETE(request) {
  const { id } = await request.json()

  const { error } = await supabase
    .from("urunler")
    .delete()
    .eq("id", id)

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json({ mesaj: "Ürün silindi" })
}

export async function PUT(request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from("urunler")
    .update({
      ad: body.ad,
      fiyat: body.fiyat,
      kategori: body.kategori,
    })
    .eq("id", body.id)
    .select()
    .single()

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json(data)
}