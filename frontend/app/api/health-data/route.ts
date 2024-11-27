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

  // Get latest health data with analysis
  const { results } = await context.env.DB.prepare(
    `SELECT healthMetrics, analysisResults, timestamp 
     FROM health_data 
     WHERE userId = ? 
     ORDER BY timestamp DESC 
     LIMIT 1`
  ).bind(userId).all()

  return NextResponse.json(results[0] || { noData: true })
}

export async function POST(request: Request, context: { env: RuntimeContext }) {
  const data = await request.json()
  const { userId, analysisResults, ...healthMetrics } = data
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Store health data and analysis results with timestamp
  await context.env.DB.prepare(
    `INSERT INTO health_data (userId, healthMetrics, analysisResults, timestamp) 
     VALUES (?, ?, ?, ?)`
  ).bind(
    userId,
    JSON.stringify(healthMetrics),
    JSON.stringify(analysisResults),
    Date.now()
  ).run()

  return NextResponse.json({ success: true, analysisResults })
}
