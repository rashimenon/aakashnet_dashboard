"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Calendar,
  Rocket,
  Menu,
  X,
  LogOut,
  Wifi,
  Shield,
  Settings,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRole } from "@/contexts/RoleContext"
import { useTheme } from "next-themes"
import { roleHomePath } from "@/lib/role-home"

// Base navs
const consumerNavItems = [
  { title: "Dashboard", href: "/consumer/dashboard", icon: LayoutDashboard }, // role home
  { title: "Connection Status", href: "/dashboard/connection", icon: Wifi },
  { title: "Billing & Support", href: "/dashboard/billing", icon: DollarSign },
  { title: "Satellite Globe", href: "/dashboard/globe", icon: Globe },
]

const armyNavItems = [
  { title: "Tactical Overview", href: "/army/dashboard", icon: Shield }, // role home
  { title: "Network Security", href: "/dashboard/security", icon: Shield },
  { title: "Terminal Control", href: "/dashboard/terminal", icon: Settings },
  { title: "Satellite Globe", href: "/dashboard/globe", icon: Globe },
]

const adminNavItems = [
  { title: "Admin Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Statistics", href: "/dashboard/statistics", icon: BarChart3 },
  { title: "Consumer View", href: "/dashboard/consumer-view", icon: Wifi },
  { title: "Army View", href: "/dashboard/army-view", icon: Shield },
  { title: "Satellite Globe", href: "/dashboard/globe", icon: Globe },
  { title: "Launch Timeline", href: "/dashboard/timeline", icon: Calendar },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session, isPending, refetch } = useSession()
  const { role } = useRole()
  const { theme, setTheme } = useTheme()

  // Enforce theme based on role
// Enforce theme based on role (consumer always dark)
useEffect(() => {
  if (role === "consumer") {
    setTheme("dark")
  } else if (role === "army") {
    // keep your existing army behavior (dark)
    setTheme("dark")
  } else {
    // admin: do not force; they can toggle
  }
}, [role, setTheme])


  // Auth guard
  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login")
  }, [session, isPending, router])

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      toast.success("Logged out successfully")
      router.push("/")
    }
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const userInitials =
    session.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"

  // Choose nav set per role
  const navItems =
    role === "consumer" ? consumerNavItems : role === "army" ? armyNavItems : adminNavItems

  const roleLabel =
    role === "consumer" ? "Consumer" : role === "army" ? "Strategic Forces" : "Administrator"

  // Helper to test active state for parent + subroutes
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" // exact for admin overview
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", role === "army" ? "bg-amber-500/20" : "bg-primary/10")}>
                <Rocket className={cn("h-6 w-6", role === "army" ? "text-amber-500" : "text-primary")} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Aakash</h2>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        active && role === "army" && "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30",
                        active && role !== "army" && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          <Separator />

          {/* Footer */}
          <div className="p-4 space-y-2">
            <div className="text-xs text-muted-foreground px-2">
              <p className="font-medium">BharatNet Initiative</p>
              <p>ISRO × NASA Partnership</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">Aakash Mission Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {role === "army" ? "Tactical Satellite Network" : "Real-time satellite monitoring system"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Keep theme toggle only for admin */}
              {role === "admin" && <ThemeToggle />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={cn(role === "army" ? "bg-amber-500/20 text-amber-500" : "bg-primary/10 text-primary")}
                      >
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">Role: {roleLabel}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
