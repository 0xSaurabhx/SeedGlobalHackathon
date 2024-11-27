import { NextResponse } from 'next/server'
import { analyzeXrayImage } from '../../../utils/together'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Get analysis from Together AI
    const response = await analyzeXrayImage(imageUrl)
    const analysis = response.choices[0]?.message?.content || 'No analysis available'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: 'Error analyzing image' },
      { status: 500 }
    )
  }
}
