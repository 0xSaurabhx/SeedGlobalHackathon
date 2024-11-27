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
              Please analyze this X-ray image in the following steps:

              1. First identify which body part or anatomical region is shown in this X-ray image.
              2. List the main anatomical structures visible in this specific type of X-ray.
              3. Describe any notable patterns, features, or characteristics visible in the image.
              4. Point out any educational aspects that would be interesting to note about this type of X-ray.

              Format your response in clear sections with informative headings.
              Focus only on what is actually visible in this specific X-ray image.
              Maintain an educational tone while analyzing the image.
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
