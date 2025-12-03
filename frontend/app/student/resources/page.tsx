"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Download, Search, Filter, X, FileText, BookOpen, ClipboardList, Star } from "lucide-react"

export default function StudentResourcesPage() {
  const [filters, setFilters] = useState({
    class: "all",
    subject: "all",
    type: "all",
    exam: "all",
    search: "",
  })
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const allResources = [
    {
      id: 1,
      title: "JEE Main 2024 Paper 1",
      type: "PYQ",
      subject: "Mathematics",
      class: "12",
      exam: "JEE",
      downloads: 342,
    },
    {
      id: 2,
      title: "Calculus Complete Notes",
      type: "Notes",
      subject: "Mathematics",
      class: "12",
      exam: "JEE",
      downloads: 198,
    },
    {
      id: 3,
      title: "Physics Numericals Practice",
      type: "Assignment",
      subject: "Physics",
      class: "12",
      exam: "JEE",
      downloads: 156,
    },
    {
      id: 4,
      title: "Organic Chemistry Reactions",
      type: "Notes",
      subject: "Chemistry",
      class: "12",
      exam: "NEET",
      downloads: 287,
    },
    {
      id: 5,
      title: "NEET 2024 Question Bank",
      type: "PYQ",
      subject: "Biology",
      class: "12",
      exam: "NEET",
      downloads: 412,
    },
    {
      id: 6,
      title: "Circuit Analysis IMP Topics",
      type: "IMP",
      subject: "Physics",
      class: "12",
      exam: "JEE",
      downloads: 203,
    },
    {
      id: 7,
      title: "Trigonometry Formulas",
      type: "IMP",
      subject: "Mathematics",
      class: "11",
      exam: "JEE",
      downloads: 178,
    },
    {
      id: 8,
      title: "Class 10 Science Notes",
      type: "Notes",
      subject: "Science",
      class: "10",
      exam: "Board",
      downloads: 245,
    },
    {
      id: 9,
      title: "MHT-CET 2024 Practice Paper",
      type: "PYQ",
      subject: "Physics",
      class: "12",
      exam: "MHT-CET",
      downloads: 189,
    },
    {
      id: 10,
      title: "Biology Chapter 1-5 Assignment",
      type: "Assignment",
      subject: "Biology",
      class: "11",
      exam: "NEET",
      downloads: 134,
    },
    {
      id: 11,
      title: "Class 9 Math Basics",
      type: "Notes",
      subject: "Mathematics",
      class: "9",
      exam: "Board",
      downloads: 267,
    },
    {
      id: 12,
      title: "Inorganic Chemistry Quick Notes",
      type: "IMP",
      subject: "Chemistry",
      class: "12",
      exam: "JEE",
      downloads: 321,
    },
  ]

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      const matchesClass = filters.class === "all" || resource.class === filters.class
      const matchesSubject =
        filters.subject === "all" || resource.subject.toLowerCase() === filters.subject.toLowerCase()
      const matchesType = filters.type === "all" || resource.type.toLowerCase() === filters.type.toLowerCase()
      const matchesExam = filters.exam === "all" || resource.exam === filters.exam
      const matchesSearch =
        filters.search === "" ||
        resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.subject.toLowerCase().includes(filters.search.toLowerCase())

      return matchesClass && matchesSubject && matchesType && matchesExam && matchesSearch
    })
  }, [filters])

  const handleDownload = async (id: number, title: string) => {
    setDownloadingId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const blob = new Blob([`Content of ${title}`], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  const resetFilters = () => {
    setFilters({ class: "all", subject: "all", type: "all", exam: "all", search: "" })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pyq":
        return FileText
      case "notes":
        return BookOpen
      case "assignment":
        return ClipboardList
      case "imp":
        return Star
      default:
        return FileText
    }
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all" && v !== "").length

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
        <p className="text-muted-foreground">Access all study materials, PYQs, notes, and assignments</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`gap-2 ${activeFiltersCount > 0 ? "border-primary text-primary" : ""}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 mb-6 border-0 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filter Resources</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
              <X className="w-4 h-4 mr-1" /> Clear All
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              >
                <option value="all">All Classes</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="all">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="science">Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="pyq">Previous Year Questions</option>
                <option value="notes">Notes</option>
                <option value="assignment">Assignments</option>
                <option value="imp">Important Topics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Exam</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filters.exam}
                onChange={(e) => setFilters({ ...filters, exam: e.target.value })}
              >
                <option value="all">All Exams</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="MHT-CET">MHT-CET</option>
                <option value="Board">Board Exams</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredResources.length} of {allResources.length} resources
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type)
          return (
            <Card key={resource.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    resource.type === "PYQ"
                      ? "bg-blue-500/10 text-blue-500"
                      : resource.type === "Notes"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : resource.type === "Assignment"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-purple-500/10 text-purple-500"
                  }`}
                >
                  <TypeIcon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    resource.type === "PYQ"
                      ? "bg-blue-100 text-blue-700"
                      : resource.type === "Notes"
                        ? "bg-emerald-100 text-emerald-700"
                        : resource.type === "Assignment"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {resource.type}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer line-clamp-2">
                {resource.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {resource.subject}
                </span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  Class {resource.class}
                </span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{resource.exam}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-4 flex-1">{resource.downloads} downloads</p>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleDownload(resource.id, resource.title)}
                disabled={downloadingId === resource.id}
              >
                {downloadingId === resource.id ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Downloading...
                  </span>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </StudentSidebar>
  )
}
