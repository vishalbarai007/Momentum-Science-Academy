"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Plus, Edit, Trash2, CheckCircle, Search, Loader2, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Updated interface to include fileUrl
interface Resource {
  id: number
  title: string
  type: string
  class: string
  downloads: number
  status: string
  date: string
  description?: string
  fileUrl?: string
}

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal & Form States
  const [editModal, setEditModal] = useState<{ open: boolean; resource: Resource | null }>({
    open: false,
    resource: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; resourceId: number | null }>({
    open: false,
    resourceId: null,
  })
  
  // NEW: State for the Open Link Confirmation Modal
  const [openLinkModal, setOpenLinkModal] = useState<{ open: boolean; link: string | null; title: string | null }>({
    open: false,
    link: null,
    title: null
  })

  const [editForm, setEditForm] = useState({ title: "", description: "" })
  const [successMessage, setSuccessMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // 1. Fetch Resources on Component Mount
  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return 

      const response = await fetch("http://localhost:8080/api/v1/resources/my-uploads", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        // Map backend entities to frontend state
        const mappedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: formatResourceType(item.type),
          class: item.targetClass,
          downloads: item.downloads || 0,
          status: item.isPublished ? "Published" : "Draft",
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          fileUrl: item.fileUrl // Ensure this is mapped from backend
        }))
        
        setResources(mappedData)
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatResourceType = (type: string) => {
    const map: Record<string, string> = {
      'pq': 'PYQ',
      'notes': 'Notes',
      'assignment': 'Assignment',
      'imp': 'IMP'
    }
    return map[type.toLowerCase()] || type
  }

  // Handle Delete
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/v1/resources/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setResources(resources.filter((r) => r.id !== id))
        setSuccessMessage("Resource deleted successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        console.error("Failed to delete resource")
      }
    } catch (error) {
      console.error("Error deleting resource:", error)
    } finally {
      setDeleteModal({ open: false, resourceId: null })
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditForm({ title: resource.title, description: resource.description || "" })
    setEditModal({ open: true, resource })
  }

  const handleSaveEdit = async () => {
    if (editModal.resource) {
      // Optimistic update
      setResources(resources.map((r) => (r.id === editModal.resource!.id ? { ...r, title: editForm.title, description: editForm.description } : r)))
      setEditModal({ open: false, resource: null })
      setSuccessMessage("Resource updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  // NEW: Handle Open Link Click
  const handleOpenLinkClick = (resource: Resource) => {
    if (resource.fileUrl) {
      setOpenLinkModal({ open: true, link: resource.fileUrl, title: resource.title })
    } else {
      // Fallback if no link exists
      alert("No file link available for this resource.")
    }
  }

  // NEW: Confirm Redirect Logic
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Downloads</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {/* NEW: Clickable Title triggering the Modal */}
                      <button 
                        onClick={() => handleOpenLinkClick(resource)}
                        className="font-medium text-emerald-600 hover:underline flex items-center gap-2 text-left"
                      >
                        {resource.title}
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded font-medium">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{resource.class}</td>
                    <td className="px-6 py-4 text-sm font-medium">{resource.downloads}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          resource.status === "Published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {resource.status}
                      </span>
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

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, resource: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Add a description..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditModal({ open: false, resource: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, resourceId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this resource? This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, resourceId: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.resourceId && handleDelete(deleteModal.resourceId)}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* NEW: Open Link Confirmation Modal */}
      <Dialog open={openLinkModal.open} onOpenChange={(open) => setOpenLinkModal({ ...openLinkModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Resource</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-2">
              You are about to be redirected to the following resource:
            </p>
            <div className="bg-muted p-3 rounded-md border border-border">
              <p className="font-medium text-emerald-600 break-all text-sm">
                {openLinkModal.link}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Do you want to continue?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenLinkModal({ open: false, link: null, title: null })}
            >
              Cancel
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={confirmRedirect}
            >
              Open Link <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </TeacherSidebar>
  )
}