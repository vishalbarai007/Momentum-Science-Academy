"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Download, Eye, Target, ArrowUpRight, ArrowDownRight, Calendar, FileText, Loader2 } from "lucide-react"
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

// --- Types ---
interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalDownloads: number
  totalResources: number
  programDistribution: Record<string, number>
  registrationTrends: Record<string, number>
  topResources: { title: string; type: string; downloads: number }[]
}

// --- Colors ---
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/v1/analytics/dashboard", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Process Data for Charts ---
  
  // 1. Program Distribution Pie Chart
  const programData = data?.programDistribution 
    ? Object.entries(data.programDistribution).map(([name, value], index) => ({
        name, value, color: COLORS[index % COLORS.length]
      }))
    : []

  // 2. Registration Trends Area Chart
  const trendData = data?.registrationTrends
    ? Object.entries(data.registrationTrends).map(([month, count]) => ({
        month, students: count
      }))
    // Sort months logically if possible, or accept backend order
    : []

  // 3. Resource Types (Derived from logic or hardcoded if not in DTO)
  // Since the backend aggregates only "Total Downloads", we use the Top 5 list for the bar chart
  const resourceDownloads = data?.topResources.map((r, i) => ({
    name: r.title.length > 15 ? r.title.substring(0, 15) + "..." : r.title,
    downloads: r.downloads,
    color: COLORS[i % COLORS.length]
  })) || []

  if (loading) {
    return (
        <AdminSidebar>
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        </AdminSidebar>
    )
  }

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
            <Button variant="outline" className="gap-2 bg-transparent" onClick={fetchAnalytics}>
              <Calendar className="w-4 h-4" /> Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Students" 
            value={data?.totalStudents.toLocaleString() || "0"} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Downloads" 
            value={data?.totalDownloads.toLocaleString() || "0"} 
            icon={Download} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Total Resources" 
            value={data?.totalResources.toLocaleString() || "0"} 
            icon={FileText} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Total Teachers" 
            value={data?.totalTeachers.toLocaleString() || "0"} 
            icon={Target} 
            color="bg-orange-500" 
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Registration Trends */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Registration Trends</h3>
                <p className="text-sm text-muted-foreground">Student registrations over time</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
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
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="New Students" />
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
                    data={programData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {programData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Top Downloaded Resources Chart */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Top Downloads</h3>
                <p className="text-sm text-muted-foreground">Most popular resources</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceDownloads} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                  <Bar dataKey="downloads" radius={[0, 4, 4, 0]}>
                    {resourceDownloads.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Resources List */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Top Resources List</h3>
                <p className="text-sm text-muted-foreground">Highest engagement files</p>
              </div>
            </div>
            <div className="space-y-4">
              {data?.topResources.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No downloads yet.</div>
              ) : (
                data?.topResources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" title={resource.title}>{resource.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-semibold">{resource.downloads}</p>
                        <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
        </div>
    )
}