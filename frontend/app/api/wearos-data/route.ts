import { NextResponse } from 'next/server'
import { D1Database } from '@cloudflare/workers-types'

interface RuntimeContext {
  DB: D1Database;
}

export const runtime = 'edge';

export async function GET(request: Request, context: { env: RuntimeContext }) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { results } = await context.env.DB.prepare(
    'SELECT heartRate, stepCount, timestamp FROM wearos_data WHERE userId = ?'
  ).bind(userId).all()

  return NextResponse.json(results)
}

export async function POST(request: Request, context: { env: RuntimeContext }) {
  const { userId, heartRate, stepCount, timestamp } = await request.json()
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  await context.env.DB.prepare(
    'INSERT INTO wearos_data (userId, heartRate, stepCount, timestamp) VALUES (?, ?, ?, ?)'
  ).bind(userId, heartRate, stepCount, timestamp).run()

  return NextResponse.json({ success: true })
}
