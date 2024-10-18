
import { authOptions } from "@/lib/authOptions";
import CandidateManagement from "../components/CandidateManagament";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Header from "../components/Header";

export default async function CandidatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <CandidateManagement />
    </div>
  );
}