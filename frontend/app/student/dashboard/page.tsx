"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import {
  BookOpen,
  Download,
  Clock,
  Calendar,
  ChevronRight,
  Target,
  Award,
  FileText,
  TrendingUp,
  Loader2,
  Bell,
  CheckCircle
} from "lucide-react"

// --- Types ---
interface Student {
  fullName: string
  email: string
  studentClass: string
  program: string
}

interface Resource {
  id: number
  title: string
  type: string
  subject: string
  createdAt: string
  fileUrl: string
}

interface PerformanceStats {
  averageScore: string
  totalTests: number
  bestRank: string
  improvement: string
}

interface Assignment {
  id: number
  title: string
  dueDate: string
  status: string
  subject: string
}

export default function StudentDashboard() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // --- State Data ---
  const [student, setStudent] = useState<Student | null>(null)
  const [performance, setPerformance] = useState<PerformanceStats | null>(null)
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  
  // Derived State from Assignments
  const [pendingCount, setPendingCount] = useState(0)
  const [nextDeadline, setNextDeadline] = useState<string | null>(null)
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const headers = { "Authorization": `Bearer ${token}` }

        // 1. Fetch Student Profile (Local fallback + API)
        const storedUser = localStorage.getItem("user")
        if (storedUser) setStudent(JSON.parse(storedUser))
        
        // 2. Fetch Performance Stats
        const perfRes = await fetch("http://localhost:8080/api/v1/performance/stats", { headers })
        if (perfRes.ok) setPerformance(await perfRes.json())

        // 3. Fetch Assignments (Calculate Pending & Deadlines)
        const assignRes = await fetch("http://localhost:8080/api/v1/assignments", { headers })
        if (assignRes.ok) {
            const allAssignments: Assignment[] = await assignRes.json()
            
            // Logic: Filter Pending
            const pending = allAssignments.filter(a => ["pending", "missing"].includes(a.status.toLowerCase()))
            
            // Logic: Sort by Date for "Upcoming"
            const upcoming = [...pending]
                .filter(a => new Date(a.dueDate) >= new Date()) // Future only
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

            setPendingCount(pending.length)
            setNextDeadline(upcoming.length > 0 ? new Date(upcoming[0].dueDate).toLocaleDateString() : "No deadlines")
            setUpcomingAssignments(upcoming.slice(0, 3)) // Top 3 for Sidebar
        }

        // 4. Fetch Resources
        const resourcesRes = await fetch("http://localhost:8080/api/v1/resources", { headers })
        if (resourcesRes.ok) {
          const data = await resourcesRes.json()
          const sorted = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 4) // Top 4 Recent
          setRecentResources(sorted)
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- Stats Config (Hybrid of V1 and V2) ---
  const stats = [
    {
      label: "Pending Tasks",
      value: pendingCount.toString(),
      icon: Clock, // V1 Icon
      color: "from-orange-500 to-red-500",
      change: "Action Required",
    },
    {
      label: "Avg. Test Score",
      value: performance?.averageScore || "0%",
      icon: Target, // V2 Icon
      color: "from-emerald-500 to-teal-500",
      change: performance?.improvement || "0%",
    },
    {
      label: "Resources Accessed",
      value: recentResources.length.toString(),
      icon: BookOpen, // V2 Icon
      color: "from-blue-500 to-cyan-500",
      change: "This Week",
    },
    { 
        label: "Next Deadline", 
        value: nextDeadline || "-", 
        icon: Calendar, // V1 Icon
        color: "from-purple-500 to-pink-500", 
        change: "Upcoming" 
    },
  ]

  const handleDownload = async (id: number, fileUrl: string) => {
    setDownloadingId(id)
    if (fileUrl && fileUrl.startsWith("http")) {
        setTimeout(() => {
            window.open(fileUrl, "_blank")
            setDownloadingId(null)
        }, 800)
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setDownloadingId(null)
        alert("File download started (Simulated)")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recent"
    return new Date(dateString).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
  }

  const formatType = (type: string) => {
    const map: any = { 'pq': 'PYQ', 'notes': 'Notes', 'assignment': 'Assignment', 'imp': 'IMP' }
    return map[type?.toLowerCase()] || type
  }

  return (
    <StudentSidebar>
      {/* Welcome Section */}
      <div className="mb-8">
        {loading ? (
            <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2"></div>
        ) : (
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {student?.fullName || "Student"}!
            </h1>
        )}
        <p className="text-muted-foreground text-lg">
          You're enrolled in <span className="text-primary font-medium">{student?.program || "General"} Preparation</span> {student?.studentClass ? `- Class ${student.studentClass}` : ""}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold mb-1 truncate" title={stat.value}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Resources & Activity */}
        <div className="lg:col-span-2">
          
          {/* Recent Resources Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Recent Resources</h2>
            <Link href="/student/resources">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
               <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : recentResources.length === 0 ? (
               <div className="p-8 text-center border-2 border-dashed rounded-xl">
                 <FileText className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-2"/>
                 <p className="text-muted-foreground">No resources uploaded yet.</p>
               </div>
            ) : (
                recentResources.map((resource) => (
                <Card key={resource.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold hover:text-primary cursor-pointer truncate max-w-[200px] md:max-w-md">
                            {resource.title}
                        </h3>
                        {(new Date().getTime() - new Date(resource.createdAt).getTime()) < 86400000 && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">New</span>
                        )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium uppercase">
                            {formatType(resource.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">{resource.subject}</span>
                        <span className="text-xs text-muted-foreground">- {formatDate(resource.createdAt)}</span>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleDownload(resource.id, resource.fileUrl)}
                        disabled={downloadingId === resource.id}
                    >
                        {downloadingId === resource.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
                        {downloadingId === resource.id ? "" : "Download"}
                    </Button>
                    </div>
                </Card>
                ))
            )}
          </div>

          {/* Quick Links / Actions */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Link href="/student/assignments">
              <Card className="p-5 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:bg-primary/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Assignments</p>
                    <p className="text-sm text-muted-foreground">{pendingCount} pending tasks</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/student/performance">
              <Card className="p-5 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:bg-primary/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Leaderboard</p>
                    <p className="text-sm text-muted-foreground">View your rank</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Sidebar: Due Soon & Performance */}
        <div className="space-y-6">
          
          {/* Due Soon Section */}
          <Card className="p-5 border-0 shadow-lg">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Due Soon
             </h3>
             <div className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20"/>
                      <p className="text-sm">All caught up!</p>
                  </div>
              ) : (
                  upcomingAssignments.map((event, i) => (
                    <div key={i} className="p-3 border-l-4 border-l-orange-500 bg-muted/20 rounded-r-lg">
                      <p className="font-semibold text-sm line-clamp-1">{event.title}</p>
                      <div className="flex justify-between items-end mt-2">
                         <div>
                            <p className="text-xs text-muted-foreground">{new Date(event.dueDate).toLocaleDateString()}</p>
                            <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground mt-1 inline-block">{event.subject}</span>
                         </div>
                         <Link href="/student/assignments" className="text-xs font-medium text-primary hover:underline">Submit</Link>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Performance Visualizer */}
          <Card className="p-5 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Your Progress
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Score</span>
                    <span className="text-xl font-bold text-emerald-600">{performance?.averageScore || "0%"}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: performance?.averageScore || "0%" }}
                    ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/10">
                     <div className="bg-white/60 p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Tests</p>
                        <p className="font-bold text-lg">{performance?.totalTests || 0}</p>
                     </div>
                     <div className="bg-white/60 p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Rank</p>
                        <p className="font-bold text-lg">{performance?.bestRank || "-"}</p>
                     </div>
                </div>
            </div>
            <Link href="/student/performance">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/10">
                Detailed Report <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </StudentSidebar>
  )
}