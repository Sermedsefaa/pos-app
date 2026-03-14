import { supabase } from "@/lib/supabase"

export async function GET(request, { params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from("siparis_kalemleri")
    .select("*")
    .eq("siparis_id", id)

  if (error) {
    return Response.json({ hata: error.message }, { status: 500 })
  }

  return Response.json(data)
}