import { redirect } from 'next/navigation';
import Header from '../components/Header';
import Settings from '../components/Settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Settings />
      </div>
    </div>
  );
}
