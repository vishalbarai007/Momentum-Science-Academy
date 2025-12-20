"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { 
  CheckCircle, Clock, FileText, Download, User, ExternalLink, 
  GraduationCap, Loader2, Calendar, ChevronRight, Plus, 
  MoreVertical, Trash2, Edit, Eye, EyeOff, Search, Filter,
  MessageSquare, Send, CornerDownRight
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Types ---
interface Assignment {
  id: number
  title: string
  description: string 
  subject: string
  targetClass: number 
  targetExam?: string
  dueDate: string
  difficulty: string
  fileUrl: string 
  isPublished: boolean 
}

interface Submission {
  id: number
  studentName: string
  studentEmail: string
  submittedAt: string
  fileUrl: string
  status: "Submitted" | "Late" | "Graded" | "Pending"
  grade?: string
  feedback?: string
}

interface Doubt {
  id: number
  student: any 
  question: string
  answer: string | null
  createdAt: string
  contextType: string
  contextId: number
}

export default function TeacherAssignmentsPage() {
  // 1. Data State
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  
  // 2. Selection State
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  // 3. Modal States
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [showDoubtsModal, setShowDoubtsModal] = useState(false)

  // 4. Async Operation States
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // 5. Form States
  const [editFormData, setEditFormData] = useState<any>({})
  const [gradeData, setGradeData] = useState({ id: 0, score: "", feedback: "" })
  const [replyText, setReplyText] = useState("")
  const [replyingId, setReplyingId] = useState<number | null>(null)

  // 6. Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterClass, setFilterClass] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // 7. Submission Filter States
  const [subSearchQuery, setSubSearchQuery] = useState("")
  const [subFilterStatus, setSubFilterStatus] = useState("all")

  // 8. Doubt Filter States
  const [doubtSearch, setDoubtSearch] = useState("")
  const [doubtFilter, setDoubtFilter] = useState("all")

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchAssignments()
    fetchDoubts()
  }, [])

  // Reset doubt filters when modal opens
  useEffect(() => {
    if (showDoubtsModal) {
      setDoubtSearch("")
      setDoubtFilter("all")
    }
  }, [showDoubtsModal])

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("http://localhost:8080/api/v1/assignments/created", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error)
    } finally {
      setLoadingAssignments(false)
    }
  }

  const fetchDoubts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await fetch("http://localhost:8080/api/v1/doubts/incoming", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setDoubts(data)
      }
    } catch (error) {
      console.error("Failed to fetch doubts", error)
    }
  }

  // --- FILTER LOGIC ---
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = filterSubject === "all" || a.subject === filterSubject
    const matchesClass = filterClass === "all" || a.targetClass.toString() === filterClass
    let matchesStatus = true
    if (filterStatus === "published") matchesStatus = a.isPublished === true
    if (filterStatus === "draft") matchesStatus = a.isPublished === false
    return matchesSearch && matchesSubject && matchesClass && matchesStatus
  })

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(subSearchQuery.toLowerCase()) || 
                          s.studentEmail.toLowerCase().includes(subSearchQuery.toLowerCase())
    const matchesStatus = subFilterStatus === "all" || s.status.toLowerCase() === subFilterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStudentName = (student: any) => {
    if (!student) return "Student"
    if (typeof student === 'string') return student
    return student.fullName || "Student"
  }
  
  const getStudentEmail = (student: any) => {
    if (!student) return ""
    return student.email || ""
  }

  const filteredDoubts = useMemo(() => {
    if (!selectedAssignment) return []
    
    // 1. Filter by specific assignment
    let relevantDoubts = doubts
      .filter(d => d.contextType === "ASSIGNMENT" && d.contextId === selectedAssignment.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 2. Apply Search
    if (doubtSearch) {
        relevantDoubts = relevantDoubts.filter(d => 
            getStudentName(d.student).toLowerCase().includes(doubtSearch.toLowerCase()) ||
            d.question.toLowerCase().includes(doubtSearch.toLowerCase())
        )
    }

    // 3. Apply Status Filter
    if (doubtFilter === "pending") {
        relevantDoubts = relevantDoubts.filter(d => !d.answer)
    } else if (doubtFilter === "replied") {
        relevantDoubts = relevantDoubts.filter(d => d.answer)
    }

    return relevantDoubts
  }, [doubts, selectedAssignment, doubtSearch, doubtFilter])

  // --- DOUBT HELPERS ---
  const getAssignmentDoubtsCount = (assignmentId: number) => {
    return doubts.filter(d => d.contextType === "ASSIGNMENT" && d.contextId === assignmentId).length
  }

  // Check if a specific student email exists in the fetched submissions list
  const checkSubmissionStatus = (studentEmail: string) => {
    const hasSubmitted = submissions.some(s => s.studentEmail === studentEmail);
    return hasSubmitted ? (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 ml-2">Submitted</Badge>
    ) : (
        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 ml-2">Not Submitted</Badge>
    );
  }

  // ==========================
  //  ACTIONS
  // ==========================

  const fetchSubmissionsForAssignment = async (assignmentId: number) => {
    setLoadingSubmissions(true)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/assignments/${assignmentId}/submissions`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
            const data = await res.json()
            setSubmissions(data)
        }
    } catch (error) {
        console.error("Failed to fetch submissions", error)
    } finally {
        setLoadingSubmissions(false)
    }
  }

  const handleViewSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSubSearchQuery("")
    setSubFilterStatus("all")
    setShowSubmissionsModal(true)
    fetchSubmissionsForAssignment(assignment.id)
  }

  const handleViewDoubts = async (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setShowDoubtsModal(true)
    fetchSubmissionsForAssignment(assignment.id)
  }

  const handleReplySubmit = async (doubtId: number) => {
    if (!replyText.trim()) return
    setReplyingId(doubtId)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/doubts/${doubtId}/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ answer: replyText })
        })

        if (res.ok) {
            setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, answer: replyText } : d))
            setReplyText("")
        } else {
            alert("Failed to send reply")
        }
    } catch (err) {
        console.error(err)
        alert("Error sending reply")
    } finally {
        setReplyingId(null)
    }
  }

  // --- Other Actions ---
  const handleDelete = async () => {
    if (!selectedAssignment) return
    setIsDeleting(true)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/assignments/${selectedAssignment.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
            setAssignments(prev => prev.filter(a => a.id !== selectedAssignment.id))
            setShowDeleteModal(false)
        } else {
            alert("Failed to delete.")
        }
    } catch (error) {
        console.error("Delete failed", error)
    } finally {
        setIsDeleting(false)
    }
  }

  const openEditModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setEditFormData({
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        classLevel: assignment.targetClass,
        examType: assignment.targetExam || "Not Applicable",
        fileLink: assignment.fileUrl,
        dueDate: assignment.dueDate,
        difficulty: assignment.difficulty,
        visibility: assignment.isPublished ? "publish" : "draft" 
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedAssignment) return
    setIsSaving(true)
    const payload = {
        ...editFormData,
        targetClass: Number(editFormData.classLevel),
        examType: editFormData.examType === "Not Applicable" ? null : editFormData.examType
    }
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/assignments/${selectedAssignment.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            const updated = await res.json()
            setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a))
            setShowEditModal(false)
        } else {
            alert("Failed to update assignment.")
        }
    } catch (error) {
        console.error("Update failed", error)
    } finally {
        setIsSaving(false)
    }
  }

  const handleGradeSubmit = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/assignments/submissions/${gradeData.id}/grade`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            grade: gradeData.score,
            feedback: gradeData.feedback
        })
      })
      if (res.ok) {
        setSubmissions(prev => prev.map(sub => 
            sub.id === gradeData.id 
            ? { ...sub, status: "Graded", grade: gradeData.score, feedback: gradeData.feedback } 
            : sub
        ))
        setShowGradeModal(false)
      }
    } catch (error) {
      console.error("Grading failed", error)
    } finally {
      setIsSaving(false)
    }
  }

  const openFile = (url: string) => { if(url) window.open(url, "_blank") }

  return (
    <TeacherSidebar>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments Manager</h1>
          <p className="text-muted-foreground">Create, manage, and grade student assignments</p>
        </div>
        <Link href="/teacher/assignment">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4 mr-2" /> Create Assignment
          </Button>
        </Link>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-card p-4 rounded-xl border shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search assignments..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Biology">Biology</SelectItem></SelectContent>
            </Select>
            <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-[110px]"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Classes</SelectItem><SelectItem value="9">Class 9</SelectItem><SelectItem value="10">Class 10</SelectItem><SelectItem value="11">Class 11</SelectItem><SelectItem value="12">Class 12</SelectItem></SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[110px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
            </Select>
        </div>
      </div>

      {/* --- ASSIGNMENTS GRID --- */}
      {loadingAssignments ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-emerald-500"/></div>
      ) : filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No assignments found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => {
            const doubtsCount = getAssignmentDoubtsCount(assignment.id);
            return (
            <Card key={assignment.id} className="group relative flex flex-col p-6 hover:shadow-xl transition-all border-border/50 bg-card">
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-background">{assignment.subject}</Badge>
                            <Badge variant={assignment.isPublished ? "default" : "secondary"} className={assignment.isPublished ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}>
                                {assignment.isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Class {assignment.targetClass}</p>
                    </div>
                 </div>
                 
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedAssignment(assignment); setShowInfoModal(true) }}><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(assignment)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => { setSelectedAssignment(assignment); setShowDeleteModal(true) }}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors" title={assignment.title}>{assignment.title}</h3>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Due: {assignment.dueDate}</div>
                <div className="flex items-center gap-2"><span className={`inline-block w-2 h-2 rounded-full ${assignment.isPublished ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>{assignment.difficulty} Difficulty</div>
              </div>

              <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex-1 flex items-center gap-1 ${doubtsCount > 0 ? "text-blue-600 border-blue-200 bg-blue-50" : ""}`}
                    onClick={() => handleViewDoubts(assignment)}
                  >
                    <MessageSquare className="w-4 h-4" /> Doubts
                    {doubtsCount > 0 && <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-1.5">{doubtsCount}</span>}
                  </Button>
                  <Button onClick={() => handleViewSubmissions(assignment)} className="flex-1 justify-between" variant="outline">
                    Submissions <ChevronRight className="w-4 h-4" />
                  </Button>
              </div>
            </Card>
          )})}
        </div>
      )}

      {/* --- INFO MODAL --- */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent>
            <DialogHeader><DialogTitle>Assignment Details</DialogTitle></DialogHeader>
            {selectedAssignment && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-muted-foreground">Subject:</span><p className="font-medium">{selectedAssignment.subject}</p></div>
                        <div><span className="text-muted-foreground">Class:</span><p className="font-medium">{selectedAssignment.targetClass}</p></div>
                        <div><span className="text-muted-foreground">Due Date:</span><p className="font-medium">{selectedAssignment.dueDate}</p></div>
                        <div><span className="text-muted-foreground">Status:</span><Badge className="ml-2" variant={selectedAssignment.isPublished ? "default" : "secondary"}>{selectedAssignment.isPublished ? "Published" : "Draft"}</Badge></div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg text-sm"><span className="text-muted-foreground block mb-1">Description:</span>{selectedAssignment.description}</div>
                    <Button onClick={() => openFile(selectedAssignment.fileUrl)} className="w-full" variant="secondary"><ExternalLink className="w-4 h-4 mr-2" /> Open Question File</Button>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* --- DOUBTS MODAL --- */}
      <Dialog open={showDoubtsModal} onOpenChange={setShowDoubtsModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Doubts: {selectedAssignment?.title}</DialogTitle>
            <DialogDescription>Questions from students regarding this assignment.</DialogDescription>
          </DialogHeader>
          
          {/* Doubts Filter */}
          <div className="flex gap-2 mb-2">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Search doubts..." 
                    className="pl-9 h-9" 
                    value={doubtSearch}
                    onChange={(e) => setDoubtSearch(e.target.value)}
                />
             </div>
             <Select value={doubtFilter} onValueChange={setDoubtFilter}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <ScrollArea className="flex-1 pr-4 -mr-4 mt-2">
            <div className="space-y-6 pb-4">
              {loadingSubmissions ? (
                 <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : filteredDoubts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" /> No doubts matching filters.
                </div>
              ) : (
                filteredDoubts.map((doubt) => (
                  <div key={doubt.id} className="border rounded-xl p-4 bg-card shadow-sm">
                    {/* Student Info */}
                    <div className="flex gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary"><User className="w-4 h-4" /></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{getStudentName(doubt.student)}</span>
                          <span className="text-xs text-muted-foreground">• {new Date(doubt.createdAt).toLocaleDateString()}</span>
                          {/* Submission Status Badge */}
                          {checkSubmissionStatus(getStudentEmail(doubt.student))}
                        </div>
                        <p className="text-sm">{doubt.question}</p>
                      </div>
                    </div>

                    {/* Teacher Reply */}
                    {doubt.answer ? (
                      <div className="ml-11 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1 text-emerald-700 font-medium text-xs"><CornerDownRight className="w-3 h-3" /> You replied:</div>
                        <p className="text-sm text-emerald-900">{doubt.answer}</p>
                      </div>
                    ) : (
                      <div className="ml-11 mt-3">
                        {replyingId === doubt.id ? (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-3 h-3 animate-spin" /> Sending...</div>
                        ) : (
                          <div className="flex gap-2">
                            <Input placeholder="Type your reply here..." className="h-9 text-sm" value={replyingId === null ? replyText : ""} onChange={(e) => setReplyText(e.target.value)} />
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 h-9 px-3" onClick={() => handleReplySubmit(doubt.id)}><Send className="w-3 h-3" /></Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-2"><Button variant="outline" onClick={() => setShowDoubtsModal(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL --- */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Assignment</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Title</Label><Input value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} /></div>
                <div className="grid gap-2"><Label>Visibility Status</Label><Select value={editFormData.visibility} onValueChange={(val) => setEditFormData({...editFormData, visibility: val})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="publish">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label>Subject</Label><Input value={editFormData.subject} onChange={e => setEditFormData({...editFormData, subject: e.target.value})} /></div><div className="grid gap-2"><Label>Class</Label><Input type="number" value={editFormData.classLevel} onChange={e => setEditFormData({...editFormData, classLevel: e.target.value})} /></div></div>
                <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label>Due Date</Label><Input type="date" value={editFormData.dueDate} onChange={e => setEditFormData({...editFormData, dueDate: e.target.value})} /></div><div className="grid gap-2"><Label>Difficulty</Label><select className="flex h-10 w-full rounded-md border border-input px-3 text-sm" value={editFormData.difficulty} onChange={e => setEditFormData({...editFormData, difficulty: e.target.value})}><option>Easy</option><option>Medium</option><option>Hard</option></select></div></div>
                <div className="grid gap-2"><Label>Description</Label><Textarea value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
                <div className="grid gap-2"><Label>File Link</Label><Input value={editFormData.fileLink} onChange={e => setEditFormData({...editFormData, fileLink: e.target.value})} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button><Button onClick={handleEditSubmit} disabled={isSaving}>{isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE MODAL --- */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent><DialogHeader><DialogTitle>Delete Assignment</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* --- SUBMISSIONS MODAL --- */}
      <Dialog open={showSubmissionsModal} onOpenChange={setShowSubmissionsModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Submissions: {selectedAssignment?.title}</DialogTitle></DialogHeader>
          <div className="flex gap-2 my-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search student..." className="pl-9 h-9" value={subSearchQuery} onChange={(e) => setSubSearchQuery(e.target.value)} /></div><Select value={subFilterStatus} onValueChange={setSubFilterStatus}><SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="graded">Graded</SelectItem><SelectItem value="late">Late</SelectItem></SelectContent></Select></div>
          <div className="space-y-4 mt-2">
            {loadingSubmissions ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin w-6 h-6 text-emerald-500"/></div>
            ) : filteredSubmissions.length === 0 ? (
               <div className="text-center py-10 text-muted-foreground">No submissions found.</div>
            ) : (
               filteredSubmissions.map((sub) => (
                 <Card key={sub.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-primary" /></div>
                       <div><p className="font-bold">{sub.studentName}</p><p className="text-xs text-muted-foreground">{sub.studentEmail}</p><div className="flex gap-2 mt-1"><span className="text-xs flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {sub.submittedAt}</span>{sub.status === "Graded" ? (<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 rounded">Score: {sub.grade}</span>) : (<Badge variant="secondary" className="text-[10px] h-5">{sub.status}</Badge>)}</div></div>
                    </div>
                    <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => openFile(sub.fileUrl)}><ExternalLink className="w-4 h-4 mr-2" /> File</Button><Button size="sm" variant={sub.status === "Graded" ? "secondary" : "default"} onClick={() => { setGradeData({ id: sub.id, score: sub.grade || "", feedback: sub.feedback || "" }); setShowGradeModal(true) }}><GraduationCap className="w-4 h-4 mr-2" />{sub.status === "Graded" ? "Edit Grade" : "Grade"}</Button></div>
                 </Card>
               ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- GRADING MODAL --- */}
      <Dialog open={showGradeModal} onOpenChange={setShowGradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Grade Submission</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2"><Label>Score / Grade</Label><Input placeholder="e.g. 45/50" value={gradeData.score} onChange={(e) => setGradeData({...gradeData, score: e.target.value})} /></div>
            <div className="space-y-2"><Label>Feedback</Label><Textarea placeholder="Comments for student..." value={gradeData.feedback} onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowGradeModal(false)}>Cancel</Button><Button onClick={handleGradeSubmit} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Grade"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </TeacherSidebar>
  )
}