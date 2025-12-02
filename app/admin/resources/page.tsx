"use client"

import type React from "react"

import { useState } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  CheckCircle,
  AlertCircle,
  Plus,
  Upload,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  type: "PYQ" | "Notes" | "Assignment" | "Important"
  subject: string
  class: string
  exam: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
  status: "active" | "archived"
  fileSize: string
}

const initialResources: Resource[] = [
  {
    id: "1",
    title: "JEE Main 2024 Physics Paper",
    type: "PYQ",
    subject: "Physics",
    class: "12th",
    exam: "JEE",
    uploadedBy: "Prof. R.P. Singh",
    uploadedAt: "2024-01-15",
    downloads: 234,
    status: "active",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Organic Chemistry Notes - Chapter 1-5",
    type: "Notes",
    subject: "Chemistry",
    class: "11th",
    exam: "JEE",
    uploadedBy: "Dr. P.V. Shukla",
    uploadedAt: "2024-01-12",
    downloads: 189,
    status: "active",
    fileSize: "5.1 MB",
  },
  {
    id: "3",
    title: "Biology Assignment - Cell Structure",
    type: "Assignment",
    subject: "Biology",
    class: "11th",
    exam: "NEET",
    uploadedBy: "Dr. Anjali Mehta",
    uploadedAt: "2024-01-10",
    downloads: 156,
    status: "active",
    fileSize: "1.8 MB",
  },
  {
    id: "4",
    title: "Important Formulas - Mathematics",
    type: "Important",
    subject: "Mathematics",
    class: "12th",
    exam: "JEE",
    uploadedBy: "Prof. S.K. Verma",
    uploadedAt: "2024-01-08",
    downloads: 312,
    status: "active",
    fileSize: "890 KB",
  },
  {
    id: "5",
    title: "NEET 2023 Biology Paper",
    type: "PYQ",
    subject: "Biology",
    class: "12th",
    exam: "NEET",
    uploadedBy: "Dr. Anjali Mehta",
    uploadedAt: "2024-01-05",
    downloads: 278,
    status: "archived",
    fileSize: "3.2 MB",
  },
]

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesSubject = filterSubject === "all" || resource.subject === filterSubject
    const matchesStatus = filterStatus === "all" || resource.status === filterStatus
    return matchesSearch && matchesType && matchesSubject && matchesStatus
  })

  const handleDelete = () => {
    if (selectedResource) {
      setResources(resources.filter((r) => r.id !== selectedResource.id))
      setDeleteDialogOpen(false)
      setSelectedResource(null)
      showSuccess("Resource deleted successfully")
    }
  }

  const handleDownload = (resource: Resource) => {
    setResources(resources.map((r) => (r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)))
    showSuccess(`Downloading ${resource.title}...`)
  }

  const handleToggleStatus = (resource: Resource) => {
    setResources(
      resources.map((r) =>
        r.id === resource.id ? { ...r, status: r.status === "active" ? "archived" : "active" } : r,
      ),
    )
    showSuccess(`Resource ${resource.status === "active" ? "archived" : "activated"}`)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newResource: Resource = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as Resource["type"],
      subject: formData.get("subject") as string,
      class: formData.get("class") as string,
      exam: formData.get("exam") as string,
      uploadedBy: "Admin",
      uploadedAt: new Date().toISOString().split("T")[0],
      downloads: 0,
      status: "active",
      fileSize: "1.0 MB",
    }
    setResources([newResource, ...resources])
    setUploadDialogOpen(false)
    showSuccess("Resource uploaded successfully!")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PYQ":
        return <FileText className="w-4 h-4" />
      case "Notes":
        return <BookOpen className="w-4 h-4" />
      case "Assignment":
        return <ClipboardList className="w-4 h-4" />
      case "Important":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "PYQ":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "Notes":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "Assignment":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "Important":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Resource
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Resources", value: resources.length, color: "bg-blue-500" },
            { label: "Active", value: resources.filter((r) => r.status === "active").length, color: "bg-green-500" },
            { label: "Archived", value: resources.filter((r) => r.status === "archived").length, color: "bg-gray-500" },
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
                placeholder="Search resources..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                        <p className="text-xs text-muted-foreground">{resource.fileSize}</p>
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
                    <Badge variant={resource.status === "active" ? "default" : "secondary"}>{resource.status}</Badge>
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
                        <DropdownMenuItem onClick={() => handleToggleStatus(resource)}>
                          {resource.status === "active" ? "Archive" : "Activate"}
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
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
              <DialogDescription>Add a new educational resource to the platform</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="Resource title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PYQ">PYQ</SelectItem>
                      <SelectItem value="Notes">Notes</SelectItem>
                      <SelectItem value="Assignment">Assignment</SelectItem>
                      <SelectItem value="Important">Important</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select name="class" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th</SelectItem>
                      <SelectItem value="10th">10th</SelectItem>
                      <SelectItem value="11th">11th</SelectItem>
                      <SelectItem value="12th">12th</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam">Exam</Label>
                  <Select name="exam" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JEE">JEE</SelectItem>
                      <SelectItem value="NEET">NEET</SelectItem>
                      <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                      <SelectItem value="Boards">Boards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 10MB</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Resource</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
                    <p className="text-muted-foreground">File Size</p>
                    <p className="font-medium">{selectedResource.fileSize}</p>
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
                    <Badge variant={selectedResource.status === "active" ? "default" : "secondary"}>
                      {selectedResource.status}
                    </Badge>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleDownload(selectedResource)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
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
