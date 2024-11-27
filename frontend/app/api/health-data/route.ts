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

  // Get latest health data
  const { results } = await context.env.DB.prepare(
    `SELECT healthMetrics, analysisReport, timestamp 
     FROM health_data 
     WHERE userId = ? 
     ORDER BY timestamp DESC 
     LIMIT 1`
  ).bind(userId).all()

  return NextResponse.json(results[0] || null)
}

export async function POST(request: Request, context: { env: RuntimeContext }) {
  const data = await request.json()
  const { userId, ...healthMetrics } = data
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Store health data with timestamp
  await context.env.DB.prepare(
    `INSERT INTO health_data (userId, healthMetrics, timestamp) 
     VALUES (?, ?, ?)`
  ).bind(
    userId,
    JSON.stringify(healthMetrics),
    Date.now()
  ).run()

  return NextResponse.json({ success: true })
}
