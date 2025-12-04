"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GraduationCap, User, BookOpen, Shield, Eye, EyeOff, ArrowRight, Mail, Lock, ChevronRight } from "lucide-react"

type UserRole = "student" | "teacher" | "admin" | null

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") as UserRole
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const roles = [
    {
      id: "student" as const,
      title: "Student",
      description: "Access study materials, assignments, and track your progress",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      redirect: "/student/dashboard",
    },
    {
      id: "teacher" as const,
      title: "Teacher / Staff",
      description: "Upload resources, manage classes, and view student feedback",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      redirect: "/teacher/dashboard",
    },
    {
      id: "admin" as const,
      title: "Administrator",
      description: "Full system access, user management, and analytics",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      redirect: "/admin/dashboard",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!selectedRole) return

  setIsLoading(true)
  setError("")

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })

    if (!response.ok) {
      const msg = await response.text()
      setError(msg || "Invalid credentials")
      setIsLoading(false)
      return
    }

    const data = await response.json() // { token, email, role }

    // Save token and data
    localStorage.setItem("token", data.token)
    localStorage.setItem("email", data.email)
    localStorage.setItem("role", data.role)
    localStorage.setItem("isAuthenticated", "true")

    // Redirect based on backend role
    const role = roles.find((r) => r.id === data.role)
    if (role) {
      router.push(role.redirect)
    } else {
      setError("Invalid role returned from server")
    }

  } catch (err) {
    setError("Something went wrong. Try again.")
  }

  setIsLoading(false)
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Momentum
              </div>
              <div className="text-sm text-muted-foreground">Science Academy</div>
            </div>
          </Link>
        </div>

        {/* Role Selection or Login Form */}
        {!selectedRole ? (
          <div className="animate-scale-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
              <p className="text-muted-foreground">Select your role to sign in</p>
              <p className="text-sm text-muted-foreground mt-2">Credentials are provided by administration only</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role, index) => {
                const Icon = role.icon
                return (
                  <Card
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`group cursor-pointer p-6 hover-lift border-2 transition-all duration-300 hover:border-primary/50 ${role.bgColor}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{role.description}</p>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      <span>Sign In</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </Card>
                )
              })}
            </div>

            <p className="text-center text-muted-foreground text-sm mt-8">
              New to Momentum?{" "}
              <Link href="/contact" className="text-primary font-medium hover:underline">
                Contact administration for enrollment
              </Link>
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-scale-in">
            <Card className="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-xl">
              {/* Back button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm">Change role</span>
              </button>

              {/* Role indicator */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-muted/50">
                {(() => {
                  const role = roles.find((r) => r.id === selectedRole)
                  if (!role) return null
                  const Icon = role.icon
                  return (
                    <>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{role.title} Login</p>
                        <p className="text-sm text-muted-foreground">Enter credentials provided by admin</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Form - Sign In Only */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <span className="text-muted-foreground text-xs">Contact admin for password reset</span>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all font-medium text-base shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Info box */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl text-sm">
                <p className="font-medium mb-2">Important Notice:</p>
                <p className="text-muted-foreground">
                  Login credentials are provided by administration only. Students and teachers cannot self-register.
                  Contact admin for account creation or password reset.
                </p>
              </div>
            </Card>

            <p className="text-center text-muted-foreground text-sm mt-6">
              <Link href="/" className="text-primary font-medium hover:underline">
                Back to Home
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
