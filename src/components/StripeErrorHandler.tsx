"use client"

import { useEffect } from "react"
import { setupStripeErrorHandling } from "@/lib/stripe-safe-loader"

/**
 * Global Stripe Error Handler Component
 * 
 * Prevents crashes from Stripe analytics/telemetry being blocked
 * by adblockers, privacy extensions, or Brave shields.
 * 
 * This component should be included once in the root layout.
 */
export default function StripeErrorHandler() {
  useEffect(() => {
    // Initialize global Stripe error handlers
    setupStripeErrorHandling()
  }, [])

  return null
}