import { NextRequest, NextResponse } from 'next/server';
import ApiClientServer from '@/lib/apiClientServer';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const apiClient = await ApiClientServer();

  if (!token) {
    return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
  }

  try {
    // Query users with the verification token
    const response = await apiClient.get(`/users?verification_token=${encodeURIComponent(token)}`);
    const users = response.data;

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
    }

    // Update the user to set is_verified to true and remove the verification token
    const updateResponse = await apiClient.patch(`/users/updateVerificationToken`, {
      id: users[0].id,
      is_verified: true,
      verification_token: null,
    });

    if (updateResponse.status >= 400) {
      return NextResponse.json({ error: 'Failed to verify email' }, { status: updateResponse.status });
    }

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
