import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import apiClientServer from "@/lib/apiClientServer";
import basicErrorHandler from "@/lib/basicErrorHandler";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const job_id = request.nextUrl.searchParams.get('jobId');
    const apiClient = await apiClientServer();
    const response = await apiClient.get(`/jobs/${job_id}`);
    const jobs = response.data;
    return NextResponse.json(jobs);
  } catch (error) {
    return basicErrorHandler(error, "Error fetching jobs");
  }
}