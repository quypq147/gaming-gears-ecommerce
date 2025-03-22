import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    // 🔹 Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // 🔹 Callbacks: Store JWT & Session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "User"; // (Optional) Store role
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // (Optional) Attach role
      return session;
    },
  },

  // 🔹 Custom Pages
  pages: {
    signIn: "/sign-in",
    error: "/sign-in?error=AuthenticationFailed",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



