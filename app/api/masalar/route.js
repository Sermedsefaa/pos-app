import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { data, error } = await supabase
    .from("masalar")
    .select("*")
    .eq("isletme_id", session.user.isletmeId)
    .eq("aktif", true)
    .order("numara")

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from("masalar")
    .insert([{
      numara: body.numara,
      isletme_id: session.user.isletmeId,
      durum: "bos",
    }])
    .select()
    .single()

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { id } = await request.json()

  const { error } = await supabase
    .from("masalar")
    .update({ aktif: false })
    .eq("id", id)
    .eq("isletme_id", session.user.isletmeId)

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json({ mesaj: "Silindi" })
}