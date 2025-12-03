"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { MessageSquare, CheckCircle, Clock, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function TeacherFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      student: "Aditya Kumar",
      message: "The calculus notes were very helpful! Can you add more examples?",
      resource: "Calculus - Complete Notes",
      time: "2 hours ago",
      status: "pending",
      reply: "",
    },
    {
      id: 2,
      student: "Priya Singh",
      message: "I found some errors in question 5 of the assignment. Please check.",
      resource: "Algebra Assignment Set 2",
      time: "Yesterday",
      status: "pending",
      reply: "",
    },
    {
      id: 3,
      student: "Rahul Sharma",
      message: "Great explanation of concepts! Very easy to understand.",
      resource: "Physics - Mechanics Notes",
      time: "2 days ago",
      status: "resolved",
      reply: "Thank you for your feedback!",
    },
    {
      id: 4,
      student: "Neha Patel",
      message: "Can you upload more practice problems for integration?",
      resource: "Calculus - Complete Notes",
      time: "3 days ago",
      status: "pending",
      reply: "",
    },
  ])
  const [replyModal, setReplyModal] = useState<{ open: boolean; feedback: (typeof feedbacks)[0] | null }>({
    open: false,
    feedback: null,
  })
  const [replyText, setReplyText] = useState("")

  const handleReply = () => {
    if (replyModal.feedback && replyText.trim()) {
      setFeedbacks(
        feedbacks.map((f) => (f.id === replyModal.feedback!.id ? { ...f, status: "resolved", reply: replyText } : f)),
      )
      setReplyModal({ open: false, feedback: null })
      setReplyText("")
    }
  }

  const pendingCount = feedbacks.filter((f) => f.status === "pending").length

  return (
    <TeacherSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Student Feedback</h1>
        <p className="text-muted-foreground">View and respond to student questions and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
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
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{feedbacks.length - pendingCount}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card
            key={feedback.id}
            className={`p-5 border-0 shadow-lg ${feedback.status === "pending" ? "border-l-4 border-l-orange-500" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                {feedback.student.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{feedback.student}</h3>
                    <p className="text-sm text-muted-foreground">{feedback.resource}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        feedback.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {feedback.status === "pending" ? "Pending" : "Resolved"}
                    </span>
                    <span className="text-xs text-muted-foreground">{feedback.time}</span>
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground">{feedback.message}</p>

                {feedback.reply && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm font-medium text-emerald-700">Your Reply:</p>
                    <p className="text-sm text-emerald-600">{feedback.reply}</p>
                  </div>
                )}

                {feedback.status === "pending" && (
                  <Button
                    size="sm"
                    className="mt-3 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => setReplyModal({ open: true, feedback })}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      <Dialog open={replyModal.open} onOpenChange={(open) => setReplyModal({ open, feedback: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{replyModal.feedback?.student}</p>
              <p className="text-sm text-muted-foreground">{replyModal.feedback?.message}</p>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReplyModal({ open: false, feedback: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReply}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                disabled={!replyText.trim()}
              >
                <Send className="w-4 h-4 mr-1" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TeacherSidebar>
  )
}
