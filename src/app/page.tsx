'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

interface Pole {
  id: number
  name: string
  lat: number
  lng: number
  status: 'good' | 'damaged'
  damageType?: string
}

interface Cable {
  id: number
  name: string
  coordinates: [number, number][]
  status: 'good' | 'needs_replacement'
}

interface ApiResponse {
  poles: Pole[]
  cables?: Cable[]
  summary: {
    totalPoles: number
    damagedPoles: number
    cablesNeedingReplacement: number
  }
}

// Load Leaflet CSS and fix icons only on client side
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css')
  import('@/lib/leaflet-fix').then(({ fixLeafletIcons }) => {
    fixLeafletIcons()
  })
}

export default function ElectricityPoleMonitor() {
  const [showCables, setShowCables] = useState(false)
  const [poles, setPoles] = useState<Pole[]>([])
  const [cables, setCables] = useState<Cable[]>([])
  const [summary, setSummary] = useState({
    totalPoles: 0,
    damagedPoles: 0,
    cablesNeedingReplacement: 0
  })
  const [loading, setLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [icons, setIcons] = useState<{
    good: any
    damaged: any
  } | null>(null)

  useEffect(() => {
    fetchData()
    loadIcons()
    // Set map ready when component mounts on client side
    setMapReady(true)
  }, [])

  const loadIcons = async () => {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet')
      
      const goodIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #22c55e;
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          position: relative;
          top: -12px;
          left: -12px;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null
      })

      const damagedIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #ef4444;
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          position: relative;
          top: -12px;
          left: -12px;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null
      })

      setIcons({ good: goodIcon, damaged: damagedIcon })
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/poles?includeCables=true')
      const data: ApiResponse = await response.json()
      
      setPoles(data.poles)
      setCables(data.cables || [])
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Electricity Pole Monitor</h1>
            <p className="text-muted-foreground">Loading monitoring data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Electricity Pole Monitor</h1>
          <p className="text-muted-foreground">Real-time monitoring of electricity poles and cables</p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Poles</CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalPoles}</div>
              <p className="text-xs text-muted-foreground">Being monitored</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Damaged Poles</CardTitle>
              <div className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{summary.damagedPoles}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cables Needing Replacement</CardTitle>
              <div className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{summary.cablesNeedingReplacement}</div>
              <p className="text-xs text-muted-foreground">Wear and tear</p>
            </CardContent>
          </Card>
        </div>

        {/* Map Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Interactive Map
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Show Cables</span>
                <Switch
                  checked={showCables}
                  onCheckedChange={setShowCables}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full rounded-lg overflow-hidden border">
              {!mapReady ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <MapContainer
                  center={[8.5271, 76.9396]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Pole Markers */}
                  {poles.map((pole) => (
                    <Marker
                      key={pole.id}
                      position={[pole.lat, pole.lng]}
                      icon={icons ? (pole.status === 'damaged' ? icons.damaged : icons.good) : undefined}
                    >
                      <Popup>
                        <div className="space-y-2">
                          <h3 className="font-semibold">{pole.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={pole.status === 'damaged' ? 'destructive' : 'default'}>
                              {pole.status === 'damaged' ? 'Damaged' : 'Good'}
                            </Badge>
                          </div>
                          {pole.status === 'damaged' && pole.damageType && (
                            <p className="text-sm text-muted-foreground">
                              Damage: {pole.damageType}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Coordinates: {pole.lat.toFixed(4)}, {pole.lng.toFixed(4)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Cables */}
                  {showCables && cables.map((cable) => (
                    <Polyline
                      key={cable.id}
                      positions={cable.coordinates}
                      color={cable.status === 'needs_replacement' ? '#f97316' : '#22c55e'}
                      weight={4}
                      opacity={0.8}
                    >
                      <Popup>
                        <div className="space-y-2">
                          <h3 className="font-semibold">{cable.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={cable.status === 'needs_replacement' ? 'destructive' : 'default'}>
                              {cable.status === 'needs_replacement' ? 'Needs Replacement' : 'Good'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Length: {cable.coordinates.length} connection points
                          </p>
                        </div>
                      </Popup>
                    </Polyline>
                  ))}
                </MapContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Poles</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="text-sm">Good Condition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="text-sm">Damaged</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Cables</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-1 bg-green-500"></div>
                  <span className="text-sm">Good Condition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-1 bg-orange-500"></div>
                  <span className="text-sm">Needs Replacement</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}