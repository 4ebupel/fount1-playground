import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { ModernTabs } from "../components/JobTabs"
import Header from "../components/Header"

export default async function JobDetailsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-background">
        <ModernTabs jobDetails={{
          id: "JOB-001",
          title: "Software Developer"
        }} />
      </main>
    </div>
  )
}