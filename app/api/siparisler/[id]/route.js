import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ hata: "Yetkisiz" }, { status: 401 })

  const { id } = await params

  const { data, error } = await supabase
    .from("siparis_kalemleri")
    .select("*")
    .eq("siparis_id", id)

  if (error) return Response.json({ hata: error.message }, { status: 500 })
  return Response.json(data)
}