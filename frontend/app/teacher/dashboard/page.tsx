"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2,
  TrendingUp,
  Search,
  UploadCloud,
  Library
} from "lucide-react"

// --- Types ---
interface TeacherStats {
  totalAssignments: number
  activeAssignments: number
  pendingDoubts: number
  totalStudents: number
}

interface RecentActivity {
  id: number
  type: "Assignment" | "Doubt"
  title: string
  subtitle: string
  date: string
  status?: string
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Instructor")
  
  // Data State
  const [stats, setStats] = useState<TeacherStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    pendingDoubts: 0,
    totalStudents: 156
  })
  const [activityFeed, setActivityFeed] = useState<RecentActivity[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const headers = { "Authorization": `Bearer ${token}` }

        // 1. Fetch Teacher Info
        const meRes = await fetch("http://localhost:8080/api/auth/me", { headers })
        if (meRes.ok) {
          const user = await meRes.json()
          setUserName(user.fullName || "Instructor")
        }

        // 2. Fetch Assignments
        const assignRes = await fetch("http://localhost:8080/api/v1/assignments/created", { headers })
        let assignments = []
        if (assignRes.ok) {
            assignments = await assignRes.json()
        }

        // 3. Fetch Doubts
        const doubtsRes = await fetch("http://localhost:8080/api/v1/doubts/incoming", { headers })
        let doubts = []
        if (doubtsRes.ok) {
            doubts = await doubtsRes.json()
        }

        // --- Process Data ---
        const publishedCount = assignments.filter((a: any) => a.isPublished).length
        const pendingDoubtsCount = doubts.filter((d: any) => !d.answer).length

        setStats(prev => ({
            ...prev,
            totalAssignments: assignments.length,
            activeAssignments: publishedCount,
            pendingDoubts: pendingDoubtsCount
        }))

        // Activity Feed Logic
        const assignmentActivities = assignments.map((a: any) => ({
            id: a.id,
            type: "Assignment",
            title: `Created: ${a.title}`,
            subtitle: `Class ${a.targetClass} • ${a.subject}`,
            date: a.createdAt,
            status: a.isPublished ? "Published" : "Draft"
        }))

        const doubtActivities = doubts.map((d: any) => ({
            id: d.id,
            type: "Doubt",
            title: `New Doubt from ${d.student?.fullName || "Student"}`,
            subtitle: d.question,
            date: d.createdAt,
            status: d.answer ? "Resolved" : "Pending"
        }))

        const combined = [...assignmentActivities, ...doubtActivities]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)

        setActivityFeed(combined)

      } catch (error) {
        console.error("Dashboard data load failed", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper to format Date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Just now"
    return new Date(dateString).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
        <TeacherSidebar>
            <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
        </TeacherSidebar>
    )
  }

  return (
    <TeacherSidebar>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, {userName}</h1>
            <p className="text-muted-foreground mt-1">Here is an overview of your classroom activities.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/teacher/assignment">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4 mr-2" /> New Assignment
                </Button>
            </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-0 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                <p className="text-xs text-muted-foreground">Total Assignments</p>
            </div>
        </Card>

        <Card className="p-5 border-0 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold">{stats.activeAssignments}</p>
                <p className="text-xs text-muted-foreground">Active / Published</p>
            </div>
        </Card>

        <Link href="/teacher/submissions">
            <Card className="p-5 border-0 shadow-md flex items-center gap-4 cursor-pointer hover:bg-orange-50 transition-colors border-l-4 border-l-orange-500">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.pendingDoubts}</p>
                    <p className="text-xs text-muted-foreground">Pending Doubts</p>
                </div>
            </Card>
        </Link>

        <Card className="p-5 border-0 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Recent Activity
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
            </div>

            <div className="space-y-4">
                {activityFeed.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground border-dashed">
                        No recent activity recorded.
                    </Card>
                ) : (
                    activityFeed.map((item, i) => (
                        <Card key={i} className="p-4 flex items-start gap-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                             <div className={`mt-1 p-2 rounded-full shrink-0 ${
                                 item.type === "Assignment" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                             }`}>
                                 {item.type === "Assignment" ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                     <h4 className="font-semibold text-sm truncate pr-2">{item.title}</h4>
                                     <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</span>
                                 </div>
                                 <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                                 <div className="mt-2">
                                     <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                         item.status === 'Published' || item.status === 'Resolved' 
                                         ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                         : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                     }`}>
                                         {item.status}
                                     </span>
                                 </div>
                             </div>
                        </Card>
                    ))
                )}
            </div>
        </div>

        {/* Right Col: Quick Actions & Pending */}
        <div className="space-y-6">
            <Card className="p-5 border-0 shadow-lg bg-emerald-900 text-white">
                <h3 className="font-bold mb-2">Quick Actions</h3>
                <p className="text-emerald-100 text-sm mb-4">Manage your content and students.</p>
                
                {/* Updated Grid for Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/teacher/assignment">
                        <Button variant="secondary" className="w-full h-auto py-3 flex flex-col gap-1 text-xs bg-white/10 hover:bg-white/20 border-0 text-white">
                            <Plus className="w-5 h-5 mb-1" /> Create Task
                        </Button>
                    </Link>
                    <Link href="/teacher/submissions">
                         <Button variant="secondary" className="w-full h-auto py-3 flex flex-col gap-1 text-xs bg-white/10 hover:bg-white/20 border-0 text-white">
                            <Search className="w-5 h-5 mb-1" /> Review Work
                        </Button>
                    </Link>
                    <Link href="/teacher/upload">
                         <Button variant="secondary" className="w-full h-auto py-3 flex flex-col gap-1 text-xs bg-white/10 hover:bg-white/20 border-0 text-white">
                            <UploadCloud className="w-5 h-5 mb-1" /> Upload Files
                        </Button>
                    </Link>
                    <Link href="/teacher/resources">
                         <Button variant="secondary" className="w-full h-auto py-3 flex flex-col gap-1 text-xs bg-white/10 hover:bg-white/20 border-0 text-white">
                            <Library className="w-5 h-5 mb-1" /> Library
                        </Button>
                    </Link>
                </div>
            </Card>

            <Card className="p-5 border-0 shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" /> Pending Actions
                </h3>
                <div className="space-y-3">
                    {stats.pendingDoubts > 0 ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                             <AlertCircle className="w-5 h-5 text-orange-500" />
                             <div className="flex-1">
                                 <p className="text-sm font-medium text-orange-900">{stats.pendingDoubts} Unresolved Doubts</p>
                                 <p className="text-xs text-orange-700">Students are waiting for reply.</p>
                             </div>
                             <Link href="/teacher/submissions">
                                 <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-orange-200"><ArrowRight className="w-4 h-4 text-orange-700" /></Button>
                             </Link>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                            No pending doubts!
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </TeacherSidebar>
  )
}