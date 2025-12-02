"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Edit, Trash2, Eye, CheckCircle, GraduationCap, Users, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students")
  const [searchQuery, setSearchQuery] = useState("")
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<{ open: boolean; user: any }>({ open: false, user: null })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId: number | null }>({
    open: false,
    userId: null,
  })
  const [viewModal, setViewModal] = useState<{ open: boolean; user: any }>({ open: false, user: null })
  const [successMessage, setSuccessMessage] = useState("")

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aditya Kumar",
      email: "aditya@email.com",
      phone: "+91 98765 43210",
      class: "12",
      program: "JEE",
      status: "Active",
      joinDate: "Sep 15, 2024",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@email.com",
      phone: "+91 87654 32109",
      class: "11",
      program: "NEET",
      status: "Active",
      joinDate: "Oct 1, 2024",
    },
    {
      id: 3,
      name: "Rahul Sharma",
      email: "rahul@email.com",
      phone: "+91 76543 21098",
      class: "12",
      program: "JEE",
      status: "Active",
      joinDate: "Aug 20, 2024",
    },
    {
      id: 4,
      name: "Neha Patel",
      email: "neha@email.com",
      phone: "+91 65432 10987",
      class: "10",
      program: "Foundation",
      status: "Inactive",
      joinDate: "Jul 10, 2024",
    },
  ])

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Prof. R.P. Singh",
      email: "rp.singh@momentum.edu",
      phone: "+91 98765 11111",
      subject: "Mathematics",
      experience: "18 years",
      status: "Active",
      joinDate: "Jan 1, 2020",
    },
    {
      id: 2,
      name: "Dr. P.V. Shukla",
      email: "pv.shukla@momentum.edu",
      phone: "+91 98765 22222",
      subject: "Physics",
      experience: "20 years",
      status: "Active",
      joinDate: "Jan 1, 2019",
    },
    {
      id: 3,
      name: "Dr. Seema Verma",
      email: "seema@momentum.edu",
      phone: "+91 98765 33333",
      subject: "Chemistry",
      experience: "16 years",
      status: "Active",
      joinDate: "Mar 15, 2021",
    },
  ])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    class: "",
    program: "",
    subject: "",
    experience: "",
  })

  const currentList = activeTab === "students" ? students : teachers
  const filteredList = currentList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = () => {
    if (activeTab === "students") {
      const newStudent = {
        id: students.length + 1,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        class: newUser.class,
        program: newUser.program,
        status: "Active",
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }
      setStudents([...students, newStudent])
    } else {
      const newTeacher = {
        id: teachers.length + 1,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        subject: newUser.subject,
        experience: newUser.experience,
        status: "Active",
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }
      setTeachers([...teachers, newTeacher])
    }
    setAddModal(false)
    setNewUser({ name: "", email: "", phone: "", password: "", class: "", program: "", subject: "", experience: "" })
    setSuccessMessage(`${activeTab === "students" ? "Student" : "Teacher"} added successfully!`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDelete = (id: number) => {
    if (activeTab === "students") {
      setStudents(students.filter((s) => s.id !== id))
    } else {
      setTeachers(teachers.filter((t) => t.id !== id))
    }
    setDeleteModal({ open: false, userId: null })
    setSuccessMessage("User deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDownloadCredentials = (user: any) => {
    const credentials = `
Momentum Science Academy - Login Credentials
=============================================
Name: ${user.name}
Email: ${user.email}
Temporary Password: Momentum@123

Please change your password after first login.
Portal: https://momentum.edu/login
    `
    const blob = new Blob([credentials], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${user.name.replace(/\s+/g, "_")}_credentials.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminSidebar>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage students and teachers</p>
        </div>
        <Button onClick={() => setAddModal(true)} className="bg-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add {activeTab === "students" ? "Student" : "Teacher"}
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "students" ? "default" : "outline"}
          onClick={() => setActiveTab("students")}
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Students ({students.length})
        </Button>
        <Button
          variant={activeTab === "teachers" ? "default" : "outline"}
          onClick={() => setActiveTab("teachers")}
          className="gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          Teachers ({teachers.length})
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  {activeTab === "students" ? "Class/Program" : "Subject"}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((user: any) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    {activeTab === "students" ? `Class ${user.class} - ${user.program}` : user.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewModal({ open: true, user })}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditModal({ open: true, user })}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadCredentials(user)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 bg-transparent"
                        onClick={() => setDeleteModal({ open: true, userId: user.id })}
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

      {/* Add User Modal */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {activeTab === "students" ? "Student" : "Teacher"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email *</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone *</label>
              <Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Temporary Password *</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Set initial password"
              />
            </div>
            {activeTab === "students" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class *</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      value={newUser.class}
                      onChange={(e) => setNewUser({ ...newUser, class: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Program *</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      value={newUser.program}
                      onChange={(e) => setNewUser({ ...newUser, program: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="JEE">JEE</option>
                      <option value="NEET">NEET</option>
                      <option value="MHT-CET">MHT-CET</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    value={newUser.subject}
                    onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience</label>
                  <Input
                    value={newUser.experience}
                    onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                    placeholder="e.g., 10 years"
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setAddModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddUser} className="flex-1">
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewModal.user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                  {viewModal.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewModal.user.name}</h3>
                  <p className="text-muted-foreground">{viewModal.user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewModal.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{viewModal.user.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{viewModal.user.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{activeTab === "students" ? "Program" : "Subject"}</p>
                  <p className="font-medium">
                    {activeTab === "students" ? viewModal.user.program : viewModal.user.subject}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, userId: null })} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.userId && handleDelete(deleteModal.userId)}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminSidebar>
  )
}
