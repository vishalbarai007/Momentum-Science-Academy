"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { 
  Download, Search, Filter, X, FileText, BookOpen, 
  ClipboardList, Star, Loader2, Info, MessageSquare, Send, 
  CheckCircle, Clock, CornerDownRight, User
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Types ---
interface Resource {
  id: number
  title: string
  description?: string
  type: string
  subject: string
  targetClass: string
  exam: string
  downloads: number
  fileUrl: string
  createdAt: string
  uploadedBy?: string
}

interface Doubt {
  id: number
  question: string
  answer: string | null
  createdAt: string
  contextType: string
  contextId: number
}

export default function StudentResourcesPage() {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<Resource[]>([])
  const [accessTags, setAccessTags] = useState<string[]>([])
  
  // Page Filters
  const [filters, setFilters] = useState({
    class: "all", subject: "all", type: "all", exam: "all", search: "",
  })
  
  // UI States
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Modals
  const [infoModal, setInfoModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false, resource: null,
  })
  
  // --- DOUBT MODAL STATE ---
  const [doubtModal, setDoubtModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false, resource: null,
  })
  const [resourceDoubts, setResourceDoubts] = useState<Doubt[]>([])
  const [loadingDoubts, setLoadingDoubts] = useState(false)
  
  // Doubt Form & Filters
  const [doubtMessage, setDoubtMessage] = useState("")
  const [isSendingDoubt, setIsSendingDoubt] = useState(false)
  const [doubtSearch, setDoubtSearch] = useState("")
  const [doubtFilter, setDoubtFilter] = useState("all") // all, pending, resolved

  // 1. Fetch Resources
  useEffect(() => {
    const fetchResources = async () => {
        const token = localStorage.getItem("token")
        if (!token) { setLoading(false); return }

        try {
            const response = await fetch("http://localhost:8080/api/v1/resources", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                // Sort by newest
                setResources(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            }
        } catch (error) {
            console.error("Error loading resources:", error)
        } finally {
            setLoading(false)
        }
    }
    fetchResources()
  }, [])

  // 2. Fetch Doubts when Modal Opens
  useEffect(() => {
    if (doubtModal.open && doubtModal.resource) {
        fetchDoubtsForResource(doubtModal.resource.id)
    } else {
        // Reset states on close
        setResourceDoubts([])
        setDoubtMessage("")
        setDoubtSearch("")
        setDoubtFilter("all")
    }
  }, [doubtModal.open, doubtModal.resource])

  const fetchDoubtsForResource = async (resourceId: number) => {
    setLoadingDoubts(true)
    try {
        const token = localStorage.getItem("token")
        // NOTE: Ideally backend should have /api/v1/doubts/resource/{id}
        // For now, we fetch all user doubts and filter client-side as per previous implementation pattern
        const res = await fetch("http://localhost:8080/api/v1/doubts/my-doubts", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
            const allDoubts: Doubt[] = await res.json()
            // Filter for current resource
            const filtered = allDoubts.filter(d => 
                d.contextType === "RESOURCE" && d.contextId === resourceId
            ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            
            setResourceDoubts(filtered)
        }
    } catch (error) {
        console.error("Failed to load doubts", error)
    } finally {
        setLoadingDoubts(false)
    }
  }

  // 3. Submit New Doubt
  const handleDoubtSubmit = async () => {
    if (!doubtModal.resource || !doubtMessage.trim()) return
    setIsSendingDoubt(true)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/v1/doubts", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                contextType: "RESOURCE",
                contextId: doubtModal.resource.id,
                question: doubtMessage
            })
        })
        if (res.ok) {
            setDoubtMessage("")
            // Refresh list
            fetchDoubtsForResource(doubtModal.resource.id)
        } else {
            alert("Failed to send doubt.")
        }
    } catch (error) {
        console.error("Error sending doubt:", error)
    } finally {
        setIsSendingDoubt(false)
    }
  }

  // 4. Page Filters
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

  // 5. Modal Internal Filtering
  const displayedModalDoubts = useMemo(() => {
    return resourceDoubts.filter(d => {
        const matchesSearch = d.question.toLowerCase().includes(doubtSearch.toLowerCase())
        let matchesStatus = true
        if (doubtFilter === "pending") matchesStatus = !d.answer
        if (doubtFilter === "resolved") matchesStatus = !!d.answer
        return matchesSearch && matchesStatus
    })
  }, [resourceDoubts, doubtSearch, doubtFilter])

  // Helpers

  const resetFilters = () => { // <--- ADDED MISSING FUNCTION
    setFilters({ class: "all", subject: "all", type: "all", exam: "all", search: "" })
  }
  
  const handleDownload = async (id: number, fileUrl: string) => {
    setDownloadingId(id)
    if (fileUrl && fileUrl.startsWith("http")) {
        setTimeout(() => { window.open(fileUrl, "_blank"); setDownloadingId(null) }, 1000)
    } else {
        alert("Downloading..."); setDownloadingId(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pyq": return FileText; case "notes": return BookOpen; case "assignment": return ClipboardList; case "imp": return Star; default: return FileText
    }
  }
  const formatResourceType = (type: string) => {
    const map: any = { 'pq': 'PYQ', 'notes': 'Notes', 'assignment': 'Assignment', 'imp': 'IMP' }; return map[type?.toLowerCase()] || type
  }
  const getUploaderName = (uploader: any) => typeof uploader === "string" ? uploader : uploader?.fullName || "Teacher"
  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all" && v !== "").length

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
        <p className="text-muted-foreground">Access your personalized study materials</p>
      </div>

      {/* --- Page Filters --- */}
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
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={`gap-2 ${activeFiltersCount > 0 ? "border-primary text-primary" : ""}`}>
          <Filter className="w-4 h-4" /> Filters {activeFiltersCount > 0 && <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">{activeFiltersCount}</span>}
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 mb-6 border-0 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filter Resources</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground"><X className="w-4 h-4 mr-1" /> Clear All</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium mb-2">Class</label><select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.class} onChange={(e) => setFilters({ ...filters, class: e.target.value })}><option value="all">All Classes</option><option value="Class 9">Class 9</option><option value="Class 10">Class 10</option><option value="Class 11">Class 11</option><option value="Class 12">Class 12</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Subject</label><select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}><option value="all">All Subjects</option><option value="Mathematics">Mathematics</option><option value="Physics">Physics</option><option value="Chemistry">Chemistry</option><option value="Biology">Biology</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Type</label><select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}><option value="all">All Types</option><option value="pq">PYQ</option><option value="notes">Notes</option><option value="assignment">Assignments</option><option value="imp">IMP Topics</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Exam</label><select className="w-full px-3 py-2 border border-border rounded-lg" value={filters.exam} onChange={(e) => setFilters({ ...filters, exam: e.target.value })}><option value="all">All Exams</option><option value="JEE Main">JEE Main</option><option value="JEE Advanced">JEE Advanced</option><option value="NEET">NEET</option><option value="MHT-CET">MHT-CET</option><option value="Board Exam">Board Exam</option></select></div>
          </div>
        </Card>
      )}

      <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center"><span>Showing {filteredResources.length} resources</span></div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type)
          const displayType = formatResourceType(resource.type)
          return (
            <Card key={resource.id} className="p-5 border-0 shadow-lg hover:shadow-xl transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayType === "PYQ" ? "bg-blue-500/10 text-blue-500" : displayType === "Notes" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-muted text-muted-foreground uppercase">{displayType}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <h3 className="font-bold text-lg hover:text-primary cursor-pointer line-clamp-1 flex-1" title={resource.title}>{resource.title}</h3>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0" onClick={() => setInfoModal({ open: true, resource })}><Info className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{resource.subject}</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{resource.targetClass}</span>
                {resource.exam && <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{resource.exam}</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-4 flex-1">{resource.downloads || 0} downloads</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDoubtModal({ open: true, resource })}><MessageSquare className="w-4 h-4 mr-2" /> Doubt</Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleDownload(resource.id, resource.fileUrl)} disabled={downloadingId === resource.id}>
                    {downloadingId === resource.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Download className="w-4 h-4 mr-2" /> Download</>}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
      )}

      {/* --- INFO MODAL --- */}
      <Dialog open={infoModal.open} onOpenChange={(open) => setInfoModal({ open, resource: null })}>
        <DialogContent>
            <DialogHeader><DialogTitle>Resource Details</DialogTitle></DialogHeader>
            {infoModal.resource && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Badge variant="outline">{infoModal.resource.subject}</Badge><span>•</span><span>{formatResourceType(infoModal.resource.type)}</span></div>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Class</span><span className="font-medium">{infoModal.resource.targetClass}</span></div>
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Exam</span><span className="font-medium">{infoModal.resource.exam || "N/A"}</span></div>
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Uploaded By</span><span className="font-medium">{getUploaderName(infoModal.resource.uploadedBy)}</span></div>
                        <div><span className="text-muted-foreground block text-xs uppercase tracking-wide">Downloads</span><span className="font-medium">{infoModal.resource.downloads}</span></div>
                    </div>
                    <div className="space-y-1"><Label className="text-muted-foreground">Description</Label><div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap min-h-[100px]">{infoModal.resource.description || "No description provided."}</div></div>
                    <DialogFooter><Button className="w-full" onClick={() => handleDownload(infoModal.resource!.id, infoModal.resource!.fileUrl)}><Download className="w-4 h-4 mr-2" /> Download File</Button></DialogFooter>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* --- UNIFIED DOUBT MODAL --- */}
      <Dialog open={doubtModal.open} onOpenChange={(open) => setDoubtModal({ open, resource: null })}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Discussion: {doubtModal.resource?.title}</DialogTitle>
            <DialogDescription>Ask a question or browse previous doubts for this resource.</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* 1. Ask New Doubt Section */}
            <div className="bg-muted/30 p-4 rounded-xl border space-y-3 shrink-0">
                <Label className="text-sm font-medium">Ask a New Doubt</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Type your question here..." 
                        value={doubtMessage}
                        onChange={(e) => setDoubtMessage(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleDoubtSubmit()}
                    />
                    <Button 
                        onClick={handleDoubtSubmit} 
                        disabled={isSendingDoubt || !doubtMessage.trim()} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                    >
                        {isSendingDoubt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* 2. Filters & Search */}
            <div className="flex gap-2 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search previous questions..." 
                        className="pl-9 h-9" 
                        value={doubtSearch}
                        onChange={(e) => setDoubtSearch(e.target.value)}
                    />
                </div>
                <Select value={doubtFilter} onValueChange={setDoubtFilter}>
                    <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 3. Doubts List */}
            <ScrollArea className="flex-1 -mr-4 pr-4">
                {loadingDoubts ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : displayedModalDoubts.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No doubts found.</p>
                        {resourceDoubts.length === 0 && <p className="text-xs">Be the first to ask!</p>}
                    </div>
                ) : (
                    <div className="space-y-3 pb-2">
                        {displayedModalDoubts.map(doubt => (
                            <div key={doubt.id} className="border rounded-lg p-3 bg-card text-sm space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-muted-foreground">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                                    {doubt.answer ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]"><CheckCircle className="w-3 h-3 mr-1"/> Resolved</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px]"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5"><User className="w-3 h-3" /></div>
                                    <p className="font-medium text-foreground">{doubt.question}</p>
                                </div>
                                {doubt.answer && (
                                    <div className="ml-9 bg-emerald-50/50 p-2.5 rounded-md border border-emerald-100">
                                        <div className="flex items-center gap-1.5 mb-1 text-emerald-700 font-semibold text-xs">
                                            <CornerDownRight className="w-3 h-3" /> Teacher's Reply
                                        </div>
                                        <p className="text-emerald-900 leading-relaxed">{doubt.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDoubtModal({ open: false, resource: null })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </StudentSidebar>
  )
}