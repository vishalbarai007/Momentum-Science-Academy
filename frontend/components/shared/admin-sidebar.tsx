"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Users, BookOpen, Mail, Gift, BarChart3, Settings, LogOut, Menu, X, Home, FileText, GraduationCap, Bell, Check
} from "lucide-react"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AdminSidebarProps {
  children: React.ReactNode
}

interface Notification {
  id: number;
  message: string;
  redirectUrl: string;
  read: boolean;
  createdAt: string;
}

export function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState("Admin User")
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const pathname = usePathname()
  const router = useRouter()

  // 1. Poll for Unread Count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/notifications/unread-count", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()

        // Toast only if count increased
        if (data.count > unreadCount) {
          toast.info("New Notification Received", {
            description: "Click the bell icon to view details."
          });
        }
        setUnreadCount(data.count)
      } catch (e) {
        console.error("Polling error", e)
      }
    }

    const interval = setInterval(fetchCount, 15000) // Poll every 15s (faster than 30s)
    fetchCount(); // Initial fetch
    return () => clearInterval(interval)
  }, [unreadCount])

  // 2. Fetch Notifications List (When Bell is clicked)
  const fetchNotificationsList = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (res.ok) {
      setNotifications(await res.json())
    }
  }

  // 3. Mark as Read Function
  const handleNotificationClick = async (id: number, url: string) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    })

    // Decrease local count immediately for better UX
    setUnreadCount(prev => Math.max(0, prev - 1))

    // Redirect
    router.push(url)
  }

  // ... (Keep existing fetchAdminProfile useEffect and navItems) ...
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8080/api/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setAdminName(data.fullName || "Admin User")
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error)
      }
    }
    fetchAdminProfile()
  }, [])

  // Inside AdminSidebar component...

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return;

        // 1. Check count
        const countRes = await fetch("http://localhost:8080/api/notifications/unread-count", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const countData = await countRes.json()

        // 2. If count increased, fetch the LATEST notification to show in toast
        if (countData.count > unreadCount) {
          const listRes = await fetch("http://localhost:8080/api/notifications", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const listData = await listRes.json();

          if (listData.length > 0) {
            const latestNote = listData[0]; // Get the newest one

            // ✅ Show actual message in bottom-right toast
            toast.info("New Notification", {
              description: latestNote.message, // e.g. "New Inquiry from Vishal"
              action: {
                label: "View",
                onClick: () => router.push(latestNote.redirectUrl) // Click redirects user
              }
            });
          }
        }

        setUnreadCount(countData.count)
      } catch (e) {
        console.error("Polling error", e)
      }
    }

    const interval = setInterval(fetchCount, 15000)
    fetchCount();
    return () => clearInterval(interval)
  }, [unreadCount]) // Dependency on unreadCount ensures we compare correctly



  const navItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Mail, label: "Leads", href: "/admin/leads" },
    { icon: BookOpen, label: "Resources", href: "/admin/resources" },
    { icon: Gift, label: "Referrals", href: "/admin/referrals" },
    { icon: FileText, label: "Blog", href: "/admin/blog" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ... (Keep Sidebar Aside code exactly as is) ... */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Momentum</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
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

          <div className="p-4 border-t border-border">
            <Link href="/admin/profile">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {adminName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{adminName}</p>
                  <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
              </div>
            </Link>
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

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">

              {/* --- MODIFIED BELL ICON WITH POPOVER --- */}
              <Popover onOpenChange={(open) => open && fetchNotificationsList()}>
                <PopoverTrigger asChild>
                  <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                    <Bell className="w-6 h-6 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center border-2 border-background">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-4" align="end">
                  <div className="p-4 border-b border-border font-semibold">
                    Notifications
                  </div>
                  <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleNotificationClick(note.id, note.redirectUrl)}
                            className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 ${!note.read ? 'bg-primary/5' : ''}`}
                          >
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div className="space-y-1">
                              <p className={`text-sm ${!note.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {note.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(note.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              {/* --------------------------------------- */}

              <Link href="/admin/profile">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
                  {adminName.charAt(0)}
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}