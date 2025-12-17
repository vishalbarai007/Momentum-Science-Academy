import { Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card } from '../ui/card'

const Testimonials = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0)


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

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])
    return (
        <div>
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
                    <div className="relative">
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
                    </div>

                    {/* Testimonial indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                                    }`}
                            />
                        ))}

                        {/* <AnimatedTestimonialsDemo/> */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonials
