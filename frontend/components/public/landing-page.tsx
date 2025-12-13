"use client"

import { useState, useEffect, useRef } from "react"
import Hero from "../../public/Hero.png"
import whychooseus from "../../public/whychooseus.png"

import Link from "next/link"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle,
  Quote,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react"
import { AnimatedTestimonialsDemo } from "../AnimatedTestimonialsDemo"
import Image from "next/image"
// import CircleCursor from "../ui/CircleCursor"

export function LandingPage() {
  const [showInquiry, setShowInquiry] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [counters, setCounters] = useState({ students: 0, years: 0, rate: 0, rank: 0 })
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  const testimonials = [
    {
      name: "Aditi Sharma",
      achievement: "NEET 2024 - 635/720",
      image: "/indian-female-student-portrait-smiling.jpg",
      quote:
        "Momentum's systematic approach and dedicated faculty helped me achieve my dream of becoming a doctor. The personalized attention made all the difference.",
      college: "AIIMS Delhi",
    },
    {
      name: "Rohan Patel",
      achievement: "JEE Advanced - AIR 329",
      image: "/indian-male-student-portrait-professional.jpg",
      quote:
        "The problem-solving techniques and regular mock tests at Momentum prepared me perfectly for JEE. Forever grateful to my mentors here.",
      college: "IIT Bombay",
    },
    {
      name: "Priya Singh",
      achievement: "ICSE 2024 - 99.60% (AIR-2)",
      image: "/indian-teenage-girl-student.png",
      quote:
        "From struggling with concepts to becoming a topper - Momentum transformed my academic journey. The teachers here truly care about every student.",
      college: "St. Xavier's College",
    },
  ]

  const programs = [
    {
      title: "Std 9-10 Foundation",
      desc: "Strong fundamentals for board excellence",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      students: "500+",
    },
    {
      title: "JEE Main & Advanced",
      desc: "Your gateway to IITs and top NITs",
      icon: Target,
      color: "from-orange-500 to-red-500",
      students: "800+",
    },
    {
      title: "NEET Preparation",
      desc: "Medical dreams start here",
      icon: Award,
      color: "from-emerald-500 to-teal-500",
      students: "700+",
    },
    {
      title: "MHT-CET Prep",
      desc: "Maharashtra entrance mastery",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      students: "600+",
    },
    {
      title: "Foundation Wing",
      desc: "Std 7-8 early preparation",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      students: "400+",
    },
    {
      title: "ICSE/CBSE Board",
      desc: "Board exam excellence",
      icon: GraduationCap,
      color: "from-indigo-500 to-purple-500",
      students: "450+",
    },
  ]

  const faculty = [
    {
      name: "Prof. R.P. Singh",
      subject: "Mathematics",
      exp: "18 years",
      qual: "B.Tech IIT Delhi, GATE Qualified",
      image: "/indian-male-professor-mathematics-professional.jpg",
    },
    {
      name: "Dr. P.V. Shukla",
      subject: "Physics",
      exp: "20 years",
      qual: "Ph.D Physics, IISc Bangalore",
      image: "/indian-male-professor-physics-senior.jpg",
    },
    {
      name: "Dr. Seema Verma",
      subject: "Chemistry",
      exp: "16 years",
      qual: "M.Tech Biochemistry, AIIMS",
      image: "/indian-female-professor-chemistry-professional.jpg",
    },
  ]

  const stats = [
    { target: 3000, label: "Students Mentored", suffix: "+" },
    { target: 15, label: "Years of Excellence", suffix: "+" },
    { target: 99, label: "Success Rate", suffix: "%" },
    { target: 329, label: "Best JEE AIR", suffix: "" },
  ]

  // Animate counters when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsVisible) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [statsVisible])

  useEffect(() => {
    if (statsVisible) {
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setCounters({
          students: Math.floor(stats[0].target * easeOutQuart),
          years: Math.floor(stats[1].target * easeOutQuart),
          rate: Math.floor(stats[2].target * easeOutQuart),
          rank: Math.floor(stats[3].target * easeOutQuart),
        })

        if (step >= steps) clearInterval(timer)
      }, interval)

      return () => clearInterval(timer)
    }
  }, [statsVisible])

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
                <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Engineers
                </span>
                <br />& Doctors
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Master JEE, NEET, MHT-CET & Board Exams with India's most trusted coaching academy. 15+ years of
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
                  { icon: Star, label: "635/720 NEET" },
                  { icon: Award, label: "99.6% Pass Rate" },
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
                      <div className="text-2xl font-bold">15+</div>
                      <div className="text-xs">Years</div>
                    </div>
                  </div>

                  <Image
                    src={Hero}
                    alt="Students at Momentum Academy"
                    className="w-full rounded-xl mb-6"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "JEE Toppers", value: "50+" },
                      { label: "NEET Selections", value: "100+" },
                      { label: "Board Toppers", value: "200+" },
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
        ref={statsRef}
        className="py-16 bg-linear-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: counters.students, suffix: "+", label: "Students Mentored" },
              { value: counters.years, suffix: "+", label: "Years Excellence" },
              { value: counters.rate, suffix: "%", label: "Success Rate" },
              { value: counters.rank, suffix: "", label: "Best JEE AIR" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Our Programs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Path to Success</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive programs designed for every academic goal and competitive exam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {programs.map((program, i) => {
              const Icon = program.icon
              return (
                <Card
                  key={i}
                  className="group p-6 hover-lift border-0 shadow-lg cursor-pointer overflow-hidden relative"
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${program.color} opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-opacity`}
                  />

                  <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${program.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-muted-foreground mb-4">{program.desc}</p>
                  <Link href="/programs">
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">

                        <Users className="w-4 h-4" />
                        {program.students} students
                      </span>
                      <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/programs">
              <Button size="lg" variant="outline" className="bg-transparent">
                View All Programs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
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
                  { title: "Expert Faculty", desc: "IITians, PhDs, and industry experts with 15+ years experience" },
                  { title: "Small Batches", desc: "Maximum 25 students ensuring personalized attention" },
                  { title: "Proven Results", desc: "AIR 329 JEE, 635/720 NEET, 99.6% pass rate" },
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
                    <div className="text-sm text-muted-foreground">Students Cleared IIT/AIIMS</div>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Expert Faculty</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn from the Best</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our faculty comprises IITians, doctors, and PhD holders with decades of teaching experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {faculty.map((prof, i) => (
              <Card key={i} className="group overflow-hidden border-0 shadow-lg hover-lift">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={prof.image || "/placeholder.svg"}
                    alt={prof.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{prof.name}</h3>
                    <p className="text-white/80 text-sm">{prof.qual}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {prof.subject}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {prof.exp}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/faculty">
              <Button variant="outline" className="bg-transparent">
                Meet All Faculty
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Hear from our students who achieved their dreams
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* <div className="relative">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${activeTestimonial === i
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 absolute inset-0 translate-y-4 pointer-events-none"
                    }`}
                >
                  <Card className="p-8 md:p-12 border-0 shadow-2xl bg-white/10 backdrop-blur-xl text-primary-foreground">
                    <Quote className="w-12 h-12 text-accent mb-6 opacity-50" />
                    <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-accent font-medium">{testimonial.achievement}</p>
                        <p className="text-primary-foreground/70 text-sm">{testimonial.college}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div> */}

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {/* {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))} */}

                <AnimatedTestimonialsDemo/>

            </div>
          </div>
        </div>
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
                  { icon: MapPin, title: "Visit Us", desc: "Vasai East, Mumbai" },
                  { icon: Phone, title: "Call Us", desc: "+91 98765 43210" },
                  { icon: Mail, title: "Email Us", desc: "contact@momentum.edu" },
                  { icon: Clock, title: "Timings", desc: "Mon-Sat: 8AM - 8PM" },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Card key={i} className="p-4 border-0 shadow-lg hover-lift">
                      <Icon className="w-6 h-6 text-primary mb-2" />
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
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
