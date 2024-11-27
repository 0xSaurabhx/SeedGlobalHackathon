import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    const buffer = await image.arrayBuffer()
    const fileName = `${Date.now()}-${image.name}`
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: image.type,
    })

    await s3Client.send(command)

    const imageUrl = `https://pub-ddad297497a2490c8620a13f6d369756.r2.dev/${fileName}`
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 })
  }
}
