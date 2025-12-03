"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function StudentLoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg mx-auto">
              M
            </div>
          </Link>
          <h1 className="text-2xl font-bold">{isLogin ? "Student Login" : "Register"}</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isLogin ? "Access your student dashboard" : "Create your student account"}
          </p>
        </div>

        <form className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
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

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Select class</option>
                <option>7th</option>
                <option>8th</option>
                <option>9th</option>
                <option>10th</option>
                <option>11th (JEE/NEET)</option>
                <option>12th (JEE/NEET)</option>
              </select>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border border-border" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or</span>
          </div>
        </div>

        <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors font-medium">
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm">
          {isLogin ? (
            <>
              <span className="text-muted-foreground">Don't have an account? </span>
              <button onClick={() => setIsLogin(false)} className="text-primary font-semibold hover:underline">
                Register here
              </button>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">Already registered? </span>
              <button onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline">
                Login here
              </button>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
          Demo credentials: student@momentum.edu / password123
        </div>
      </Card>
    </div>
  )
}
