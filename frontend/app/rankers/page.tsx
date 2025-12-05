"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Award, TrendingUp, Filter } from "lucide-react"
import { Footer } from "@/components/public/footer"
import { Navbar } from "@/components/public/navbar"

type rankerItem = {
  id: number
  studentName: string
  exam: string
  rank: string
  score?: string
  year: string
  image: string
  description: string
  category: string
  location?: string
}

const rankerData: rankerItem[] = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    exam: "JEE Main",
    rank: "AIR 452",
    score: "98.7%",
    year: "2024",
    category: "JEE",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Secured AIR 452 in JEE Main 2024 with exceptional performance.",
    location: "Mumbai",
  },
  {
    id: 2,
    studentName: "Priya Deshmukh",
    exam: "NEET",
    rank: "AIR 312",
    score: "683/720",
    year: "2024",
    category: "NEET",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Achieved an outstanding score of 683, securing AIR 312 in NEET 2024.",
    location: "Pune",
  },
  {
    id: 3,
    studentName: "Vikrant Nair",
    exam: "MHT-CET",
    rank: "State Rank 29",
    score: "99.78%",
    year: "2023",
    category: "MHT-CET",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Scored 99.78 percentile in MHT-CET 2023 securing a top State rank.",
    location: "Thane",
  },
  {
    id: 4,
    studentName: "Simran Kaur",
    exam: "JEE Advanced",
    rank: "Qualified",
    score: "Qualified",
    year: "2023",
    category: "JEE",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Qualified JEE Advanced 2023 with exceptional determination.",
    location: "Navi Mumbai",
  },
  {
    id: 5,
    studentName: "Rohan Patil",
    exam: "10th Boards",
    rank: "School Topper",
    score: "96.2%",
    year: "2023",
    category: "Boards(10th)",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Secured 96.2% in SSC Board Exams becoming the school topper.",
    location: "Mumbai",
  },
  {
    id: 6,
    studentName: "Kavya Mehta",
    exam: "12th Boards",
    rank: "School Topper",
    score: "93.8%",
    year: "2022",
    category: "Boards(12th)",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Achieved 93.8% in HSC exams securing the top spot in school.",
    location: "Pune",
  },
]

const years = ["All", "2024", "2023", "2022"]
const categories = ["All", "JEE", "NEET", "MHT-CET", "Boards(10th)", "Boards(12th)"]

export default function RankersPage() {
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const filteredItems = rankerData.filter((item) => {
    const yearMatch = selectedYear === "All" || item.year === selectedYear
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory
    return yearMatch && categoryMatch
  })

  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ""
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImage((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1))
    } else {
      setCurrentImage((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Navbar Placeholder */}
     <Navbar/>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Hall of Excellence
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
              Our Top Rankers
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Celebrating the outstanding achievements of Momentum Science Academy students across board & competitive exams. Their success is our pride.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">150+</div>
                <div className="text-sm text-slate-600 mt-1">Top Rankers</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-sm text-slate-600 mt-1">Success Rate</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-sm text-slate-600 mt-1">Years Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 bg-white/80 backdrop-blur-md z-30 border-y border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Filter Results</span>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-slate-600 min-w-[60px]">Year:</span>
              <div className="flex gap-2 flex-wrap">
                {years.map((y) => (
                  <Button
                    key={y}
                    size="sm"
                    variant={selectedYear === y ? "default" : "outline"}
                    onClick={() => setSelectedYear(y)}
                    className={`rounded-full px-5 transition-all duration-300 ${
                      selectedYear === y 
                        ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/25" 
                        : "bg-white border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700"
                    }`}
                  >
                    {y}
                  </Button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-slate-200" />

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-slate-600 min-w-20">Category:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={selectedCategory === c ? "default" : "outline"}
                    onClick={() => setSelectedCategory(c)}
                    className={`rounded-full px-5 transition-all duration-300 ${
                      selectedCategory === c 
                        ? "bg-secondary hover:bg-secondary/90 text-white shadow-md shadow-secondary/25" 
                        : "bg-white border-slate-200 hover:border-secondary hover:bg-secondary/5 text-slate-700"
                    }`}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-lg text-slate-600 mb-6">No rankers found for selected filters.</p>
              <Button
                variant="outline"
                className="rounded-full px-8"
                onClick={() => {
                  setSelectedYear("All")
                  setSelectedCategory("All")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Showing {filteredItems.length} {filteredItems.length === 1 ? 'Result' : 'Results'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedYear !== "All" && `Year: ${selectedYear}`}
                    {selectedYear !== "All" && selectedCategory !== "All" && " • "}
                    {selectedCategory !== "All" && `Category: ${selectedCategory}`}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item, idx) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-primary/20 bg-white hover:-translate-y-1"
                    onClick={() => openLightbox(idx)}
                  >
                    <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={`${item.studentName} ${item.exam}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-semibold rounded-full shadow-lg border border-slate-200">
                          {item.category}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white font-bold text-lg leading-tight mb-1">
                          {item.studentName}
                        </h3>
                        <p className="text-white/90 text-sm font-medium">
                          {item.exam}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-sm">{item.rank}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1 leading-tight">
                            {item.studentName}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">{item.exam}</p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                            {item.rank}
                          </div>
                          {item.score && (
                            <div className="text-xs text-slate-600 font-semibold mt-1">{item.score}</div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.year}
                        </span>
                        {item.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
              <img
                src={filteredItems[currentImage].image || "/placeholder.svg"}
                alt={filteredItems[currentImage].studentName}
                className="w-full max-h-[60vh] object-contain bg-black/20"
              />
              
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-4">
                  {filteredItems[currentImage].category}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">
                  {filteredItems[currentImage].studentName}
                </h3>
                
                <div className="flex items-center justify-center gap-3 text-white/80 mb-6">
                  <span className="font-semibold">{filteredItems[currentImage].exam}</span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1.5 font-semibold text-yellow-400">
                    <Award className="w-4 h-4" />
                    {filteredItems[currentImage].rank}
                  </span>
                  {filteredItems[currentImage].score && (
                    <>
                      <span className="text-white/40">•</span>
                      <span className="font-semibold">{filteredItems[currentImage].score}</span>
                    </>
                  )}
                </div>

                <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-6">
                  {filteredItems[currentImage].description}
                </p>

                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {filteredItems[currentImage].year}
                  </span>
                  {filteredItems[currentImage].location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {filteredItems[currentImage].location}
                    </span>
                  )}
                </div>

                <div className="mt-6 text-sm text-white/40 font-medium">
                  {currentImage + 1} of {filteredItems.length}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

     <Footer/>
    </div>
  )
}