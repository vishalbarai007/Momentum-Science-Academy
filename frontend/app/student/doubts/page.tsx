"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { 
  MessageSquare, CheckCircle, Clock, FileText, 
  ClipboardList, Loader2, CornerDownRight, ExternalLink, Search, Filter 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Doubt {
  id: number
  question: string
  answer: string | null
  createdAt: string
  contextType: "ASSIGNMENT" | "RESOURCE"
  contextId: number
  contextTitle: string
}

export default function StudentDoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState("all") // all, pending, resolved
  const [contextFilter, setContextFilter] = useState("all") // all, ASSIGNMENT, RESOURCE
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMyDoubts()
  }, [])

  const fetchMyDoubts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("http://localhost:8080/api/v1/doubts/my-doubts", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        // Sort newest first
        const sortedData = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setDoubts(sortedData)
      }
    } catch (error) {
      console.error("Failed to load doubts", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Filtering Logic ---
  const filteredDoubts = useMemo(() => {
    return doubts.filter(doubt => {
      // 1. Search Query
      const matchesSearch = 
        doubt.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doubt.contextTitle.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 2. Context Filter
      const matchesContext = contextFilter === "all" || doubt.contextType === contextFilter

      // 3. Status Filter
      let matchesStatus = true
      if (statusFilter === "pending") matchesStatus = !doubt.answer
      if (statusFilter === "resolved") matchesStatus = !!doubt.answer
      
      return matchesSearch && matchesContext && matchesStatus
    })
  }, [doubts, searchQuery, contextFilter, statusFilter])

  // --- Helper to link back to context ---
  const getContextLink = (type: string) => {
    if (type === "ASSIGNMENT") return "/student/assignments"
    if (type === "RESOURCE") return "/student/resources"
    return "#"
  }

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Doubts</h1>
        <p className="text-muted-foreground">Track questions you have asked and view teacher replies.</p>
      </div>

      {/* --- Filters & Search Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Search your questions or topics..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Context Dropdown */}
        <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Category" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ASSIGNMENT">Assignments</SelectItem>
                <SelectItem value="RESOURCE">Resources</SelectItem>
            </SelectContent>
        </Select>

        {/* Status Tabs */}
        <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      {/* --- Results --- */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : filteredDoubts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed flex flex-col items-center">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No doubts found</p>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredDoubts.map((doubt) => (
                <Card key={doubt.id} className={`p-5 border-0 shadow-lg transition-all ${doubt.answer ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-orange-500"}`}>
                    <div className="flex flex-col gap-3">
                        
                        {/* Header: Context & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                <Badge variant="outline" className={`flex items-center gap-1 ${doubt.contextType === 'ASSIGNMENT' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                    {doubt.contextType === "ASSIGNMENT" ? <ClipboardList className="w-3 h-3"/> : <FileText className="w-3 h-3"/>}
                                    {doubt.contextType === "ASSIGNMENT" ? "Assignment" : "Resource"}
                                </Badge>
                                <span>on <strong>{doubt.contextTitle}</strong></span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground hidden sm:inline">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                                {doubt.answer ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle className="w-3 h-3 mr-1"/> Resolved</Badge>
                                ) : (
                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
                                )}
                            </div>
                        </div>

                        {/* Question */}
                        <div className="bg-muted/30 p-3 rounded-md border">
                            <p className="font-medium text-base">{doubt.question}</p>
                        </div>

                        {/* Answer Section */}
                        {doubt.answer && (
                            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 mt-1">
                                <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold text-sm">
                                    <CornerDownRight className="w-4 h-4" />
                                    Teacher's Reply
                                </div>
                                <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
                                    {doubt.answer}
                                </p>
                            </div>
                        )}

                        {/* Action: Go to Context */}
                        <div className="flex justify-end mt-1">
                            <Link href={getContextLink(doubt.contextType)}>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2">
                                    View Original Item <ExternalLink className="w-3 h-3 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      )}
    </StudentSidebar>
  )
}