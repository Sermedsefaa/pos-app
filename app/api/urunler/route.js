import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { data, error } = await supabase
    .from("urunler")
    .select("*")
    .eq("isletme_id", session.user.isletmeId)
    .eq("aktif", true)
    .order("ad")

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from("urunler")
    .insert([{
      ad: body.ad,
      fiyat: body.fiyat,
      kategori: body.kategori,
      stok: body.stok ? Number(body.stok) : 999,
      isletme_id: session.user.isletmeId,
    }])
    .select()

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data[0], { status: 201 })
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { id } = await request.json()

  const { error } = await supabase
    .from("urunler")
    .delete()
    .eq("id", id)
    .eq("isletme_id", session.user.isletmeId)

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json({ mesaj: "Silindi" })
}

export async function PUT(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from("urunler")
    .update({
      ad: body.ad,
      fiyat: body.fiyat,
      kategori: body.kategori,
      stok: body.stok !== undefined ? Number(body.stok) : 999,
    })
    .eq("id", body.id)
    .eq("isletme_id", session.user.isletmeId)
    .select()
    .single()

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}