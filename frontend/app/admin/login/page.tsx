"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg mx-auto">
              M
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-2">Restricted Access - Admin Users Only</p>
        </div>

        <form className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@momentum.edu"
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

          <div>
            <label className="block text-sm font-medium mb-1">Two-Factor Code</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Login</Button>
        </form>

        <div className="p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
          Demo credentials: admin@momentum.edu / admin123 + 2FA code: 000000
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Unauthorized access is prohibited. All activity is logged.
        </div>
      </Card>
    </div>
  )
}
