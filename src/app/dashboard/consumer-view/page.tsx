"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Wifi,
  Download,
  Upload,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Users,
  Smartphone,
  MonitorSmartphone,
  Tv,
  Router,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

/* ------------------ tiny helpers ------------------ */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const fmtMbps = (n: number) => `${n.toFixed(1)} Mbps`

/* ------------------ sparkline (no deps) ------------------ */
function Sparkline({
  data,
  width = 140,
  height = 36,
  stroke = "hsl(var(--primary))",
  background = "transparent",
}: {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  background?: string
}) {
  const d = useMemo(() => {
    if (!data.length) return ""
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = Math.max(1, max - min)
    const stepX = width / Math.max(1, data.length - 1)

    return data
      .map((v, i) => {
        const x = i * stepX
        const y = height - ((v - min) / range) * height
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")
  }, [data, width, height])

  return (
    <svg width={width} height={height} style={{ display: "block", background }}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={2} />
    </svg>
  )
}

/* ------------------ page ------------------ */
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type Alert = { id: string; message: string; when: string; severity: Severity }

type DeviceBreakdown = {
  Phones: number
  PCs: number
  TVs: number
  IoT: number
}

type LinkStatus = "ONLINE" | "OFFLINE" | "SLEEP"

export default function ConsumerViewPage() {
  // link status
  const [status, setStatus] = useState<LinkStatus>("ONLINE")
  const cycleStatus = () =>
    setStatus((s) => (s === "ONLINE" ? "OFFLINE" : s === "OFFLINE" ? "SLEEP" : "ONLINE"))

// ~28px tall, ~88px wide pill
const statusBadge = {
  ONLINE:  { text: "ONLINE",  class: "inline-flex h-7 min-w-[88px] px-3 rounded-full bg-green-700 text-white text-xs font-semibold justify-center" },
  OFFLINE: { text: "OFFLINE", class: "inline-flex h-7 min-w-[88px] px-3 rounded-full bg-red-600 text-white text-xs font-semibold justify-center" },
  SLEEP:   { text: "SLEEP",   class: "inline-flex h-7 min-w-[88px] px-3 rounded-full bg-yellow-400 text-black text-xs font-semibold justify-center" },
}[status]


  const statusIconTint =
    status === "ONLINE" ? "text-green-500" : status === "SLEEP" ? "text-yellow-500" : "text-red-500"

  // live metrics
  const [downloadSpeed, setDownloadSpeed] = useState(0) // Mbps
  const [uploadSpeed, setUploadSpeed] = useState(0) // Mbps
  const [latency, setLatency] = useState(0) // ms
  const [uptime, setUptime] = useState(0) // seconds

  // sparklines series
  const [histConnections, setHistConnections] = useState<number[]>([])
  const [histDownload, setHistDownload] = useState<number[]>([])
  const [histUptime, setHistUptime] = useState<number[]>([])
  const [histTickets, setHistTickets] = useState<number[]>([])

  // KPI snapshot
  const activeConnections = useMemo(() => 12458 + Math.floor(Math.random() * 50 - 25), []) // static-ish
  const networkUptimePct = 99.8
  const supportTickets = 24

  // alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: crypto.randomUUID(), message: "Transient latency spike detected", when: "2 min ago", severity: "LOW" },
    { id: crypto.randomUUID(), message: "Packet loss above 1% in Zone B", when: "7 min ago", severity: "MEDIUM" },
  ])

  // diagnose modal
  const [openDiag, setOpenDiag] = useState(false)
  const [diagProgress, setDiagProgress] = useState(0)
  const [diagPhase, setDiagPhase] = useState<"idle" | "running" | "done">("idle")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // --- functions: startDiag / resetDiag ---
const startDiag = () => {
  setDiagPhase("running")
  setDiagProgress(0)
  if (timerRef.current) {
    clearInterval(timerRef.current)
    timerRef.current = null
  }
  timerRef.current = setInterval(() => {
    setDiagProgress((p) => {
      if (p >= 100) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setDiagPhase("done")
        return 100
      }
      return Math.min(100, p + 12 + Math.random() * 10)
    })
  }, 500)
}

const resetDiag = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current)
    timerRef.current = null
  }
  setDiagPhase("idle")
  setDiagProgress(0)
}

