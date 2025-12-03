"use client"

import { useState } from "react"
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
  Flame,
  Target,
  Award,
  FileText,
  TrendingUp,
} from "lucide-react"

export default function StudentDashboard() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const stats = [
    {
      label: "Resources Accessed",
      value: "42",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      change: "+5 this week",
    },
    { label: "Current Streak", value: "15", icon: Flame, color: "from-orange-500 to-red-500", change: "days" },
    {
      label: "Avg. Test Score",
      value: "87%",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      change: "+3% improvement",
    },
    { label: "Study Hours", value: "128", icon: Clock, color: "from-purple-500 to-pink-500", change: "hrs this month" },
  ]

  const recentResources = [
    {
      id: 1,
      title: "JEE Main 2024 - Full Paper Analysis",
      type: "PYQ",
      subject: "Mathematics",
      date: "Today",
      new: true,
      fileUrl: "#",
    },
    {
      id: 2,
      title: "Quadratic Equations - Complete Notes",
      type: "Notes",
      subject: "Mathematics",
      date: "Yesterday",
      new: false,
      fileUrl: "#",
    },
    {
      id: 3,
      title: "Organic Chemistry - Reaction Mechanisms",
      type: "Notes",
      subject: "Chemistry",
      date: "2 days ago",
      new: false,
      fileUrl: "#",
    },
    {
      id: 4,
      title: "Physics - Thermodynamics Assignment",
      type: "Assignment",
      subject: "Physics",
      date: "3 days ago",
      new: false,
      fileUrl: "#",
    },
  ]

  const upcomingEvents = [
    { title: "Algebra Test", date: "Tomorrow, 2 PM", type: "Test", urgent: true },
    { title: "Physics Doubt Session", date: "Dec 20, 5 PM", type: "Session", urgent: false },
    { title: "Chemistry Assignment Due", date: "Dec 22", type: "Assignment", urgent: false },
  ]

  const handleDownload = async (id: number, title: string) => {
    setDownloadingId(id)
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a fake download
    const blob = new Blob([`Content of ${title}`], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  return (
    <StudentSidebar>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Aditya!</h1>
        <p className="text-muted-foreground text-lg">
          You're enrolled in <span className="text-primary font-medium">JEE Advanced Preparation</span> - Class 12
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Resources */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Resources</h2>
            <Link href="/student/resources">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentResources.map((resource) => (
              <Card key={resource.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold hover:text-primary cursor-pointer">{resource.title}</h3>
                      {resource.new && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {resource.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{resource.subject}</span>
                      <span className="text-xs text-muted-foreground">- {resource.date}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleDownload(resource.id, resource.title)}
                    disabled={downloadingId === resource.id}
                  >
                    {downloadingId === resource.id ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </span>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link href="/student/assignments">
              <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Assignments</p>
                    <p className="text-xs text-muted-foreground">3 pending</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/student/performance">
              <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Performance</p>
                    <p className="text-xs text-muted-foreground">View results</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <Card
                  key={i}
                  className={`p-4 border-l-4 ${event.urgent ? "border-l-red-500" : "border-l-primary"} border-0 shadow-md`}
                >
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                  <span className="text-xs bg-muted px-2 py-1 rounded inline-block mt-2">{event.type}</span>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Card */}
          <Card className="p-5 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Your Performance
            </h3>
            <div className="space-y-3">
              {[
                { subject: "Mathematics", score: 82, trend: "+5%" },
                { subject: "Physics", score: 78, trend: "+3%" },
                { subject: "Chemistry", score: 75, trend: "-2%" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.subject}</span>
                    <span className={`font-medium ${item.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                      {item.score}% ({item.trend})
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/student/performance">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-primary">
                View Detailed Report <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </StudentSidebar>
  )
}
