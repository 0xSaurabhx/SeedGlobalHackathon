import HealthInputForm from "@/components/health-input-form"
import HealthAnalyzer from "@/components/health-analyzer"
import { HealthDataProvider } from "@/components/HealthDataContext"

export default function HealthAnalyzerPage() {
  return (
    <HealthDataProvider>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Health Analyzer</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <HealthInputForm />
          <HealthAnalyzer />
        </div>
      </div>
    </HealthDataProvider>
  )
}

