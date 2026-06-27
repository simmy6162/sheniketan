import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';

// Routes accessible only when NOT authenticated
const PUBLIC_ROUTES = ['/login', '/register', '/auth/admin'];

// Protected routes and which roles may access them
const ROLE_MAP: Record<string, string[]> = {
  '/admin':    ['admin', 'warden'],
  '/resident': ['member', 'warden', 'admin'],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and API routes to pass through unchanged
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('sn_session')?.value;
  const session = token ? await verifyToken(token) : null;

  // Redirect already-logged-in users away from auth pages
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    if (session) {
      const dest = session.role === 'admin' ? '/admin' : session.role === 'warden' ? '/admin/rooms' : '/resident';
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // Enforce role-based protection on dashboard routes
  for (const [route, allowedRoles] of Object.entries(ROLE_MAP)) {
    if (pathname.startsWith(route)) {
      if (!session) {
        const loginUrl = new URL(
          route === '/admin' ? '/auth/admin' : '/login',
          req.url
        );
        if (route !== '/admin') {
          loginUrl.searchParams.set('redirect', pathname);
        }
        return NextResponse.redirect(loginUrl);
      }
      if (!allowedRoles.includes(session.role)) {
        const dest = session.role === 'admin' ? '/admin' : session.role === 'warden' ? '/admin/rooms' : '/resident';
        return NextResponse.redirect(new URL(dest, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
