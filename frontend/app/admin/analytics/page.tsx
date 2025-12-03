"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Download, Eye, Target, ArrowUpRight, ArrowDownRight, Calendar, FileText } from "lucide-react"
import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

const registrationData = [
  { month: "Jan", students: 45, teachers: 2 },
  { month: "Feb", students: 52, teachers: 3 },
  { month: "Mar", students: 61, teachers: 1 },
  { month: "Apr", students: 78, teachers: 4 },
  { month: "May", students: 89, teachers: 2 },
  { month: "Jun", students: 95, teachers: 3 },
  { month: "Jul", students: 110, teachers: 2 },
  { month: "Aug", students: 125, teachers: 5 },
  { month: "Sep", students: 140, teachers: 3 },
  { month: "Oct", students: 155, teachers: 2 },
  { month: "Nov", students: 168, teachers: 4 },
  { month: "Dec", students: 180, teachers: 3 },
]

const resourceDownloads = [
  { name: "PYQs", downloads: 4500, color: "#3b82f6" },
  { name: "Notes", downloads: 3200, color: "#22c55e" },
  { name: "Assignments", downloads: 2800, color: "#f59e0b" },
  { name: "Important", downloads: 1500, color: "#ef4444" },
]

const programDistribution = [
  { name: "JEE", value: 45, color: "#3b82f6" },
  { name: "NEET", value: 35, color: "#22c55e" },
  { name: "MHT-CET", value: 15, color: "#f59e0b" },
  { name: "Boards", value: 5, color: "#8b5cf6" },
]

const pageViews = [
  { page: "Home", views: 12500 },
  { page: "Programs", views: 8200 },
  { page: "Faculty", views: 5400 },
  { page: "Blog", views: 4100 },
  { page: "Contact", views: 3200 },
  { page: "About", views: 2800 },
]

const leadConversion = [
  { week: "W1", leads: 45, converted: 12 },
  { week: "W2", leads: 52, converted: 18 },
  { week: "W3", leads: 38, converted: 14 },
  { week: "W4", leads: 65, converted: 25 },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")

  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Resource Downloads",
      value: "12,045",
      change: "+8.2%",
      trend: "up",
      icon: Download,
      color: "bg-green-500",
    },
    {
      title: "Page Views",
      value: "36,200",
      change: "+15.3%",
      trend: "up",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      title: "Conversion Rate",
      value: "32.5%",
      change: "-2.1%",
      trend: "down",
      icon: Target,
      color: "bg-orange-500",
    },
  ]

  const topResources = [
    { title: "JEE Main 2024 Physics Paper", downloads: 856, type: "PYQ" },
    { title: "Organic Chemistry Complete Notes", downloads: 724, type: "Notes" },
    { title: "NEET Biology Practice Set", downloads: 689, type: "Assignment" },
    { title: "Mathematics Formula Sheet", downloads: 612, type: "Important" },
    { title: "JEE Advanced 2023 Solutions", downloads: 578, type: "PYQ" },
  ]

  return (
    <AdminSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track platform performance and user engagement</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Registration Trends */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Registration Trends</h3>
                <p className="text-sm text-muted-foreground">Monthly student & teacher registrations</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                    name="Students"
                  />
                  <Line type="monotone" dataKey="teachers" stroke="#22c55e" strokeWidth={2} name="Teachers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Program Distribution</h3>
                <p className="text-sm text-muted-foreground">Students by program type</p>
              </div>
            </div>
            <div className="h-80 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {programDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Resource Downloads */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Resource Downloads</h3>
                <p className="text-sm text-muted-foreground">Downloads by resource type</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceDownloads} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="downloads" radius={[0, 4, 4, 0]}>
                    {resourceDownloads.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Conversion */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Lead Conversion</h3>
                <p className="text-sm text-muted-foreground">Weekly leads vs conversions</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadConversion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" fill="#22c55e" name="Converted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Page Views */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Page Views</h3>
                <p className="text-sm text-muted-foreground">Most visited pages</p>
              </div>
            </div>
            <div className="space-y-4">
              {pageViews.map((page, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{page.page}</span>
                      <span className="text-sm text-muted-foreground">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(page.views / pageViews[0].views) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Resources */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Top Downloaded Resources</h3>
                <p className="text-sm text-muted-foreground">Most popular resources</p>
              </div>
            </div>
            <div className="space-y-4">
              {topResources.map((resource, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{resource.title}</p>
                    <p className="text-sm text-muted-foreground">{resource.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{resource.downloads}</p>
                    <p className="text-xs text-muted-foreground">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
