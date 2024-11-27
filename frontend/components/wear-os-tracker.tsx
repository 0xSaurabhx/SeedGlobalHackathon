"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { 
  BluetoothDevice,
  BluetoothRemoteGATTCharacteristic
} from "@/components/types"

// Import RequestDeviceOptions type from the Web Bluetooth API
type RequestDeviceOptions = {
  filters: Array<{ services: string[] }>
  optionalServices?: string[]
}

// Add 'bluetooth' property directly to Navigator interface
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice: (options: RequestDeviceOptions) => Promise<BluetoothDevice>
    }
  }
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SensorData {
  heartRate: number[]
  stepCount: number[]
  timestamp: number[]
}

// Updated UUIDs to match working example
const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb'
const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb'
const STEP_COUNT_SERVICE = '00001814-0000-1000-8000-00805f9b34fb'
const STEP_COUNT_CHARACTERISTIC = '00002a56-0000-1000-8000-00805f9b34fb'
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb'
const BATTERY_CHARACTERISTIC = '00002a19-0000-1000-8000-00805f9b34fb'

export default function WearOSTracker() {
  const { data: session, status } = useSession() as { data: Session & { user: { id: string } } | null, status: string } // Ensures session is handled
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [sensorData, setSensorData] = useState<SensorData>({ heartRate: [], stepCount: [], timestamp: [] })
  const [batteryLevel, setBatteryLevel] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)

  const connectToDevice = async () => {
    if (!session?.user?.id) {
      setError('User ID not available')
      return
    }
    try {
      setError('')
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [HEART_RATE_SERVICE] },
          { services: [STEP_COUNT_SERVICE] }
        ],
        optionalServices: [
          BATTERY_SERVICE,
          'device_information'
        ]
      })
      
      setDevice(device)
      device.addEventListener('gattserverdisconnected', onDisconnected)
      await connect(device)
    } catch (error) {
      setError(`Error connecting: ${(error as Error).message}`)
      setIsConnected(false)
    }
  }

  const connect = async (device: BluetoothDevice) => {
    try {
      const server = await device.gatt?.connect()
      if (!server) throw new Error("Failed to connect to GATT server")
      
      setIsConnected(true)

      // Heart Rate Service
      try {
        const heartRateService = await server.getPrimaryService(HEART_RATE_SERVICE)
        const heartRateChar = await heartRateService.getCharacteristic(HEART_RATE_CHARACTERISTIC)
        await heartRateChar.startNotifications()
        heartRateChar.addEventListener('characteristicvaluechanged', handleHeartRateChange)
      } catch {
        console.log('Heart Rate service not available')
      }

      // Step Count Service
      try {
        const stepService = await server.getPrimaryService(STEP_COUNT_SERVICE)
        const stepChar = await stepService.getCharacteristic(STEP_COUNT_CHARACTERISTIC)
        await stepChar.startNotifications()
        stepChar.addEventListener('characteristicvaluechanged', handleStepCountChange)
      } catch {
        console.log('Step counter not available')
      }

      // Battery Service
      try {
        const batteryService = await server.getPrimaryService(BATTERY_SERVICE)
        const batteryChar = await batteryService.getCharacteristic(BATTERY_CHARACTERISTIC)
        
        const readBattery = async () => {
          const value = await batteryChar.readValue() // Changed from getValue to readValue
          setBatteryLevel(value.getUint8(0))
        }

        await readBattery()
        // Read battery every 60 seconds
        const batteryInterval = setInterval(readBattery, 60000)
        return () => clearInterval(batteryInterval)
      } catch {
        console.log('Battery service not available')
      }

    } catch (error) {
      setError(`Connection error: ${(error as Error).message}`)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (device && device.gatt?.connected) {
      device.gatt.disconnect()
      setDevice(null)
    }
  }

  const onDisconnected = () => {
    console.log('Device disconnected')
    setDevice(null)
  }

  const handleHeartRateChange = (event: Event) => {
    const characteristic = event.target as unknown as BluetoothRemoteGATTCharacteristic
    const value = characteristic.value
    if (value) {
      const heartRate = value.getUint8(1)
      setSensorData(prev => ({
        ...prev,
        heartRate: [...prev.heartRate, heartRate],
        timestamp: [...prev.timestamp, Date.now()]
      }))
      fetch('/api/wearos-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          heartRate,
          timestamp: Date.now(),
        }),
      }).catch(error => console.error('Error saving data:', error))
    }
  }

  const handleStepCountChange = (event: Event) => {
    const characteristic = event.target as unknown as BluetoothRemoteGATTCharacteristic
    const value = characteristic.value
    if (value) {
      // This is a simplified example. In reality, step count might be calculated differently
      const stepCount = value.getUint16(0)
      setSensorData(prev => ({
        ...prev,
        stepCount: [...prev.stepCount, stepCount],
        timestamp: [...prev.timestamp, Date.now()]
      }))
      fetch('/api/wearos-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          stepCount,
          timestamp: Date.now(),
        }),
      }).catch(error => console.error('Error saving data:', error))
    }
  }

  useEffect(() => {
    return () => {
      if (device && device.gatt?.connected) {
        device.gatt.disconnect()
      }
    }
  }, [device])

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/wearos-data?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          // Transform data into the required format
          const transformed = {
            heartRate: data.map((d: { heartRate: number }) => d.heartRate).filter(Boolean),
            stepCount: data.map((d: { stepCount: number }) => d.stepCount).filter(Boolean),
            timestamp: data.map((d: { timestamp: number }) => d.timestamp)
          }
          setSensorData(transformed)
        })
        .catch(console.error)
    }
  }, [session])

  const chartData = sensorData.timestamp.map((time, index) => ({
    time,
    heartRate: sensorData.heartRate[index],
    stepCount: sensorData.stepCount[index]
  }))

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in to access the Wear OS Tracker.</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wear OS Tracker</CardTitle>
        <CardDescription>
          <div className={`flex items-center gap-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            <div className="w-2 h-2 rounded-full bg-current"/>
            {isConnected ? 'Connected' : 'Disconnected'}
            {isConnected && batteryLevel > 0 && (
              <span className="ml-2">Battery: {batteryLevel}%</span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {device ? (
            <Button onClick={disconnect}>Disconnect</Button>
          ) : (
            <Button onClick={connectToDevice}>Connect to Wear OS Device</Button>
          )}
          {device && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Heart Rate</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
                    <Line type="monotone" dataKey="heartRate" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Step Count</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
                    <Line type="monotone" dataKey="stepCount" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

