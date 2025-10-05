"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, CheckCircle2, Clock, Calendar } from "lucide-react"

const timelineEvents = [
  {
    id: 1,
    title: "Aakash-8 Weather Satellite",
    date: "May 20, 2024",
    status: "upcoming",
    vehicle: "PSLV-C58",
    description: "Next-generation weather monitoring satellite with enhanced imaging capabilities",
    countdown: "12 days",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 2,
    title: "BharatNet Regional Hub Launch",
    date: "June 15, 2024",
    status: "upcoming",
    vehicle: "GSLV Mk III",
    description: "Expanding rural connectivity infrastructure across northern regions",
    countdown: "38 days",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 3,
    title: "Earth Observation-9 Deployed",
    date: "April 5, 2024",
    status: "completed",
    vehicle: "PSLV-C57",
    description: "High-resolution earth imaging satellite successfully placed in sun-synchronous orbit",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 4,
    title: "Aakash-7 Communications Online",
    date: "March 15, 2024",
    status: "completed",
    vehicle: "GSLV Mk II",
    description: "Geostationary communications satellite providing broadband to remote areas",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 5,
    title: "BharatNet Relay-3 Launch",
    date: "February 28, 2024",
    status: "completed",
    vehicle: "PSLV-C56",
    description: "Low earth orbit relay satellite enhancing network capacity",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 6,
    title: "NavIC Enhancement-2 Mission",
    date: "January 20, 2024",
    status: "completed",
    vehicle: "PSLV-C55",
    description: "Navigation satellite augmenting India's regional navigation system",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 7,
    title: "NavIC Constellation-4",
    date: "July 10, 2024",
    status: "upcoming",
    vehicle: "PSLV-C59",
    description: "Fourth satellite in the constellation upgrade program",
    countdown: "63 days",
    location: "Satish Dhawan Space Centre"
  },
  {
    id: 8,
    title: "Remote Sensing-11 Deployment",
    date: "December 18, 2023",
    status: "completed",
    vehicle: "PSLV-C54",
    description: "Advanced remote sensing satellite for agricultural and environmental monitoring",
    location: "Satish Dhawan Space Centre"
  }
]

export default function TimelinePage() {
  const upcomingEvents = timelineEvents.filter(e => e.status === "upcoming")
  const completedEvents = timelineEvents.filter(e => e.status === "completed")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Launch Timeline</h2>
        <p className="text-muted-foreground">
          Past missions and upcoming launch schedule
        </p>
      </div>

      {/* Upcoming Launches */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Upcoming Launches
        </h3>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <Card key={event.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      {event.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.date} • {event.vehicle}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                    T-{event.countdown}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📍 {event.location}</span>
                  <span>🚀 {event.vehicle}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Missions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Completed Missions
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {completedEvents.map((event, index) => (
              <div key={event.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.date} • {event.vehicle}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📍 {event.location}</span>
                      <span>🚀 {event.vehicle}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <CardHeader>
          <CardTitle>Mission Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-green-500">{completedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-500">100%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}