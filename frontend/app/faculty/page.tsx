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
      subject: "Mathematics & physics",
      experience: "18+ years",
      qualifications: "M.Sc, Ph.D in Physics (Mumbai Univ)",
      specialization: "JEE Advanced, Problem Solving",
      toppers: 5,
      students: "2500+",
      image: "/Faculty/RP-Singh.jpeg",
    },
    {
      name: "Prof. P.V. Shukla",
      subject: "Chemistry",
      experience: "12+ years",
      qualifications: "BDS (Mumbai Univ)",
      specialization: "Oraganic Chemistry, JEE Main",
      toppers: 8,
      students: "5000+",
      image: "/Faculty/PV-Shukla.jpeg",
    },
    {
      name: "Prof. Rishi Singh",
      subject: "Biology",
      experience: "12+ years",
      qualifications: "MBBS from K.E.M. Medical College, Mumbai",
      specialization: "NEET Biology, Genetics",
      toppers: 6,
      students: "3000+",
      image: "/Faculty/Rishi-Singh.jpeg",
    },
    {
      name: "Prof. Deepak Pal",
      subject: "Biology",
      experience: "4+ years",
      qualifications: "MBBS from JJ Hospital, Mumbai",
      specialization: "Human Physiology, Botany",
      toppers: 4,
      students: "800+",
      image: "/professional-indian-male-teacher-mathematics.jpg",
    },
    {
      name: "Prof. Avinash Mishra",
      subject: "Chemistry",
      experience: "10+ years",
      qualifications: "M.Sc , B.Ed (Mumbai Univ)",
      specialization: "Inorganic Chemistry, Physical Chemistry",
      toppers: 7,
      students: "3000+",
      image: "/professional-indian-female-teacher-biology.jpg",
    },
    {
      name: "Prof. Jittu Kanauja",
      subject: "Physics",
      experience: "5+ years",
      qualifications: "B.Ed (Mumbai Univ)",
      specialization: "Mechanics, Thermodynamics",
      toppers: 5,
      students: "2000+",
      image: "/professional-indian-male-professor-physics-mechani.jpg",
    },
    {
      name: "Prof. Rahul Maurya",
      subject: "Mathematics",
      experience: "12+ years",
      qualifications: "B.Tech (Mumbai Univ)",
      specialization: "Calculus, Coordinate Geometry",
      toppers: 5,
      students: "1500+",
      image: "/professional-indian-male-professor-physics-mechani.jpg",
    },
    {
      name: "Prof. Siddhart ",
      subject: "Chemistry",
      experience: "3+ years",
      qualifications: "B.Tech (Mumbai Univ)",
      specialization: "Organic Chemistry, Physical Chemistry",
      toppers: 5,
      students: "1500+",
      image: "/professional-indian-male-professor-physics-mechani.jpg",
    },
    {
      name: "Prof. Rohit Gotpagar ",
      subject: "Chemistry",
      experience: "10+ years",
      qualifications: "M.Sc (Mumbai Univ)",
      specialization: "Inorganic Chemistry, Physical Chemistry",
      toppers: 5,
      students: "4000+",
      image: "/Faculty/RohitGotpagar.jpeg",
    },
    {
      name: "Prof. Tushar angre ",
      subject: "Physics and Mathematics",
      experience: "15+ years",
      qualifications: "B. tech, M. tech (Mumbai Univ)",
      specialization: "Mechanics, Thermodynamics, Calculus",
      toppers: 5,
      students: "3000+",
      image: "/Faculty/TusharAngre.jpeg",
    },
  ]

  const stats = [
    { icon: GraduationCap, value: "20+", label: "Expert Faculty" },
    { icon: Award, value: "500+", label: "Top Rankers Produced" },
    { icon: BookOpen, value: "10+", label: "Years Avg Experience" },
    { icon: Users, value: "5,000+", label: "Students Taught" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative mt-20 py-20 bg-linear-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
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
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={prof.image || "/placeholder.svg"}
                      alt={prof.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{prof.name}</h3>
                      <p className="text-primary-foreground/80">{prof.subject}</p>
                    </div>
                  </div>
                  <div className="px-6 py-0">
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
                        <span className="text-muted-foreground">Students Mentored</span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">
                          {prof.students}
                        </span>

                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Toppers Mentored</span>
                        <span className="px-3 bg-primary/10 text-primary rounded-full font-bold">
                          {prof.toppers}
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
