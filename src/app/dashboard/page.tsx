"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Satellite, Activity, TrendingUp, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRole } from "@/contexts/RoleContext"

interface Stats {
  totalSatellites: number
  activeSatellites: number
  completedMissions: number
  upcomingLaunches: number
  successRate: number
  dataTransmitted: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { role } = useRole()
  const router = useRouter()

  // Role-based redirect to the new stable routes (which then redirect to your real pages)
  useEffect(() => {
    if (!role) return
    const r = role.toLowerCase()
    if (r === "consumer") router.replace("/consumer/dashboard")
    else if (r === "army") router.replace("/army/dashboard")
  }, [role, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("bearer_token")
        const res = await fetch("/api/stats", {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        })
        if (res.ok) setStats(await res.json())
        else toast.error("Failed to load statistics")
      } catch (e) {
        console.error(e)
        toast.error("Failed to load statistics")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Admin Overview (default)
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <p className="text-muted-foreground">Complete system monitoring and management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Satellites</CardTitle>
            <Satellite className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSatellites ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.activeSatellites ?? 0} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mission Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate ?? 0}%</div>
            <p className="text-xs text-muted-foreground">{stats?.completedMissions ?? 0} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Transmitted</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dataTransmitted ?? "0 PB"}</div>
            <p className="text-xs text-muted-foreground">Total volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Launches</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcomingLaunches ?? 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>View Options</CardTitle>
            <CardDescription>Access different dashboard views</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/consumer/dashboard">
              <Button variant="outline" className="w-full justify-start">Consumer Dashboard</Button>
            </Link>
            <Link href="/army/dashboard">
              <Button variant="outline" className="w-full justify-start">Strategic Forces Dashboard</Button>
            </Link>
            <Link href="/dashboard/statistics">
              <Button variant="outline" className="w-full justify-start">Detailed Statistics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Overall network health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Status</span>
              <span className="text-sm font-medium text-green-500">OPERATIONAL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Security Level</span>
              <span className="text-sm font-medium text-green-500">SECURE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Coverage</span>
              <span className="text-sm font-medium">98.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
