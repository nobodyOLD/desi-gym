'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Login Page - Auto-redirects to Dashboard
 * since login forms have been disabled.
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
