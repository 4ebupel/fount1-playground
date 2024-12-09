import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login");
  }
      
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
}
