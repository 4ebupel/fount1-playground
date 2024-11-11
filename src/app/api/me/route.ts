import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import apiClientServer from '@/lib/apiClientServer';
import { isAxiosError } from 'axios';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const apiClient = await apiClientServer();
    const apiUrl = 'https://xwmq-s7x2-c3ge.f2.xano.io/api:RwXSE_w2';

    const response = await apiClient.get(`${apiUrl}/auth/me?profile=employer`);
    const user_data = response.data;

    // console.log("user_data:", user_data);

    return NextResponse.json(user_data);
  } catch (error) {
    console.error("Error fetching user data:", error);

    if (isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error || error.message;

      switch(status) {
        case 400:
          return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        case 401:
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        case 403:
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        case 404:
          return NextResponse.json({ error: "Not Found" }, { status: 404 });
        case 500:
          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        default:
          return NextResponse.json({ error: message || "An unexpected error occurred" }, { status: status || 500 });
      }
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
