import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import apiClientServer from '@/lib/apiClientServer';

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

    console.log("user_data:", user_data);

    // if (response.status !== 200) {
    //   return NextResponse.json(
    //     { error: 'Failed to fetch user data' },
    //     { status: response.status }
    //   );
    // }
    
    return NextResponse.json(user_data);
  } catch (error: any) {
    const isXanoError = Boolean(error?.getResponse?.());
    console.log("isXanoError:", isXanoError);
    console.error("Xano auth/me error:", isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error);
    throw new Error(isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error.message || "An unexpected error occurred");
  }
}
