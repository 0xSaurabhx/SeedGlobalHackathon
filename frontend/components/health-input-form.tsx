"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useHealthData } from "@/components/HealthDataContext"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"

interface CustomSession extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface HealthInputs {
  [key: string]: number
}

const initialHealthInputs: HealthInputs = {
  Glucose: 85,
  Cholesterol: 180,
  Hemoglobin: 14,
  Platelets: 250000,
  "White Blood Cells": 7000,
  "Red Blood Cells": 5.0,
  Hematocrit: 42,
  "Mean Corpuscular Volume": 90,
  "Mean Corpuscular Hemoglobin": 30,
  "Mean Corpuscular Hemoglobin Concentration": 34,
  Insulin: 10,
  BMI: 22,
  "Systolic Blood Pressure": 110,
  "Diastolic Blood Pressure": 70,
  Triglycerides: 100,
  HbA1c: 5.0,
  "LDL Cholesterol": 90,
  "HDL Cholesterol": 50,
  AST: 25,
  "Heart Rate": 75,
  Creatinine: 1.0,
  Troponin: 0.02,
  "C-reactive Protein": 1.5
}

export default function HealthInputForm() {
  const { data: session } = useSession() as { data: CustomSession | null }
  const { setHealthData } = useHealthData()
  const [healthInputs, setHealthInputs] = useState<HealthInputs>(initialHealthInputs)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/health-data?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.healthMetrics) {
            setHealthInputs(JSON.parse(data.healthMetrics))
          }
        })
        .catch(console.error)
    }
  }, [session])

  const handleInputChange = (key: string, value: string) => {
    setHealthInputs((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...healthInputs, userId: session.user.id }),
      })
      if (!response.ok) {
        throw new Error("Failed to submit health data")
      }
      const data = await response.json()
      setHealthData(data)
      toast({
        title: "Health data submitted",
        description: "Your health data has been successfully analyzed.",
      })
      setIsConnected(true)
    } catch (error) {
      console.error("Error submitting health data:", error)
      toast({
        title: "Error",
        description: "Failed to submit health data. Please try again.",
        variant: "destructive",
      })
      setIsConnected(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Input Form</CardTitle>
        <CardDescription>Enter your health metrics for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(healthInputs).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  step="any"
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">Submit Health Data</Button>
        </form>
        {isConnected && <p className="text-green-500">Connected</p>}
      </CardContent>
    </Card>
  )
}

