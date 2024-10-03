import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { XanoClient } from "@xano/js-sdk";
import { User, Session } from "next-auth";
import { DefaultSession } from "next-auth";

// Add this type declaration
declare module "next-auth" {
  interface User {
    authToken?: string;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      authToken?: string;
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const xano = new XanoClient({
          apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
        });

        try {
          const response = await xano.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.getBody();

          if (user) {
            return {
              id: user.id,
              email: user.email,
              authToken: user.authToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Xano login error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.authToken = user.authToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string' && typeof token.email === 'string' && typeof token.authToken === 'string') {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.authToken = token.authToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
