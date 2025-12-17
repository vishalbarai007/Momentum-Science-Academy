import React, { useEffect, useRef, useState } from 'react'

const StatsSection = () => {
    const statsRef = useRef<HTMLDivElement>(null)

    const [counters, setCounters] = useState({ students: 0, years: 0, rate: 0, rank: 0 })

    const [statsVisible, setStatsVisible] = useState(false)

    const stats = [
        { target: 3000, label: "Students Mentored", suffix: "+" },
        { target: 9, label: "Years of Excellence", suffix: "+" },
        { target: 95, label: "Success Rate", suffix: "%" },
        { target: 329, label: "Best JEE AIR", suffix: "" },
    ]

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


    return (
        <div>
            
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

        </div>
    )
}

export default StatsSection
