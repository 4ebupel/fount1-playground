import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { XanoClient } from "@xano/js-sdk";

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
          console.log("Attempting to login with Xano");
          const response = await xano.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const userAuthToken = response.getBody().authToken;

          let user

          if (userAuthToken) {
            try {
              const response = await xano.get("/auth/me");
              user = response.getBody();
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
            console.log("User returned from Xano:", user);
            return {
              id: user.id,
              email: user.email,
              authToken: userAuthToken,
            };
          } else {
            console.log("No user returned from Xano");
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
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.authToken = token.authToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};