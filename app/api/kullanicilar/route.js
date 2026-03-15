import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })
  if (session.user.rol !== "sahip") return Response.json({ hata: "Yetkisiz" }, { status: 403 })

  const { data, error } = await supabase
    .from("kullanicilar")
    .select("id, kullanici_adi, rol, aktif, created_at")
    .eq("isletme_id", session.user.isletmeId)
    .order("created_at")

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })
  if (session.user.rol !== "sahip") return Response.json({ hata: "Yetkisiz" }, { status: 403 })

  const body = await request.json()
  const sifreHash = await bcrypt.hash(body.sifre, 10)

  const { data, error } = await supabase
    .from("kullanicilar")
    .insert([{
      kullanici_adi: body.kullanici_adi,
      sifre_hash: sifreHash,
      rol: body.rol || "kasiyer",
      isletme_id: session.user.isletmeId,
      aktif: true,
    }])
    .select("id, kullanici_adi, rol, aktif")
    .single()

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })
  if (session.user.rol !== "sahip") return Response.json({ hata: "Yetkisiz" }, { status: 403 })

  const { id } = await request.json()

  const { error } = await supabase
    .from("kullanicilar")
    .delete()
    .eq("id", id)
    .eq("isletme_id", session.user.isletmeId)

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json({ mesaj: "Silindi" })
}