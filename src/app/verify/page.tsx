'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage('Email verified successfully. You can now log in.');
          // Optionally redirect after a delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('An unexpected error occurred');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>{message}</p>
    </div>
  );
}
