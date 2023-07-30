import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  const token = await getToken({ req })
  const isAuthenticated = !!token
  if (req.nextUrl.pathname === '/auth' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (req.nextUrl.pathname === '/profile' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}
