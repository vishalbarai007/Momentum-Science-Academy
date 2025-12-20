"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import {
  Download, Clock, CheckCircle, AlertCircle, Calendar, FileText, Loader2, Upload,
  Link as LinkIcon, MessageSquare, Send, ExternalLink, Search, Info, Trash2,
  RotateCcw, User, CornerDownRight, GraduationCap
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface Assignment {
  id: number
  title: string
  description?: string
  subject: string
  teacher: string
  dueDate: string
  status: string
  difficulty: string
  questionFileUrl: string
  submissionFileUrl?: string
  score?: string
}

interface Doubt {
  id: number
  question: string
  answer: string | null
  createdAt: string
  contextType: string
  contextId: number
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Modal States
  const [submitModal, setSubmitModal] = useState<{ open: boolean; assignment: Assignment | null }>({ open: false, assignment: null })
  const [infoModal, setInfoModal] = useState<{ open: boolean; assignment: Assignment | null }>({ open: false, assignment: null })
  const [revokeModal, setRevokeModal] = useState<{ open: boolean; assignment: Assignment | null }>({ open: false, assignment: null })

  // --- DOUBT MODAL STATE ---
  const [doubtModal, setDoubtModal] = useState<{ open: boolean; assignment: Assignment | null }>({ open: false, assignment: null })
  const [assignmentDoubts, setAssignmentDoubts] = useState<Doubt[]>([])
  const [loadingDoubts, setLoadingDoubts] = useState(false)
  const [doubtMessage, setDoubtMessage] = useState("")
  const [isSendingDoubt, setIsSendingDoubt] = useState(false)
  const [doubtSearch, setDoubtSearch] = useState("")
  const [doubtFilter, setDoubtFilter] = useState("all")

  // Submission States
  const [submissionLink, setSubmissionLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)

