import Together from "together-ai"

export const together = new Together({ 
  apiKey: process.env.TOGETHER_API_KEY 
})

export async function analyzeXrayImage(imageUrl: string) {
  const response = await together.chat.completions.create({
    messages: [
      {
        role: "user",
        content: JSON.stringify([
          {
            type: "text",
            text: "For educational purposes only: Please describe what you observe in this X-ray image in general terms. Include a clear disclaimer that this is not medical advice and should not be used for diagnosis."
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
    model: "meta-llama/Llama-Vision-Free",
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>", "<|eom_id|>"]
  })

  return response
}
