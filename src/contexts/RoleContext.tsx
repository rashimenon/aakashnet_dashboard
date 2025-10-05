"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "consumer" | "army" | "admin"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<UserRole>("consumer")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem("user_role") as UserRole | null
    if (savedRole && ["consumer", "army", "admin"].includes(savedRole)) {
      setRoleState(savedRole)
    }
    setIsInitialized(true)
  }, [])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem("user_role", newRole)
  }

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}