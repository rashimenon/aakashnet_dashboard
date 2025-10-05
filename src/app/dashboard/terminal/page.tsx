"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Power, Radio, RefreshCw, Shield, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function TerminalPage() {
  const [isGoingSilent, setIsGoingSilent] = useState(false)
  const [isHandingOver, setIsHandingOver] = useState(false)
  const [isReauthenticating, setIsReauthenticating] = useState(false)

  const handleGoSilent = async () => {
    setIsGoingSilent(true)
    toast.info("Initiating silent mode...")
    setTimeout(() => {
      toast.success("Terminal is now in silent mode. All transmissions stopped.")
      setIsGoingSilent(false)
    }, 2000)
  }

  const handleForceHandover = async () => {
    setIsHandingOver(true)
    toast.info("Forcing satellite handover...")
    setTimeout(() => {
      toast.success("Handover complete. Connected to new satellite.")
      setIsHandingOver(false)
    }, 3000)
  }

  const handleReauthenticate = async () => {
    setIsReauthenticating(true)
    toast.info("Re-authenticating secure link...")
    setTimeout(() => {
      toast.success("Link re-authenticated successfully. Encryption renewed.")
      setIsReauthenticating(false)
    }, 2500)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Terminal Control</h2>
        <p className="text-muted-foreground">Direct tactical network operations</p>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-500/50 bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-200">Authorized Personnel Only</p>
              <p className="text-sm text-amber-200/70 mt-1">
                These controls directly affect operational network behavior. Use only when directed or in emergency situations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Control Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-red-500/30 hover:border-red-500/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Power className="h-5 w-5" />
              Go Silent
            </CardTitle>
            <CardDescription>
              Immediately cease all transmissions and enter radio silence mode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-red-200">
                <strong>Effect:</strong> All RF emissions stop. Terminal becomes invisible to direction finding. Use when under threat of detection.
              </p>
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
              onClick={handleGoSilent}
              disabled={isGoingSilent}
            >
              {isGoingSilent ? "Going Silent..." : "GO SILENT"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 hover:border-blue-500/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Radio className="h-5 w-5" />
              Force Handover
            </CardTitle>
            <CardDescription>
              Manually switch to a different satellite in the constellation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-200">
                <strong>Effect:</strong> Forces immediate connection to next available satellite. Use when current link is degraded or compromised.
              </p>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              onClick={handleForceHandover}
              disabled={isHandingOver}
            >
              {isHandingOver ? "Switching Satellite..." : "FORCE HANDOVER"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 hover:border-green-500/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <RefreshCw className="h-5 w-5" />
              Re-Authenticate Link
            </CardTitle>
            <CardDescription>
              Renew encryption keys and re-establish secure connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-3">
              <p className="text-xs text-green-200">
                <strong>Effect:</strong> Refreshes all cryptographic material and verifies secure channel integrity. Use if security breach is suspected.
              </p>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={handleReauthenticate}
              disabled={isReauthenticating}
            >
              {isReauthenticating ? "Re-Authenticating..." : "RE-AUTHENTICATE"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Terminal Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Terminal Operational Status
          </CardTitle>
          <CardDescription>Current configuration and readiness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Mode</p>
              <p className="text-lg font-bold">ACTIVE</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Encryption</p>
              <p className="text-lg font-bold">AES-256-GCM</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Auth Expiry</p>
              <p className="text-lg font-bold">23h 45m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase">Priority Level</p>
              <p className="text-lg font-bold text-amber-500">TACTICAL</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Anti-Jamming</span>
              <span className="text-sm font-medium text-green-500">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Frequency Hopping</span>
              <span className="text-sm font-medium text-green-500">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Automatic Failover</span>
              <span className="text-sm font-medium text-green-500">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Beacon</span>
              <span className="text-sm font-medium text-muted-foreground">STANDBY</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Operations Log</CardTitle>
          <CardDescription>Last 5 terminal actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {[
              { time: "14:32:18", action: "LINK_ESTABLISHED", status: "SUCCESS" },
              { time: "14:15:02", action: "AUTH_RENEWAL", status: "SUCCESS" },
              { time: "13:58:45", action: "HANDOVER_COMPLETED", status: "SUCCESS" },
              { time: "13:42:11", action: "FREQUENCY_SHIFT", status: "SUCCESS" },
              { time: "13:20:33", action: "POSITION_UPDATE", status: "SUCCESS" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{log.time}</span>
                  <span>{log.action}</span>
                </div>
                <span className="text-green-500">{log.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}