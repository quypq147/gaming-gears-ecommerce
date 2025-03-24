import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          console.log("🔹 Strapi Response:", data);

          if (!res.ok) {
            throw new Error(data.error?.message || "Đăng nhập thất bại");
          }

          if (!data.jwt) {
            throw new Error("Không nhận được token từ Strapi");
          }

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            jwt: data.jwt, // Lưu token
          };
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.jwt = user.jwt; // Lưu token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.jwt = token.jwt;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


