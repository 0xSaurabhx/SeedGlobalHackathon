import Together from "together-ai"

export const together = new Together({ 
  apiKey: process.env.TOGETHER_API_KEY 
})

export async function analyzeXrayImage(imageUrl: string) {
  console.log('Sending request with URL:', imageUrl) // Debug log

  const response = await together.chat.completions.create({
    messages: [
      {
        role: "user",
        content: JSON.stringify([
          {
            type: "text",
            text: "Please describe the visual elements and general features you observe in this X-ray image. Focus on describing the visible structures and patterns from an educational perspective. Remember, this is for educational purposes only and not for medical diagnosis."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ])
      }
    ],
    model: "meta-llama/Llama-Vision-Free",  // Try a different model
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
  })

  console.log('API Response:', response) // Debug log
  return response
}
