import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function analyzeXrayImage(imageUrl: string) {
  // First, detect the type of X-ray
  const detectionResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What type of X-ray is this? Please respond with only one of these categories: CHEST, HAND, LEG, SKULL, SPINE, or OTHER."
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    model: "llama-3.2-90b-vision-preview",
    temperature: 0.1,
    max_tokens: 50,
  });

  const xrayType = detectionResponse.choices[0].message.content.trim().toUpperCase();

  // Define specific prompts for different X-ray types
  const prompts: Record<string, string> = {
    CHEST: `Analyze this chest X-ray and describe:
    1. Visible anatomical structures (heart, lungs, ribs, etc.)
    2. General appearance of lung fields
    3. Heart size and position
    4. Any notable patterns in lung tissue
    5. Position and appearance of the diaphragm
    
    Structure your response in these sections:
    - Anatomical Overview
    - Lung Fields
    - Cardiac Silhouette
    - Additional Observations`,

    HAND: `Analyze this hand X-ray and describe:
    1. Bone structure and alignment
    2. Visible joints and spacing
    3. Finger bones (phalanges)
    4. Wrist bones if visible
    5. Overall bone density appearance
    
    Structure your response in these sections:
    - Bone Structure
    - Joint Spaces
    - Soft Tissue
    - Additional Observations`,

    LEG: `Analyze this leg X-ray and describe:
    1. Long bones (femur/tibia/fibula)
    2. Joint spaces if visible
    3. Bone density and alignment
    4. Soft tissue shadows
    
    Structure your response in these sections:
    - Bone Structure
    - Alignment
    - Joint Assessment
    - Additional Observations`,

    SKULL: `Analyze this skull X-ray and describe:
    1. Cranial vault
    2. Facial bones
    3. Sinus spaces
    4. Dental structures if visible
    
    Structure your response in these sections:
    - Cranial Structure
    - Facial Bones
    - Density Patterns
    - Additional Observations`,

    SPINE: `Analyze this spine X-ray and describe:
    1. Vertebral alignment
    2. Disc spaces
    3. Bone density patterns
    4. Curvature assessment
    
    Structure your response in these sections:
    - Vertebral Alignment
    - Disc Spaces
    - Bone Characteristics
    - Additional Observations`,

    OTHER: `Analyze this X-ray and describe:
    1. Visible anatomical structures
    2. Bone/tissue patterns
    3. Notable features
    
    Structure your response in these sections:
    - Anatomical Overview
    - Key Features
    - Additional Observations`
  };

  const analysisPrompt = prompts[xrayType] || prompts.OTHER;

  // Get detailed analysis based on X-ray type
  const analysisResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${analysisPrompt}\n\nProvide an educational analysis. Focus on describing what is visible in the image.`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
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

  return {
    type: xrayType,
    ...analysisResponse
  }
}
