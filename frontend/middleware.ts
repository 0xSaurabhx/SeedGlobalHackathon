import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { D1Database } from '@cloudflare/workers-types'

export const config = {
  matcher: '/api/:path*',
}

export function middleware(request: NextRequest) {
  // Make D1 database available globally
  if (!global.DB) {
    global.DB = request.nextUrl.searchParams.get('DB') as unknown as D1Database
  }
  return NextResponse.next()
}