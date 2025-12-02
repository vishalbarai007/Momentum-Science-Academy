"use client"

import { useState } from "react"
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
  Edit,
} from "lucide-react"

const Trophy = Award

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const studentData = {
    name: "Aditya Kumar",
    email: "aditya.kumar@email.com",
    phone: "+91 98765 43210",
    class: "12",
    program: "JEE Advanced",
    enrolledDate: "September 15, 2024",
    studentId: "MSA2024-1234",
    status: "Active",
    avatar: "A",
  }

  const stats = [
    { label: "Study Hours", value: "128 hrs", icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Resources Downloaded", value: "42", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
    { label: "Current Streak", value: "15 days", icon: Flame, color: "from-orange-500 to-red-500" },
    { label: "Avg. Test Score", value: "82%", icon: Target, color: "from-purple-500 to-pink-500" },
  ]

  const achievements = [
    { title: "Top 10 Scorer", description: "Ranked in top 10 in 3 mock tests", icon: Trophy, date: "Dec 2024" },
    { title: "Perfect Attendance", description: "100% attendance this month", icon: Star, date: "Dec 2024" },
    { title: "Quick Learner", description: "Completed 50+ resources", icon: Award, date: "Nov 2024" },
  ]

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
                  <h1 className="text-2xl font-bold">{studentData.name}</h1>
                  <p className="text-muted-foreground">
                    Class {studentData.class} - {studentData.program}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {studentData.status}
                    </span>
                    <span className="text-xs text-muted-foreground">ID: {studentData.studentId}</span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
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
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: studentData.email },
                { icon: Phone, label: "Phone", value: studentData.phone },
                { icon: GraduationCap, label: "Class", value: `Class ${studentData.class}` },
                { icon: BookOpen, label: "Program", value: studentData.program },
                { icon: Calendar, label: "Enrolled", value: studentData.enrolledDate },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
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
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                      >
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

            {/* Subject Performance */}
            <Card className="mt-6 p-6 border-0 shadow-lg">
              <h3 className="font-bold mb-4">Subject Performance</h3>
              <div className="space-y-4">
                {[
                  { subject: "Mathematics", score: 85, tests: 8 },
                  { subject: "Physics", score: 78, tests: 7 },
                  { subject: "Chemistry", score: 72, tests: 6 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.score}% avg ({item.tests} tests)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
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
            {[
              { action: "Downloaded", item: "JEE Main 2024 Paper", time: "2 hours ago" },
              { action: "Completed", item: "Physics Mock Test", time: "Yesterday" },
              { action: "Viewed", item: "Calculus Notes", time: "2 days ago" },
              { action: "Submitted", item: "Chemistry Assignment", time: "3 days ago" },
              { action: "Achieved", item: "Top 10 in Mock Test", time: "1 week ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.action} <span className="text-primary">{activity.item}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </StudentSidebar>
  )
}
