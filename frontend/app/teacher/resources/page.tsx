"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Plus, Edit, Trash2, CheckCircle, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Algebra Equations",
      type: "Notes",
      class: "11-12",
      downloads: 156,
      status: "Published",
      date: "Today",
    },
    {
      id: 2,
      title: "JEE Main 2024 Paper",
      type: "PYQ",
      class: "12",
      downloads: 342,
      status: "Published",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Trigonometry Set 2",
      type: "Assignment",
      class: "11",
      downloads: 89,
      status: "Published",
      date: "2 days",
    },
    { id: 4, title: "Calculus Formulas", type: "IMP", class: "12", downloads: 203, status: "Draft", date: "3 days" },
  ])
  const [editModal, setEditModal] = useState<{ open: boolean; resource: (typeof resources)[0] | null }>({
    open: false,
    resource: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; resourceId: number | null }>({
    open: false,
    resourceId: null,
  })
  const [editForm, setEditForm] = useState({ title: "", description: "" })
  const [successMessage, setSuccessMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (resource: (typeof resources)[0]) => {
    setEditForm({ title: resource.title, description: "" })
    setEditModal({ open: true, resource })
  }

  const handleSaveEdit = () => {
    if (editModal.resource) {
      setResources(resources.map((r) => (r.id === editModal.resource!.id ? { ...r, title: editForm.title } : r)))
      setEditModal({ open: false, resource: null })
      setSuccessMessage("Resource updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleDelete = (id: number) => {
    setResources(resources.filter((r) => r.id !== id))
    setDeleteModal({ open: false, resourceId: null })
    setSuccessMessage("Resource deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
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
      <Card className="overflow-hidden border-0 shadow-lg">
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
                  <td className="px-6 py-4 font-medium">{resource.title}</td>
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
    </TeacherSidebar>
  )
}
