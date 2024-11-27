import { NextResponse } from 'next/server'
import { analyzeXrayImage } from '@/utils/groq'

export const runtime = 'edge'

function formatAnalysis(content: string) {
  const sections = content.split('\n\n')
  const formattedAnalysis = sections
    .filter(section => section.trim() && !section.includes("I'm not a medical professional"))
    .map(section => {
      const lines = section.split('\n')
      const title = lines[0].replace(/\*\*/g, '').trim()
      const content = lines.slice(1).join('\n').trim()
      return { title, content }
    })
    .filter(section => section.title && section.content)

  return { formattedAnalysis }
}

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

    const analysis = formatAnalysis(response.choices[0].message.content)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error analyzing image' },
      { status: 500 }
    )
  }
}
