import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    // Email & Password (Strapi Local Auth)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();
        if (!res.ok) throw new Error(user.error?.message || "Login failed");

        return { id: user.user.id, name: user.user.username, email: user.user.email, jwt: user.jwt };
      },
    }),

    // Google OAuth (Strapi Social Auth)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/google/callback?access_token=${profile.access_token}`);
        const user = await res.json();

        if (!res.ok) throw new Error(user.error?.message || "Google login failed");

        return { id: user.user.id, name: user.user.username, email: user.user.email, jwt: user.jwt };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

