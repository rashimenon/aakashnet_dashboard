"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Satellite, Activity, Radio } from "lucide-react"

export default function ArmyViewPage() {
  const [linkStatus, setLinkStatus] = useState<"SECURE" | "SEARCHING" | "COMPROMISED">("SECURE")
  const [latency, setLatency] = useState(0)
  const [signalStrength, setSignalStrength] = useState(0)
  const [snr, setSnr] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.random() * 20 + 5)
      setSignalStrength(Math.random() * 30 + 70)
      setSnr(Math.random() * 20 + 30)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const threats = [
    { type: "GPS Spoofing Detected", severity: "HIGH", time: "2 min ago", zone: "Northeast Sector" },
    { type: "High Jamming Interference", severity: "MEDIUM", time: "5 min ago", zone: "Border Region A" },
    { type: "Potential Network Intrusion", severity: "CRITICAL", time: "8 min ago", zone: "Command Node 7" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500"
      case "HIGH": return "bg-orange-500"
      case "MEDIUM": return "bg-yellow-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Strategic Forces Network View</h2>
        <p className="text-muted-foreground">Tactical satellite network monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-amber-500/30">
          <CardHeader className="pb-2">
            <CardDescription>Active Tactical Links</CardDescription>
            <CardTitle className="text-3xl">156</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All units connected</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardDescription>Network Security</CardDescription>
            <CardTitle className="text-3xl text-green-500">SECURE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">AES-256 encryption active</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader className="pb-2">
            <CardDescription>Active Threats</CardDescription>
            <CardTitle className="text-3xl text-red-500">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Under monitoring</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Link Latency</CardDescription>
            <CardTitle className="text-3xl">
              12.8 <span className="text-lg text-muted-foreground">ms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Optimal performance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-500/50">
        <CardHeader className="bg-gradient-to-r from-amber-900/20 to-transparent">
          <CardTitle className="text-xl">SAMPLE TACTICAL LINK STATUS</CardTitle>
          <CardDescription className="text-amber-200/70">Representative field unit metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Link Status</p>
              <Badge className="bg-green-500 text-white font-mono text-sm">{linkStatus}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Latency</p>
              <p className="text-2xl font-mono font-bold">
                {latency.toFixed(1)}<span className="text-sm text-muted-foreground ml-1">ms</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Encryption</p>
              <Badge className="bg-blue-500 text-white font-mono text-sm">AES-256</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Anti-Jam</p>
              <Badge className="bg-green-500 text-white font-mono text-sm">ACTIVE</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">GPS/NAV Lock</p>
              <Badge className="bg-green-500 text-white font-mono text-sm">LOCKED</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Signal Strength</span>
                <span className="font-mono font-bold">{signalStrength.toFixed(1)} dBm</span>
              </div>
              <Progress value={signalStrength} max={100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">SNR (Signal-to-Noise)</span>
                <span className="font-mono font-bold">{snr.toFixed(1)} dB</span>
              </div>
              <Progress value={snr} max={50} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Network-Wide Threat Status
          </CardTitle>
          <CardDescription>All active security alerts across tactical network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "GPS Spoofing Detected", severity: "HIGH", time: "2 min ago", zone: "Northeast Sector" },
              { type: "High Jamming Interference", severity: "MEDIUM", time: "5 min ago", zone: "Border Region A" },
              { type: "Potential Network Intrusion", severity: "CRITICAL", time: "8 min ago", zone: "Command Node 7" },
            ].map((threat, i) => (
              <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{threat.type}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{threat.time}</span>
                      <span>•</span>
                      <span>{threat.zone}</span>
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(threat.severity)} text-white font-mono text-xs`}>
                    {threat.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-950/30 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-200 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              3 active threats detected across network - countermeasures deployed
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-amber-500" />
              Tactical Constellation View
            </CardTitle>
            <CardDescription>Active satellite health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-amber-500/30">
              {Array.from({ length: 12 }).map((_, i) => {
                const health = i % 3 === 0 ? "healthy" : i % 3 === 1 ? "degraded" : "critical"
                const color =
                  health === "healthy" ? "bg-green-500" : health === "degraded" ? "bg-yellow-500" : "bg-red-500"
                return (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 ${color} rounded-full animate-pulse`}
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                )
              })}
              <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white">Healthy (8)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-white">Degraded (3)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white">Critical (1)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Throughput Overview</CardTitle>
            <CardDescription>Aggregate tactical data rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Total Uplink Capacity
                </span>
                <span className="text-2xl font-mono font-bold">
                  2.4 <span className="text-sm text-muted-foreground">Gbps</span>
                </span>
              </div>
              <Progress value={68} className="h-3" />
              <p className="text-xs text-muted-foreground">1.63 Gbps in use • 68% utilization</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Total Downlink Capacity
                </span>
                <span className="text-2xl font-mono font-bold">
                  4.8 <span className="text-sm text-muted-foreground">Gbps</span>
                </span>
              </div>
              <Progress value={54} className="h-3" />
              <p className="text-xs text-muted-foreground">2.59 Gbps in use • 54% utilization</p>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 mt-4">
              <p className="text-sm text-amber-200">All tactical links operating within optimal parameters</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "CRITICAL": return "bg-red-500"
    case "HIGH": return "bg-orange-500"
    case "MEDIUM": return "bg-yellow-500"
    default: return "bg-blue-500"
  }
}
