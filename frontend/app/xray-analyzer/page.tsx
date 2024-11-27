"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// Removed unused import
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function XrayAnalyzerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin")
    return null
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [analysis, setAnalysis] = useState<{ formattedAnalysis?: { title: string, content: string }[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
      setError("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  const analyzeImage = async () => {
    if (!image) return
    setError("")
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', image)

      // Upload image to Cloudflare R2
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok) throw new Error(uploadData.error)

      // Analyze image using Together AI
      const analyzeResponse = await fetch('/api/analyze-xray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: uploadData.imageUrl })
      })

      const analyzeData = await analyzeResponse.json()
      if (!analyzeResponse.ok) throw new Error(analyzeData.error)
      setAnalysis(analyzeData.analysis)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error analyzing image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI X-Ray Analysis</h1>
        <p className="text-muted-foreground">Educational tool for understanding X-ray imagery</p>
        <div className="mt-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-400/10">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <strong>Important Disclaimer:</strong> This tool is for educational and demonstration purposes only. 
                It should not be used for medical diagnosis. Always consult qualified healthcare professionals for 
                medical advice and interpretation of X-ray images.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload X-Ray Image</CardTitle>
            <CardDescription>
              Drag and drop your X-ray image or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted",
                imageUrl && "border-none p-0"
              )}
            >
              <input {...getInputProps()} />
              {imageUrl ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt="X-ray preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive ? "Drop the file here" : "Drop your X-ray image here or click to browse"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-4">
              <Button
                onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                variant="secondary"
                className="w-full"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <Button
                onClick={analyzeImage}
                disabled={!image || loading}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze X-Ray"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Educational Insights</CardTitle>
            <CardDescription>
              General observations about the X-ray image structure and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 dark:bg-blue-400/10">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    This is an educational analysis of the X-ray image. For accurate medical interpretation, 
                    please consult with a qualified healthcare professional.
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {analysis?.formattedAnalysis?.map((section: { title: string, content: string }, index: number) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                      <AccordionTrigger className="text-lg font-semibold">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          {section.content.split('\n').map((paragraph: string, pIndex: number) => {
                            if (paragraph.startsWith('*')) {
                              // Handle bullet points
                              return (
                                <ul key={pIndex} className="my-2">
                                  <li className="ml-4">{paragraph.substring(2)}</li>
                                </ul>
                              )
                            }
                            return <p key={pIndex} className="my-2">{paragraph}</p>
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                <p>Upload and analyze an X-ray to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
