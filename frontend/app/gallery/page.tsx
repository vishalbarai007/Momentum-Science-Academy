"use client"

import { useState } from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users } from "lucide-react"

type GalleryItem = {
  id: number
  title: string
  year: string
  category: string
  image: string
  description: string
  location?: string
  attendees?: number
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Annual Day Celebration 2024",
    year: "2024",
    category: "Events",
    image: "/school-annual-day-celebration-students-stage-perfo.jpg",
    description: "Students performing cultural activities during the annual day celebration",
    location: "Main Auditorium",
    attendees: 500,
  },
  {
    id: 2,
    title: "JEE Toppers Felicitation 2024",
    year: "2024",
    category: "Achievements",
    image: "/students-receiving-awards-ceremony-academic-achiev.jpg",
    description: "Honoring our JEE Advanced qualifiers with their proud moments",
    location: "Conference Hall",
    attendees: 200,
  },
  {
    id: 3,
    title: "Science Exhibition 2024",
    year: "2024",
    category: "Academic",
    image: "/students-science-exhibition-projects-display.jpg",
    description: "Students showcasing innovative science projects",
    location: "Exhibition Hall",
    attendees: 350,
  },
  {
    id: 4,
    title: "NEET Success Celebration 2024",
    year: "2024",
    category: "Achievements",
    image: "/medical-students-celebration-success-party.jpg",
    description: "Celebrating our NEET qualifiers' success",
    location: "Campus Ground",
    attendees: 180,
  },
  {
    id: 5,
    title: "Teachers Day 2023",
    year: "2023",
    category: "Events",
    image: "/teachers-day-celebration-students-honoring-teacher.jpg",
    description: "Students expressing gratitude to their mentors",
    location: "Main Auditorium",
    attendees: 400,
  },
  {
    id: 6,
    title: "Physics Lab Inauguration 2023",
    year: "2023",
    category: "Infrastructure",
    image: "/modern-physics-laboratory-inauguration-ceremony.jpg",
    description: "Opening of our state-of-the-art physics laboratory",
    location: "Science Block",
    attendees: 100,
  },
  {
    id: 7,
    title: "Sports Day 2023",
    year: "2023",
    category: "Sports",
    image: "/school-sports-day-students-athletic-competition.jpg",
    description: "Annual sports day with various athletic events",
    location: "Sports Ground",
    attendees: 600,
  },
  {
    id: 8,
    title: "Chemistry Workshop 2023",
    year: "2023",
    category: "Academic",
    image: "/chemistry-workshop-students-laboratory-experiments.jpg",
    description: "Hands-on chemistry experiments for competitive exam prep",
    location: "Chemistry Lab",
    attendees: 80,
  },
  {
    id: 9,
    title: "Foundation Day 2022",
    year: "2022",
    category: "Events",
    image: "/school-foundation-day-celebration-ceremony.jpg",
    description: "Celebrating our academy's founding anniversary",
    location: "Main Campus",
    attendees: 700,
  },
  {
    id: 10,
    title: "Guest Lecture Series 2022",
    year: "2022",
    category: "Academic",
    image: "/guest-lecture-professor-speaking-auditorium-studen.jpg",
    description: "Distinguished professors sharing insights with students",
    location: "Seminar Hall",
    attendees: 250,
  },
  {
    id: 11,
    title: "Graduation Ceremony 2022",
    year: "2022",
    category: "Achievements",
    image: "/graduation-ceremony-students-caps-gowns-celebratio.jpg",
    description: "Batch of 2022 graduates receiving their certificates",
    location: "Main Auditorium",
    attendees: 450,
  },
  {
    id: 12,
    title: "Independence Day 2022",
    year: "2022",
    category: "Events",
    image: "/independence-day-celebration-school-flag-hoisting.jpg",
    description: "Patriotic celebrations and flag hoisting ceremony",
    location: "Campus Ground",
    attendees: 550,
  },
]

// const years = ["All", "2024", "2023", "2022"]
const categories = ["All", "Events", "Achievements", "Academic", "Sports", "Infrastructure"]

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const filteredImages = galleryData.filter((item) => {
    const yearMatch = selectedYear === "All" || item.year === selectedYear
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory
    return yearMatch && categoryMatch
  })

  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImage((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
    } else {
      setCurrentImage((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              Relive the memorable moments from events, celebrations, and achievements at Momentum Science Academy
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-lg z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Year Filter */}
            <div className="flex items-center gap-3">
              {/* <span className="text-sm font-medium text-muted-foreground">Year:</span> */}
              {/* <div className="flex gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className={`transition-all ${
                      selectedYear === year
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent hover:bg-primary/10"
                    }`}
                  >
                    {year}
                  </Button>
                ))}
              </div> */}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-sm font-medium text-muted-foreground">Category:</span>
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all ${
                      selectedCategory === category
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-transparent hover:bg-secondary/10"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredImages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {filteredImages.map((item, index) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden cursor-pointer hover-lift border-0 shadow-lg"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.year}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No images found for the selected filters.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSelectedYear("All")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-5xl mx-auto px-16">
            <img
              src={filteredImages[currentImage].image || "/placeholder.svg"}
              alt={filteredImages[currentImage].title}
              className="max-h-[70vh] w-auto mx-auto rounded-lg shadow-2xl"
            />
            <div className="text-center mt-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{filteredImages[currentImage].title}</h3>
              <p className="text-white/70 mb-4">{filteredImages[currentImage].description}</p>
              <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {filteredImages[currentImage].year}
                </span>
                {filteredImages[currentImage].location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {filteredImages[currentImage].location}
                  </span>
                )}
                {filteredImages[currentImage].attendees && (
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {filteredImages[currentImage].attendees} attendees
                  </span>
                )}
              </div>
            </div>
            <div className="text-center mt-4 text-white/50 text-sm">
              {currentImage + 1} / {filteredImages.length}
            </div>
          </div>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}
