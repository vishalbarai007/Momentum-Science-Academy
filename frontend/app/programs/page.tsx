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
} from "lucide-react"
import { submitEnrollment } from "@/lib/api"

type Program = {
  id: number
  name: string
  tagline: string
  duration: string
  subjects: string[]
  highlights: string[]
  // fee: string
  icon: string
  color: string
  badge?: string
}

const programs: Program[] = [
  {
    id: 1,
    name: "Standard 9-10",
    tagline: "Build Strong Foundations",
    duration: "Ongoing Batches",
    subjects: ["All Subjects", "Mathematics", "Physics"],
    highlights: ["Board Exam Focus", "Concept Building", "Regular Assessments", "Doubt Clearing"],
    // fee: "Starting ₹3,500/month",
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
    // fee: "Starting ₹8,000/month",
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
    // fee: "Starting ₹7,500/month",
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
    // fee: "Starting ₹6,000/month",
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
    // fee: "Starting ₹2,500/month",
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
    // fee: "Starting ₹4,000/month",
    icon: "🏆",
    color: "from-indigo-500 to-purple-500",
  },
]

const faqs = [
  {
    question: "What makes Momentum different from other coaching institutes?",
    answer:
      "Momentum stands apart with our 15+ years of proven results, small batch sizes (max 25 students), personalized attention, and a track record that includes AIR 329 in JEE and 635/720 in NEET. Our faculty includes IITians, doctors, and PhD holders who bring real-world expertise to the classroom.",
  },
  {
    question: "Do you offer online classes?",
    answer:
      "Yes! We offer a hybrid learning model with both offline and online options. Our digital platform includes live interactive classes, recorded lectures for revision, online tests with instant results, and 24/7 doubt resolution support. Students can switch between modes based on their convenience.",
  },
  {
    question: "What is the batch size and timing?",
    answer:
      "We maintain small batch sizes of maximum 20-25 students to ensure personalized attention. Batches are available in morning (7 AM - 10 AM), afternoon (2 PM - 5 PM), and evening (5 PM - 8 PM) slots. Weekend-only batches are also available for school students.",
  },
  {
    question: "Do you provide study materials?",
    answer:
      "Every enrolled student receives comprehensive study packages including topic-wise notes, practice worksheets, previous year question papers (PYQs), important questions compilations, formula sheets, and access to our digital resource library with 1000+ solved examples.",
  },
  {
    question: "What is the fee structure and are there scholarships?",
    answer:
      "Our fees vary by program and are designed to be affordable. We offer up to 100% scholarships based on entrance test performance. EMI options and sibling discounts (10%) are also available. Contact us for a detailed fee breakdown specific to your chosen program.",
  },
  {
    question: "How do I enroll and what's the admission process?",
    answer:
      "Enrollment is simple: 1) Fill the inquiry form or visit our center, 2) Appear for a diagnostic test (free), 3) Counseling session with faculty, 4) Complete registration with documents. You can start attending classes immediately after registration.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we have a transparent refund policy. If you're not satisfied within the first 7 days of joining, you can get a full refund (minus processing charges). After that, pro-rata refunds are available based on the duration attended. Terms apply.",
  },
  {
    question: "What support is available for doubt clearing?",
    answer:
      "We offer multiple doubt-clearing channels: daily doubt sessions after regular classes, dedicated WhatsApp groups monitored by faculty, weekly one-on-one sessions with subject experts, and our online platform's 24/7 query system with response within 4 hours.",
  },
]

export default function ProgramsPage() {
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      await submitEnrollment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        studentClass: formData.class,
        program: selectedProgram?.name, // Pass the selected program name
        message: formData.message,
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
      alert("Failed to submit enrollment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>6 Specialized Programs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Path to{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Success</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive coaching programs tailored for every student's aspirations and academic level
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {programs.map((program) => (
              <Card key={program.id} className="group relative overflow-hidden border-0 shadow-lg hover-lift">
                {program.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-linear-to-r ${program.color}`}
                    >
                      {program.badge}
                    </span>
                  </div>
                )}

                <div className={`h-2 bg-linear-to-r ${program.color}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-linear-to-br ${program.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {program.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground">{program.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {program.duration}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {program.subjects.map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Highlights
                    </h4>
                    <ul className="space-y-1">
                      {program.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Book your</p>
                      <p className="text-lg font-bold text-primary"> Demo lecture </p>
                    </div>
                    <Button
                      onClick={() => handleEnroll(program)}
                      className={`bg-linear-to-r ${program.color} text-white hover:opacity-90 shadow-lg`}
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section with Accordion */}
      <section className="py-20 bg-linear-to-br from-muted/30 to-muted/10" id="#FAQ">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our programs and admission process
            </p>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-0">
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-primary/5">
                    <span className="font-semibold text-base pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-2">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" className="bg-transparent" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnrollModal(false)} />

          <Card className="relative w-full max-w-lg p-0 overflow-hidden animate-scale-in shadow-2xl">
            {selectedProgram && (
              <>
                <div className={`h-2 bg-gradient-to-r ${selectedProgram.color}`} />

                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                  {!isSubmitted ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedProgram.color} flex items-center justify-center text-2xl shadow-lg`}
                        >
                          {selectedProgram.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Enroll in {selectedProgram.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedProgram.tagline}</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Enter your full name"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your@email.com"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Current Class *</label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <select
                              required
                              value={formData.class}
                              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                            >
                              <option value="">Select your class</option>
                              <option value="7">7th Standard</option>
                              <option value="8">8th Standard</option>
                              <option value="9">9th Standard</option>
                              <option value="10">10th Standard</option>
                              <option value="11">11th Standard</option>
                              <option value="12">12th Standard</option>
                              <option value="dropper">Dropper</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message (Optional)</label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Any specific questions or requirements?"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-6 bg-gradient-to-r ${selectedProgram.color} text-white hover:opacity-90 font-medium text-base shadow-lg`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            "Submit Enrollment Request"
                          )}
                        </Button>
                      </form>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Our counselor will contact you within 24 hours to guide you through the admission process.
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your enrollment request for {selectedProgram.name} has been submitted successfully. Our team
                        will contact you within 24 hours.
                      </p>
                      <Button onClick={() => setShowEnrollModal(false)} variant="outline" className="bg-transparent">
                        Close
                      </Button>
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
