"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Instagram, Linkedin, MessageCircle, Sparkles, School, User, AtSign, PhoneCall, BookOpen, MessageSquare, Youtube } from "lucide-react"
import { Navbar } from "@/components/public/navbar"
import { submitContactForm } from "@/lib/api"
import { appendLeadToSheet } from "@/app/actions/sheets"
import { toast } from "sonner"
import { Footer } from "@/components/public/footer"
import Link from "next/link"

const SCHOOL_OPTIONS = [
  " ", "SVM", "Vidyavikasini", "Holy-Family", "J.B.S", "SKC", "St. Joseph-Vasai",
  "Mother Mary - East", "J.B.Ludhani", "Kapol", "Kalindi", "Mother Teresa",
  "St Joseph-Nallasopara", "St Aloysius", "Mother Mary-West", "Others"
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: SCHOOL_OPTIONS[0],
    program: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        message: formData.message
      })

      await appendLeadToSheet(formData.school, formData.name, formData.phone)

      setSubmitted(true)
      toast.success("Enquiry submitted successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Rashmi Divya Complex 6, Vasai East",
      subtext: "Near Agarwal Circle, next to Galaxy Hotel",
      link: "https://maps.google.com",
      colorClass: "text-secondary",
      bgClass: "bg-secondary/10",
      borderClass: "border-secondary/20",
      gradient: "from-secondary/5 to-secondary/10"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 9823788328",
      subtext: "Mon-Sat: 9AM-9PM",
      link: "tel:+919823788328",
      colorClass: "text-accent",
      bgClass: "bg-accent/10",
      borderClass: "border-accent/20",
      gradient: "from-accent/5 to-accent/10"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "momentumscienceacademy",
      subtext: "We reply within 24 hours",
      link: "mailto:momentumscienceacademy@gmail.com",
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/20",
      gradient: "from-primary/5 to-primary/10"
    },
  ]

  const officeHours = [
    { day: "Monday - Saturday", time: "9:00 AM - 9:00 PM" },
    { day: "Sunday", time: "9:00 AM - 7:00 PM" },
  ]

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/momentumscienceacademy", colorClass: "text-pink-600 bg-pink-100 dark:bg-pink-900/20" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/momentum-science-academy-0279aa3a8/", colorClass: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
    { icon: Youtube, label: "Youtube", href: "https://youtube.com/@momentum-science-academy?si=m0DYGXH-pipFUiOh", colorClass: "text-red-600 bg-red-100 dark:bg-red-900/20" },

  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">We're Here to Help</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Get in <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about our programs? Our team is ready to guide you towards academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              return (
                <a key={i} href={info.link} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className={`p-8 h-full border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${info.gradient} relative overflow-hidden backdrop-blur-sm`}>
                    <div className="relative">
                      <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${info.bgClass}`}>
                        <Icon className={`w-8 h-8 ${info.colorClass}`} />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-foreground">{info.title}</h3>
                      <p className="text-foreground/80 font-medium mb-1 break-words">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.subtext}</p>
                    </div>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="p-8 md:p-10 border-0 shadow-2xl bg-card relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {submitted ? (
                  <div className="text-center py-16 relative animate-scale-in">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 text-foreground">Message Sent Successfully!</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-6 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Send us a Message</h2>
                        </div>
                      </div>
                      <p className="text-muted-foreground ml-15">Fill out the form below and we'll respond as soon as possible.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Name Input */}
                        <div className="space-y-2 group">
                          <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Full Name *
                          </label>
                          <div className="relative">
                            <Input
                              required
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              className={`h-12 bg-background pl-4 transition-all duration-300 ${focusedField === 'name' ? 'ring-2 ring-primary/50 border-primary' : ''
                                }`}
                            />
                            <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-100' : 'opacity-0'
                              }`} />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2 group">
                          <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                            <AtSign className="w-4 h-4 text-primary" />
                            Email Address *
                          </label>
                          <div className="relative">
                            <Input
                              required
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              className={`h-12 bg-background pl-4 transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-primary/50 border-primary' : ''
                                }`}
                            />
                            <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : 'opacity-0'
                              }`} />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Phone Input */}
                        <div className="space-y-2 group">
                          <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-primary" />
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Input
                              required
                              type="tel"
                              placeholder="+91 98237 88328"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              className={`h-12 bg-background pl-4 transition-all duration-300 ${focusedField === 'phone' ? 'ring-2 ring-primary/50 border-primary' : ''
                                }`}
                            />
                            <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'phone' ? 'opacity-100' : 'opacity-0'
                              }`} />
                          </div>
                        </div>

                        {/* School Select */}
                        <div className="space-y-2 group">
                          <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                            <School className="w-4 h-4 text-primary" />
                            Select Your School *
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={formData.school}
                              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                              onFocus={() => setFocusedField('school')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full h-12 px-4 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 bg-background text-foreground transition-all duration-300 ${focusedField === 'school' ? 'ring-2 ring-primary/50 border-primary' : ''
                                }`}
                            >
                              {SCHOOL_OPTIONS.map((school) => (
                                <option key={school} value={school}>{school}</option>
                              ))}
                            </select>
                            <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'school' ? 'opacity-100' : 'opacity-0'
                              }`} />
                          </div>
                        </div>
                      </div>

                      {/* Program Select */}
                      <div className="space-y-2 group">
                        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          Program of Interest
                        </label>
                        <div className="relative">
                          <select
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            onFocus={() => setFocusedField('program')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full h-12 px-4 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 bg-background text-foreground transition-all duration-300 ${focusedField === 'program' ? 'ring-2 ring-primary/50 border-primary' : ''
                              }`}
                          >
                            <option value="">Select a program</option>
                            <option value="9th-10th">9th-10th Foundation</option>
                            <option value="jee">JEE Preparation</option>
                            <option value="neet">NEET Preparation</option>
                            <option value="mht-cet">MHT-CET</option>
                          </select>
                          <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'program' ? 'opacity-100' : 'opacity-0'
                            }`} />
                        </div>
                      </div>

                      {/* Message Textarea */}
                      <div className="space-y-2 group">
                        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          Your Message *
                        </label>
                        <div className="relative">
                          <Textarea
                            required
                            rows={6}
                            placeholder="Tell us about your goals and how we can help you achieve them..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            className={`bg-background resize-none transition-all duration-300 ${focusedField === 'message' ? 'ring-2 ring-primary/50 border-primary' : ''
                              }`}
                          />
                          <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'message' ? 'opacity-100' : 'opacity-0'
                            }`} />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-[position:100%] text-primary-foreground shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        disabled={isSubmitting}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              Send Message
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </Button>

                      {/* Trust Indicators */}
                      <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Quick Response</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Secure & Private</span>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-0 shadow-xl bg-card relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Office Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {officeHours.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-3 px-4 rounded-lg bg-gradient-to-r from-background to-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                        <span className="text-muted-foreground font-medium">{item.day}</span>
                        <span className="font-bold text-secondary">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl bg-card relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <h3 className="text-xl font-bold mb-5 text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Connect With Us
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, i) => {
                      const Icon = social.icon
                      return (
                        <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="group/social flex-1">
                          <div className={`h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 ${social.colorClass}`}>
                            <Icon className="w-6 h-6 group-hover/social:scale-110 transition-transform" />
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}