  // 1. Fetch Assignments
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await fetch("http://localhost:8080/api/v1/assignments", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAssignments(data)
      }
    } catch (error) { console.error("Failed to load assignments", error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAssignments() }, [])

  // 2. Fetch Doubts Logic
  useEffect(() => {
    if (doubtModal.open && doubtModal.assignment) {
      fetchDoubtsForAssignment(doubtModal.assignment.id)
    } else {
      setAssignmentDoubts([])
      setDoubtMessage("")
      setDoubtSearch("")
      setDoubtFilter("all")
    }
  }, [doubtModal.open, doubtModal.assignment])

  const fetchDoubtsForAssignment = async (assignmentId: number) => {
    setLoadingDoubts(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/v1/doubts/my-doubts", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const allDoubts: Doubt[] = await res.json()
        const filtered = allDoubts.filter(d =>
          d.contextType === "ASSIGNMENT" && d.contextId === assignmentId
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setAssignmentDoubts(filtered)
      }
    } catch (error) { console.error("Failed to load doubts", error) }
    finally { setLoadingDoubts(false) }
  }

  // 3. Submit Doubt
  const handleDoubtSubmit = async () => {
    if (!doubtModal.assignment || !doubtMessage.trim()) return
    setIsSendingDoubt(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/v1/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          contextType: "ASSIGNMENT",
          contextId: doubtModal.assignment.id,
          question: doubtMessage
        })
      })
      if (res.ok) {
        setDoubtMessage("")
        fetchDoubtsForAssignment(doubtModal.assignment.id)
      } else { alert("Failed to send doubt.") }
    } catch (error) { console.error("Error sending doubt:", error) }
    finally { setIsSendingDoubt(false) }
  }

  // --- Filtering Logic ---
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = filterSubject === "all" || assignment.subject === filterSubject
    let matchesStatus = true
    if (filterStatus !== "all") {
      matchesStatus = assignment.status.toLowerCase() === filterStatus.toLowerCase()
    }
    return matchesSearch && matchesSubject && matchesStatus
  })

  const displayedModalDoubts = useMemo(() => {
    return assignmentDoubts.filter(d => {
      const matchesSearch = d.question.toLowerCase().includes(doubtSearch.toLowerCase())
      let matchesStatus = true
      if (doubtFilter === "pending") matchesStatus = !d.answer
      if (doubtFilter === "resolved") matchesStatus = !!d.answer
      return matchesSearch && matchesStatus
    })
  }, [assignmentDoubts, doubtSearch, doubtFilter])

  // --- Actions ---
  const handleSubmitAssignment = async () => {
    if (!submitModal.assignment || !submissionLink) return
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/assignments/${submitModal.assignment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ fileUrl: submissionLink })
      })
      if (res.ok) {
        await fetchAssignments()
        setSubmitModal({ open: false, assignment: null })
        setSubmissionLink("")
        alert("Assignment Submitted Successfully!")
      } else { alert("Failed to submit. Please try again.") }
    } catch (error) { alert("Error submitting assignment") }
    finally { setIsSubmitting(false) }
  }

  const handleRevokeSubmission = async () => {
    if (!revokeModal.assignment) return
    setIsRevoking(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/assignments/${revokeModal.assignment.id}/submit`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        await fetchAssignments()
        setRevokeModal({ open: false, assignment: null })
      } else {
        const err = await res.text()
        alert(`Failed to revoke: ${err}`)
      }
    } catch (error) { alert("Error revoking submission") }
    finally { setIsRevoking(false) }
  }

  const openFile = (url: string) => { if (url) window.open(url, "_blank"); else alert("No file link available.") }

  // Helpers
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />
      case "submitted": return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "late": return <Clock className="w-4 h-4 text-yellow-600" />
      case "graded": return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "missing": return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-orange-100 text-orange-700"
      case "submitted": return "bg-blue-100 text-blue-700"
      case "late": return "bg-yellow-100 text-yellow-700"
      case "graded": return "bg-emerald-100 text-emerald-700"
      case "missing": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const pendingCount = assignments.filter((a) => ["pending", "missing"].includes(a.status.toLowerCase())).length
  const completedCount = assignments.filter((a) => ["submitted", "graded", "late"].includes(a.status.toLowerCase())).length

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
        <p className="text-muted-foreground">Track your tasks, submit work, and view grades</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-orange-500" /></div>
          <div><p className="text-2xl font-bold">{pendingCount}</p><p className="text-sm text-muted-foreground">To Do</p></div>
        </Card>
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Upload className="w-5 h-5 text-blue-500" /></div>
          <div><p className="text-2xl font-bold">{completedCount}</p><p className="text-sm text-muted-foreground">Submitted</p></div>
        </Card>
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
          <div><p className="text-2xl font-bold">{assignments.length}</p><p className="text-sm text-muted-foreground">Total</p></div>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl border shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search assignments..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Biology">Biology</SelectItem></SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Submitted">Submitted</SelectItem><SelectItem value="Graded">Graded</SelectItem><SelectItem value="Missing">Missing</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed flex flex-col items-center">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No assignments found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const isSubmittable = ["pending", "missing"].includes(assignment.status.toLowerCase());
            // Can only revoke if submitted/late and NOT graded
            const isRevokable = ["submitted", "late"].includes(assignment.status.toLowerCase()) && assignment.status.toLowerCase() !== "graded";

            return (
              <Card key={assignment.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{assignment.title}</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => setInfoModal({ open: true, assignment })}><Info className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{assignment.subject}</span><span>•</span><span>{assignment.teacher}</span>
                        {assignment.difficulty && <span className="text-xs border px-1 rounded bg-background">{assignment.difficulty}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)} capitalize flex items-center gap-1`}>{getStatusIcon(assignment.status)}{assignment.status}</span>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {assignment.dueDate}</span>
                        {/* Display Grade in List View */}
                        {assignment.status.toLowerCase() === 'graded' && assignment.score && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> Score: {assignment.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-16 md:ml-0">
                    <Button variant="outline" size="sm" onClick={() => setDoubtModal({ open: true, assignment })}>
                      <MessageSquare className="w-4 h-4 mr-2" /> Doubt
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openFile(assignment.questionFileUrl)}>
                      <Download className="w-4 h-4 mr-2" /> Question
                    </Button>
                    {isSubmittable ? (
                      <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => setSubmitModal({ open: true, assignment })}>
                        <Upload className="w-4 h-4 mr-2" /> Submit
                      </Button>
                    ) : (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => openFile(assignment.submissionFileUrl || "")}><ExternalLink className="w-4 h-4 mr-2" /> View Work</Button>
                        {isRevokable && <Button variant="destructive" size="sm" className="px-2" onClick={() => setRevokeModal({ open: true, assignment })} title="Unsubmit Assignment"><RotateCcw className="w-4 h-4" /></Button>}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* --- INFO MODAL --- */}
      <Dialog open={infoModal.open} onOpenChange={(open) => setInfoModal({ open, assignment: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assignment Details</DialogTitle></DialogHeader>
          {infoModal.assignment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Badge variant="outline">{infoModal.assignment.subject}</Badge><span>•</span><span>{infoModal.assignment.teacher}</span></div>

              {/* Grade Highlight Section (Only if Graded) */}
              {infoModal.assignment.status.toLowerCase() === 'graded' && infoModal.assignment.score && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                    <GraduationCap className="w-4 h-4" /> Final Grade
                  </div>
                  <span className="text-3xl font-extrabold text-emerald-600">{infoModal.assignment.score}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Due Date</span><span className="font-medium">{infoModal.assignment.dueDate}</span></div>
                <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Difficulty</span><span className="font-medium">{infoModal.assignment.difficulty}</span></div>
                <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Status</span><span className="capitalize">{infoModal.assignment.status}</span></div>
                {/* Fallback Score display for compact view if not emphasized above */}
                {!infoModal.assignment.status.toLowerCase().includes('graded') && infoModal.assignment.score && (
                  <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Score</span><span className="font-bold text-emerald-600">{infoModal.assignment.score}</span></div>
                )}
              </div>
              <div className="space-y-1"><Label className="text-muted-foreground">Description</Label><div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap min-h-[100px]">{infoModal.assignment.description || "No description provided."}</div></div>
              <DialogFooter>
                {infoModal.assignment?.submissionFileUrl && (
                  <Button
                    variant="secondary"
                    onClick={() => openFile(infoModal.assignment?.submissionFileUrl || "")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> View My Submission
                  </Button>
                )}
                <Button onClick={() => setInfoModal({ open: false, assignment: null })}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- SUBMIT MODAL --- */}
      <Dialog open={submitModal.open} onOpenChange={(open) => setSubmitModal({ open, assignment: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Submit Assignment</DialogTitle><DialogDescription>Submit work for <strong>{submitModal.assignment?.title}</strong></DialogDescription></DialogHeader>
          <div className="space-y-4 py-4"><div className="space-y-2"><Label htmlFor="link">Google Drive / Dropbox Link</Label><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="link" className="pl-9" placeholder="https://..." value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} /></div><p className="text-xs text-muted-foreground">Ensure link is accessible to anyone.</p></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setSubmitModal({ open: false, assignment: null })}>Cancel</Button><Button onClick={handleSubmitAssignment} disabled={isSubmitting || !submissionLink} className="bg-emerald-500 hover:bg-emerald-600">{isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <><Upload className="w-4 h-4 mr-2" /> Submit Work</>}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- REVOKE MODAL --- */}
      <Dialog open={revokeModal.open} onOpenChange={(open) => setRevokeModal({ open, assignment: null })}>
        <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Unsubmit Assignment</DialogTitle><DialogDescription>Are you sure you want to unsubmit <strong>{revokeModal.assignment?.title}</strong>?<br />This will remove your submission file and mark the assignment as pending.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setRevokeModal({ open: false, assignment: null })}>Cancel</Button><Button onClick={handleRevokeSubmission} disabled={isRevoking} variant="destructive">{isRevoking ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Revoking...</> : "Yes, Unsubmit"}</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* --- UNIFIED DOUBT MODAL --- */}
      <Dialog open={doubtModal.open} onOpenChange={(open) => setDoubtModal({ open, assignment: null })}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader><DialogTitle>Discussion: {doubtModal.assignment?.title}</DialogTitle><DialogDescription>Ask a question or browse previous doubts for this assignment.</DialogDescription></DialogHeader>

          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Ask Doubt */}
            <div className="bg-muted/30 p-4 rounded-xl border space-y-3 shrink-0">
              <Label className="text-sm font-medium">Ask a New Doubt</Label>
              <div className="flex gap-2">
                <Input placeholder="Type your question here..." value={doubtMessage} onChange={(e) => setDoubtMessage(e.target.value)} className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleDoubtSubmit()} />
                <Button onClick={handleDoubtSubmit} disabled={isSendingDoubt || !doubtMessage.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0">{isSendingDoubt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 shrink-0">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search previous questions..." className="pl-9 h-9" value={doubtSearch} onChange={(e) => setDoubtSearch(e.target.value)} /></div>
              <Select value={doubtFilter} onValueChange={setDoubtFilter}><SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select>
            </div>

            {/* List */}
            <ScrollArea className="flex-1 -mr-4 pr-4">
              {loadingDoubts ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : displayedModalDoubts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl"><MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" /><p className="text-sm">No doubts found.</p>{assignmentDoubts.length === 0 && <p className="text-xs">Be the first to ask!</p>}</div>
              ) : (
                <div className="space-y-3 pb-2">
                  {displayedModalDoubts.map(doubt => (
                    <div key={doubt.id} className="border rounded-lg p-3 bg-card text-sm space-y-2">
                      <div className="flex justify-between items-start"><span className="text-xs text-muted-foreground">{new Date(doubt.createdAt).toLocaleDateString()}</span>{doubt.answer ? (<Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>) : (<Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px]"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>)}</div>
                      <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5"><User className="w-3 h-3" /></div><p className="font-medium text-foreground">{doubt.question}</p></div>
                      {doubt.answer && (<div className="ml-9 bg-emerald-50/50 p-2.5 rounded-md border border-emerald-100"><div className="flex items-center gap-1.5 mb-1 text-emerald-700 font-semibold text-xs"><CornerDownRight className="w-3 h-3" /> Teacher's Reply</div><p className="text-emerald-900 leading-relaxed">{doubt.answer}</p></div>)}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <DialogFooter className="mt-2"><Button variant="outline" onClick={() => setDoubtModal({ open: false, assignment: null })}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </StudentSidebar>
  )
}