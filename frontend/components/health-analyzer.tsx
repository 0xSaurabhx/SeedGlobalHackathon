"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealthData } from "@/components/HealthDataContext"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { FiAlertCircle, FiInfo } from "react-icons/fi"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export function HealthAnalyzer() {
  const { healthData } = useHealthData()

  if (!healthData) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          No health data available. Please submit your health metrics.
        </CardContent>
      </Card>
    )
  }

  if (!healthData.summary || !healthData.analysis) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Invalid analysis data format. Please try submitting again.
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, analysis, action_plan } = healthData

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Health Analysis Results</CardTitle>
        <CardDescription>Your overall health score and risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={summary.health_score}
              text={`${summary.health_score.toFixed(2)}`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: summary.health_score >= 70 ? "#4caf50" : summary.health_score >= 40 ? "#ff9800" : "#f44336",
                textColor: "#000",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
          <div>
            <div className="flex items-center">
              <Badge color={
                summary.risk_level === "Low" ? "green" :
                summary.risk_level === "Medium" ? "yellow" : "red"
              }>
                {summary.risk_level}
              </Badge>
              <Tooltip content={summary.risk_message}>
                <FiInfo className="ml-2 text-gray-500 cursor-pointer" />
              </Tooltip>
            </div>
            <p className="mt-2 font-semibold">Predicted Condition: {summary.predicted_condition}</p>
            <p>Confidence: {(summary.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Metrics Overview</h3>
          <div className="flex space-x-4">
            <Badge color="blue">Total Metrics: {analysis.metrics_overview.total_metrics}</Badge>
            <Badge color="orange">Metrics at Risk: {analysis.metrics_overview.metrics_at_risk}</Badge>
            <Badge color="green">Normal Metrics: {analysis.metrics_overview.normal_metrics}</Badge>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Risk Factors</h3>
          {analysis.risk_factors ? (
            <>
              {analysis.risk_factors.primary_factors && analysis.risk_factors.primary_factors.length > 0 ? (
                <div className="mb-4">
                  <h4 className="font-medium">Primary Factors</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.risk_factors.primary_factors.map((factor, index) => (
                      <Tooltip key={index} content={`${factor.metric}: ${factor.status}`}>
                        <Badge color="red" className="cursor-pointer">
                          {factor.metric}
                        </Badge>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No primary risk factors available.</p>
              )}
              {analysis.risk_factors.secondary_factors && analysis.risk_factors.secondary_factors.length > 0 ? (
                <div>
                  <h4 className="font-medium">Secondary Factors</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.risk_factors.secondary_factors.map((factor, index) => (
                      <Tooltip key={index} content={`${factor.metric}: ${factor.status}`}>
                        <Badge color="orange" className="cursor-pointer">
                          {factor.metric}
                        </Badge>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No secondary risk factors available.</p>
              )}
            </>
          ) : (
            <p>No risk factors available.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Action Plan</h3>
          <ul className="list-disc list-inside space-y-1">
            {action_plan.lifestyle_changes.map((change, index) => (
              <li key={index} className="flex items-center space-x-2">
                <FiAlertCircle className={`text-${change.importance === "High" ? "red-500" : change.importance === "Medium" ? "yellow-500" : "green-500"}`} />
                <span>{change.area}: {change.recommendation} (Importance: {change.importance})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Warnings</h3>
          {healthData.warnings ? (
            <>
              {Object.keys(healthData.warnings.abnormal_metrics).length > 0 ? (
                <div className="mb-4">
                  <h4 className="font-medium">Abnormal Metrics</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(healthData.warnings.abnormal_metrics).map(([metric, details]) => (
                      <li key={metric} className="flex items-center space-x-2">
                        <FiAlertCircle className="text-red-500" />
                        <span>{metric}: {details.warning} (Severity: {details.severity})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No abnormal metrics.</p>
              )}
              {healthData.warnings.critical_values.length > 0 ? (
                <div>
                  <h4 className="font-medium">Critical Values</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {healthData.warnings.critical_values.map((value, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FiAlertCircle className="text-red-700" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No critical values.</p>
              )}
            </>
          ) : (
            <p>No warnings available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HealthAnalyzer

