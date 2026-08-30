import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'aslanadmin123';
  const hasCookie = request.cookies.get('admin_token')?.value === adminPassword;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!hasCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If user is already logged in and tries to access /login, redirect to admin
  if (request.nextUrl.pathname === '/login') {
    if (hasCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
