"use client"
import { useState, useRef } from "react"
import Hero from "../../public/Infrastructure/Classroom.jpeg"
import whychooseus from "../../public/whychooseus.png"
import Link from "next/link"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  GraduationCap,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Award,
  Clock,
  Zap,
} from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/home/Testimonials'))
const Program = dynamic(() => import('@/components/home/Program'))
const FacultyPreview = dynamic(() => import('@/components/home/FacultyPreview'))



export function LandingPage() {
  const [showInquiry, setShowInquiry] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* <CircleCursor /> */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 3000+ Students</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Empowering Future{" "}
                <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                  Engineers
                </span>
                <br />& Doctors
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Master JEE, NEET, MHT-CET & Board Exams with India's most trusted coaching academy. 9+ years of
                excellence, proven results, personalized learning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                  onClick={() => setShowInquiry(true)}
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Link href="/programs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 hover:bg-primary/5 text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Explore Programs
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Trophy, label: "AIR 329 JEE" },
                  { icon: Star, label: "624/720 NEET" },
                  { icon: Award, label: "95% Pass Rate" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-5 h-5 text-accent" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <Card className="p-8 shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-accent to-accent/50 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                    <div className="text-center text-accent-foreground">
                      <div className="text-2xl font-bold">9+</div>
                      <div className="text-xs">Years</div>
                    </div>
                  </div>

                  <Image
                    src={Hero}
                    alt="Students at Momentum Academy"
                    className="w-full rounded-xl mb-6"
                  />

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "JEE Toppers", value: "50+" },
                      { label: "NEET Selections", value: "50+" },
                      { label: "Board Toppers", value: "200+" },
                      { label: "Board Toppers", value: "100+" },

                    ].map((stat, i) => (
                      <div key={i} className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="text-xl font-bold text-primary">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 bg-linear-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden"
      >
        <StatsSection />
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background">
        <Program />
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-linear-to-br from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                <span>Why Momentum</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Momentum <span className="text-primary">Advantage</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                What sets us apart is our unwavering commitment to every student's success through personalized
                attention, expert guidance, and proven methodologies.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Expert Faculty", desc: "Engineers, PhDs, and industry experts with 15+ years experience" },
                  { title: "Small Batches", desc: "Maximum 25 students ensuring personalized attention" },
                  { title: "Proven Results", desc: "AIR 329 JEE, 624/720 NEET, 95% pass rate" },
                  { title: "Comprehensive Resources", desc: "Notes, PYQs, mock tests, and 24/7 doubt support" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-card transition-colors">
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src={whychooseus}
                alt="Momentum Academy Classroom"
                className="rounded-2xl shadow-2xl"
              />
              <Card className="absolute -bottom-8 -left-8 p-6 shadow-xl border-0 bg-card/95 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Students Ranked JEE/NEET/MHT-CET</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FacultyPreview />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <Testimonials />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Card className="p-8 md:p-16 border-0 shadow-2xl bg-linear-to-br from-muted/50 to-muted/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your <span className="text-primary">Success Journey?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of successful students who transformed their academic careers with Momentum. Take the
                  first step towards your dream college today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-xl"
                    onClick={() => setShowInquiry(true)}
                  >
                    Book Free Counseling
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, title: "Visit Us", desc: "Rashmi Divya Complex 6, Vasai East", link: "https://maps.app.goo.gl/DgU3Za7P7pxjF8oZA" },
                  { icon: Phone, title: "Call Us", desc: "+91 98237 88328", link: "tel:+919823788328" },
                  { icon: Mail, title: "Email Us", desc: "momentumscienceacademy@gmail.com", link: "mailto:momentumscienceacademy@gmail.com" },
                  { icon: Clock, title: "Timings", desc: "Mon-Sat: 9AM - 9PM", link: "#" },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Card key={i} className="p-4 border-0 shadow-lg hover-lift">
                      <Link href={item.link}>
                        <Icon className="w-6 h-6 text-primary mb-2" />
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-muted-foreground text-xs">{item.desc}</p>
                      </Link>
                    </Card>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInquiry(false)} />

          <Card className="relative w-full max-w-lg p-8 animate-scale-in shadow-2xl border-0">
            <button
              onClick={() => setShowInquiry(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Get in Touch</h3>
              <p className="text-muted-foreground">We'll help you find the perfect program</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interested Program</label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Select a program</option>
                  <option>JEE Main & Advanced</option>
                  <option>NEET Preparation</option>
                  <option>MHT-CET Prep</option>
                  <option>Standard 9-10</option>
                  <option>Foundation (7-8)</option>
                </select>
              </div>
              <Button className="w-full py-6 bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-lg">
                Submit Inquiry
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
