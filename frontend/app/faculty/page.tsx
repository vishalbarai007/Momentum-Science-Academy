import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import { GraduationCap, Award, BookOpen, Users } from "lucide-react"

export const metadata = {
  title: "Faculty - Momentum Science Academy",
  description: "Meet our expert faculty members with years of experience.",
}

export default function FacultyPage() {
  const faculty = [
    {
      name: "Prof. R.P. Singh",
      subject: "Mathematics",
      experience: "18 years",
      qualifications: "B.Tech (IIT-D), GATE Qualified",
      specialization: "JEE Advanced, Problem Solving",
      toppers: 5,
      image: "/professional-indian-male-professor-mathematics.jpg",
    },
    {
      name: "Dr. P.V. Shukla",
      subject: "Physics",
      experience: "20 years",
      qualifications: "Ph.D Physics, B.Sc (Honors)",
      specialization: "Conceptual Physics, Research",
      toppers: 8,
      image: "/professional-indian-male-professor-physics.jpg",
    },
    {
      name: "Dr. Seema Verma",
      subject: "Chemistry",
      experience: "16 years",
      qualifications: "M.Tech Biochemistry, B.Sc",
      specialization: "Organic Chemistry, NEET Prep",
      toppers: 6,
      image: "/professional-indian-female-professor-chemistry.jpg",
    },
    {
      name: "Prof. Rajesh Gupta",
      subject: "Mathematics",
      experience: "14 years",
      qualifications: "M.Sc Mathematics (Delhi Univ)",
      specialization: "Trigonometry, Algebra",
      toppers: 4,
      image: "/professional-indian-male-teacher-mathematics.jpg",
    },
    {
      name: "Ms. Priya Nair",
      subject: "Biology",
      experience: "12 years",
      qualifications: "M.Sc Botany, B.Sc (Honors)",
      specialization: "NEET Biology, Anatomy",
      toppers: 7,
      image: "/professional-indian-female-teacher-biology.jpg",
    },
    {
      name: "Prof. Anil Kumar",
      subject: "Physics",
      experience: "17 years",
      qualifications: "B.Tech Mechanical Engineering",
      specialization: "Mechanics, Thermodynamics",
      toppers: 5,
      image: "/professional-indian-male-professor-physics-mechani.jpg",
    },
  ]

  const stats = [
    { icon: GraduationCap, value: "50+", label: "Expert Faculty" },
    { icon: Award, value: "35+", label: "Top Rankers Produced" },
    { icon: BookOpen, value: "18+", label: "Years Avg Experience" },
    { icon: Users, value: "10,000+", label: "Students Taught" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
            <div className="text-center animate-fade-in">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Expert Team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Faculty</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn from the best educators with decades of experience in producing top performers
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Faculty Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((prof, i) => (
                <Card
                  key={i}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={prof.image || "/placeholder.svg"}
                      alt={prof.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{prof.name}</h3>
                      <p className="text-primary-foreground/80">{prof.subject}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-medium">{prof.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Qualifications</span>
                        <span className="font-medium text-right max-w-[60%]">{prof.qualifications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Specialization</span>
                        <span className="font-medium text-right max-w-[60%]">{prof.specialization}</span>
                      </div>
                      <div className="pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-muted-foreground">Toppers Mentored</span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">
                          {prof.toppers} Top Rankers
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
