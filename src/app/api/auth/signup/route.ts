import { NextResponse } from "next/server";
import { XanoClient } from "@xano/js-sdk";

const xano = new XanoClient({
  apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL, // Replace with your Xano instance URL
});

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const response = await xano.post("/auth/signup", {
      email,
      password,
    });

    return NextResponse.json(response.getBody().data, { status: 200 });
  } catch (error: any) {
    console.error("Xano signup error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 400 }
    );
  }
}