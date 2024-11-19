import { authOptions } from "@/lib/authOptions";
import basicErrorHandler from "@/lib/basicErrorHandler";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import ApiClientServer from "@/lib/apiClientServer";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { company_id, socials } = await request.json();
    const apiClient = await ApiClientServer();
    const response = await apiClient.patch('/companies/update/socialMedia', {
      company_id,
      socials,
    });

    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    return basicErrorHandler(error, "Error updating company socials");
  }
}
