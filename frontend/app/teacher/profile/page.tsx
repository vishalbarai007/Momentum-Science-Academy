"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import {
  User,
  Mail,
  BookOpen,
  Calendar,
  BarChart,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  Loader2,
  FileText,
  UploadCloud
} from "lucide-react"

// --- Types ---
interface TeacherData {
  id: number
  fullName: string
  email: string
  role: string
  specializations: string[] // Derived from accessTags
  joinDate: string
  avatar: string
}

interface TeacherStats {
  totalAssignments: number
  publishedAssignments: number
  draftAssignments: number
}

interface ActivityLog {
  action: string
  item: string
  date: string
  status: string
}

export default function TeacherProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  
  // Data States
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  const [stats, setStats] = useState<TeacherStats>({ totalAssignments: 0, publishedAssignments: 0, draftAssignments: 0 })
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const headers = { "Authorization": `Bearer ${token}` }

        // 1. Fetch Teacher Profile
        const profileRes = await fetch("http://localhost:8080/api/auth/me", { headers })
        if (profileRes.ok) {
          const user = await profileRes.json()
          setTeacherData({
            id: user.id,
            fullName: user.fullName || "Instructor",
            email: user.email,
            role: "Senior Educator", // Hardcoded or derived
            // Access tags usually contain subjects/classes for teachers
            specializations: user.accessTags ? Array.from(user.accessTags) : ["General"], 
            joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString(),
            avatar: user.fullName ? user.fullName.charAt(0).toUpperCase() : "T"
          })
        }

        // 2. Fetch Created Assignments to generate Stats
        const assignRes = await fetch("http://localhost:8080/api/v1/assignments/created", { headers })
        if (assignRes.ok) {
            const assignments = await assignRes.json()
            
            // Calculate Stats
            const published = assignments.filter((a: any) => a.isPublished).length
            setStats({
                totalAssignments: assignments.length,
                publishedAssignments: published,
                draftAssignments: assignments.length - published
            })

            // Generate Activity Log from Assignments
            const logs = assignments
                .sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
                .slice(0, 5)
                .map((a: any) => ({
                    action: "Created Assignment",
                    item: a.title,
                    date: new Date(a.createdAt || Date.now()).toLocaleDateString(),
                    status: a.isPublished ? "Published" : "Draft"
                }))
            setRecentActivity(logs)
        }

      } catch (error) {
        console.error("Failed to fetch teacher profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
        <TeacherSidebar>
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        </TeacherSidebar>
    )
  }

  if (!teacherData) return <TeacherSidebar>User not found</TeacherSidebar>

  return (
    <TeacherSidebar>
      {/* Profile Header */}
      <Card className="border-0 shadow-xl mb-8 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center shadow-xl border-4 border-white">
                <div className="w-full h-full bg-emerald-50 rounded-xl flex items-center justify-center text-5xl font-bold text-emerald-600">
                    {teacherData.avatar}
                </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{teacherData.fullName}</h1>
                  <p className="text-muted-foreground font-medium">
                    {teacherData.role} • {teacherData.specializations[0] || "Faculty"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      Active Faculty
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined {teacherData.joinDate}
                    </span>
                  </div>
                </div>
                
                {/* <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Edit Profile
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b pb-1">
        {["overview", "activity"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "secondary" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${activeTab === tab ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info */}
          <Card className="p-6 border-0 shadow-lg h-fit">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Instructor Details
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="font-medium text-sm truncate" title={teacherData.email}>{teacherData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium text-sm">Science & Mathematics</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subjects / Classes</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacherData.specializations.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-emerald-700">
                            {tag}
                        </span>
                    ))}
                    {teacherData.specializations.length === 0 && <span className="text-xs">General</span>}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column: Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Row */}
            <div className="grid sm:grid-cols-3 gap-4">
               <Card className="p-5 border-0 shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                     <p className="text-xs text-muted-foreground">Total Created</p>
                  </div>
               </Card>
               <Card className="p-5 border-0 shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                     <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-2xl font-bold">{stats.publishedAssignments}</p>
                     <p className="text-xs text-muted-foreground">Published</p>
                  </div>
               </Card>
               <Card className="p-5 border-0 shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-2xl font-bold">{stats.draftAssignments}</p>
                     <p className="text-xs text-muted-foreground">Drafts</p>
                  </div>
               </Card>
            </div>

            {/* Recent Uploads */}
            <Card className="p-6 border-0 shadow-lg">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-600" /> Recent Uploads
               </h3>
               <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No assignments created yet.</p>
                  ) : (
                      recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <div>
                                 <p className="font-medium text-sm">{activity.item}</p>
                                 <p className="text-xs text-muted-foreground">{activity.date}</p>
                              </div>
                           </div>
                           <span className={`text-[10px] px-2 py-0.5 rounded-full border ${activity.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              {activity.status}
                           </span>
                        </div>
                      ))
                  )}
               </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
             <BarChart className="w-5 h-5 text-emerald-600" /> Assignment History
          </h3>
          <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
            {recentActivity.length === 0 ? (
                <div className="pl-6 text-muted-foreground">No activity recorded.</div>
            ) : (
                recentActivity.map((activity, i) => (
                    <div key={i} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-emerald-500" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/20 p-4 rounded-lg">
                           <div>
                              <p className="font-semibold text-sm">{activity.action}: <span className="text-emerald-700">{activity.item}</span></p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                           </div>
                           <div className="mt-2 sm:mt-0">
                                <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border">
                                    {activity.status}
                                </span>
                           </div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </Card>
      )}
    </TeacherSidebar>
  )
}