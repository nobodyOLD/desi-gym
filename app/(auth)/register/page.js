'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Register Page - Auto-redirects to profile setup
 * since registration forms are bypassed for direct guest usage.
 */
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/profile');
  }, [router]);

  return null;
}
