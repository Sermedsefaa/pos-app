import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        // Önce kullanıcıyı bul
        const { data: kullanici, error } = await supabase
          .from("kullanicilar")
          .select("*")
          .eq("kullanici_adi", credentials.username)
          .eq("aktif", true)
          .single()

        if (error || !kullanici) {
          console.log("Kullanici bulunamadi:", error)
          return null
        }

        // Şifreyi kontrol et
        const sifreDogruMu = await bcrypt.compare(
          credentials.password,
          kullanici.sifre_hash
        )

        if (!sifreDogruMu) {
          console.log("Sifre yanlis")
          return null
        }

        // İşletme adını ayrı çek
        const { data: isletme } = await supabase
          .from("isletmeler")
          .select("ad")
          .eq("id", kullanici.isletme_id)
          .single()

        console.log("Giris basarili:", kullanici.kullanici_adi, isletme?.ad)

        return {
          id: kullanici.id,
          name: kullanici.kullanici_adi,
          isletmeId: kullanici.isletme_id,
          isletmeAdi: isletme?.ad || "İşletme",
          rol: kullanici.rol,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isletmeId = user.isletmeId
        token.isletmeAdi = user.isletmeAdi
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }) {
      session.user.isletmeId = token.isletmeId
      session.user.isletmeAdi = token.isletmeAdi
      session.user.rol = token.rol
      return session
    },
  },
  pages: { signIn: "/giris" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}
