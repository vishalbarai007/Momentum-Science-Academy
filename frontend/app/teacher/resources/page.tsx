"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Plus, Edit, Trash2, CheckCircle, Search, Loader2, ExternalLink, Save, Eye, EyeOff, Filter, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Interface matching Backend Resource Model
interface Resource {
  id: number
  title: string
  type: string       // Frontend display format (e.g., "PYQ")
  subject: string
  targetClass: string // Frontend display format (e.g., "11")
  exam: string       // Frontend display format (e.g., "JEE Advanced")
  downloads: number
  status: string
  date: string
  description?: string
  fileUrl?: string
}

// Constants
const CLASS_OPTIONS = ["9", "10", "11", "12"]
const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "Biology"]
const TYPE_OPTIONS = ["PYQ", "Notes", "Assignment", "IMP"]
const EXAM_OPTIONS = ["JEE Main", "JEE Advanced", "NEET", "MHT-CET", "Foundation", "Board Exam"]

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  // Filter State
  const [filters, setFilters] = useState({
    class: "all",
    subject: "all",
    type: "all",
    exam: "all",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Modal States
  const [editModal, setEditModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false,
    resource: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; resourceId: number | null }>({
    open: false,
    resourceId: null,
  })
  const [openLinkModal, setOpenLinkModal] = useState<{ open: boolean; link: string | null; title: string | null }>({
    open: false,
    link: null,
    title: null
  })

  // Edit Form State
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    resourceType: "",
    subject: "",
    classLevel: "",
    examType: "",
    fileLink: "",
    visibility: ""
  })

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchResources()
  }, [])

  // --- Filter Logic ---
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // Normalize comparison for classes (e.g. data "Class 11" vs filter "11" or "Class 11")
      const resourceClass = resource.targetClass.replace("Class ", "")
      const filterClass = filters.class.replace("Class ", "")
      const matchesClass = filters.class === "all" || resourceClass === filterClass

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

  const resetFilters = () => {
    setFilters({ class: "all", subject: "all", type: "all", exam: "all", search: "" })
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all" && v !== "").length

  // --- HELPER: Map Backend Types ---
  const formatResourceTypeFromBackend = (type: string) => {
    if (!type) return "Notes"
    const map: Record<string, string> = {
      'pq': 'PYQ',
      'pyq': 'PYQ',
      'notes': 'Notes',
      'assignment': 'Assignment',
      'imp': 'IMP'
    }
    return map[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://localhost:8080/api/v1/resources/my-uploads", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const mappedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: formatResourceTypeFromBackend(item.type),
          subject: item.subject,
          targetClass: item.targetClass, 
          exam: item.exam,
          downloads: item.downloads || 0,
          status: item.isPublished ? "Published" : "Draft",
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          fileUrl: item.fileUrl
        }))
        // Sort by newest first
        setResources(mappedData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Edit & Delete Handlers ---
  const handleEdit = (resource: Resource) => {
    setEditForm({
      title: resource.title,
      description: resource.description || "",
      resourceType: resource.type,
      subject: resource.subject,
      classLevel: resource.targetClass.replace("Class ", ""), // Strip prefix if present for select match
      examType: resource.exam || "",
      fileLink: resource.fileUrl || "",
      visibility: resource.status === "Published" ? "publish" : "draft"
    })
    setEditModal({ open: true, resource })
  }

  const handleSaveEdit = async () => {
    if (!editModal.resource) return
    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      const payload = {
        title: editForm.title,
        description: editForm.description,
        resourceType: editForm.resourceType.toLowerCase() === 'pyq' ? 'pq' : editForm.resourceType.toLowerCase(),
        subject: editForm.subject,
        classLevel: `Class ${editForm.classLevel}`, // Add prefix for backend consistency
        examType: editForm.examType,
        fileLink: editForm.fileLink,
        visibility: editForm.visibility
      }

      const response = await fetch(`http://localhost:8080/api/v1/resources/${editModal.resource.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        fetchResources() // Reload to get fresh data
        setSuccessMessage("Resource updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditModal({ open: false, resource: null })
      } else {
        alert("Failed to update resource.")
      }
    } catch (error) {
      console.error("Error updating resource:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/v1/resources/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setResources(resources.filter((r) => r.id !== id))
        setSuccessMessage("Resource deleted successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error deleting resource:", error)
    } finally {
      setDeleteModal({ open: false, resourceId: null })
    }
  }

  const handleOpenLinkClick = (resource: Resource) => {
    if (resource.fileUrl) {
      setOpenLinkModal({ open: true, link: resource.fileUrl, title: resource.title })
    } else {
      alert("No file link available.")
    }
  }

  const confirmRedirect = () => {
    if (openLinkModal.link) {
      window.open(openLinkModal.link, "_blank")
      setOpenLinkModal({ open: false, link: null, title: null })
    }
  }

  return (
    <TeacherSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Resources</h1>
        <p className="text-muted-foreground">Manage and filter your uploaded study materials</p>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* --- Action Bar: Search, Filter Toggle, New Upload --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 h-full ${activeFiltersCount > 0 ? "border-emerald-500 text-emerald-600 bg-emerald-50" : ""}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <Link href="/teacher/upload">
              <Button className="bg-emerald-500 text-white hover:bg-emerald-600 h-full">
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </Link>
        </div>
      </div>

      {/* --- Filter Panel --- */}
      {showFilters && (
        <Card className="p-4 mb-6 border-0 shadow-lg animate-fade-in bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Filter Resources</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-destructive">
              <X className="w-4 h-4 mr-1" /> Clear All
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              >
                <option value="all">All Classes</option>
                {CLASS_OPTIONS.map(opt => <option key={opt} value={opt}>Class {opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="all">All Subjects</option>
                {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Exam</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={filters.exam}
                onChange={(e) => setFilters({ ...filters, exam: e.target.value })}
              >
                <option value="all">All Exams</option>
                {EXAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* --- Table --- */}
      <Card className="overflow-hidden border-0 shadow-lg min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-emerald-500" />
            <p>Loading your resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Search className="w-12 h-12 mb-4 text-muted-foreground/30" />
            <p>No resources match your filters.</p>
            <Button variant="link" onClick={resetFilters} className="text-emerald-500">Reset Filters</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenLinkClick(resource)}
                        className="font-medium text-emerald-600 hover:underline flex items-center gap-2 text-left"
                      >
                        {resource.title}
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <div className="text-xs text-muted-foreground mt-1">
                        {resource.subject} • {resource.exam}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded font-medium uppercase">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{resource.targetClass}</td>
                    <td className="px-6 py-4">
                      <Badge variant={resource.status === "Published" ? "default" : "secondary"} className={resource.status === "Published" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}>
                        {resource.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 bg-transparent"
                          onClick={() => setDeleteModal({ open: true, resourceId: resource.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* --- EDIT MODAL (Unchanged Logic, mostly) --- */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, resource: null })}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="e.g. Physics Chapter 1 Notes"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">File Link (Drive/Dropbox URL)</label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={editForm.fileLink}
                  onChange={(e) => setEditForm({ ...editForm, fileLink: e.target.value })}
                  className="pl-9"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border">
              <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                {editForm.visibility === 'publish' ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                Visibility Status
              </label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={editForm.visibility}
                onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
              >
                <option value="publish">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={editForm.resourceType}
                  onChange={(e) => setEditForm({ ...editForm, resourceType: e.target.value })}
                >
                  <option value="">Select Type</option>
                  {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Class</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={editForm.classLevel}
                  onChange={(e) => setEditForm({ ...editForm, classLevel: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {CLASS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Target Exam</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={editForm.examType}
                  onChange={(e) => setEditForm({ ...editForm, examType: e.target.value })}
                >
                  <option value="">Select Exam</option>
                  {EXAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Optional description..."
                className="h-24"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditModal({ open: false, resource: null })}
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1 bg-emerald-500 hover:bg-emerald-600" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, resourceId: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Resource</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, resourceId: null })} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteModal.resourceId && handleDelete(deleteModal.resourceId)} className="flex-1">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Open Link Modal */}
      <Dialog open={openLinkModal.open} onOpenChange={(open) => setOpenLinkModal({ ...openLinkModal, open })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Open Resource</DialogTitle></DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-2">Redirecting to:</p>
            <div className="bg-muted p-3 rounded border"><p className="font-medium text-emerald-600 break-all text-sm">{openLinkModal.link}</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLinkModal({ open: false, link: null, title: null })}>Cancel</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={confirmRedirect}>Open Link <ExternalLink className="w-4 h-4 ml-2" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </TeacherSidebar>
  )
}