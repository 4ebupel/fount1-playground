// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error: string;
  }
}
