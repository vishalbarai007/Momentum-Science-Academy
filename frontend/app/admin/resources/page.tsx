"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  FileText,
  BookOpen,
  ClipboardList,
  AlertCircle,
  Plus,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"

// Interface matching the transformed backend data
interface Resource {
  id: number
  title: string
  type: string
  subject: string
  class: string
  exam: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
  status: "Published" | "Draft"
  fileSize: string // Placeholder as backend might not send file size yet
  fileUrl: string
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  
  // Modal States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // --- 1. Fetch Resources from Backend ---
  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token")
      // Use the generic GET endpoint which returns all resources for Admins
      const response = await fetch("http://localhost:8080/api/v1/resources", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        // Map backend data to frontend interface
        const mappedData: Resource[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: formatResourceType(item.type),
          subject: item.subject,
          class: item.targetClass,
          exam: item.exam,
          uploadedBy: item.uploadedBy?.fullName || "Unknown",
          uploadedAt: new Date(item.createdAt).toLocaleDateString(),
          downloads: item.downloads || 0,
          status: item.isPublished ? "Published" : "Draft",
          fileSize: "N/A", // Backend usually doesn't store size unless explicitly added
          fileUrl: item.fileUrl
        }))
        
        // Sort by newest first
        setResources(mappedData.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()))
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Helper Functions ---
  const formatResourceType = (type: string) => {
    const map: Record<string, string> = {
      'pq': 'PYQ', 'pyq': 'PYQ',
      'notes': 'Notes',
      'assignment': 'Assignment',
      'imp': 'Important'
    }
    return map[type?.toLowerCase()] || type
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PYQ": return <FileText className="w-4 h-4" />
      case "Notes": return <BookOpen className="w-4 h-4" />
      case "Assignment": return <ClipboardList className="w-4 h-4" />
      case "Important": return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "PYQ": return "bg-blue-100 text-blue-700"
      case "Notes": return "bg-green-100 text-green-700"
      case "Assignment": return "bg-orange-100 text-orange-700"
      case "Important": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // --- Actions ---

  const handleDelete = async () => {
    if (!selectedResource) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/resources/${selectedResource.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        setResources(resources.filter((r) => r.id !== selectedResource.id))
        setDeleteDialogOpen(false)
        setSelectedResource(null)
        showSuccess("Resource deleted successfully")
      } else {
        alert("Failed to delete resource")
      }
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const handleDownload = (resource: Resource) => {
    if (resource.fileUrl) {
        window.open(resource.fileUrl, "_blank")
    } else {
        alert("No file link available")
    }
  }

  // Toggle Status (Publish/Draft) - Requires PUT endpoint updates
  const handleToggleStatus = async (resource: Resource) => {
    // This requires the Update Endpoint logic from previous steps.
    // For now, we simulate UI update or implement if backend supports generic update
    alert("Status toggle functionality requires the Edit Endpoint integration.")
  }

  // Filter Logic
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Note: Backend stores "Notes", Frontend filter uses "Notes"
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesSubject = filterSubject === "all" || resource.subject === filterSubject
    
    // Status mapping: "active" filter -> "Published" status
    const matchesStatus = filterStatus === "all" || 
        (filterStatus === "active" && resource.status === "Published") ||
        (filterStatus === "archived" && resource.status === "Draft")

    return matchesSearch && matchesType && matchesSubject && matchesStatus
  })

  return (
    <AdminSidebar>
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Resources Management</h1>
            <p className="text-muted-foreground">Manage all educational resources</p>
          </div>
          {/* Note: Admin upload usually redirects to a specific admin upload page or reuses teacher form */}
          {/* <Button className="gap-2"> <Plus className="w-4 h-4" /> Upload Resource </Button> */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Resources", value: resources.length, color: "bg-blue-500" },
            { label: "Published", value: resources.filter((r) => r.status === "Published").length, color: "bg-green-500" },
            { label: "Drafts", value: resources.filter((r) => r.status === "Draft").length, color: "bg-gray-500" },
            {
              label: "Total Downloads",
              value: resources.reduce((acc, r) => acc + r.downloads, 0),
              color: "bg-orange-500",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources or uploader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PYQ">PYQ</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Published</SelectItem>
                <SelectItem value="archived">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden min-h-[300px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-2 text-primary" />
                <p>Loading resources...</p>
             </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead className="hidden md:table-cell">Class</TableHead>
                <TableHead className="hidden lg:table-cell">Uploaded By</TableHead>
                <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.uploadedAt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeBadgeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{resource.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">{resource.class}</TableCell>
                  <TableCell className="hidden lg:table-cell">{resource.uploadedBy}</TableCell>
                  <TableCell className="hidden lg:table-cell">{resource.downloads}</TableCell>
                  <TableCell>
                    <Badge variant={resource.status === "Published" ? "default" : "secondary"} className={resource.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                        {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedResource(resource)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(resource)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                                setSelectedResource(resource)
                                setDeleteDialogOpen(true)
                            }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resource Details</DialogTitle>
            </DialogHeader>
            {selectedResource && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center">
                    {getTypeIcon(selectedResource.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedResource.title}</h3>
                    <Badge className={getTypeBadgeColor(selectedResource.type)}>{selectedResource.type}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedResource.subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Class</p>
                    <p className="font-medium">{selectedResource.class}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exam</p>
                    <p className="font-medium">{selectedResource.exam}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uploaded By</p>
                    <p className="font-medium">{selectedResource.uploadedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Upload Date</p>
                    <p className="font-medium">{selectedResource.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Downloads</p>
                    <p className="font-medium">{selectedResource.downloads}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={selectedResource.status === "Published" ? "default" : "secondary"}>
                      {selectedResource.status}
                    </Badge>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleDownload(selectedResource)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Resource
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Resource</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminSidebar>
  )
}