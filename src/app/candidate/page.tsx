import CandidateManagement from "../components/CandidateManagament";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function CandidatePage() {
  const { data: session, status } = useSession()

  if (!session) {
    redirect("/login");
  }

  return <CandidateManagement />;
}