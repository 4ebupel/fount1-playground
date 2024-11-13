import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import ApiClientServer from "@/lib/apiClientServer";
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const { firstName, lastName, email } = body;

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const apiClient = await ApiClientServer();

  try {
    const response = await apiClient.patch('/user/updateInfo', {
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error('Update profile information error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
      headers: error.response?.headers,
    });
    return NextResponse.json({ message: 'Failed to update profile information' }, { status: 500 });
  }
}