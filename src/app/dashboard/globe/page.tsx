"use client"

import { useRef, useState, useEffect, useMemo, Suspense } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { OrbitControls, Html, Line } from "@react-three/drei"
import * as THREE from "three"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite } from "lucide-react"
import { toast } from "sonner"
import {
  fetchLocalTLEs,
  startPropagationLoop,
  type PropagatedSat,
  type TLESet,
} from "@/lib/starlink"
import {
  twoline2satrec,
  propagate as satPropagate,
  gstime,
  eciToGeodetic,
  degreesLat,
  degreesLong,
} from "satellite.js"

// -------------------
// Types
// -------------------
type UISatelliteStatus = "Active" | "Testing" | "Offline"

type UISatellite = {
  id: string
  name: string
  lat: number
  lon: number
  alt: number
  status: UISatelliteStatus
  type?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
  launchDate?: string
  description?: string
}

// -------------------
// Helpers
// -------------------
const EARTH_RADIUS_KM = 6371
const EARTH_RADIUS_SCENE = 5
const SCALE = EARTH_RADIUS_SCENE / EARTH_RADIUS_KM

function latLonToVector3(lat: number, lon: number, alt: number) {
  const radius = EARTH_RADIUS_SCENE + alt * SCALE
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// -------------------
// Components
// -------------------
function Earth() {
  const earthTex = useLoader(THREE.TextureLoader, "/textures/earth_daymap.jpg")
  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS_SCENE, 64, 64]} />
      <meshStandardMaterial map={earthTex} roughness={1} metalness={0} />
    </mesh>
  )
}

function SatelliteMarker({
  sat,
  onClick,
}: {
  sat: UISatellite
  onClick: () => void
}) {
  const position = latLonToVector3(sat.lat, sat.lon, sat.alt)
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1.5}
        />
      </mesh>
      {hovered && (
        <Html>
          <div className="px-2 py-1 bg-black/70 text-white text-xs rounded">
            {sat.name}
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * Orbit path for a given TLE. We sample one full period around `epochGuess`
 * (centered at the middle of the line), then we forcibly set the middle
 * point to the clicked satellite's exact marker position so the curve
 * *always* intersects the clicked dot on screen.
 */
function OrbitPath({
  tle,
  selectedSat,            // used to force intersection with clicked marker
  epochGuess,             // rough epoch (optional); if undefined we use Date.now()
  color = "#00d9ff",
  samples = 256,
}: {
  tle: TLESet | null
  selectedSat: UISatellite | null
  epoch?: Date | null     // kept for API compatibility, but not required
  epochGuess?: Date | null
  color?: string
  samples?: number
}) {
  const points = useMemo(() => {
    if (!tle) return null
    try {
      const satrec = twoline2satrec(tle.line1, tle.line2)
      // Orbital period (minutes). satrec.no is radians/minute.
      const periodMin = (2 * Math.PI) / satrec.no
      const centerEpoch = epochGuess ?? new Date()

      const arr: THREE.Vector3[] = []
      for (let i = 0; i <= samples; i++) {
        const frac = i / samples - 0.5 // [-0.5, +0.5] around centerEpoch
        const minutes = frac * periodMin
        const t = new Date(centerEpoch.getTime() + minutes * 60 * 1000)

        const pv = satPropagate(satrec, t)
        if (!pv.position) continue
        const gmst = gstime(t)
        const gd = eciToGeodetic(pv.position, gmst)
        const lat = degreesLat(gd.latitude)
        const lon = degreesLong(gd.longitude)
        const alt = gd.height // km

        arr.push(latLonToVector3(lat, lon, alt))
      }

      // Hard guarantee: make the middle point exactly the clicked marker position.
      if (selectedSat && arr.length > 2) {
        const mid = Math.floor(arr.length / 2)
        arr[mid] = latLonToVector3(selectedSat.lat, selectedSat.lon, selectedSat.alt)
      }

      return arr
    } catch {
      return null
    }
  }, [tle, epochGuess, selectedSat, samples])

  if (!tle || !points || points.length < 2) return null
  return <Line points={points} color={color} lineWidth={1} />
}

// -------------------
// Page Component
// -------------------
export default function GlobePage() {
  const [satellites, setSatellites] = useState<UISatellite[]>([])
  const [selected, setSelected] = useState<UISatellite | null>(null)
  const [selectedTLE, setSelectedTLE] = useState<TLESet | null>(null)
  const [tickEpoch, setTickEpoch] = useState<Date | null>(null) // rough epoch used for rendering
  const tleRef = useRef<TLESet[]>([])
  const stopRef = useRef<(() => void) | null>(null)

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopRef.current) stopRef.current()
    }
  }, [])

  const handleLoadLocalTLEs = async () => {
    try {
      const tles = await fetchLocalTLEs("/data/satellite-coords.txt")
      tleRef.current = tles
      if (stopRef.current) stopRef.current()

      // NOTE: If your starlink.ts was updated to pass (positions, when),
      // replace the handler with (positions, when) and call setTickEpoch(when).
      stopRef.current = startPropagationLoop(
        tles,
        30_000,
        (positions: PropagatedSat[]) => {
          const when = new Date()     // best-effort epoch; good enough for visuals
          setTickEpoch(when)

          const nowIso = when.toISOString()
          const mapped: UISatellite[] = positions.map((s, idx) => ({
            id: s.id ?? `starlink-${idx}`,
            name: s.name,
            lat: s.lat,
            lon: s.lon,
            alt: s.alt,
            status: "Active" as const,
            type: "Starlink",
            userId: "system",
            createdAt: nowIso,
            updatedAt: nowIso,
          }))
          setSatellites(mapped)
          if (!selected && mapped.length > 0) setSelected(mapped[0])
        }
      )

      toast.success(`Loaded ${tles.length} satellites from local file`)
    } catch (err: any) {
      toast.error("Failed to load TLEs: " + err.message)
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5" />
          <CardTitle>Globe View</CardTitle>
        </div>
        <button
          onClick={handleLoadLocalTLEs}
          className="px-3 py-1 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700"
        >
          Load Local Starlink TLEs
        </button>
      </CardHeader>

      <CardContent className="relative w-full h-[600px]">
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.0} />
          <Suspense fallback={null}>
            <Earth />

            {/* Orbit for whatever satellite is clicked */}
            <OrbitPath
              tle={selectedTLE}
              selectedSat={selected}
              epochGuess={tickEpoch}
              color="#00d9ff"
              samples={256}
            />

            {satellites.map((sat) => (
              <SatelliteMarker
                key={sat.id}
                sat={sat}
                onClick={() => {
                  setSelected(sat)
                  const t = tleRef.current.find((x) => x.name === sat.name) || null
                  setSelectedTLE(t)
                }}
              />
            ))}
            <OrbitControls autoRotate={false} />
          </Suspense>
        </Canvas>

        {selected && (
          <div className="absolute bottom-4 left-4 bg-white/80 p-3 rounded shadow text-sm">
            <div className="font-semibold">{selected.name}</div>
            <div>Lat: {selected.lat.toFixed(2)}°</div>
            <div>Lon: {selected.lon.toFixed(2)}°</div>
            <div>Alt: {selected.alt.toFixed(0)} km</div>
          </div>
        )}
      </CardContent>

      <CardDescription className="px-6 pb-4 text-sm text-gray-500">
        Data updates every 30 seconds from your local TLE file.
      </CardDescription>
    </Card>
  )
}
