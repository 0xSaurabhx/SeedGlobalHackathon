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

    const rawAnalysis = response.choices[0].message.content

    // Format the analysis into sections
    const sections = rawAnalysis.split('\n\n').filter(Boolean)
    const formattedAnalysis = sections.map(section => {
      const lines = section.split('\n')
      let title = lines[0].replace(/[:#]*/g, '').trim()
      const content = lines.slice(1).join('\n').trim()
      
      // If no clear title is found, generate one based on content
      if (!title || title === content) {
        if (content.includes('body part')) title = 'Identified Region'
        else if (content.includes('visible')) title = 'Visible Structures'
        else if (content.includes('pattern')) title = 'Notable Features'
        else title = 'Additional Observations'
      }

      return { title, content }
    })

    return NextResponse.json({ 
      analysis: { formattedAnalysis }
    })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error analyzing image' },
      { status: 500 }
    )
  }
}
