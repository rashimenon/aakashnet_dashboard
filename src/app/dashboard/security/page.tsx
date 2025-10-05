"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Lock, AlertTriangle, Wifi, Satellite, Activity } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function SecurityPage() {
  const [linkStatus, setLinkStatus] = useState<"SECURE" | "SEARCHING" | "COMPROMISED">("SECURE")
  const [latency, setLatency] = useState(0)
  const [signalStrength, setSignalStrength] = useState(0)
  const [snr, setSnr] = useState(0)
  const [signalData, setSignalData] = useState<{ time: string; signal: number; snr: number }[]>([])

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      setLatency(Math.random() * 20 + 5)
      const newSignal = Math.random() * 30 + 70
      const newSNR = Math.random() * 20 + 30
      setSignalStrength(newSignal)
      setSnr(newSNR)
      
      setSignalData((prev) => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          signal: newSignal,
          snr: newSNR
        }]
        return newData.slice(-20) // Keep last 20 points
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const threats = [
    { type: "GPS Spoofing Detected", severity: "HIGH", time: "2 min ago" },
    { type: "High Jamming Interference", severity: "MEDIUM", time: "5 min ago" },
    { type: "Potential Network Intrusion", severity: "CRITICAL", time: "8 min ago" },
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
      {/* Primary Status Display */}
      <Card className="border-amber-500/50">
        <CardHeader className="bg-gradient-to-r from-amber-900/20 to-transparent">
          <CardTitle className="text-xl">TACTICAL NETWORK STATUS</CardTitle>
          <CardDescription className="text-amber-200/70">Real-time operational metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Link Status</p>
              <Badge className="bg-green-500 text-white font-mono text-sm">{linkStatus}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Latency</p>
              <p className="text-2xl font-mono font-bold">{latency.toFixed(1)}<span className="text-sm text-muted-foreground ml-1">ms</span></p>
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
        </CardContent>
      </Card>

      {/* Network Health & Security */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              Signal Strength & SNR
            </CardTitle>
            <CardDescription>Real-time network performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="snr" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Threat Warnings
            </CardTitle>
            <CardDescription>Active security alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threats.map((threat, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">{threat.type}</p>
                      <p className="text-xs text-muted-foreground">{threat.time}</p>
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
                3 active threats detected - monitoring
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Constellation View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-amber-500" />
            Live Constellation View
          </CardTitle>
          <CardDescription>Unit position and satellite orbital tracks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-amber-500/30">
            {/* Unit position marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-amber-500 rounded-full animate-ping absolute"></div>
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              </div>
            </div>

            {/* Satellite orbital tracks */}
            {Array.from({ length: 8 }).map((_, i) => {
              const health = i % 3 === 0 ? "healthy" : i % 3 === 1 ? "degraded" : "critical"
              const color = health === "healthy" ? "bg-green-500" : health === "degraded" ? "bg-yellow-500" : "bg-red-500"
              
              return (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${color} rounded-full animate-pulse`}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              )
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-white">Unit Position</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Healthy Satellite</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-white">Degraded</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-white">Critical</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Throughput Monitor */}
      <Card>
        <CardHeader>
          <CardTitle>Data Throughput Monitor</CardTitle>
          <CardDescription>Uplink and downlink speeds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Uplink Speed (Priority)
                </span>
                <span className="text-2xl font-mono font-bold">45.2 <span className="text-sm text-muted-foreground">Mbps</span></span>
              </div>
              <Progress value={75} className="h-3" />
              <p className="text-xs text-muted-foreground">Operating at 75% capacity</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Downlink Speed
                </span>
                <span className="text-2xl font-mono font-bold">89.7 <span className="text-sm text-muted-foreground">Mbps</span></span>
              </div>
              <Progress value={60} className="h-3" />
              <p className="text-xs text-muted-foreground">Operating at 60% capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}