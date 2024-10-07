import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const authToken = session.user?.authToken;

    if (!authToken) {
      return NextResponse.json({ error: 'No authentication token available' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const apiUrl = 'https://xwmq-s7x2-c3ge.f2.xano.io/api:mWh-8XyD';

    const response = await axios.get(`${apiUrl}/querySkills?${queryString}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const skills = response.data;

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}