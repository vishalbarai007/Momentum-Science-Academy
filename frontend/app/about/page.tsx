"use client"

import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import {
  Target,
  Eye,
  Lightbulb,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  Building,
  Rocket,
  Globe,
  Heart,
} from "lucide-react"
import { TimelineDemo } from "@/components/TimelineDemo"

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  const milestones = [
    {
      year: "2017",
      title: "The Beginning",
      description:
        "Founded Momentum Science Academy with a vision to transform science education in Vasai region. Started with just 30 students and 3 dedicated teachers.",
      icon: Building,
      color: "from-blue-500 to-cyan-500",
      achievements: ["30 students enrolled", "3 expert faculty", "First MHT-CET qualifier"],
    },
    {
      year: "2019",
      title: "Growing Strong",
      description:
        "Expanded to a larger facility with state-of-the-art labs. Introduced NEET preparation program and achieved first MBBS selection.",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      achievements: ["100+ students", "New campus", "First MBBS selection"],
    },
    {
      year: "2021",
      title: "Excellence Milestone",
      description:
        "Launched specialized JEE Advanced batch. Our student secured AIR 329, putting Momentum on the national map.",
      icon: Award,
      color: "from-amber-500 to-orange-500",
      achievements: ["AIR 329 in JEE", "10+ faculty", "50+ alumni"],
    },
    {
      year: "2023",
      title: "Digital Transformation",
      description:
        "Launched comprehensive digital learning platform with live classes, recorded lectures, and online assessments.",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      achievements: ["5+ MHT-CET Toppers in a year ", "Personalized learning", "Online Mock tests"],
    },
    {
      year: "2024",
      title: "New Branch opening",
      description:
        "Increasing Branch every year to meet students expectations. ",
      icon: Rocket,
      color: "from-primary to-secondary",
      achievements: ["3000+ students", "99.6% success rate", "NEET 635/720"],
    },
    {
      year: "2025",
      title: "Present & Future",
      description:
        "Now mentoring 3000+ students across all programs with 100% pass rate and multiple top rankers every year.",
      icon: Rocket,
      color: "from-primary to-secondary",
      achievements: ["3000+ students", "95% selection rate", "NEET 624/720"],
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Goal-Oriented Learning",
      description: "Every session designed with clear learning objectives and measurable outcomes",
    },
    {
      icon: Lightbulb,
      title: "Conceptual Clarity",
      description: "Deep understanding over rote memorization - we build problem solvers",
    },
    {
      icon: TrendingUp,
      title: "Continuous Progress",
      description: "Regular assessments, personalized feedback, and adaptive learning paths",
    },
    {
      icon: Heart,
      title: "Student-First Approach",
      description: "Individual attention with small batch sizes and dedicated mentorship",
    },
  ]

  const stats = [
    { value: "9+", label: "Years of Excellence", icon: Award },
    { value: "3000+", label: "Students Mentored", icon: Users },
    { value: "99.9%", label: "Success Rate", icon: TrendingUp },
    { value: "20+", label: "Expert Faculty", icon: BookOpen },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveYear((prev) => (prev + 1) % milestones.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-linear-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>Since 2017</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Shaping Future{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Engineers & Doctors
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For over 9 years, we've been committed to nurturing tomorrow's innovators, researchers, and healthcare
              professionals through excellence in science education.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 stagger-children">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <Card key={i} className="p-6 text-center hover-lift border-0 shadow-lg bg-card/80 backdrop-blur">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover-lift border-0 shadow-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-primary-foreground/90 leading-relaxed text-lg">
                To provide comprehensive, high-quality science education that builds strong conceptual foundations and
                prepares students for competitive exams while fostering critical thinking, creativity, and a lifelong
                love for learning.
              </p>
            </Card>

            <Card className="p-8 hover-lift border-0 shadow-xl bg-linear-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-secondary-foreground/90 leading-relaxed text-lg">
                To be India's most trusted science academy, recognized for producing top performers in board exams and
                competitive entrances while developing scientifically literate, ethically responsible citizens who
                contribute to society.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline - Modern Interactive */}
      <section className="py-20 bg-linear-to-br from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From a small classroom to a premier coaching institute - explore the milestones that shaped Momentum
            </p>
          </div>

          {/* Timeline Navigation */}
          <div className="flex justify-center gap-4 mb-12 overflow-x-auto pb-4">
            {milestones.map((milestone, i) => (
              <button
                key={i}
                onClick={() => setActiveYear(i)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeYear === i
                    ? "bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105"
                    : "bg-card hover:bg-muted text-foreground border border-border"
                }`}
              >
                {milestone.year}
              </button>
            ))}
          </div>

          {/* Active Milestone Display */}
          <div ref={timelineRef} className="relative">
            {milestones.map((milestone, i) => {
              const Icon = milestone.icon
              return (
                <div
                  key={i}
                  className={`transition-all duration-500 ${
                    activeYear === i
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 absolute inset-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <Card className="p-8 md:p-12 border-0 shadow-2xl overflow-hidden relative">
                    <div
                      className={`absolute top-0 right-0 w-96 h-96 bg-linear-to-br ${milestone.color} opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2`}
                    />

                    <div className="relative grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div
                          className={`w-20 h-20 rounded-2xl bg-linear-to-br ${milestone.color} flex items-center justify-center mb-6 shadow-xl`}
                        >
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-6xl md:text-8xl font-bold text-muted/20 mb-4">{milestone.year}</div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">{milestone.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">{milestone.description}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg mb-4">Key Achievements</h4>
                        {milestone.achievements.map((achievement, j) => (
                          <div
                            key={j}
                            className={`flex items-center gap-4 p-4 rounded-xl bg-linear-to-r ${milestone.color} bg-opacity-10`}
                            style={{ animationDelay: `${j * 0.1}s` }}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg bg-linear-to-br ${milestone.color} flex items-center justify-center shrink-0`}
                            >
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
          


          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {milestones.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveYear(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeYear === i ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Teaching Philosophy</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide our approach to education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <Card key={i} className="p-6 hover-lift border-0 shadow-lg group">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      {/* <TimelineDemo/> */}

      <Footer />
    </div>
  )
}
