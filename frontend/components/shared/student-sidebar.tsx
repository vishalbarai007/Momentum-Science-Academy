"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, FileText, Settings, User, LogOut, Menu, X, GraduationCap, BarChart3, Bell } from "lucide-react"

interface StudentSidebarProps {
  children: React.ReactNode
}

export function StudentSidebar({ children }: StudentSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/student/dashboard" },
    { icon: BookOpen, label: "Resources", href: "/student/resources" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: BarChart3, label: "Performance", href: "/student/performance" },
    { icon: User, label: "Profile", href: "/student/profile" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Momentum</div>
                <div className="text-xs text-muted-foreground">Student Portal</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Aditya Kumar</p>
                <p className="text-xs text-muted-foreground">Class 12 - JEE</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full mt-2 justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 rounded-lg hover:bg-muted">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link href="/student/profile">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
                  A
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
