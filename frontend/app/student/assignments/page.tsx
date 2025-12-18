"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Download, Clock, CheckCircle, AlertCircle, Calendar, FileText, MessageSquare, Loader2, Upload, Link as LinkIcon, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Interface matching the new Backend DTO
interface Assignment {
  id: number
  title: string
  subject: string
  teacher: string
  dueDate: string
  status: string // "Pending", "Missing", "Submitted", "Late", "Graded"
  difficulty: string
  questionFileUrl: string
  submissionFileUrl?: string
  score?: string
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  
  // States for Modals
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; assignment: Assignment | null }>({
    open: false, assignment: null,
  })
  
  const [submitModal, setSubmitModal] = useState<{ open: boolean; assignment: Assignment | null }>({
    open: false, assignment: null,
  })

  // Form States
  const [submissionLink, setSubmissionLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")

  // --- Fetch Assignments ---
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
    } catch (error) {
      console.error("Failed to load assignments", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  // --- Actions ---

  const handleDownload = (id: number, fileUrl: string) => {
    setDownloadingId(id)
    if (fileUrl && fileUrl.startsWith("http")) {
       setTimeout(() => {
           window.open(fileUrl, "_blank")
           setDownloadingId(null)
       }, 1000)
    } else {
       alert("No valid file link provided by teacher.")
       setDownloadingId(null)
    }
  }

  const handleSubmitAssignment = async () => {
    if (!submitModal.assignment || !submissionLink) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/assignments/${submitModal.assignment.id}/submit`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ fileUrl: submissionLink })
      })

      if (res.ok) {
        // Refresh list to show new status
        fetchAssignments()
        setSubmitModal({ open: false, assignment: null })
        setSubmissionLink("")
      } else {
        alert("Failed to submit assignment")
      }
    } catch (error) {
      console.error(error)
      alert("Error submitting assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Helper: Status Styles ---
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
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">View pending tasks and upload your solutions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">To Do</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{assignments.length}</p>
              <p className="text-sm text-muted-foreground">Total Assigned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : assignments.length === 0 ? (
           <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
             No active assignments found.
           </div>
        ) : (
          assignments.map((assignment) => {
            const isSubmittable = ["pending", "missing"].includes(assignment.status.toLowerCase());

            return (
              <Card key={assignment.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.teacher}</span>
                        {assignment.difficulty && (
                            <span className="text-xs border px-1 rounded bg-background">{assignment.difficulty}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)} capitalize flex items-center gap-1`}>
                          {getStatusIcon(assignment.status)}
                          {assignment.status}
                        </span>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {assignment.dueDate}
                        </span>
                        {assignment.score && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                            Score: {assignment.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 ml-16 md:ml-0">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(assignment.id, assignment.questionFileUrl)}
                        disabled={downloadingId === assignment.id}
                    >
                        {downloadingId === assignment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Question
                    </Button>
                    
                    {isSubmittable ? (
                        <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground"
                            onClick={() => setSubmitModal({ open: true, assignment })}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Submit
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submitted
                        </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Submit Assignment Modal */}
      <Dialog open={submitModal.open} onOpenChange={(open) => setSubmitModal({ open, assignment: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
             <div className="text-sm">
                <p className="font-medium">Assignment:</p>
                <p className="text-muted-foreground">{submitModal.assignment?.title}</p>
             </div>
             
             <div className="space-y-2">
                <Label htmlFor="link">Solution Link (Google Drive / Dropbox)</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        id="link" 
                        className="pl-9" 
                        placeholder="https://..." 
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                    />
                </div>
                <p className="text-xs text-muted-foreground">Paste the shareable link to your solution PDF.</p>
             </div>

             <DialogFooter>
                <Button variant="outline" onClick={() => setSubmitModal({ open: false, assignment: null })}>Cancel</Button>
                <Button onClick={handleSubmitAssignment} disabled={isSubmitting || !submissionLink}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                </Button>
             </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
    </StudentSidebar>
  )
}