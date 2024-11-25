import { authOptions } from "@/lib/authOptions";
import basicErrorHandler from "@/lib/basicErrorHandler";
import { getServerSession } from "next-auth/next";
import ApiClientServer from "@/lib/apiClientServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const apiClient = await ApiClientServer();
    const { company_id } = body;

    const response = await apiClient.post('/companies/initializeBillingDetails', {
      company_id,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return basicErrorHandler(error, "Error initializing company billing details");
  }
}