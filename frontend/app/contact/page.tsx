"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Plot 123, Vasai East, Mumbai - 401208",
      link: "https://maps.google.com",
    },
    { icon: Phone, title: "Phone", content: "+91 98765 43210", link: "tel:+919876543210" },
    { icon: Mail, title: "Email", content: "contact@momentum.edu", link: "mailto:contact@momentum.edu" },
  ]

  const officeHours = [
    { day: "Monday - Friday", time: "8:00 AM - 6:00 PM" },
    { day: "Saturday", time: "9:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ]

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
            <div className="text-center animate-fade-in">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions? We're here to help. Reach out to us anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon
                return (
                  <a key={i} href={info.link} target="_blank" rel="noopener noreferrer">
                    <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 border-0 shadow-xl">
                {submitted ? (
                  <div className="text-center py-12 animate-scale-in">
                    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input placeholder="Your name" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input type="email" placeholder="your@email.com" required />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <Input type="tel" placeholder="+91" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Program Interested</label>
                          <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option>Select a program</option>
                            <option>9th-10th Foundation</option>
                            <option>JEE Preparation</option>
                            <option>NEET Preparation</option>
                            <option>MHT-CET</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <Textarea rows={5} placeholder="Your message..." required />
                      </div>
                      <Button type="submit" className="w-full py-6" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </Card>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Office Hours */}
                <Card className="p-6 border-0 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Office Hours
                  </h3>
                  <div className="space-y-3">
                    {officeHours.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Social Links */}
                <Card className="p-6 border-0 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social, i) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={i}
                          href={social.href}
                          className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                          aria-label={social.label}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      )
                    })}
                  </div>
                </Card>

                {/* Special Offer */}
                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <h3 className="text-xl font-bold mb-2">Special Offer</h3>
                  <p className="text-muted-foreground mb-4">
                    First-time students get 25% discount on enrollment. Limited time offer!
                  </p>
                  <Button className="w-full">Claim Offer</Button>
                </Card>

                {/* Map */}
                <Card className="overflow-hidden border-0 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.123456789!2d72.8!3d19.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI0JzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all"
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
