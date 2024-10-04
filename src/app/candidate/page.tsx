import { authOptions } from "@/lib/authOptions";
import CandidateManagement from "../components/CandidateManagament";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function CandidatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login");
  }

  return <CandidateManagement />;
}