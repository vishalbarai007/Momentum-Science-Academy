"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Search,
  User,
  ExternalLink,
  GraduationCap
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Submission {
  id: number
  studentName: string
  assignmentTitle: string
  submissionDate: string
  fileLink: string
  status: "pending" | "graded"
  score?: string
}

export default function TeacherSubmissionsPage() {
  // Mock Data - In real app, fetch this from API
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      studentName: "Aditya Kumar",
      assignmentTitle: "Calculus Problem Set 1",
      submissionDate: "2024-03-10",
      fileLink: "https://drive.google.com/file/d/sample1",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Priya Singh",
      assignmentTitle: "Physics Mechanics Drill",
      submissionDate: "2024-03-09",
      fileLink: "https://drive.google.com/file/d/sample2",
      status: "graded",
      score: "45/50",
    },
    {
      id: 3,
      studentName: "Rahul Sharma",
      assignmentTitle: "Calculus Problem Set 1",
      submissionDate: "2024-03-11",
      fileLink: "https://drive.google.com/file/d/sample3",
      status: "pending",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [gradeModal, setGradeModal] = useState<{ open: boolean; submission: Submission | null }>({
    open: false,
    submission: null,
  })
  const [scoreInput, setScoreInput] = useState("")

  const handleGradeSubmit = () => {
    if (gradeModal.submission) {
      setSubmissions(prev => prev.map(sub => 
        sub.id === gradeModal.submission!.id 
          ? { ...sub, status: "graded", score: scoreInput } 
          : sub
      ))
      setGradeModal({ open: false, submission: null })
      setScoreInput("")
    }
  }

  const filteredSubmissions = submissions.filter(sub => 
    sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingCount = submissions.filter(s => s.status === "pending").length

  return (
    <TeacherSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Student Submissions</h1>
        <p className="text-muted-foreground">Review and grade assignments submitted by students</p>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-4 flex-1">
          <Card className="flex-1 p-4 border-0 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </Card>
          <Card className="flex-1 p-4 border-0 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions.length - pendingCount}</p>
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
          </Card>
        </div>
        
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search student or assignment..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
           <div className="text-center py-12 text-muted-foreground">No submissions found.</div>
        ) : (
          filteredSubmissions.map((sub) => (
            <Card key={sub.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Info Section */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{sub.studentName}</h3>
                    <p className="text-muted-foreground">{sub.assignmentTitle}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                       <span className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1">
                         <Clock className="w-3 h-3" /> Submitted: {sub.submissionDate}
                       </span>
                       {sub.status === "graded" ? (
                         <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                           Score: {sub.score}
                         </span>
                       ) : (
                         <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                           Pending Review
                         </span>
                       )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href={sub.fileLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View File
                    </a>
                  </Button>
                  
                  {sub.status === "pending" ? (
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => setGradeModal({ open: true, submission: sub })}
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Grade
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        setScoreInput(sub.score || "")
                        setGradeModal({ open: true, submission: sub })
                      }}
                    >
                      Edit Grade
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          ))
        )}
      </div>

      {/* Grading Modal */}
      <Dialog open={gradeModal.open} onOpenChange={(open) => setGradeModal({ open, submission: null })}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Student</p>
                <p className="font-semibold">{gradeModal.submission?.studentName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Assignment</p>
                <p>{gradeModal.submission?.assignmentTitle}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">Score / Grade</Label>
              <Input 
                id="score"
                placeholder="e.g. 45/50 or A+" 
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeModal({ open: false, submission: null })}>
                Cancel
            </Button>
            <Button onClick={handleGradeSubmit} className="bg-emerald-500 hover:bg-emerald-600">
                Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </TeacherSidebar>
  )
}