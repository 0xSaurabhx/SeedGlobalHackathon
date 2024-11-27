export interface BluetoothDevice extends EventTarget {
  gatt?: BluetoothRemoteGATTServer
  gattServerConnected?: boolean
  name?: string
  id?: string
}

export interface BluetoothRemoteGATTServer {
  connected: boolean
  connect(): Promise<BluetoothRemoteGATTServer>
  disconnect(): void
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>
}

export interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>
}

export interface BluetoothRemoteGATTCharacteristic {
  value: DataView | null
  readValue(): Promise<DataView>
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  addEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions
  ): void
}

export interface WearOSData {
  userId: string
  heartRate?: number
  stepCount?: number
  timestamp: number
}


