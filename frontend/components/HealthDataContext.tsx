"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export interface HealthData {
  summary: {
    health_score: number
    risk_level: string
    risk_message: string
    predicted_condition: string
    confidence: number
  }
  analysis: {
    metrics_overview: {
      total_metrics: number
      metrics_at_risk: number
      normal_metrics: number
    }
    risk_factors: {
      primary_factors: Array<{ metric: string; value: number; status: string }>
      secondary_factors: Array<{ metric: string; value: number; status: string }>
    }
  }
  action_plan: {
    lifestyle_changes: Array<{ area: string; recommendation: string; importance: string }>
  }
  warnings: {
    abnormal_metrics: {
      [key: string]: {
        status: string
        warning: string
        severity: string
      }
    }
    critical_values: string[]
  }
}

interface HealthDataContextType {
  healthData: HealthData | null
  setHealthData: React.Dispatch<React.SetStateAction<HealthData | null>>
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined)

interface ExtendedSession extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function HealthDataProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [healthData, setHealthData] = useState<HealthData | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/health-data?userId=${session.user.id}`)
        .then(response => response.json())
        .then(data => {
          if (data.analysisResults) {
            // Parse the analysis results if they're stored as a string
            const parsedResults = typeof data.analysisResults === 'string' 
              ? JSON.parse(data.analysisResults) 
              : data.analysisResults
            setHealthData(parsedResults)
          }
        })
        .catch(error => console.error('Error fetching health data:', error))
    }
  }, [session])

  return (
    <HealthDataContext.Provider value={{ healthData, setHealthData }}>
      {children}
    </HealthDataContext.Provider>
  )
}

export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider')
  }
  return context
}

