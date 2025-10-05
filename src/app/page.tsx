"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Satellite, BarChart3, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-primary/10 p-6 rounded-full">
              <Rocket className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Aakash Mission
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              ISRO × BharatNet Partnership
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced satellite monitoring and mission control dashboard for the next generation of space exploration
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <LayoutDashboard className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Real-time Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Monitor satellite health and mission metrics in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive mission statistics and performance insights
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Globe className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">3D Globe View</h3>
              <p className="text-sm text-muted-foreground">
                Interactive 3D visualization of satellite positions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <Satellite className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Launch Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Track past missions and upcoming launch schedules
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-primary">47</p>
              <p className="text-sm text-muted-foreground">Active Satellites</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">98.5%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Active Missions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">2.4 PB</p>
              <p className="text-sm text-muted-foreground">Data Transmitted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}