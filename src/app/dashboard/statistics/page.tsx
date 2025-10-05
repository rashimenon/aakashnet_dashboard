"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { satelliteService } from "@/services/satelliteService"
import { toast } from "sonner"

interface Stats {
  totalSatellites: number
  activeSatellites: number
  completedMissions: number
  upcomingLaunches: number
  successRate: number
  dataTransmitted: string
  typeDistribution: Record<string, number>
  testingSatellites: number
  inactiveSatellites: number
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('bearer_token')
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          toast.error("Failed to load statistics")
        }
      } catch (error) {
        toast.error("Failed to load statistics")
        console.error(error)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const launchData = [
    { month: "Jan", launches: 2 },
    { month: "Feb", launches: 3 },
    { month: "Mar", launches: 1 },
    { month: "Apr", launches: 2 },
    { month: "May", launches: 1 },
    { month: "Jun", launches: 2 },
    { month: "Jul", launches: 1 },
    { month: "Aug", launches: 2 },
    { month: "Sep", launches: 1 },
    { month: "Oct", launches: 0 },
    { month: "Nov", launches: 0 },
    { month: "Dec", launches: 0 },
  ]

  const dataTransmissionData = [
    { month: "Jan", data: 180 },
    { month: "Feb", data: 220 },
    { month: "Mar", data: 250 },
    { month: "Apr", data: 290 },
    { month: "May", data: 310 },
    { month: "Jun", data: 350 },
  ]

  // Use real satellite type distribution from API
  const satelliteTypeData = stats?.typeDistribution 
    ? Object.entries(stats.typeDistribution).map(([type, count]) => ({
        name: type,
        value: count
      }))
    : []

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

  const statusData = [
    { name: 'Active', value: stats?.activeSatellites || 0 },
    { name: 'Testing', value: stats?.testingSatellites || 0 },
    { name: 'Inactive', value: stats?.inactiveSatellites || 0 },
  ]

  const successRateData = [
    { month: "Q1", rate: 98.2 },
    { month: "Q2", rate: 98.5 },
    { month: "Q3", rate: 98.8 },
    { month: "Q4", rate: 98.5 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mission Statistics</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Satellites</CardDescription>
            <CardTitle className="text-3xl">{stats?.totalSatellites || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats?.activeSatellites || 0} active missions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl">{stats?.successRate || 0}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats?.completedMissions || 0} completed missions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Data Transmitted</CardDescription>
            <CardTitle className="text-3xl">{stats?.dataTransmitted || '0 PB'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total volume processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Launches</CardDescription>
            <CardTitle className="text-3xl">{stats?.upcomingLaunches || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Scheduled deployments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Launch Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Launch Activity (2024)</CardTitle>
            <CardDescription>Monthly launch frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={launchData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="launches" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Data Transmission Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Data Transmission Growth</CardTitle>
            <CardDescription>Monthly data volume (GB)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataTransmissionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="data" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satellite Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Type Distribution</CardTitle>
            <CardDescription>By mission category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satelliteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {satelliteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Status Distribution</CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mission Success Rate */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mission Success Rate Trend</CardTitle>
            <CardDescription>Quarterly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis domain={[95, 100]} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}