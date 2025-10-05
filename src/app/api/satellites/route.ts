import { NextRequest, NextResponse } from 'next/server';

// Generate 500 mock satellites evenly distributed around Earth at LEO altitude (~550km)
const mockSatellites = []
    
// Evenly distribute satellites in a grid pattern around the globe
const numSatellites = 500
const goldenRatio = (1 + Math.sqrt(5)) / 2
    
for (let i = 0; i < numSatellites; i++) {
  // Fibonacci sphere distribution for even spacing
  const y = 1 - (i / (numSatellites - 1)) * 2 // y goes from 1 to -1
  const radius = Math.sqrt(1 - y * y)
  const theta = goldenRatio * i * 2 * Math.PI
  
  // Convert to lat/lon
  const lat = Math.asin(y) * (180 / Math.PI)
  const lon = (theta % (2 * Math.PI)) * (180 / Math.PI) - 180
  
  mockSatellites.push({
    id: i + 1,
    name: `Starlink-${i + 101}`,
    type: i % 10 === 0 ? "Communication" : i % 5 === 0 ? "Earth Observation" : "Communication",
    status: i % 20 === 0 ? "Testing" : "Active",
    lat: parseFloat(lat.toFixed(4)),
    lon: parseFloat(lon.toFixed(4)),
    alt: 550, // Low Earth Orbit - Starlink altitude
    altitude_km: 550,
    orbit: "LEO",
    launchDate: new Date(2020 + Math.floor(i / 100), (i % 12), (i % 28) + 1).toISOString(),
    description: `Starlink satellite providing global internet coverage`
  })
}

export async function GET(request: Request) {
  try {
    return Response.json(mockSatellites)
  } catch (error) {
    console.error("Error fetching satellites:", error)
    return Response.json({ error: "Failed to fetch satellites" }, { status: 500 })
  }
}

// Keep POST, PUT, DELETE for future use but return mock responses
export async function POST(request: NextRequest) {
  const user = getAuthFromHeader(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const mockSatellite = {
    id: MOCK_SATELLITES.length + 1,
    ...body,
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(mockSatellite, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = getAuthFromHeader(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  const satellite = MOCK_SATELLITES.find(s => s.id === parseInt(id || '0'));
  if (!satellite) {
    return NextResponse.json({ error: 'Satellite not found' }, { status: 404 });
  }

  return NextResponse.json({ ...satellite, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(request: NextRequest) {
  const user = getAuthFromHeader(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const satellite = MOCK_SATELLITES.find(s => s.id === parseInt(id || '0'));
  if (!satellite) {
    return NextResponse.json({ error: 'Satellite not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Satellite deleted successfully',
    deleted: satellite
  });
}