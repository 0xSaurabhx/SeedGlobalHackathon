import { useState, useCallback, useEffect } from "react"
import { 
  BluetoothDevice,
  BluetoothRemoteGATTServer,
  BluetoothRemoteGATTCharacteristic // Added import
} from "@/components/types"

interface WearOSTrackerHook {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  heartRate: number | null
  stepCount: number | null
}

export function useWearOSTracker(): WearOSTrackerHook {
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [stepCount, setStepCount] = useState<number | null>(null)

  const connect = useCallback(async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate", "step_counter", "health_thermometer"] }], // Expanded services
        optionalServices: ["battery_service"], // Optional services
      })

      const server = await device.gatt?.connect()
      if (!server) throw new Error("Failed to connect to GATT server")

      setDevice(device)
      setServer(server)
      setIsConnected(true)

      // Dynamically handle available services
      const services = ["heart_rate", "step_counter", "health_thermometer"]
      for (const serviceName of services) {
        try {
          const service = await server.getPrimaryService(serviceName)
          const characteristic = await service.getCharacteristic("desired_characteristic") // Replace as needed
          await characteristic.startNotifications()
          characteristic.addEventListener("characteristicvaluechanged", handleCharacteristicChange)
        } catch (err) {
          console.warn(`Service ${serviceName} not available.`)
        }
      }
    } catch (error) {
      console.error("Error connecting to Bluetooth device:", error)
    }
  }, [])

  const handleCharacteristicChange = (event: Event) => {
    // Handle different characteristics based on service
  }

  const disconnect = useCallback(() => {
    if (server) {
      server.disconnect()
    }
    setDevice(null)
    setServer(null)
    setIsConnected(false)
    setHeartRate(null)
    setStepCount(null)
  }, [server])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    connect,
    disconnect,
    heartRate,
    stepCount,
  }
}

