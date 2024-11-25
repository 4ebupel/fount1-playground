import LoginForm from "../components/LoginForm";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
}
