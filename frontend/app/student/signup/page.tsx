"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function StudentSignupPage() {
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg mx-auto">
              M
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create Student Account</h1>
          <p className="text-muted-foreground text-sm mt-2">Join thousands of successful students</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <form
            className="space-y-4 mb-6"
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </form>
        )}

        {/* Step 2: Program Selection */}
        {step === 2 && (
          <form
            className="space-y-4 mb-6"
            onSubmit={(e) => {
              e.preventDefault()
              setStep(3)
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-3">Select Your Class</label>
              <div className="space-y-2">
                {["7th", "8th", "9th", "10th", "11th", "12th"].map((cls) => (
                  <label
                    key={cls}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <input type="radio" name="class" value={cls} defaultChecked={cls === "12"} />
                    <span className="font-medium">{cls} Standard</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 mt-6">Interested Program</label>
              <div className="space-y-2">
                {["Board Exam", "JEE Preparation", "NEET Preparation", "MHT-CET Prep"].map((prog) => (
                  <label
                    key={prog}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <input type="radio" name="program" value={prog} defaultChecked={prog === "JEE Preparation"} />
                    <span className="font-medium">{prog}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Agreement */}
        {step === 3 && (
          <form className="space-y-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg max-h-40 overflow-y-auto text-sm">
              <p className="mb-3">
                <strong>Terms & Conditions</strong>
              </p>
              <p className="text-muted-foreground mb-2">
                By creating an account, you agree to our terms of service and privacy policy. You acknowledge that you
                have read and understood our policies...
              </p>
              <p className="text-muted-foreground">
                All resources provided are for educational purposes only. Unauthorized copying or distribution is
                prohibited.
              </p>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" required />
              <span className="text-sm">I agree to Terms & Conditions</span>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Create Account
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/student/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </Card>
    </div>
  )
}
