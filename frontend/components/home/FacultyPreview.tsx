import { Users, Clock, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from '../ui/card'
import Link from 'next/link'

const FacultyPreview = () => {

    const faculty = [
        {
            name: "Prof. R.P. Singh",
            subject: "Mathematics & physics",
            experience: "18+ years",
            qualifications: "M.Sc, Ph.D in Physics (Mumbai Univ)",
            specialization: "JEE Advanced, Problem Solving",
            toppers: 5,
            students: "2500+",
            image: "/Faculty/RP.png",
        },
        {
            name: "Prof. P.V. Shukla",
            subject: "Chemistry",
            experience: "12+ years",
            qualifications: "BDS (Mumbai Univ)",
            specialization: "Oraganic Chemistry, JEE Main",
            toppers: 8,
            students: "5000+",
            image: "/professional-indian-male-professor-physics.jpg",
        },
        {
            name: "Prof. Rishi Singh",
            subject: "Biology",
            experience: "12+ years",
            qualifications: "MBBS from K.E.M. Medical College, Mumbai",
            specialization: "NEET Biology, Genetics",
            toppers: 6,
            students: "3000+",
            image: "/professional-indian-female-professor-chemistry.jpg",
        },
    ]

    return (
        <div>
            {/* <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                            <Users className="w-4 h-4" />
                            <span>Expert Faculty</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn from the Best</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Our faculty comprises Engineers, doctors, and PhD holders with decades of teaching experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 stagger-children">
                        {faculty.map((prof, i) => (
                            <Card key={i} className="group overflow-hidden border-0 shadow-lg hover-lift">
                                <div className="relative h-80 overflow-hidden">
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


                    <div className=" text-center">
                        <Link href="/faculty">
                            <Button variant="outline" className="bg-transparent">
                                Meet All Faculty
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </section> */}

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
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
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
        </div>
    )
}

export default FacultyPreview
