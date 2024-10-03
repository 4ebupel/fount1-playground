import CandidateManagement from "../components/CandidateManagament";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function CandidatePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <CandidateManagement />;
}