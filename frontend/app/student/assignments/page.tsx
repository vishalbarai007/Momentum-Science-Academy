"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import {
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  Send
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Ensure this component exists, or use standard textarea
import { toast } from "sonner" 

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

  // Submit Assignment Modal State
  const [submitModal, setSubmitModal] = useState<{ open: boolean; assignment: Assignment | null }>({
    open: false, assignment: null,
  })
  const [submissionLink, setSubmissionLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Feedback/Doubt Modal State
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; assignment: Assignment | null }>({
    open: false, assignment: null,
  })
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  // Fetch Assignments
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      // Simulated fetch
      setTimeout(() => {
        setAssignments([
          {
            id: 1, title: "Integration Practice Set", subject: "Mathematics", teacher: "Prof. R.P. Singh",
            dueDate: "2024-03-20", status: "Pending", difficulty: "Medium", questionFileUrl: "#"
          },
          {
            id: 2, title: "Organic Chemistry Reactions", subject: "Chemistry", teacher: "Dr. P.V. Shukla",
            dueDate: "2024-03-15", status: "Submitted", difficulty: "Hard", questionFileUrl: "#", score: "Pending"
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to load assignments", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  // Handle Assignment Submission
  const handleSubmitAssignment = async () => {
    if (!submitModal.assignment || !submissionLink) return

    setIsSubmitting(true)
    try {
      // API Call would go here
      await new Promise(resolve => setTimeout(resolve, 1500))

      setAssignments(prev => prev.map(a =>
        a.id === submitModal.assignment!.id ? { ...a, status: "Submitted" } : a
      ))

      setSubmitModal({ open: false, assignment: null })
      setSubmissionLink("")
      alert("Assignment Submitted Successfully!") 
    } catch (error) {
      alert("Error submitting assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Feedback/Doubt Submission
  const handleFeedbackSubmit = async () => {
    if (!feedbackModal.assignment || !feedbackMessage) return

    setIsSubmittingFeedback(true)
    try {
      // API Call to send feedback would go here:
      // await fetch(`http://localhost:8080/api/v1/assignments/${feedbackModal.assignment.id}/feedback`, { ... })

      await new Promise(resolve => setTimeout(resolve, 1500))

      alert(`Feedback sent to ${feedbackModal.assignment.teacher}!`)
      
      setFeedbackModal({ open: false, assignment: null })
      setFeedbackMessage("")
    } catch (error) {
      console.error(error)
      alert("Failed to send feedback")
    } finally {
      setIsSubmittingFeedback(false)
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
        <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
        <p className="text-muted-foreground">Track your tasks, submit work, and ask doubts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">To Do</p>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Submitted</p>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{assignments.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
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
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
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
                    {/* Feedback Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeedbackModal({ open: true, assignment })}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask Doubt
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(assignment.questionFileUrl, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-2" />
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
            <DialogDescription>
              Submit your work for <strong>{submitModal.assignment?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link">Google Drive / Dropbox Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="link"
                  className="pl-9"
                  placeholder="https://drive.google.com/..."
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Ensure the link is accessible (set permission to "Anyone with the link").
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitModal({ open: false, assignment: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAssignment}
              disabled={isSubmitting || !submissionLink}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Work
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback / Doubt Modal */}
      <Dialog open={feedbackModal.open} onOpenChange={(open) => setFeedbackModal({ open, assignment: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback & Doubts</DialogTitle>
            <DialogDescription>
              Message for <strong>{feedbackModal.assignment?.teacher}</strong> regarding <strong>{feedbackModal.assignment?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Message</Label>
              <Textarea
                id="feedback"
                placeholder="Ask a doubt or share your feedback about this assignment..."
                rows={4}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModal({ open: false, assignment: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleFeedbackSubmit}
              disabled={isSubmittingFeedback || !feedbackMessage.trim()}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isSubmittingFeedback ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </StudentSidebar>
  )
}