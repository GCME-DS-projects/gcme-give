import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware triggered for path: ', pathname);
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = request.cookies.get('better-auth.session_token');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*']
};