import { NextResponse } from 'next/server';

/**
 * Next.js Middleware - Bypassed to allow public usage
 * without requiring login or session registration.
 */
export async function middleware(req) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
