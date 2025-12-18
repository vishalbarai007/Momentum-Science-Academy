import { BookOpen, Users, ChevronRight, ArrowRight, Award, GraduationCap, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { memo } from "react"




const Program = () => {
    const programs = [
        {
            title: "Foundation Wing",
            desc: "Std 7-8 early preparation",
            icon: Sparkles,
            color: "from-amber-500 to-orange-500",
            students: "50+",
        },
        {
            title: "Std 9-10 Foundation",
            desc: "Strong fundamentals for board excellence",
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500",
            students: "50+",
        },
        {
            title: "ICSE/CBSE Board",
            desc: "Board exam excellence",
            icon: GraduationCap,
            color: "from-indigo-500 to-purple-500",
            students: "100+",
        },
        {
            title: "JEE Main & Advanced",
            desc: "Your gateway to IITs and top NITs",
            icon: Target,
            color: "from-orange-500 to-red-500",
            students: "1200+",
        },
        {
            title: "NEET Preparation",
            desc: "Medical dreams start here",
            icon: Award,
            color: "from-emerald-500 to-teal-500",
            students: "1500+",
        },
        {
            title: "MHT-CET Prep",
            desc: "Maharashtra entrance mastery",
            icon: TrendingUp,
            color: "from-purple-500 to-pink-500",
            students: "2000+",
        },

    ]

    return (
        <div>
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
        </div>
    )
}

export default Program
