import { NextResponse } from 'next/server'
import { analyzeXrayImage } from '@/utils/groq'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()
    console.log('Received image URL:', imageUrl) // Debug log

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    // Get analysis from Groq AI
    const response = await analyzeXrayImage(imageUrl)
    console.log('Groq AI response:', response) // Debug log

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from AI model')
    }

    const analysis = response.choices[0].message.content
    if (analysis.includes("I can't help you with that")) {
      throw new Error('Model refused to analyze the image. Please try with a different image or prompt.')
    }

    return NextResponse.json({ 
      analysis: response.choices[0].message.content,
      type: response.type 
    })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error analyzing image' },
      { status: 500 }
    )
  }
}
