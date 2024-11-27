import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function analyzeXrayImage(imageUrl: string) {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
              Please analyze the provided X-ray image and describe:
              1. Visible anatomical structures and any notable features.
              2. Patterns or irregularities that might indicate potential conditions, anomalies, or areas of interest for educational purposes.
              3. Hypothesize plausible scenarios based on the patterns observed.

              DONT SAY I'm not a medical professional, and I don't have the capability to visually examine or analyze X-ray images. However, I can provide some general information about what might be visible in a chest X-ray. Please consult a qualified healthcare professional for medical advice and interpretation of X-ray images.
              `
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })
  
    return response
  }
  