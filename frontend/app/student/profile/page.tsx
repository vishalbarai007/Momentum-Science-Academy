"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Flame,
  Clock,
  GraduationCap,
  Target,
  TrendingUp,
  Star,
  Loader2,
  CheckCircle,
} from "lucide-react"

// --- Types ---
interface StudentData {
  id: number
  fullName: string
  email: string
  phone: string
  studentClass: string
  program: string
  enrollmentDate: string
  status: string
  avatar: string
}

interface PerformanceStats {
  averageScore: string
  totalTests: number
  bestRank: string
  improvement: string
}

interface ActivityLog {
  action: string
  item: string
  time: string
}

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [performance, setPerformance] = useState<PerformanceStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Fetch Student Profile & Performance Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const headers = { "Authorization": `Bearer ${token}` }

        // A. Fetch Profile
        const profileRes = await fetch("http://localhost:8080/api/auth/me", { headers })
        if (profileRes.ok) {
          const user = await profileRes.json()
          setStudentData({
            id: user.id,
            fullName: user.fullName || "Student",
            email: user.email,
            phone: user.phone || "Not provided",
            studentClass: user.studentClass || "N/A",
            program: user.program || "General",
            enrollmentDate: new Date(user.createdAt || Date.now()).toLocaleDateString(),
            status: user.active ? "Active" : "Active", // Defaulting to active for now
            avatar: user.fullName ? user.fullName.charAt(0).toUpperCase() : "S"
          })
        }

        // B. Fetch Performance Stats
        const perfRes = await fetch("http://localhost:8080/api/v1/performance/stats", { headers })
        if (perfRes.ok) {
            setPerformance(await perfRes.json())
        }

        // C. Fetch Assignments (To generate Activity Log)
        const assignRes = await fetch("http://localhost:8080/api/v1/assignments", { headers })
        if (assignRes.ok) {
            const assignments = await assignRes.json()
            // Transform assignments into activity log
            const logs = assignments
                .filter((a: any) => ["submitted", "graded"].includes(a.status.toLowerCase()))
                .sort((a: any, b: any) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                .slice(0, 5)
                .map((a: any) => ({
                    action: a.status === "Graded" ? "Graded" : "Submitted",
                    item: a.title,
                    time: new Date(a.dueDate).toLocaleDateString()
                }))
            setRecentActivity(logs)
        }

      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- Derived Stats using Real Data ---
  const stats = [
    { 
        label: "Total Tests", 
        value: performance?.totalTests.toString() || "0", 
        icon: Clock, 
        color: "from-blue-500 to-cyan-500" 
    },
    { 
        label: "Avg. Score", 
        value: performance?.averageScore || "0%", 
        icon: Target, 
        color: "from-purple-500 to-pink-500" 
    },
    { 
        label: "Improvement", 
        value: performance?.improvement || "0%", 
        icon: TrendingUp, 
        color: "from-emerald-500 to-teal-500" 
    },
    { 
        label: "Best Rank", 
        value: performance?.bestRank || "-", 
        icon: Award, 
        color: "from-orange-500 to-red-500" 
    },
  ]

  // Hardcoded for UI demo (since we don't have a badge system backend yet)
  const achievements = [
    { title: "Top Performer", description: "Reached top 5 rank in class", icon: Award, date: "Current" },
    { title: "Consistent", description: "Submitted 5 assignments in a row", icon: Star, date: "Recent" },
    { title: "Active Learner", description: "Logged in daily this week", icon: Flame, date: "This Week" },
  ]

  if (loading) {
    return (
        <StudentSidebar>
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        </StudentSidebar>
    )
  }

  if (!studentData) return <StudentSidebar>User not found</StudentSidebar>

  return (
    <StudentSidebar>
      {/* Profile Header */}
      <Card className="border-0 shadow-xl mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-secondary" />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-bold text-white shadow-xl border-4 border-background">
              {studentData.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{studentData.fullName}</h1>
                  <p className="text-muted-foreground">
                    Class {studentData.studentClass} - {studentData.program}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                      {studentData.status}
                    </span>
                    <span className="text-xs text-muted-foreground">ID: MSA-{studentData.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["overview", "achievements", "activity"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Info */}
          <Card className="p-6 border-0 shadow-lg h-fit">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: studentData.email },
                { icon: Phone, label: "Phone", value: studentData.phone },
                { icon: GraduationCap, label: "Class", value: `Class ${studentData.studentClass}` },
                { icon: BookOpen, label: "Program", value: studentData.program },
                { icon: Calendar, label: "Enrolled", value: studentData.enrollmentDate },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-sm truncate" title={item.value}>{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Learning Statistics
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Card key={i} className="p-5 border-0 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Subject Performance - Using Overall Avg for now */}
            <Card className="mt-6 p-6 border-0 shadow-lg">
              <h3 className="font-bold mb-4">Overall Performance</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Average Score</span>
                      <span className="text-sm text-emerald-600 font-bold">
                        {performance?.averageScore || "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                        style={{ width: performance?.averageScore || "0%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on {performance?.totalTests || 0} graded assignments/tests.</p>
                  </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon
            return (
              <Card key={i} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </Card>
            )
          })}
        </div>
      )}

      {activeTab === "activity" && (
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No recent activity found.</div>
            ) : (
                recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <div className="flex-1">
                    <p className="font-medium text-sm">
                        {activity.action} <span className="text-primary font-semibold">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                </div>
                ))
            )}
          </div>
        </Card>
      )}
    </StudentSidebar>
  )
}