"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Upload, Download, Users, Star, ChevronRight, TrendingUp, FileText, MessageSquare, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState("");
  // NEW: State for dynamic recent resources
  const [recentResources, setRecentResources] = useState<any[]>([]); 
  const [loadingResources, setLoadingResources] = useState(true);

  const stats = [
    { label: "Total Uploads", value: "47", icon: Upload, color: "from-blue-500 to-cyan-500", change: "+3 this week" },
    {
      label: "Total Downloads",
      value: "3,420",
      icon: Download,
      color: "from-emerald-500 to-teal-500",
      change: "+156 this week",
    },
    { label: "Active Students", value: "156", icon: Users, color: "from-orange-500 to-red-500", change: "+12 new" },
    { label: "Avg Rating", value: "4.8", icon: Star, color: "from-purple-500 to-pink-500", change: "Out of 5" },
  ]

  const recentFeedback = [
    {
      student: "Aditya Kumar",
      message: "The calculus notes were very helpful!",
      resource: "Calculus Notes",
      time: "2 hours ago",
    },
    {
      student: "Priya Singh",
      message: "Can you add more practice problems?",
      resource: "Algebra Assignment",
      time: "Yesterday",
    },
    {
      student: "Rahul Sharma",
      message: "Great explanation of concepts!",
      resource: "Physics Notes",
      time: "2 days ago",
    },
  ]

  // Helper to format Enum values
  const formatResourceType = (type: string) => {
    const map: Record<string, string> = {
      'pq': 'PYQ',
      'notes': 'Notes',
      'assignment': 'Assignment',
      'imp': 'IMP'
    }
    return map[type.toLowerCase()] || type
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const email = decoded.sub; 

      // 1. Fetch Teacher Name
      fetch(`http://localhost:8080/api/auth/name?email=${email}`)
        .then(res => res.text())
        .then(name => setTeacherName(name))
        .catch(err => console.error("Error fetching teacher name:", err));

      // 2. Fetch Recent Resources
      fetch("http://localhost:8080/api/v1/resources/my-uploads", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort by date (newest first) and take the top 4
          const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const recent = sorted.slice(0, 4).map((item: any) => ({
            id: item.id,
            title: item.title,
            type: formatResourceType(item.type),
            class: item.targetClass,
            downloads: item.downloads || 0,
            date: new Date(item.createdAt).toLocaleDateString() // Format date
          }));
          setRecentResources(recent);
        }
      })
      .catch(err => console.error("Error fetching resources:", err))
      .finally(() => setLoadingResources(false));

    } catch (err) {
      console.error("Token decode error:", err);
    }
  }, []);


  return (
    <TeacherSidebar>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {teacherName || "Teacher"}!
          </h1>
          <p className="text-muted-foreground">Mathematics - 15 years experience</p>
        </div>
        <Link href="/teacher/upload">
          <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
        </Link>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Resources */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Recent Resources</h2>
            <Link href="/teacher/resources">
              <Button variant="ghost" size="sm" className="text-emerald-500">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {loadingResources ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : recentResources.length === 0 ? (
              <div className="text-center p-8 border rounded-xl bg-muted/20">
                <p className="text-muted-foreground">No resources uploaded yet.</p>
                <Link href="/teacher/upload" className="text-emerald-500 hover:underline text-sm mt-2 block">
                  Upload your first resource
                </Link>
              </div>
            ) : (
              recentResources.map((resource, i) => (
                <Card key={i} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded">
                            {resource.type}
                          </span>
                          <span className="text-xs text-muted-foreground">Class {resource.class}</span>
                          <span className="text-xs text-muted-foreground">
                            - {resource.downloads} downloads - {resource.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href="/teacher/resources">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Quick Stats */}
          <Card className="mt-6 p-6 border-0 shadow-lg bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold">Upload Progress</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Upload 3 more resources this month to earn the "Top Contributor" badge!
            </p>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">4/7 uploads this month</p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Feedback */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Recent Feedback
              </h3>
              <Link href="/teacher/feedback">
                <Button variant="ghost" size="sm" className="text-emerald-500">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentFeedback.map((feedback, i) => (
                <Card key={i} className="p-4 border-0 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {feedback.student.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{feedback.student}</p>
                      <p className="text-xs text-muted-foreground truncate">{feedback.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{feedback.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/teacher/upload">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </Link>
              <Link href="/teacher/resources">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Resources
                </Button>
              </Link>
              <Link href="/teacher/feedback">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Feedback
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </TeacherSidebar>
  )
}