"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DollarSign, HelpCircle, CreditCard } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BillingPage() {
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")

  const handlePayBill = () => {
    toast.success("Redirecting to UPI payment gateway...")
    // TODO: integrate UPI payment gateway here
  }

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success("Support ticket submitted successfully!")
    setTicketSubject("")
    setTicketDescription("")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing &amp; Support</h2>
        <p className="text-muted-foreground">Manage your payments and get help</p>
      </div>

      {/* Billing Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Bill
            </CardTitle>
            <CardDescription>Your upcoming payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-medium">Premium 100GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Billing Cycle</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="font-medium">Jan 15, 2025</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Amount Due</span>
                  <span className="text-2xl font-bold">₹999</span>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handlePayBill}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay with UPI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Dec 15, 2024", amount: "₹999", status: "Paid" },
                { date: "Nov 15, 2024", amount: "₹999", status: "Paid" },
                { date: "Oct 15, 2024", amount: "₹999", status: "Paid" },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{payment.date}</p>
                    <p className="text-xs text-muted-foreground">{payment.status}</p>
                  </div>
                  <span className="font-semibold">{payment.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section — Ticket only, spans full width on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Submit Support Ticket
            </CardTitle>
            <CardDescription>Get help from our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email (optional)</Label>
                <Input id="email" placeholder="you@example.com" type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about your issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows={8}
              />
            </div>
            <Button className="w-full md:w-auto" onClick={handleSubmitTicket}>
              Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Help */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { q: "How do I change my plan?", a: "Visit the Billing section and click 'Upgrade Plan'." },
              { q: "What payment methods are accepted?", a: "We accept UPI, credit cards, and debit cards." },
              { q: "How do I check my data usage?", a: "Visit the Connection Status page for real-time usage." },
              { q: "What is the cancellation policy?", a: "Cancel anytime with 30 days notice, no penalties." },
            ].map((faq, i) => (
              <details key={i} className="border rounded-lg p-3">
                <summary className="font-medium cursor-pointer">{faq.q}</summary>
                <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
