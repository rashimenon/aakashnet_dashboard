"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Activity, Clock, Download, Upload, Zap } from "lucide-react"

export default function ConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<"online" | "searching" | "offline">("online")
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [latency, setLatency] = useState(0)
  const [uptime, setUptime] = useState(0)
  const [dailyUsage, setDailyUsage] = useState(0)
  const [monthlyUsage, setMonthlyUsage] = useState(0)

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDownloadSpeed(Math.random() * 100 + 50)
      setUploadSpeed(Math.random() * 50 + 20)
      setLatency(Math.random() * 30 + 10)
      setUptime((prev) => prev + 1)
      setDailyUsage(Math.min(100, Math.random() * 5 + 35))
      setMonthlyUsage(Math.min(100, Math.random() * 5 + 45))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "online": return "bg-green-500"
      case "searching": return "bg-yellow-500"
      case "offline": return "bg-red-500"
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "online": return <Wifi className="h-6 w-6" />
      case "searching": return <Activity className="h-6 w-6 animate-pulse" />
      case "offline": return <WifiOff className="h-6 w-6" />
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Connection Status</h2>
        <p className="text-muted-foreground">Real-time network monitoring</p>
      </div>

      {/* Live Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            Connection Status
          </CardTitle>
          <CardDescription>Current network connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Status</span>
            <Badge className={`${getStatusColor()} text-white uppercase`}>
              {connectionStatus}
            </Badge>
          </div>

          {/* Speedometer-style graphics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </span>
                <span className="text-2xl font-bold">{downloadSpeed.toFixed(1)} <span className="text-sm text-muted-foreground">Mbps</span></span>
              </div>
              <Progress value={downloadSpeed} max={150} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </span>
                <span className="text-2xl font-bold">{uploadSpeed.toFixed(1)} <span className="text-sm text-muted-foreground">Mbps</span></span>
              </div>
              <Progress value={uploadSpeed} max={70} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Latency
                </span>
                <span className="text-2xl font-bold">{latency.toFixed(0)} <span className="text-sm text-muted-foreground">ms</span></span>
              </div>
              <Progress value={100 - latency} max={100} className="h-2" />
            </div>
          </div>

          {/* Uptime Clock */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Connection Uptime</span>
              </div>
              <span className="text-2xl font-mono font-bold">{formatUptime(uptime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Usage Monitor */}
      <Card>
        <CardHeader>
          <CardTitle>Data Usage Monitor</CardTitle>
          <CardDescription>Daily and monthly data consumption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Usage</span>
              <span className="text-sm text-muted-foreground">{dailyUsage.toFixed(1)}% of 10GB</span>
            </div>
            <Progress value={dailyUsage} className="h-3" />
            <p className="text-xs text-muted-foreground">{(dailyUsage * 0.1).toFixed(2)} GB used today</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Usage</span>
              <span className="text-sm text-muted-foreground">{monthlyUsage.toFixed(1)}% of 100GB</span>
            </div>
            <Progress value={monthlyUsage} className="h-3" />
            <p className="text-xs text-muted-foreground">{(monthlyUsage * 1).toFixed(2)} GB used this month</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">FUP Quota:</span> You have{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {(100 - monthlyUsage).toFixed(1)} GB
              </span>{" "}
              remaining this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Local Network Health Map */}
      <Card>
        <CardHeader>
          <CardTitle>Local Network Health</CardTitle>
          <CardDescription>Satellite coverage in your region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] bg-muted rounded-lg overflow-hidden">
            {/* Simplified India map with dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Simulate green dots for healthy satellites */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg">
                    15 healthy satellites detected in your region
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}