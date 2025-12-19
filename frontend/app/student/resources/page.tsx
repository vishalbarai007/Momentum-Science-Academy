"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { 
  Download, Search, Filter, X, FileText, BookOpen, 
  ClipboardList, Star, Loader2, Info, MessageSquare, Send 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Types
interface Resource {
  id: number
  title: string
  description?: string // Added
  type: string
  subject: string
  targetClass: string
  exam: string
  downloads: number
  fileUrl: string
  createdAt: string
  uploadedBy?: string // Teacher Name
}

export default function StudentResourcesPage() {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<Resource[]>([])
  const [accessTags, setAccessTags] = useState<string[]>([])
  
  // Filters
  const [filters, setFilters] = useState({
    class: "all",
    subject: "all",
    type: "all",
    exam: "all",
    search: "",
  })
  
  // UI States
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Modals
  const [infoModal, setInfoModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false, resource: null,
  })
  const [doubtModal, setDoubtModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false, resource: null,
  })

  // Form States
  const [doubtMessage, setDoubtMessage] = useState("")
  const [isSendingDoubt, setIsSendingDoubt] = useState(false)

  // 1. Fetch Resources
  useEffect(() => {
    const fetchResources = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch("http://localhost:8080/api/v1/resources", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            if (response.ok) {
                const data = await response.json()
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

  // 2. Filters
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesClass = filters.class === "all" || resource.targetClass === filters.class
      const matchesSubject = filters.subject === "all" || resource.subject.toLowerCase() === filters.subject.toLowerCase()
      const matchesType = filters.type === "all" || resource.type.toLowerCase() === filters.type.toLowerCase()
      const matchesExam = filters.exam === "all" || resource.exam === filters.exam
      const matchesSearch = filters.search === "" ||
        resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.subject.toLowerCase().includes(filters.search.toLowerCase())

      return matchesClass && matchesSubject && matchesType && matchesExam && matchesSearch
    })
  }, [filters, resources])

  // 3. Actions
  const handleDownload = async (id: number, fileUrl: string) => {
    setDownloadingId(id)
    if (fileUrl && fileUrl.startsWith("http")) {
        setTimeout(() => {
            window.open(fileUrl, "_blank")
            setDownloadingId(null)
        }, 1000)
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert("Downloading file... (Simulated)")
        setDownloadingId(null)
    }
  }

  const handleDoubtSubmit = async () => {
    if (!doubtModal.resource || !doubtMessage) return
    setIsSendingDoubt(true)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/v1/doubts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                contextType: "RESOURCE",
                contextId: doubtModal.resource.id,
                question: doubtMessage
            })
        })
        if (res.ok) {
            alert("Doubt sent successfully!")
            setDoubtModal({ open: false, resource: null })
            setDoubtMessage("")
        } else {
            alert("Failed to send doubt.")
        }
    } catch (error) {
        console.error("Error sending doubt:", error)
        alert("Network error.")
    } finally {
        setIsSendingDoubt(false)
    }
  }

  const resetFilters = () => {
    setFilters({ class: "all", subject: "all", type: "all", exam: "all", search: "" })
  }

  // Visual Helpers
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
              <select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.class} onChange={(e) => setFilters({ ...filters, class: e.target.value })}>
                <option value="all">All Classes</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="all">All Types</option>
                <option value="pq">PYQ</option>
                <option value="notes">Notes</option>
                <option value="assignment">Assignments</option>
                <option value="imp">IMP Topics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Exam</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.exam} onChange={(e) => setFilters({ ...filters, exam: e.target.value })}>
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

              <div className="flex items-center gap-2 mb-2">
                 <h3 className="font-bold text-lg hover:text-primary cursor-pointer line-clamp-1 flex-1" title={resource.title}>
                    {resource.title}
                 </h3>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0"
                    onClick={() => setInfoModal({ open: true, resource })}
                 >
                    <Info className="w-4 h-4" />
                 </Button>
              </div>

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

              <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDoubtModal({ open: true, resource })}
                >
                    <MessageSquare className="w-4 h-4 mr-2" /> Doubt
                </Button>
                <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleDownload(resource.id, resource.fileUrl)}
                    disabled={downloadingId === resource.id}
                >
                    {downloadingId === resource.id ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                    </span>
                    ) : (
                    <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </>
                    )}
                </Button>
              </div>
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
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}

      {/* --- INFO MODAL --- */}
      <Dialog open={infoModal.open} onOpenChange={(open) => setInfoModal({ open, resource: null })}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Resource Details</DialogTitle>
            </DialogHeader>
            {infoModal.resource && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{infoModal.resource.subject}</Badge>
                        <span>•</span>
                        <span>{formatResourceType(infoModal.resource.type)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Class</span>
                        <span className="font-medium">{infoModal.resource.targetClass}</span></div>
                        
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Exam</span>
                        <span className="font-medium">{infoModal.resource.exam || "N/A"}</span></div>

                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Uploaded By</span>
                        <span className="font-medium">{infoModal.resource.uploadedBy || "Teacher"}</span></div>

                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Downloads</span>
                        <span className="font-medium">{infoModal.resource.downloads}</span></div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Description</Label>
                        <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap min-h-[100px]">
                            {infoModal.resource.description || "No description provided."}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full" onClick={() => handleDownload(infoModal.resource!.id, infoModal.resource!.fileUrl)}>
                            <Download className="w-4 h-4 mr-2" /> Download File
                        </Button>
                    </DialogFooter>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* --- DOUBT MODAL --- */}
      <Dialog open={doubtModal.open} onOpenChange={(open) => setDoubtModal({ open, resource: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask Doubt</DialogTitle>
            <DialogDescription>
                Ask a question about <strong>{doubtModal.resource?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="doubt">Your Question</Label>
              <Textarea 
                id="doubt" 
                placeholder="Type your question here..." 
                rows={4} 
                value={doubtMessage} 
                onChange={(e) => setDoubtMessage(e.target.value)} 
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDoubtModal({ open: false, resource: null })}>Cancel</Button>
            <Button onClick={handleDoubtSubmit} disabled={isSendingDoubt || !doubtMessage.trim()} className="bg-emerald-500 hover:bg-emerald-600">
              {isSendingDoubt ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Doubt</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </StudentSidebar>
  )
}