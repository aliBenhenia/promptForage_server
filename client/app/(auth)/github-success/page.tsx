// pages/github-success.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GithubSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Save to localStorage or cookies
      localStorage.setItem('token', token);

      // Optionally fetch profile here using the token
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [token]);

  return (
    <div className="text-white flex items-center justify-center h-screen">
      <p>Logging you in with GitHub...</p>
    </div>
  );
}
