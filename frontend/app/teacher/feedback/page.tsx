"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { 
  MessageSquare, CheckCircle, Clock, Send, 
  FileText, ClipboardList, Loader2, User, CornerDownRight, 
  Search, Filter
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Types matching Backend ---
interface Doubt {
  id: number
  student: any // Can be object or string depending on DTO
  contextType: "ASSIGNMENT" | "RESOURCE"
  contextTitle: string
  contextId: number
  question: string
  answer: string | null
  createdAt: string
}

export default function TeacherFeedbackPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState("all") // all, pending, resolved
  const [contextFilter, setContextFilter] = useState("all") // all, ASSIGNMENT, RESOURCE
  const [searchQuery, setSearchQuery] = useState("")

  // Reply Modal State
  const [replyModal, setReplyModal] = useState<{ open: boolean; doubt: Doubt | null }>({
    open: false, doubt: null,
  })
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- 1. Fetch Doubts ---
  const fetchDoubts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://localhost:8080/api/v1/doubts/incoming", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        // Sort by newest first
        const sortedData = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setDoubts(sortedData)
      }
    } catch (error) {
      console.error("Failed to fetch doubts", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoubts()
  }, [])

  // --- 2. Handle Reply ---
  const handleReplySubmit = async () => {
    if (!replyModal.doubt || !replyText.trim()) return
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/doubts/${replyModal.doubt.id}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ answer: replyText })
      })

      if (res.ok) {
        // Optimistic Update
        setDoubts(prev => prev.map(d => 
            d.id === replyModal.doubt!.id ? { ...d, answer: replyText } : d
        ))
        setReplyModal({ open: false, doubt: null })
        setReplyText("")
      } else {
        alert("Failed to send reply.")
      }
    } catch (error) {
      console.error("Error replying:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Helpers ---
  const getStudentName = (student: any) => {
    if (!student) return "Unknown Student"
    if (typeof student === 'string') return student
    return student.fullName || "Student"
  }

  // --- Filtering Logic ---
  const filteredDoubts = useMemo(() => {
    return doubts.filter(d => {
        // 1. Status Filter
        if (statusFilter === "pending" && d.answer) return false
        if (statusFilter === "resolved" && !d.answer) return false

        // 2. Context Filter
        if (contextFilter !== "all" && d.contextType !== contextFilter) return false

        // 3. Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const studentName = getStudentName(d.student).toLowerCase()
            const question = d.question.toLowerCase()
            const title = d.contextTitle ? d.contextTitle.toLowerCase() : ""
            
            return studentName.includes(query) || question.includes(query) || title.includes(query)
        }

        return true
    })
  }, [doubts, statusFilter, contextFilter, searchQuery])

  const pendingCount = doubts.filter(d => !d.answer).length
  const resolvedCount = doubts.filter(d => d.answer).length

  return (
    <TeacherSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Doubts & Feedback</h1>
        <p className="text-muted-foreground">Centralized inbox for student questions from assignments and resources</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-md flex items-center gap-3 bg-card">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending Reply</p>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md flex items-center gap-3 bg-card">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
        </Card>
      </div>

      {/* --- Search & Filters Bar --- */}
      <div className="bg-card p-4 rounded-xl border shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Search by student, question, or title..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <Select value={contextFilter} onValueChange={setContextFilter}>
                <SelectTrigger className="w-[160px]">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Context" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ASSIGNMENT">Assignments</SelectItem>
                    <SelectItem value="RESOURCE">Resources</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* --- Status Tabs --- */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All Doubts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* --- Doubts List --- */}
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-emerald-500"/></div>
        ) : filteredDoubts.length === 0 ? (
           <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed flex flex-col items-center">
             <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
             <p className="text-lg font-medium">No doubts found</p>
             <p className="text-sm">Try adjusting your search or filters</p>
           </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <Card
              key={doubt.id}
              className={`p-5 border-0 shadow-lg transition-all ${
                !doubt.answer ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-emerald-500"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Avatar / Icon */}
                <div className="hidden md:flex flex-col items-center gap-2 pt-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
                        {getStudentName(doubt.student)}
                        {/* Context Badge */}
                        <Badge variant="outline" className={`text-xs font-normal ${
                            doubt.contextType === "ASSIGNMENT" 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                            {doubt.contextType === "ASSIGNMENT" ? <ClipboardList className="w-3 h-3 mr-1"/> : <FileText className="w-3 h-3 mr-1"/>}
                            {doubt.contextType}
                        </Badge>
                        {/* Status Badge (Visible on Mobile mostly) */}
                        {!doubt.answer ? (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Pending</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Resolved</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        Regarding: <span className="text-foreground font-semibold">{doubt.contextTitle}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {new Date(doubt.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="bg-muted/30 p-3 rounded-lg text-sm border mt-2">
                    <p className="whitespace-pre-wrap">{doubt.question}</p>
                  </div>

                  {/* Answer Section */}
                  {doubt.answer ? (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-emerald-200 animate-fade-in">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-1">
                        <CornerDownRight className="w-4 h-4" />
                        Your Reply
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{doubt.answer}</p>
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                        onClick={() => {
                            setReplyText("")
                            setReplyModal({ open: true, doubt })
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* --- REPLY MODAL --- */}
      <Dialog open={replyModal.open} onOpenChange={(open) => setReplyModal({ open, doubt: null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {getStudentName(replyModal.doubt?.student)}</DialogTitle>
            <DialogDescription>
                Answering doubt regarding <strong>{replyModal.doubt?.contextTitle}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground italic border">
              "{replyModal.doubt?.question}"
            </div>
            
            <div className="space-y-2">
                <Textarea
                placeholder="Type your explanation here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="resize-none focus-visible:ring-emerald-500"
                />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyModal({ open: false, doubt: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleReplySubmit}
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isSubmitting || !replyText.trim()}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </TeacherSidebar>
  )
}