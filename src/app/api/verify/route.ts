import { NextRequest, NextResponse } from 'next/server';
import { XanoNodeClient } from '@xano/js-sdk';

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
  }

  try {
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });

    // Query users with the verification token
    const response = await xano.get(`/users?verification_token=${encodeURIComponent(token)}`);
    const users = response.getBody();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
    }

    const user = users[0];

    // Update the user to set is_verified to true and remove the verification token
    const updateResponse = await xano.put(`/users/${user.id}`, {
      is_verified: true,
      verification_token: null,
    });

    if (updateResponse.getStatusCode() >= 400) {
      return NextResponse.json({ error: 'Failed to verify email' }, { status: updateResponse.getStatusCode() });
    }

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
