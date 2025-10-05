// src/lib/starlink.ts
import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLat,
  degreesLong,
} from "satellite.js"

export type TLESet = {
  name: string
  line1: string
  line2: string
}

export type PropagatedSat = {
  id: string
  name: string
  lat: number   // deg
  lon: number   // deg
  alt: number   // km
}

/**
 * Parse raw TLE text into structured objects
 */
export function parseTLEText(text: string, limit = 400): TLESet[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const out: TLESet[] = []
  for (let i = 0; i < lines.length - 2; i++) {
    const name = lines[i]
    const l1 = lines[i + 1]
    const l2 = lines[i + 2]
    if (l1?.startsWith("1 ") && l2?.startsWith("2 ")) {
      out.push({ name, line1: l1, line2: l2 })
      i += 2
    }
  }
  return out.slice(0, limit)
}

/**
 * Read TLEs from a local file served by Next.js public/ (e.g., /public/data/satellite-coords.txt).
 * Call from the browser: it fetches "/data/satellite-coords.txt".
 */
export async function fetchLocalTLEs(path = "/data/satellite-coords.txt", limit = 400) {
  const res = await fetch(path, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`)
  const text = await res.text()
  return parseTLEText(text, limit)
}

/**
 * Propagate a batch of TLEs to geodetic lat/lon/alt (km) at a given time.
 */
export function propagateTLEs(tles: TLESet[], when: Date): PropagatedSat[] {
  const gmst = gstime(when)
  const out: PropagatedSat[] = []

  for (let i = 0; i < tles.length; i++) {
    const t = tles[i]
    try {
      const satrec = twoline2satrec(t.line1, t.line2)
      const pv = propagate(satrec, when)
      if (!pv.position) continue
      const geo = eciToGeodetic(pv.position, gmst)
      out.push({
        id: `starlink-${i}`,
        name: t.name,
        lat: degreesLat(geo.latitude),
        lon: degreesLong(geo.longitude),
        alt: geo.height, // already km
      })
    } catch {
      // skip malformed records
    }
  }
  return out
}

/**
 * Start a propagation loop.
 * Calls `callback` with fresh positions every `intervalMs`.
 * Returns a stop() function to clear the loop.
 */
// 
export function startPropagationLoop(
  tles: TLESet[],
  intervalMs: number,
  onUpdate: (sats: PropagatedSat[], when: Date) => void  // <-- include epoch
) {
  const tick = () => {
    const when = new Date()
    const sats = propagateTLEs(tles, when)
    onUpdate(sats, when)
  }

  tick()
  const timer = setInterval(tick, intervalMs)
  return () => clearInterval(timer)
}
