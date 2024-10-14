// /app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { XanoNodeClient } from '@xano/js-sdk';

export async function POST(request: NextRequest) {
  try {
    // Get the token (JWT) from the request
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.refreshToken) {
      return NextResponse.json({ error: 'Not authenticated or no refresh token found' }, { status: 401 });
    }

    const refreshToken = token.refreshToken;

    // Initialize Xano client
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });

    // Send request to invalidate the refresh token
    const response = await xano.post('/auth/logout', {
      refresh_token: refreshToken,
    });

    if (response.getStatusCode() !== 200) {
      console.error('Failed to invalidate refresh token on Xano:', response.getBody());
      return NextResponse.json({ error: 'Failed to invalidate refresh token' }, { status: 500 });
    }

    // Successfully invalidated the refresh token
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
