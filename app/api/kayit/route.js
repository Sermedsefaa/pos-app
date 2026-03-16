import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request) {
  const body = await request.json()

  const { isletme_adi, kullanici_adi, sifre } = body

  if (!isletme_adi || !kullanici_adi || !sifre) {
    return Response.json({ hata: "Tüm alanlar zorunlu" }, { status: 400 })
  }

  if (sifre.length < 6) {
    return Response.json({ hata: "Şifre en az 6 karakter olmalı" }, { status: 400 })
  }

  // Kullanıcı adı daha önce alınmış mı?
  const { data: mevcutKullanici } = await supabase
    .from("kullanicilar")
    .select("id")
    .eq("kullanici_adi", kullanici_adi)
    .single()

  if (mevcutKullanici) {
    return Response.json({ hata: "Bu kullanıcı adı zaten alınmış" }, { status: 400 })
  }

  // İşletmeyi oluştur
  const { data: isletme, error: isletmeHata } = await supabase
    .from("isletmeler")
    .insert([{ ad: isletme_adi, aktif: true }])
    .select()
    .single()

  if (isletmeHata) {
    return Response.json({ hata: isletmeHata.message }, { status: 500 })
  }

  // Sahip kullanıcıyı oluştur
  const sifreHash = await bcrypt.hash(sifre, 10)

  const { error: kullaniciHata } = await supabase
    .from("kullanicilar")
    .insert([{
      isletme_id: isletme.id,
      kullanici_adi,
      sifre_hash: sifreHash,
      rol: "sahip",
      aktif: true,
    }])

  if (kullaniciHata) {
    // Kullanıcı oluşturulamazsa işletmeyi de sil
    await supabase.from("isletmeler").delete().eq("id", isletme.id)
    return Response.json({ hata: kullaniciHata.message }, { status: 500 })
  }

  return Response.json({ mesaj: "Kayıt başarılı" }, { status: 201 })
}