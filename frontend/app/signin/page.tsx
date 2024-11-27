"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign In</h1>
      <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
    </div>
  )
}
