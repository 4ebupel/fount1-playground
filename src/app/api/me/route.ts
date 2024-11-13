import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import apiClientServer from '@/lib/apiClientServer';
import { isAxiosError } from 'axios';
import basicErrorHandler from '@/lib/basicErrorHandler';

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
    return basicErrorHandler(error, "Error fetching user data");
  }
}
