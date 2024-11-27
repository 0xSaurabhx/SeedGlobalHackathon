"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface ProtectedComponentProps {
  children: ReactNode
}

export default function ProtectedComponent({ children }: ProtectedComponentProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!session?.user?.id) router.push("/signin") // Redirect if not authenticated
  }, [session, status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
