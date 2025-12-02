"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Download, Clock, CheckCircle, AlertCircle, Calendar, FileText, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function StudentAssignmentsPage() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; assignment: (typeof assignments)[0] | null }>({
    open: false,
    assignment: null,
  })
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const assignments = [
    {
      id: 1,
      title: "Calculus - Integration Practice Set 1",
      subject: "Mathematics",
      teacher: "Prof. R.P. Singh",
      dueDate: "Dec 18, 2024",
      status: "pending",
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Thermodynamics Problem Set",
      subject: "Physics",
      teacher: "Prof. Anil Kumar",
      dueDate: "Dec 20, 2024",
      status: "pending",
      difficulty: "Hard",
    },
    {
      id: 3,
      title: "Organic Chemistry Reactions - Week 3",
      subject: "Chemistry",
      teacher: "Dr. Seema Verma",
      dueDate: "Dec 15, 2024",
      status: "submitted",
      difficulty: "Medium",
    },
    {
      id: 4,
      title: "Trigonometry Basic Problems",
      subject: "Mathematics",
      teacher: "Prof. Rajesh Gupta",
      dueDate: "Dec 10, 2024",
      status: "completed",
      score: "45/50",
      difficulty: "Easy",
    },
    {
      id: 5,
      title: "Biology NEET Practice Questions",
      subject: "Biology",
      teacher: "Ms. Priya Nair",
      dueDate: "Dec 22, 2024",
      status: "pending",
      difficulty: "Hard",
    },
  ]

  const handleDownload = async (id: number, title: string) => {
    setDownloadingId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const blob = new Blob([`Assignment: ${title}`], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  const handleFeedbackSubmit = () => {
    // In real app, send to backend
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackModal({ open: false, assignment: null })
      setFeedbackText("")
      setFeedbackSubmitted(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "submitted":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700"
      case "submitted":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const pendingCount = assignments.filter((a) => a.status === "pending").length
  const completedCount = assignments.filter((a) => a.status === "completed").length

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">View and download your assignments</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
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
                    <span>-</span>
                    <span>{assignment.teacher}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)} capitalize flex items-center gap-1`}
                    >
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {assignment.dueDate}
                    </span>
                    {assignment.score && (
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        Score: {assignment.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-16 md:ml-0">
                <Button variant="outline" size="sm" onClick={() => setFeedbackModal({ open: true, assignment })}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Feedback
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleDownload(assignment.id, assignment.title)}
                  disabled={downloadingId === assignment.id}
                >
                  {downloadingId === assignment.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Feedback Modal */}
      <Dialog open={feedbackModal.open} onOpenChange={(open) => setFeedbackModal({ open, assignment: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          {feedbackSubmitted ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <p className="font-semibold text-lg">Feedback Submitted!</p>
              <p className="text-muted-foreground">Your teacher will review it soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Assignment: <span className="font-medium text-foreground">{feedbackModal.assignment?.title}</span>
              </p>
              <Textarea
                placeholder="Describe any issues or questions you have about this assignment..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFeedbackModal({ open: false, assignment: null })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleFeedbackSubmit} className="flex-1" disabled={!feedbackText.trim()}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StudentSidebar>
  )
}
