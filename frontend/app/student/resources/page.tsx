"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Download, Search, Filter, X, FileText, BookOpen, ClipboardList, Star, Loader2 } from "lucide-react"

// Types
interface Resource {
  id: number
  title: string
  type: string
  subject: string
  targetClass: string // Backend field name
  exam: string
  downloads: number
  fileUrl: string
  createdAt: string
}

export default function StudentResourcesPage() {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<Resource[]>([])
  const [accessTags, setAccessTags] = useState<string[]>([])
  
  const [filters, setFilters] = useState({
    class: "all",
    subject: "all",
    type: "all",
    exam: "all",
    search: "",
  })
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // 1. Fetch Profile (Access Tags) & Resources
useEffect(() => {
    const fetchResources = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        try {
            // Backend now handles filtering automatically based on the token
            const response = await fetch("http://localhost:8080/api/v1/resources", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            if (response.ok) {
                const data = await response.json()
                // Optional: Sort by newest first
                const sortedData = data.sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setResources(sortedData)
            } else {
                console.error("Failed to fetch resources")
            }

        } catch (error) {
            console.error("Error loading resources:", error)
        } finally {
            setLoading(false)
        }
    }

    fetchResources()
  }, [])

  // 2. Apply UI Filters (Dropdowns/Search) on the Allowed Resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesClass = filters.class === "all" || resource.targetClass === filters.class
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
  }, [filters, resources])

  const handleDownload = async (id: number, fileUrl: string) => {
    setDownloadingId(id)
    
    if (fileUrl && fileUrl.startsWith("http")) {
        // Real Download
        setTimeout(() => {
            window.open(fileUrl, "_blank")
            setDownloadingId(null)
        }, 1000)
    } else {
        // Simulation
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert("Downloading file... (Simulated)")
        setDownloadingId(null)
    }
  }

  const resetFilters = () => {
    setFilters({ class: "all", subject: "all", type: "all", exam: "all", search: "" })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pyq": return FileText
      case "notes": return BookOpen
      case "assignment": return ClipboardList
      case "imp": return Star
      default: return FileText
    }
  }

  const formatResourceType = (type: string) => {
    const map: any = { 'pq': 'PYQ', 'notes': 'Notes', 'assignment': 'Assignment', 'imp': 'IMP' }
    return map[type?.toLowerCase()] || type
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all" && v !== "").length

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
        <p className="text-muted-foreground">Access your personalized study materials</p>
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
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
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
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
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
                <option value="pq">PYQ</option>
                <option value="notes">Notes</option>
                <option value="assignment">Assignments</option>
                <option value="imp">IMP Topics</option>
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
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
                <option value="MHT-CET">MHT-CET</option>
                <option value="Board Exam">Board Exam</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center">
        <span>Showing {filteredResources.length} resources</span>
        {accessTags.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                Access enabled for: {accessTags.slice(0,3).join(", ")}{accessTags.length > 3 ? "..." : ""}
            </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type)
          const displayType = formatResourceType(resource.type)
          
          return (
            <Card key={resource.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    displayType === "PYQ"
                      ? "bg-blue-500/10 text-blue-500"
                      : displayType === "Notes"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : displayType === "Assignment"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-purple-500/10 text-purple-500"
                  }`}
                >
                  <TypeIcon className="w-6 h-6" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-muted text-muted-foreground uppercase">
                  {displayType}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer line-clamp-2" title={resource.title}>
                {resource.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {resource.subject}
                </span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {resource.targetClass}
                </span>
                {resource.exam && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{resource.exam}</span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-4 flex-1">{resource.downloads || 0} downloads</p>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleDownload(resource.id, resource.fileUrl)}
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
      )}

      {/* No Results */}
      {!loading && filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            {accessTags.length === 0 
                ? "You currently have no access permissions. Contact your admin." 
                : "Try adjusting your filters or search query."}
          </p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </StudentSidebar>
  )
}