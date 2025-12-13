"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Edit, Trash2, Eye, CheckCircle, GraduationCap, Users, Shield, Loader2, Tag, ChevronDown, ChevronUp, Save, Lock, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Types matching Backend User
interface User {
  id: number
  fullName: string
  email: string
  phone: string
  role: string
  // Student fields
  studentClass?: string
  program?: string
  // Teacher fields
  expertise?: string[]
  experience?: number
  qualifications?: string[]
  // Access Control
  accessTags?: string[] 
  status?: string
}

// Configuration for Access Tags
const ACCESS_CATEGORIES = {
  "Classes": ["9", "10", "11", "12"],
  "Exams": ["JEE", "NEET", "MHT-CET", "Foundation"],
  "Subjects": ["Mathematics", "Physics", "Chemistry", "Biology"]
}

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students")
  const [searchQuery, setSearchQuery] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  
  // Data State
  const [students, setStudents] = useState<User[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  
  // Modals
  const [addModal, setAddModal] = useState(false)
  const [accessModal, setAccessModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId: number | null }>({ open: false, userId: null })
  const [viewModal, setViewModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    password: "", 
    studentClass: "", 
    program: "", 
    experience: "", 
    expertise: "",
    qualifications: "",
    accessTags: [] as string[]
  })
  
  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // NEW: State for delete loading

  // Access Management State
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loadingAccess, setLoadingAccess] = useState(false)
  const [savingAccess, setSavingAccess] = useState(false)
  const [resourceSearch, setResourceSearch] = useState("") 

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // 1. Trigger both fetch requests in parallel
      const [studentsRes, teachersRes] = await Promise.all([
        fetch("http://localhost:8080/api/auth/students"),
        fetch("http://localhost:8080/api/auth/teachers")
      ])

      // 2. Handle Students Response
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
      } else {
        console.error("Failed to fetch students")
      }

      // 3. Handle Teachers Response
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      } else {
        console.error("Failed to fetch teachers")
      }

    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // --- 2. Add User Logic ---
  const handleAddUser = async () => {
    setIsSubmitting(true)
    try {
      const role = activeTab === "students" ? "student" : "teacher"
      
      // Determine Access Tags
      let finalTags: string[] = [...formData.accessTags]
      if (role === "student" && finalTags.length === 0) {
        if (formData.studentClass) finalTags.push(formData.studentClass)
        if (formData.program) finalTags.push(formData.program)
      }

      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: role,
        phone: formData.phone,
        ...(role === "student" ? {
          studentClass: formData.studentClass,
          program: formData.program,
          accessTags: finalTags
        } : {
          experience: parseInt(formData.experience) || 0,
          expertise: formData.expertise ? [formData.expertise] : [],
          qualifications: formData.qualifications ? [formData.qualifications] : []
        })
      }

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const msg = await res.text()
        alert("Error: " + msg)
      } else {
        setSuccessMessage("User created successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
        setAddModal(false)
        resetForm()
        fetchUsers() 
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- 3. Edit User Logic ---
  const handleEditClick = (user: User) => {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "", 
      phone: user.phone || "",
      password: "", 
      studentClass: user.studentClass || "",
      program: user.program || "",
      experience: user.experience?.toString() || "",
      expertise: user.expertise?.[0] || "",
      qualifications: user.qualifications?.[0] || "",
      accessTags: user.accessTags || []
    })
    setEditModal({ open: true, user })
  }

  const handleUpdateUser = async () => {
    if (!editModal.user) return
    setIsSubmitting(true)
    try {
        const role = editModal.user.role 
        
        const payload = {
            fullName: formData.fullName,
            email: formData.email, 
            phone: formData.phone,
            password: formData.password || null, 
            
            ...(role === "student" ? {
                studentClass: formData.studentClass,
                program: formData.program,
            } : {
                experience: parseInt(formData.experience) || 0,
                expertise: formData.expertise ? [formData.expertise] : [],
                qualifications: formData.qualifications ? [formData.qualifications] : []
            })
        }

        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/admin/users/${editModal.user.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            setSuccessMessage("User updated successfully!")
            setTimeout(() => setSuccessMessage(""), 3000)
            setEditModal({ open: false, user: null })
            resetForm()
            fetchUsers()
        } else {
            const err = await res.text()
            alert("Failed to update user: " + err)
        }
    } catch (err) {
        console.error(err)
    } finally {
        setIsSubmitting(false)
    }
  }

  // --- 4. Delete User Logic (IMPLEMENTED) ---
  const confirmDelete = async () => {
    if (!deleteModal.userId) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/admin/users/${deleteModal.userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        setSuccessMessage("User deleted successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
        setDeleteModal({ open: false, userId: null })
        // Refresh the list to remove the deleted user
        fetchUsers()
      } else {
        alert("Failed to delete user. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred while deleting the user.")
    } finally {
      setIsDeleting(false)
    }
  }

  const resetForm = () => {
    setFormData({ 
      fullName: "", email: "", phone: "", password: "", 
      studentClass: "", program: "", experience: "", 
      expertise: "", qualifications: "", accessTags: [] 
    })
  }

  const toggleFormTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      accessTags: prev.accessTags.includes(tag) 
        ? prev.accessTags.filter(t => t !== tag) 
        : [...prev.accessTags, tag]
    }))
  }

  // --- 5. Manage Access Logic ---
  const handleManageAccess = async (user: User) => {
    setAccessModal({ open: true, user })
    setLoadingAccess(true)
    setSelectedTags([])
    if (user.accessTags) setSelectedTags(user.accessTags)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/api/v1/admin/users/${user.id}/access-tags`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const tags = await res.json()
        setSelectedTags(tags)
      }
    } catch (err) {
      console.error("Failed to fetch fresh tags", err)
    } finally {
      setLoadingAccess(false)
    }
  }

  const toggleTagAccess = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const saveAccessPermissions = async () => {
    if (!accessModal.user) return
    setSavingAccess(true)
    try {
      const token = localStorage.getItem("token")
      await fetch(`http://localhost:8080/api/v1/admin/users/${accessModal.user.id}/access-tags`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(selectedTags)
      })
      setSuccessMessage("Permissions updated!")
      setTimeout(() => setSuccessMessage(""), 3000)
      setAccessModal({ open: false, user: null })
      fetchUsers() 
    } catch(err) {
      console.error(err)
    } finally {
      setSavingAccess(false)
    }
  }

  // Filter Logic
  const currentList = activeTab === "students" ? students : teachers
  const filteredList = currentList.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage students, teachers, and permissions</p>
        </div>
        <Button onClick={() => { resetForm(); setAddModal(true); }} className="bg-primary">
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
        <Button variant={activeTab === "students" ? "default" : "outline"} onClick={() => setActiveTab("students")} className="gap-2">
          <Users className="w-4 h-4" /> Students ({students.length})
        </Button>
        <Button variant={activeTab === "teachers" ? "default" : "outline"} onClick={() => setActiveTab("teachers")} className="gap-2">
          <GraduationCap className="w-4 h-4" /> Teachers ({teachers.length})
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* User Table */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Info</th>
                {activeTab === "students" && <th className="px-6 py-4 text-left text-sm font-semibold">Access Tags</th>}
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((user: User) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {activeTab === "students" ? (
                      <>
                        <Badge variant="outline" className="mr-1">Cl {user.studentClass}</Badge>
                        <Badge variant="outline">{user.program}</Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-foreground">{user.expertise?.[0] || "General"}</div>
                        <div className="text-xs text-muted-foreground">{user.experience} Yrs Exp.</div>
                      </>
                    )}
                  </td>
                  {activeTab === "students" && (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {user.accessTags && user.accessTags.length > 0 ? (
                          user.accessTags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] h-5">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        )}
                        {user.accessTags && user.accessTags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{user.accessTags.length - 3}</span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {activeTab === "students" && (
                        <Button size="sm" variant="outline" onClick={() => handleManageAccess(user)} className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2">
                            <Shield className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setViewModal({ open: true, user })} className="h-8 px-2">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(user)} className="h-8 px-2">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 px-2 text-destructive hover:bg-destructive/10" onClick={() => setDeleteModal({ open: true, userId: user.id })}>
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

      {/* --- MODALS --- */}

      {/* 1. Add User Modal */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New {activeTab === "students" ? "Student" : "Teacher"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="john@example.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+91 9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Temporary Password</label>
                    <Input placeholder="SecurePassword123" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
                
                {activeTab === "students" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Class</label>
                            <select 
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={formData.studentClass} 
                              onChange={e => setFormData({...formData, studentClass: e.target.value})}
                            >
                                <option value="">Select Class</option>
                                <option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Program</label>
                            <select 
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={formData.program} 
                              onChange={e => setFormData({...formData, program: e.target.value})}
                            >
                                <option value="">Select Program</option>
                                <option value="JEE">JEE</option><option value="NEET">NEET</option><option value="MHT-CET">MHT-CET</option><option value="Foundation">Foundation</option>
                            </select>
                          </div>
                      </div>

                      <div className="border rounded-md p-3 bg-muted/20">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="py-2 hover:no-underline">
                              <span className="text-sm font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                Initial Access Permissions
                                <Badge variant="secondary" className="ml-2">{formData.accessTags.length} selected</Badge>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                {Object.entries(ACCESS_CATEGORIES).map(([category, tags]) => (
                                    <div key={category} className="space-y-2">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground">{category}</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {tags.map((tag) => (
                                                <div 
                                                    key={tag}
                                                    onClick={() => toggleFormTag(tag)}
                                                    className={`
                                                        flex items-center space-x-2 p-1.5 rounded border cursor-pointer text-xs transition-all
                                                        ${formData.accessTags.includes(tag) ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-background hover:bg-muted border-input'}
                                                    `}
                                                >
                                                    <Checkbox checked={formData.accessTags.includes(tag)} className="h-3 w-3" />
                                                    <span>{tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Experience (Years)</label>
                          <Input placeholder="e.g. 5" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Subject/Expertise</label>
                          <Input placeholder="Mathematics" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Qualifications</label>
                          <Input placeholder="M.Sc Physics, B.Ed" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} />
                        </div>
                    </div>
                )}
                
                <Button className="w-full mt-6" onClick={handleAddUser} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>}
                </Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* 2. Edit User Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ ...editModal, open })}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User: {editModal.user?.fullName}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
                
                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><Mail className="w-3 h-3" /> Email</label>
                    <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {/* Password Section */}
                <div className="p-3 border rounded-md bg-muted/20">
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Lock className="w-3 h-3" /> Change Password
                    </label>
                    <Input 
                        type="password" 
                        placeholder="Enter new password to reset..." 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        className="bg-white"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">Leave blank to keep current password.</p>
                </div>
                
                {editModal.user?.role === "student" ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Class</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})}>
                              <option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Program</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})}>
                              <option value="JEE">JEE</option><option value="NEET">NEET</option><option value="MHT-CET">MHT-CET</option><option value="Foundation">Foundation</option>
                          </select>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Experience (Years)</label>
                          <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Subject</label>
                          <Input value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Qualifications</label>
                          <Input value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} />
                        </div>
                    </div>
                )}
                
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={handleUpdateUser} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* 3. View User Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, user: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewModal.user && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white uppercase">
                  {viewModal.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewModal.user.fullName}</h3>
                  <p className="text-muted-foreground capitalize">{viewModal.user.role}</p>
                  <Badge variant={viewModal.user.status === 'Inactive' ? 'destructive' : 'default'} className="mt-1">
                    {viewModal.user.status || 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{viewModal.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewModal.user.phone}</p>
                </div>
                
                {viewModal.user.role === 'student' ? (
                  <>
                    <div>
                      <p className="text-muted-foreground">Class</p>
                      <p className="font-medium">{viewModal.user.studentClass}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Program</p>
                      <p className="font-medium">{viewModal.user.program}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Access Permissions</p>
                        <div className="flex flex-wrap gap-1">
                            {viewModal.user.accessTags?.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                            {(!viewModal.user.accessTags || viewModal.user.accessTags.length === 0) && <span className="italic text-gray-400">No specific access tags</span>}
                        </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-medium">{viewModal.user.experience} Years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subject</p>
                      <p className="font-medium">{viewModal.user.expertise?.[0]}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Qualifications</p>
                      <p className="font-medium">{viewModal.user.qualifications?.[0] || "N/A"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. Delete User Modal */}
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
              onClick={confirmDelete}
              className="flex-1"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Access Management Modal */}
      <Dialog open={accessModal.open} onOpenChange={(open) => setAccessModal({ ...accessModal, open })}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>Manage Access: {accessModal.user?.fullName}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                    Current Access: <span className="font-medium text-emerald-600">
                      {selectedTags.length > 0 ? selectedTags.join(", ") : "None"}
                    </span>
                </p>
            </DialogHeader>

            {loadingAccess ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-6">
                        {Object.entries(ACCESS_CATEGORIES).map(([category, tags]) => (
                            <div key={category} className="space-y-2">
                                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{category}</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {tags.map((tag) => {
                                        const isSelected = selectedTags.includes(tag)
                                        return (
                                            <div 
                                                key={tag}
                                                onClick={() => toggleTagAccess(tag)}
                                                className={`
                                                    flex items-center space-x-2 p-2 rounded-md border cursor-pointer text-sm transition-all
                                                    ${isSelected ? 'bg-primary/10 border-primary text-primary font-medium' : 'hover:bg-muted border-border'}
                                                `}
                                            >
                                                <Checkbox checked={isSelected} className="pointer-events-none" />
                                                <span>{tag}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            <DialogFooter>
                <Button variant="outline" onClick={() => setAccessModal({ open: false, user: null })}>Cancel</Button>
                <Button onClick={saveAccessPermissions} disabled={savingAccess}>
                    {savingAccess && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminSidebar>
  )
}