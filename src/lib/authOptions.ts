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
        console.log("authorize function invoked");
        if (!credentials?.email || !credentials?.password) {
          // Return null to indicate unsuccessful login
          return null;
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
      
          const userAuthToken = response.getBody()?.authToken;
      
          if (userAuthToken) {
            // Set the auth token for subsequent requests
            xano.setAuthToken(userAuthToken);
      
            let user;
            try {
              const meResponse = await xano.get("/auth/me");
              user = meResponse.getBody();
            } catch (error) {
              console.error("Error fetching user details:", error);
              return null;
            }
      
            console.log("User returned from Xano:", user);
      
            return {
              id: user.id.toString(),
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
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};