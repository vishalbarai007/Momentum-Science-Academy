"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Plus, Edit, Trash2, CheckCircle, Search, Loader2, ExternalLink, Save, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// 1. Updated Constants to match likely Backend Enumerations
const CLASS_OPTIONS = ["9", "10", "11", "12"]
const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "Biology"]
const TYPE_OPTIONS = ["PYQ", "Notes", "Assignment", "IMP"]
// Updated to match specific backend formats like "JEE Advanced"
const EXAM_OPTIONS = ["JEE Main", "JEE Advanced", "NEET", "MHT-CET", "Foundation", "Board Exam"]

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  
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
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchResources()
  }, [])

  // --- HELPER: Map Backend Types (lowercase/short) to Frontend Display ---
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
          type: formatResourceTypeFromBackend(item.type), // Convert 'notes' -> 'Notes'
          subject: item.subject,
          targetClass: item.targetClass, // Convert 'Class 11' -> '11'
          exam: item.exam,
          downloads: item.downloads || 0,
          status: item.isPublished ? "Published" : "Draft",
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          fileUrl: item.fileUrl
        }))
        setResources(mappedData)
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Edit Click - Populate Form
  const handleEdit = (resource: Resource) => {
    setEditForm({
      title: resource.title,
      description: resource.description || "",
      resourceType: resource.type, // Already formatted as "Notes", "PYQ" etc by fetch
      subject: resource.subject,
      classLevel: resource.targetClass, // Already formatted as "11", "12" by fetch
      examType: resource.exam || "",
      fileLink: resource.fileUrl || "",
      visibility: resource.status === "Published" ? "publish" : "draft"
    })
    setEditModal({ open: true, resource })
  }

  // Handle Save Changes (Convert Frontend Formats -> Backend Formats)
  const handleSaveEdit = async () => {
    if (!editModal.resource) return
    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      
      // Construct Payload with BACKEND formats
      const payload = {
        title: editForm.title,
        description: editForm.description,
        
        // 1. Convert Type to Lowercase (e.g., "PYQ" -> "pyq")
        resourceType: editForm.resourceType.toLowerCase() === 'pyq' ? 'pq' : editForm.resourceType.toLowerCase(),
        
        subject: editForm.subject,
        
        // 2. Convert Class to "Class X" format
        classLevel: `Class ${editForm.classLevel}`, 
        
        // 3. Exam is sent as is (assuming dropdown matches backend)
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
        // Optimistic UI Update (Keep Frontend Formats)
        setResources(prev => prev.map(r => 
          r.id === editModal.resource!.id 
            ? { 
                ...r, 
                title: editForm.title,
                description: editForm.description,
                type: editForm.resourceType,
                subject: editForm.subject,
                targetClass: editForm.classLevel,
                exam: editForm.examType,
                fileUrl: editForm.fileLink,
                status: editForm.visibility === "publish" ? "Published" : "Draft"
              } 
            : r
        ))
        
        setSuccessMessage("Resource updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditModal({ open: false, resource: null })
      } else {
        alert("Failed to update resource. Please try again.")
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
      alert("No file link available for this resource.")
    }
  }

  const confirmRedirect = () => {
    if (openLinkModal.link) {
      window.open(openLinkModal.link, "_blank")
      setOpenLinkModal({ open: false, link: null, title: null })
    }
  }

  const filteredResources = resources.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <TeacherSidebar>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Resources</h1>
          <p className="text-muted-foreground">Manage your uploaded study materials</p>
        </div>
        <Link href="/teacher/upload">
          <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
            <Plus className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        </Link>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-0 shadow-lg min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-emerald-500" />
            <p>Loading your resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <p>No resources found.</p>
            <Link href="/teacher/upload" className="text-emerald-500 hover:underline mt-2">Upload your first resource</Link>
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

      {/* --- EXPANDED EDIT MODAL --- */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, resource: null })}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input 
                value={editForm.title} 
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                placeholder="e.g. Physics Chapter 1 Notes"
              />
            </div>

            {/* File URL */}
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

            {/* Row: Visibility (Status) */}
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
                    <option value="publish">Published (Visible to Students)</option>
                    <option value="draft">Draft (Hidden)</option>
                </select>
            </div>

            {/* Row 1: Type & Subject */}
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

            {/* Row 2: Class & Exam */}
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

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Optional description..."
                className="h-24"
              />
            </div>

            {/* Footer Actions */}
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