// optional unmount cleanup
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
}, [])


  // NEW: device breakdown + forecast state
  const [devices, setDevices] = useState<DeviceBreakdown>({ Phones: 5, PCs: 2, TVs: 1, IoT: 6 })
  const totalDevices = devices.Phones + devices.PCs + devices.TVs + devices.IoT
  const dist = totalDevices
    ? {
        Phones: (devices.Phones / totalDevices) * 100,
        PCs: (devices.PCs / totalDevices) * 100,
        TVs: (devices.TVs / totalDevices) * 100,
        IoT: (devices.IoT / totalDevices) * 100,
      }
    : { Phones: 0, PCs: 0, TVs: 0, IoT: 0 }

  const [forecast, setForecast] = useState<number[]>(
    Array.from({ length: 24 }, (_, i) => 60 + 20 * Math.sin((i / 24) * Math.PI * 2) + Math.random() * 10)
  )

  // simulate updates (behavior depends on link status)
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "ONLINE") {
        setDownloadSpeed(50 + Math.random() * 100) // 50..150
        setUploadSpeed(20 + Math.random() * 50) // 20..70
        setLatency(10 + Math.random() * 30) // 10..40
        setUptime((u) => u + 2)

        setHistConnections((h) => [...h.slice(-29), activeConnections + Math.floor(Math.random() * 150 - 75)])
        setHistDownload((h) => [...h.slice(-29), 50 + Math.random() * 100])
        setHistUptime((h) => [...h.slice(-29), 99.6 + Math.random() * 0.4])
        setHistTickets((h) => [...h.slice(-29), 20 + Math.floor(Math.random() * 10)])

        if (Math.random() < 0.08) {
          const pool: Omit<Alert, "id" | "when">[] = [
            { message: "Jitter exceeded 25ms threshold", severity: "MEDIUM" },
            { message: "Short throughput dip on downlink", severity: "LOW" },
            { message: "DNS resolution delay observed", severity: "LOW" },
            { message: "Retransmissions briefly elevated", severity: "HIGH" },
          ]
          const pick = pool[Math.floor(Math.random() * pool.length)]
          setAlerts((a) => [{ id: crypto.randomUUID(), message: pick.message, when: "just now", severity: pick.severity }, ...a].slice(0, 5))
        }
      } else if (status === "SLEEP") {
        // low-power drift toward near-idle
        setDownloadSpeed((s) => Math.max(2, s * 0.85))
        setUploadSpeed((s) => Math.max(1, s * 0.85))
        setLatency((l) => Math.min(80, l + Math.random() * 2))
        setUptime((u) => u + 2) // device is still "up", just sleeping
        setHistDownload((h) => [...h.slice(-29), Math.max(5, (h[h.length - 1] ?? 10) * 0.9)])
      } else {
        // OFFLINE: freeze metrics at zeros/last known; do not increment uptime
        setDownloadSpeed(0)
        setUploadSpeed(0)
        setLatency(0)
      }

      // device mix + forecast keep moving slowly regardless
      setDevices((d) => {
        const next = { ...d }
        const keys = ["Phones", "PCs", "TVs", "IoT"] as (keyof DeviceBreakdown)[]
        const k = keys[Math.floor(Math.random() * keys.length)]
        next[k] = clamp(next[k] + (Math.random() > 0.5 ? 1 : -1), 0, 12)
        return next
      })

      setForecast((arr) => {
        const tail =
          60 + 20 * Math.sin(((arr.length + Math.random()) / 24) * Math.PI * 2) + Math.random() * 12
        return [...arr.slice(1), tail]
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [activeConnections, status])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const sevClass = (s: Severity) =>
    s === "CRITICAL" ? "bg-red-500" : s === "HIGH" ? "bg-orange-500" : s === "MEDIUM" ? "bg-yellow-500" : "bg-blue-500"

  // values shown in UI should reflect status
  const shownDown =
    status === "ONLINE" ? downloadSpeed : status === "SLEEP" ? Math.min(downloadSpeed, 5) : 0
  const shownUp =
    status === "ONLINE" ? uploadSpeed : status === "SLEEP" ? Math.min(uploadSpeed, 2) : 0
  const shownLatency =
    status === "ONLINE" ? latency : status === "SLEEP" ? Math.max(0, latency + 10) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Top row: Dish + Quick actions */}
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        {/* Dish status */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wifi className={`h-5 w-5 ${statusIconTint}`} />
              Primary Dish — <span className="font-normal text-muted-foreground">Bondhu's Dish</span>
            </CardTitle>
            <CardDescription>Local last-mile status</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="flex items-center gap-2">
                <Badge className={statusBadge.class}>{statusBadge.text}</Badge>
                <Button size="sm" variant="outline" onClick={cycleStatus}>
                  switch
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Latency</div>
              <div className="text-xl font-mono">{shownLatency.toFixed(0)} ms</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Uptime</div>
              <div className="text-xl font-mono">{formatUptime(uptime)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Throughput</div>
              <div className="text-xl font-mono">
                {shownDown.toFixed(0)}↓ / {shownUp.toFixed(0)}↑ Mbps
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick test / diagnose */}
        <Card className="w-full md:w-72">
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Run basic health checks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Dialog open={openDiag} onOpenChange={(o) => { setOpenDiag(o); if (!o) resetDiag() }}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={status === "OFFLINE"}>
                  Diagnose Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Running diagnostics…</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Progress value={diagProgress} className="h-2" />
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      {diagProgress > 15 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Activity className="h-4 w-4 text-muted-foreground" />}
                      DNS resolution
                    </li>
                    <li className="flex items-center gap-2">
                      {diagProgress > 45 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Activity className="h-4 w-4 text-muted-foreground" />}
                      Gateway reachability
                    </li>
                    <li className="flex items-center gap-2">
                      {diagProgress > 70 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Activity className="h-4 w-4 text-muted-foreground" />}
                      Packet loss test
                    </li>
                    <li className="flex items-center gap-2">
                      {diagProgress >= 100 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Activity className="h-4 w-4 text-muted-foreground" />}
                      Final report
                    </li>
                  </ul>
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                  {diagPhase !== "running" ? (
                    <Button onClick={startDiag} disabled={status === "OFFLINE"}>
                      {diagPhase === "done" ? "Re-run" : "Start"}
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      Running…
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => { setOpenDiag(false); resetDiag() }}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="w-full" disabled={status === "OFFLINE"}>
              Reset Modem
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KPI + sparklines */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Active Connections <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{activeConnections.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">+2.5% from yesterday</div>
            <Sparkline data={histConnections} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium">Avg. Download Speed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">
              {shownDown.toFixed(1)} <span className="text-lg text-muted-foreground">Mbps</span>
            </div>
            <div className="text-xs text-muted-foreground">Network-wide average</div>
            <Sparkline data={histDownload} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold"> {networkUptimePct.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
            <Sparkline data={histUptime} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{supportTickets}</div>
            <div className="text-xs text-muted-foreground">18 resolved today</div>
            <Sparkline data={histTickets} />
          </CardContent>
        </Card>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>Live distribution by device type</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Users className="h-4 w-4" />
            {totalDevices} devices
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full h-4 rounded bg-muted overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${dist.Phones}%` }} title={`Phones ${devices.Phones} (${dist.Phones.toFixed(0)}%)`} />
            <div className="h-full bg-indigo-500" style={{ width: `${dist.PCs}%` }} title={`PCs ${devices.PCs} (${dist.PCs.toFixed(0)}%)`} />
            <div className="h-full bg-amber-500" style={{ width: `${dist.TVs}%` }} title={`TVs ${devices.TVs} (${dist.TVs.toFixed(0)}%)`} />
            <div className="h-full bg-sky-500" style={{ width: `${dist.IoT}%` }} title={`IoT ${devices.IoT} (${dist.IoT.toFixed(0)}%)`} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <LegendRow color="bg-emerald-500" label="Phones" count={devices.Phones} percent={dist.Phones} icon={<Smartphone className="h-4 w-4" />} />
            <LegendRow color="bg-indigo-500" label="PCs" count={devices.PCs} percent={dist.PCs} icon={<MonitorSmartphone className="h-4 w-4" />} />
            <LegendRow color="bg-amber-500" label="TVs" count={devices.TVs} percent={dist.TVs} icon={<Tv className="h-4 w-4" />} />
            <LegendRow color="bg-sky-500" label="IoT" count={devices.IoT} percent={dist.IoT} icon={<Router className="h-4 w-4" />} />
          </div>

          <div className="text-xs text-muted-foreground">
            Estimated split of current throughput:{" "}
            <span className="font-mono">
              {fmtMbps(shownDown * (dist.Phones / 100))} / {fmtMbps(shownDown * (dist.PCs / 100))} /{" "}
              {fmtMbps(shownDown * (dist.TVs / 100))} / {fmtMbps(shownDown * (dist.IoT / 100))}
            </span>{" "}
            (Phones / PCs / TVs / IoT)
          </div>
        </CardContent>
      </Card>

      {/* Bandwidth Forecast (next 24h) */}
      <Card>
        <CardHeader>
          <CardTitle>Bandwidth Forecast (Next 24h)</CardTitle>
          <CardDescription>Projected download demand for capacity planning.</CardDescription>
        </CardHeader>
        <CardContent>
          <MiniBars data={forecast} max={160} height={120} />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">Now: {fmtMbps(shownDown)}</span>
            <span>
              Peak next 24h: <span className="font-mono">{fmtMbps(Math.max(...forecast))}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Alerts & Anomalies
          </CardTitle>
          <CardDescription>Last few noteworthy events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No alerts at the moment.</div>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="flex items-start justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <div className="font-medium">{a.message}</div>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
                <Badge className={`${sevClass(a.severity)} text-white`}>{a.severity}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------ tiny presentational helpers ------------------ */
function LegendRow({
  color,
  label,
  count,
  percent,
  icon,
}: {
  color: string
  label: string
  count: number
  percent: number
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded border p-2">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded ${color}`} />
        <span className="flex items-center gap-1">
          {icon}
          {label}
        </span>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm">{count}</div>
        <div className="text-xs text-muted-foreground">{percent.toFixed(0)}%</div>
      </div>
    </div>
  )
}

function MiniBars({
  data,
  max = 100,
  height = 100,
}: {
  data: number[]
  max?: number
  height?: number
}) {
  const w = 8 // bar width
  const gap = 4
  const totalWidth = data.length * (w + gap) - gap
  return (
    <div className="w-full overflow-x-auto">
      <svg width={totalWidth} height={height} role="img" aria-label="Bandwidth forecast chart">
        {data.map((v, i) => {
          const h = Math.max(2, (v / max) * (height - 10))
          return <rect key={i} x={i * (w + gap)} y={height - h} width={w} height={h} rx={2} className="fill-blue-500/70" />
        })}
      </svg>
    </div>
  )
}
