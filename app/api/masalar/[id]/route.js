import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from("masalar")
    .update({ durum: body.durum })
    .eq("id", id)
    .eq("isletme_id", session.user.isletmeId)
    .select()
    .single()

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}