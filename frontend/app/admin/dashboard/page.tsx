"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import {
  Users,
  BookOpen,
  Mail,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  UserPlus,
  Gift,
  BarChart3,
  Download,
  Eye,
  Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"

// Define interface for Student data for the dashboard
interface Student {
  id: string
  name: string
  email: string
  class: string
  program: string
  date: string
}

export default function AdminDashboard() {
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(true)

  const metrics = [
    { label: "Total Students", value: "2,847", change: "+12%", icon: Users, color: "from-blue-500 to-cyan-500" },
    {
      label: "Total Teachers",
      value: "156",
      change: "+5%",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500",
    },
    { label: "Active Leads", value: "423", change: "+28%", icon: Mail, color: "from-orange-500 to-red-500" },
    { label: "Resources", value: "1,203", change: "+43", icon: BookOpen, color: "from-purple-500 to-pink-500" },
  ]

  const recentLeads = [
    { name: "Aditya Kumar", status: "new", program: "JEE", phone: "+91 98765 43210" },
    { name: "Neha Sharma", status: "contacted", program: "NEET", phone: "+91 87654 32109" },
    { name: "Vikram Singh", status: "interested", program: "JEE", phone: "+91 76543 21098" },
  ]

  // Fetch Recent Students
  useEffect(() => {
    const fetchRecentStudents = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
            setIsLoadingStudents(false)
            return
        }

        // 1. Use the same endpoint as AdminUsersPage
        const response = await fetch("http://localhost:8080/api/auth/students", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json() // Expecting array of User objects
          
          if (Array.isArray(data)) {
            // 2. Client-side Sort: Newest 'createdAt' first
            const sortedData = data.sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || 0).getTime()
              const dateB = new Date(b.createdAt || 0).getTime()
              return dateB - dateA
            })

            // 3. Slice the top 3
            const top3 = sortedData.slice(0, 3)

            // 4. Map with Defaults (handling mapping between backend 'studentClass' and frontend 'class')
            const mappedStudents = top3.map((user: any) => ({
              id: user.id,
              name: user.fullName || "Unknown Name",
              email: user.email || "No Email",
              class: user.studentClass || user.class || "N/A", // Try both field names
              program: user.program || "N/A",
              date: new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { 
                month: 'short', 
                day: 'numeric' 
              })
            }))
            
            setRecentStudents(mappedStudents)
          }
        }
      } catch (error) {
        console.error("Failed to fetch recent students:", error)
      } finally {
        setIsLoadingStudents(false)
      }
    }

    fetchRecentStudents()
  }, [])

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <Card key={i} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Registrations Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Monthly Registrations</h3>
            <Link href="/admin/analytics">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" /> View Details
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { month: "October", students: 240, teachers: 12 },
              { month: "November", students: 325, teachers: 15 },
              { month: "December", students: 289, teachers: 18 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">
                    {item.students} students, {item.teachers} teachers
                  </span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 rounded"
                    style={{ width: `${(item.students / 350) * 100}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-secondary to-secondary/80 rounded"
                    style={{ width: `${(item.teachers / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded" />
              <span>Teachers</span>
            </div>
          </div>
        </Card>

        {/* Lead Conversion */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Lead Conversion Funnel</h3>
            <Link href="/admin/analytics">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4 mr-1" /> Analytics
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { stage: "New Leads", count: 156, color: "bg-blue-500" },
              { stage: "Contacted", count: 98, color: "bg-amber-500" },
              { stage: "Interested", count: 67, color: "bg-purple-500" },
              { stage: "Enrolled", count: 45, color: "bg-emerald-500" },
            ].map((stage, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <span className="text-sm text-muted-foreground">{stage.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`${stage.color} h-full rounded-full transition-all`}
                    style={{ width: `${(stage.count / 156) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Conversion rate: <span className="font-bold text-emerald-600">28.8%</span>
          </p>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Students</h3>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoadingStudents ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent students found.</p>
            ) : (
              recentStudents.map((student) => (
                <div key={student.id} className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Class {student.class}
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {student.program}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {student.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Leads */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Leads</h3>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{lead.name}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      lead.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : lead.status === "contacted"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{lead.phone}</p>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full inline-block mt-2">
                  {lead.program}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: UserPlus, label: "Add New User", href: "/admin/users" },
              { icon: Mail, label: "View All Leads", href: "/admin/leads" },
              { icon: BookOpen, label: "Manage Resources", href: "/admin/resources" },
              { icon: Gift, label: "Referral System", href: "/admin/referrals" },
              { icon: BarChart3, label: "Generate Reports", href: "/admin/analytics" },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={i} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-primary/5 hover:text-primary bg-transparent"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {action.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </Card>
      </div>
    </AdminSidebar>
  )
}