import { NextResponse } from 'next/server';
import apiClientServer from '@/lib/apiClientServer';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const apiClient = await apiClientServer(request);
    const apiUrl = 'https://xwmq-s7x2-c3ge.f2.xano.io/api:eNLIk4zU';

    const response = await apiClient.get(`${apiUrl}/user?${queryString}`);
    const candidates = response.data;

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);

    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      // Handle unauthorized access
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}


