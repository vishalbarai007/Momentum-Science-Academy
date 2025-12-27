"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  X,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  Phone,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  School,
} from "lucide-react"
import { submitEnrollment } from "@/lib/api"
import { appendLeadToSheet } from "@/app/actions/sheets"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

type Program = {
  id: number
  name: string
  tagline: string
  duration: string
  subjects: string[]
  highlights: string[]
  icon: string
  color: string
  badge?: string
}

const SCHOOL_OPTIONS = [
  "SVM", "Vidyavikasini", "Holy-Family", "J.B.S", "SKC", "St. Joseph-Vasai",
  "Mother Mary - East", "J.B.Ludhani", "Kapol", "Kalindi", "Mother Teresa",
  "St Joseph-Nallasopara", "St Aloysius", "Mother Mary-West"
];

const programs: Program[] = [
  {
    id: 1,
    name: "Standard 9-10",
    tagline: "Build Strong Foundations",
    duration: "Ongoing Batches",
    subjects: ["All Subjects", "Mathematics", "Physics"],
    highlights: ["Board Exam Focus", "Concept Building", "Regular Assessments", "Doubt Clearing"],
    icon: "📚",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "JEE Main & Advanced",
    tagline: "Your IIT Dream Starts Here",
    duration: "2 Year Program",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    highlights: ["Expert Faculty", "Daily Practice Problems", "AIR 329 Track Record", "Mock Tests"],
    icon: "🎯",
    color: "from-orange-500 to-red-500",
    badge: "Most Popular",
  },
  {
    id: 3,
    name: "NEET Preparation",
    tagline: "Become a Doctor",
    duration: "2 Year Program",
    subjects: ["Physics", "Chemistry", "Biology"],
    highlights: ["624/720 Achievers", "NCERT+ Advanced", "Weekly Tests", "Personalized Mentoring"],
    icon: "🏥",
    color: "from-emerald-500 to-teal-500",
    badge: "High Success Rate",
  },
  {
    id: 4,
    name: "MHT-CET Prep",
    tagline: "Maharashtra's Top Colleges",
    duration: "1 Year Intensive",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    highlights: ["190/200 Score", "State Board Focus", "CET Pattern Practice", "Time Management"],
    icon: "📊",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    name: "Foundation (7-8)",
    tagline: "Early Start Advantage",
    duration: "Ongoing Program",
    subjects: ["All Subjects", "Mathematics", "Science", "Olympiad Prep"],
    highlights: ["Olympiad Training", "Strong Base Building", "Interactive Learning", "Fun Science"],
    icon: "⭐",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 6,
    name: "ICSE/CBSE Board",
    tagline: "Board Exam Excellence",
    duration: "Ongoing Batches",
    subjects: ["All Subjects", "Sciences", "Mathematics", "English"],
    highlights: ["100% Pass Rate", "Topper Strategy", "Board Pattern Focus", "Previous Year Solving"],
    icon: "🏆",
    color: "from-indigo-500 to-purple-500",
  },
]

const faqs = [
  {
    question: "What makes Momentum different from other coaching institutes?",
    answer: "Momentum stands apart with our 15+ years of proven results, small batch sizes (max 25 students), personalized attention, and a track record that includes AIR 329 in JEE and 635/720 in NEET.",
  },
  {
    question: "Do you offer study materials?",
    answer: "Every enrolled student receives comprehensive study packages including topic-wise notes, practice worksheets, and previous year question papers.",
  },
]

export default function ProgramsPage() {
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: SCHOOL_OPTIONS[0],
    class: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEnroll = (program: Program) => {
    setSelectedProgram(program)
    setShowEnrollModal(true)
    setIsSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Submit to Database
      await submitEnrollment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        studentClass: formData.class,
        program: selectedProgram?.name,
        message: formData.message,
      })

      // 2. Append to specific Google Sheet
      await appendLeadToSheet(formData.school, formData.name, formData.phone)

      setIsSubmitted(true)
      toast.success("Enrollment request sent!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit enrollment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>6 Specialized Programs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Path to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Success</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive coaching programs tailored for every student's aspirations
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="group relative overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1">
                {program.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${program.color}`}>
                      {program.badge}
                    </span>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {program.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground">{program.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-lg font-bold text-primary"> Demo lecture </p>
                    <Button
                      onClick={() => handleEnroll(program)}
                      className={`bg-gradient-to-r ${program.color} text-white shadow-lg`}
                    >
                      Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="FAQ" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <Card className="border-0 shadow-xl text-left">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-6 border-b last:border-0">
                  <AccordionTrigger className="font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnrollModal(false)} />
          <Card className="relative w-full max-w-lg p-0 overflow-hidden shadow-2xl bg-card">
            {selectedProgram && (
              <>
                <div className={`h-2 bg-gradient-to-r ${selectedProgram.color}`} />
                <button onClick={() => setShowEnrollModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10">
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-xl font-bold mb-4">Enroll in {selectedProgram.name}</h3>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Mobile Number *</label>
                          <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Mobile" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <School className="w-4 h-4 text-primary" /> School *
                          </label>
                          <select
                            required
                            className="w-full h-10 px-3 border rounded-md bg-background"
                            value={formData.school}
                            onChange={(e) => setFormData({...formData, school: e.target.value})}
                          >
                            {SCHOOL_OPTIONS.map(school => <option key={school} value={school}>{school}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Class *</label>
                        <select
                            required
                            className="w-full h-10 px-3 border rounded-md bg-background"
                            value={formData.class}
                            onChange={(e) => setFormData({...formData, class: e.target.value})}
                        >
                            <option value="">Select Class</option>
                            <option value="9">9th Standard</option>
                            <option value="10">10th Standard</option>
                            <option value="11">11th Standard</option>
                            <option value="12">12th Standard</option>
                        </select>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className={`w-full py-6 bg-gradient-to-r ${selectedProgram.color} text-white`}>
                        {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">Request Submitted!</h3>
                      <p className="text-muted-foreground mt-2 mb-6">We will contact you shortly regarding {selectedProgram.name}.</p>
                      <Button onClick={() => setShowEnrollModal(false)}>Close</Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}