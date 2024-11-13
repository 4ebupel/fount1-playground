import { NextResponse } from 'next/server';
import apiClientServer from '@/lib/apiClientServer';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import basicErrorHandler from '@/lib/basicErrorHandler';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const apiClient = await apiClientServer();
    const apiUrl = 'https://xwmq-s7x2-c3ge.f2.xano.io/api:mWh-8XyD';

    const response = await apiClient.get(`${apiUrl}/querySkills?${queryString}`);
    const skills = response.data;

    return NextResponse.json(skills);
  } catch (error) {
    return basicErrorHandler(error, "Error fetching skills");
  }
}
