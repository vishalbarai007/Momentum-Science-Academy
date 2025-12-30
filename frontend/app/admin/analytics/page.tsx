"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Download, Eye, Target, ArrowUpRight, ArrowDownRight, Calendar, FileText, Loader2, Database, Table as TableIcon } from "lucide-react"
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
import { getSchoolData } from "@/app/actions/sheets"

// --- Configuration ---
const SCHOOLS = [
  "SVM", "Vidyavikasini", "Holy-Family", "J.B.S", "SKC", "St. Joseph-Vasai",
  "Mother Mary - East", "J.B.Ludhani", "Kapol", "Kalindi", "Mother Teresa",
  "St Joseph-Nallasopara", "St Aloysius", "Mother Mary-West"
];

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"]

// --- Types ---
interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalDownloads: number
  totalResources: number
  
  // Lead Stats from DB
  totalDbLeads: number
  dbLeadConversionRate: number
  dbLeadsByStatus: Record<string, number>

  programDistribution: Record<string, number>
  registrationTrends: Record<string, number>
  topResources: { title: string; type: string; downloads: number }[]
}

interface SheetStats {
  totalSheetLeads: number
  sheetConversionRate: number
  enrolledCount: number
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardStats | null>(null)
  const [sheetStats, setSheetStats] = useState<SheetStats>({ totalSheetLeads: 0, sheetConversionRate: 0, enrolledCount: 0 })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      // 1. Fetch Backend Data (DB Leads + System Stats)
      const res = await fetch("http://localhost:8080/api/v1/analytics/dashboard", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }

      // 2. Fetch Google Sheet Data (Parallel Requests)
      // We fetch all schools to calculate total volume
      const sheetPromises = SCHOOLS.map(school => getSchoolData(school))
      const sheetsResults = await Promise.all(sheetPromises)
      
      // 3. Aggregate Sheet Stats
      let totalSheetLeads = 0
      let totalSheetEnrolled = 0

      sheetsResults.flat().forEach((row: any) => {
        if (row.name && row.name !== "-") { // Basic validation
            totalSheetLeads++
            // Check for "Admission Taken" in response column
            if (row.response && row.response.toLowerCase().includes("admission")) {
                totalSheetEnrolled++
            }
        }
      })

      setSheetStats({
        totalSheetLeads,
        enrolledCount: totalSheetEnrolled,
        sheetConversionRate: totalSheetLeads > 0 ? (totalSheetEnrolled / totalSheetLeads) * 100 : 0
      })

    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Chart Data Preparation ---

  // 1. Program Distribution
  const programData = data?.programDistribution 
    ? Object.entries(data.programDistribution).map(([name, value], index) => ({
        name, value, color: COLORS[index % COLORS.length]
      }))
    : []

  // 2. Registration Trends
  const trendData = data?.registrationTrends
    ? Object.entries(data.registrationTrends).map(([month, count]) => ({
        month, students: count
      }))
    : []

  // 3. Top Resources
  const resourceDownloads = data?.topResources.map((r, i) => ({
    name: r.title.length > 15 ? r.title.substring(0, 15) + "..." : r.title,
    downloads: r.downloads,
    color: COLORS[i % COLORS.length]
  })) || []

  // 4. Lead Source Comparison (DB vs Sheets)
  const leadSourceData = [
    { name: "Website", value: data?.totalDbLeads || 0, color: "#3b82f6" }, // Blue
    { name: "Sheets (Offline)", value: sheetStats.totalSheetLeads, color: "#22c55e" } // Green
  ]

  // 5. Conversion Comparison
  const conversionData = [
    { name: "Website", rate: data?.dbLeadConversionRate || 0 },
    { name: "Sheets", rate: parseFloat(sheetStats.sheetConversionRate.toFixed(1)) }
  ]

  // Calculate Global Stats
  const globalTotalLeads = (data?.totalDbLeads || 0) + sheetStats.totalSheetLeads
  const globalEnrolled = (data?.dbLeadsByStatus?.["ENROLLED"] || 0) + sheetStats.enrolledCount
  const globalConversion = globalTotalLeads > 0 ? ((globalEnrolled / globalTotalLeads) * 100).toFixed(1) : "0"

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
            <p className="text-muted-foreground">Comprehensive platform & lead insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={fetchAllData}>
              <Calendar className="w-4 h-4" /> Refresh Data
            </Button>
          </div>
        </div>

        {/* --- SECTION 1: LEAD ANALYTICS --- */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Lead Performance
            </h2>
            
            {/* Lead Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Leads (Global)" 
                    value={globalTotalLeads.toLocaleString()} 
                    icon={Users} 
                    color="bg-indigo-500" 
                />
                <StatCard 
                    title="Website Leads" 
                    value={data?.totalDbLeads.toLocaleString() || "0"} 
                    icon={Database} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Sheet Leads" 
                    value={sheetStats.totalSheetLeads.toLocaleString()} 
                    icon={TableIcon} 
                    color="bg-emerald-500" 
                />
                <StatCard 
                    title="Global Conversion" 
                    value={`${globalConversion}%`} 
                    icon={Target} 
                    color="bg-orange-500" 
                />
            </div>

            {/* Lead Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Lead Source Distribution</h3>
                    <div className="h-64 flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leadSourceData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {leadSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Conversion Rate Comparison (%)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={conversionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                                <Bar dataKey="rate" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Conversion Rate %" label={{ position: 'top' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>

        <div className="h-px bg-border my-8" />

        {/* --- SECTION 2: ACADEMIC & RESOURCE ANALYTICS --- */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Academic Overview
            </h2>

            {/* Academic Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Students" value={data?.totalStudents.toLocaleString() || "0"} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Downloads" value={data?.totalDownloads.toLocaleString() || "0"} icon={Download} color="bg-green-500" />
                <StatCard title="Resources Uploaded" value={data?.totalResources.toLocaleString() || "0"} icon={FileText} color="bg-purple-500" />
                <StatCard title="Registered Teachers" value={data?.totalTeachers.toLocaleString() || "0"} icon={Target} color="bg-orange-500" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Registration Trends */}
                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Student Registration Trends</h3>
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
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                                <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="New Students" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Program Distribution */}
                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Program Distribution</h3>
                    <div className="h-80 flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={programData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {programData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Resources */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Top Downloaded Resources</h3>
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

                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-6">Most Popular Files</h3>
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
