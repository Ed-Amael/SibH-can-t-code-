import { NextRequest, NextResponse } from 'next/server'

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

const mockPoles: Pole[] = [
  { id: 1, name: 'Pole-001', lat: 8.5241, lng: 76.9366, status: 'good' },
  { id: 2, name: 'Pole-002', lat: 8.5251, lng: 76.9376, status: 'damaged', damageType: 'broken' },
  { id: 3, name: 'Pole-003', lat: 8.5261, lng: 76.9386, status: 'good' },
  { id: 4, name: 'Pole-004', lat: 8.5271, lng: 76.9396, status: 'damaged', damageType: 'leaning' },
  { id: 5, name: 'Pole-005', lat: 8.5281, lng: 76.9406, status: 'good' },
  { id: 6, name: 'Pole-006', lat: 8.5291, lng: 76.9416, status: 'damaged', damageType: 'cracked' },
  { id: 7, name: 'Pole-007', lat: 8.5301, lng: 76.9426, status: 'good' },
  { id: 8, name: 'Pole-008', lat: 8.5311, lng: 76.9436, status: 'damaged', damageType: 'broken' },
]

const mockCables: Cable[] = [
  { 
    id: 1, 
    name: 'Cable-A', 
    coordinates: [
      [8.5241, 76.9366],
      [8.5251, 76.9376],
      [8.5261, 76.9386]
    ], 
    status: 'good' 
  },
  { 
    id: 2, 
    name: 'Cable-B', 
    coordinates: [
      [8.5261, 76.9386],
      [8.5271, 76.9396],
      [8.5281, 76.9406]
    ], 
    status: 'needs_replacement' 
  },
  { 
    id: 3, 
    name: 'Cable-C', 
    coordinates: [
      [8.5281, 76.9406],
      [8.5291, 76.9416],
      [8.5301, 76.9426]
    ], 
    status: 'needs_replacement' 
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCables = searchParams.get('includeCables') === 'true'

    const response = {
      poles: mockPoles,
      ...(includeCables && { cables: mockCables }),
      summary: {
        totalPoles: mockPoles.length,
        damagedPoles: mockPoles.filter(pole => pole.status === 'damaged').length,
        cablesNeedingReplacement: mockCables.filter(cable => cable.status === 'needs_replacement').length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching pole data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}