import WearOSTracker from "@/components/wear-os-tracker"
import ProtectedComponent from "../../components/protected-component"

export default function WearOSTrackerPage() {
  return (
    <ProtectedComponent>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Wear OS Tracker</h1>
        <WearOSTracker />
      </div>
    </ProtectedComponent>
  )
}

