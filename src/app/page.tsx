import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  } else {
    redirect("/candidate")
  }

  // Optionally, you can return null or a loading component
  return null
}