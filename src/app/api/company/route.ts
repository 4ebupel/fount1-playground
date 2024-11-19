import apiClientServer from "@/lib/apiClientServer";
import { authOptions } from "@/lib/authOptions";
import basicErrorHandler from "@/lib/basicErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
      
    const apiClient = await apiClientServer();
        
    const response = await apiClient.get(`/companies/${request.nextUrl.searchParams.get("companyId")}`);
        
    return NextResponse.json(response.data);
  } catch (error) {
    return basicErrorHandler(error, "Error fetching company data");
  }
}