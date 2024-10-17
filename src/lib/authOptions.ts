import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { XanoNodeClient, XanoRequestError } from "@xano/js-sdk";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
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
        console.log("authorize function invoked");
        if (!credentials?.email || !credentials?.password) {
          // Return null to indicate unsuccessful login
          return null;
        }
      
        const xano = new XanoNodeClient({
          apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
        });
      
        try {
          console.log("Attempting to login with Xano");
          const response = await xano.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });
      
          const responseBody = response.getBody();

          const isVerified = responseBody?.user?.is_verified;

          if (!isVerified) {
            // User is not verified
            throw new Error('Please verify your email before logging in', { cause: 'EmailNotVerified' });
          }

          const accessToken = responseBody?.access_token;
          const refreshToken = responseBody?.refresh_token;
          const expiresIn = responseBody?.expires_in; // in seconds
          const user = responseBody?.user;

          console.log(`expiresIn received from Xano: ${expiresIn}`);

          if (accessToken && refreshToken && user) {
            // Calculate token expiration time
            const accessTokenExpires = Date.now() + expiresIn * 1000;

            return {
              id: user.id.toString(),
              email: user.email,
              accessToken,
              refreshToken,
              accessTokenExpires,
              isVerified,
            };
          } else {
            console.log("Login failed, no tokens returned from Xano");
            return null;
          }
        } catch (error: any) {
          // This whole circus is because Xano uses its own error object (XanoRequestError), 
          // which is different from the standard NextAuth error object 
          // and for some reason I wasn't able to get the "instanceof" check to work.
          const isXanoError = Boolean(error?.getResponse?.());
          console.log("isXanoError:", isXanoError);
          console.error("Xano login error:", isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error);
          // Pass the error message through
          throw new Error(isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error.message || "An unexpected error occurred");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          isVerified: user.isVerified,
        };
      }
  
      // Return previous token if the access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        const secondsUntilExpiration = (token.accessTokenExpires - Date.now()) / 1000;
        console.log(`Access token will expire in ${secondsUntilExpiration} seconds`);
        return token;
      }
  
      // Access token has expired, try to refresh it
      console.log("Access token has expired, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
      }
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(token: JWT) {
  try {
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });   

    const response = await xano.post("/auth/refresh", {
      refresh_token: token.refreshToken,
    });

    const responseBody = response.getBody();

    const accessToken = responseBody?.access_token;
    const refreshToken = responseBody?.refresh_token;
    const expiresIn = responseBody?.expires_in; // in seconds

    if (!accessToken || !refreshToken) {
      throw new Error("Failed to refresh access token");
    }

    const accessTokenExpires = Date.now() + expiresIn * 1000;

    return {
      ...token,
      accessToken,
      refreshToken,
      accessTokenExpires,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Error response from Xano:", error.response.data);
    } else if (error.request) {
      // No response received
      console.error("No response received when refreshing access token:", error.request);
    } else {
      // Error setting up the request
      console.error("Error setting up refresh token request:", error.message);
    }
  
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
