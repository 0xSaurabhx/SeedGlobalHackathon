"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Metric {
  value: number
  status: string
  normal_range: [number, number]
  interpretation: string
}

interface HealthData {
  analysis: {
    detailed_metrics: {
      [key: string]: Metric
    }
  }
}

export default function DetailedMetrics() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch("http://localhost:8000/analyze")
        const data = await response.json()
        setHealthData(data)
      } catch (error) {
        console.error("Error fetching health data:", error)
      }
    }

    fetchHealthData()
  }, [])

  if (!healthData) {
    return <div>Loading detailed metrics...</div>
  }

  const { detailed_metrics } = healthData.analysis

  const chartData = Object.entries(detailed_metrics).map(([name, metric]) => ({
    name,
    value: metric.value,
    min: metric.normal_range[0],
    max: metric.normal_range[1],
  }))

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Detailed Metrics</CardTitle>
        <CardDescription>Breakdown of your health metrics and their interpretations</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
              <Bar dataKey="min" fill="#82ca9d" />
              <Bar dataKey="max" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Normal Range</TableHead>
                <TableHead>Interpretation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(detailed_metrics).map(([name, metric]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{metric.value}</TableCell>
                  <TableCell>{metric.status}</TableCell>
                  <TableCell>{`${metric.normal_range[0]} - ${metric.normal_range[1]}`}</TableCell>
                  <TableCell>{metric.interpretation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

