"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Edit, Trash2, Eye, CheckCircle, GraduationCap, Users, Shield, Loader2, Save, Lock, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types matching Backend User
interface User {
  id: number
  fullName: string
  email: string
  phone: string
  role: string
  studentClass?: string
  program?: string
  expertise?: string[]
  experience?: number
  qualifications?: string[]
  accessTags?: string[] 
  status?: string
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
    fullName: "", email: "", phone: "", password: "", 
    studentClass: "", program: "", experience: "", 
    expertise: "", qualifications: "", accessTags: [] as string[]
  })

  // Advanced Student Form State
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  
  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingAccess, setLoadingAccess] = useState(false)
  const [savingAccess, setSavingAccess] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch("http://localhost:8080/api/auth/students"),
        fetch("http://localhost:8080/api/auth/teachers")
      ])

      if (studentsRes.ok) setStudents(await studentsRes.json())
      if (teachersRes.ok) setTeachers(await teachersRes.json())

    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // --- LOGIC: Auto-calculate Access Tags ---
  const calculateAccessTags = (cls: string, prog: string, subs: string[]) => {
    const tags = new Set<string>()
    
    // Class Tags
    if (cls === "11 & 12") {
        tags.add("11"); tags.add("12");
    } else if (cls) {
        tags.add(cls);
    }

    // Program Tags
    if (["9", "10"].includes(cls)) {
        tags.add("Foundation"); 
    } else if (prog) {
        tags.add(prog);
        if (prog === "JEE") { tags.add("JEE Main"); tags.add("JEE Advanced"); }
    }

    // Subject Tags
    subs.forEach(s => tags.add(s));

    return Array.from(tags);
  }

  const handleClassChange = (val: string) => {
    setFormData(prev => ({ ...prev, studentClass: val, program: "" }))
    setSelectedSubjects([])
  }

  const handleProgramChange = (val: string) => {
    setFormData(prev => ({ ...prev, program: val }))
    
    // Auto-select subjects based on Exam
    if (val === "JEE") {
        setSelectedSubjects(["Physics", "Chemistry", "Mathematics"])
    } else if (val === "NEET") {
        setSelectedSubjects(["Physics", "Chemistry", "Biology"])
    } else {
        // Reset for manual selection (MHT-CET / Board)
        // For Board, we might want to default to English + PCMB to save clicks
        if (val === "Board") {
            setSelectedSubjects(["English", "Physics", "Chemistry", "Mathematics", "Biology"])
        } else {
            setSelectedSubjects([]) 
        }
    }
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
        prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    )
  }

  // --- 2. Add User Logic ---
  const handleAddUser = async () => {
    setIsSubmitting(true)
    try {
      const role = activeTab === "students" ? "student" : "teacher"
      let finalTags: string[] = [...formData.accessTags]
      if (role === "student") {
         finalTags = calculateAccessTags(formData.studentClass, formData.program, selectedSubjects)
      }

      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: role,
        phone: formData.phone,
        ...(role === "student" ? {
          studentClass: formData.studentClass,
          program: formData.program || "Foundation",
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

    // Populate Subjects from tags
    if (user.role === 'student' && user.accessTags) {
        // Filter out class/exam tags to get just subjects
        const subjects = user.accessTags.filter(t => 
            !["9", "10", "11", "12", "JEE", "NEET", "MHT-CET", "Board", "Foundation", "JEE Main", "JEE Advanced"].includes(t)
        )
        setSelectedSubjects(subjects)
    }

    setEditModal({ open: true, user })
  }

  const handleUpdateUser = async () => {
    if (!editModal.user) return
    setIsSubmitting(true)
    try {
        const role = editModal.user.role 
        let finalTags = editModal.user.accessTags
        if (role === "student") {
            finalTags = calculateAccessTags(formData.studentClass, formData.program, selectedSubjects)
        }

        const payload = {
            fullName: formData.fullName,
            email: formData.email, 
            phone: formData.phone,
            password: formData.password || null, 
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
        fetchUsers()
      } else {
        alert("Failed to delete user.")
      }
    } catch (err) {
      console.error(err)
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
    setSelectedSubjects([])
  }

  // --- 5. Manage Access Logic (Direct Tag Manipulation) ---
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

  const currentList = activeTab === "students" ? students : teachers
  const filteredList = currentList.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // --- UI HELPER: Student Form Content ---
  const renderStudentForm = () => {
    const isHigherClass = ["11", "12", "11 & 12"].includes(formData.studentClass)
    const showSubjects = isHigherClass && formData.program
    
    // Define available subjects based on exam/board
    // Scraped data for Maharashtra Board includes specific languages and vocational subjects
    let availableSubjects: string[] = []

    if (formData.program === "JEE") {
        availableSubjects = ["Physics", "Chemistry", "Mathematics"]
    } else if (formData.program === "NEET") {
        availableSubjects = ["Physics", "Chemistry", "Biology"]
    } else if (formData.program === "MHT-CET") {
        availableSubjects = ["Physics", "Chemistry", "Mathematics", "Biology"]
    } else if (formData.program === "Board") {
        availableSubjects = [
            "English", "Hindi", "Marathi", "Physics", "Chemistry", "Mathematics", "Biology", 
            "Geography", "Information Technology", "Computer Science", "Electronics", 
            "Environmental Science", "Psychology"
        ]
    }

    const isAutoLocked = formData.program === "JEE" || formData.program === "NEET"

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Class / Grade</Label>
                    <Select value={formData.studentClass} onValueChange={handleClassChange}>
                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9">Class 9 (Foundation)</SelectItem>
                            <SelectItem value="10">Class 10 (Foundation)</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                            <SelectItem value="11 & 12">Class 11 & 12 (Integrated)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isHigherClass && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label>Target Exam / Stream</Label>
                        <Select value={formData.program} onValueChange={handleProgramChange}>
                            <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="JEE">JEE (Mains & Adv)</SelectItem>
                                <SelectItem value="NEET">NEET (Medical)</SelectItem>
                                <SelectItem value="MHT-CET">MHT-CET (Engg/Pharm)</SelectItem>
                                <SelectItem value="Board">Board / HSC (General Science)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Subject Selection (Only for 11/12) */}
            {showSubjects && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg animate-in fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                            {formData.program} Subjects 
                            {isAutoLocked && " (Fixed)"}
                        </Label>
                        {!isAutoLocked && (
                            <span className="text-[10px] text-muted-foreground">Select all that apply</span>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {availableSubjects.map(sub => (
                            <div 
                                key={sub}
                                onClick={() => {
                                    if (isAutoLocked) return;
                                    toggleSubject(sub)
                                }}
                                className={`
                                    flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all
                                    ${selectedSubjects.includes(sub) ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-background border-input hover:bg-muted cursor-pointer'}
                                    ${isAutoLocked ? 'opacity-80 cursor-not-allowed' : ''}
                                `}
                            >
                                <Checkbox 
                                    checked={selectedSubjects.includes(sub)} 
                                    disabled={isAutoLocked}
                                    className="pointer-events-none"
                                />
                                {sub}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Preview Generated Tags */}
            <div className="text-xs text-muted-foreground pt-2">
                <span className="font-semibold">Generated Permissions: </span> 
                {calculateAccessTags(formData.studentClass, formData.program, selectedSubjects).join(", ") || "No permissions generated yet."}
            </div>
        </div>
    )
  }

  return (
    <AdminSidebar>
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
                        <Button size="sm" variant="outline" onClick={() => handleManageAccess(user)} className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2" title="Manage Specific Permissions">
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

      {/* --- ADD MODAL --- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New {activeTab === "students" ? "Student" : "Teacher"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="john@example.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input placeholder="+91 9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Temporary Password</Label>
                    <Input placeholder="SecurePassword123" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
                
                {activeTab === "students" ? renderStudentForm() : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Experience (Years)</Label>
                          <Input placeholder="e.g. 5" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                        </div>
                        <div>
                          <Label>Subject/Expertise</Label>
                          <Input placeholder="Mathematics" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Label>Qualifications</Label>
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

      {/* --- EDIT MODAL --- */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ ...editModal, open })}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User: {editModal.user?.fullName}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Full Name</Label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2"><Mail className="w-3 h-3" /> Email</Label>
                    <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {/* Password Section */}
                <div className="p-3 border rounded-md bg-muted/20">
                    <Label className="flex items-center gap-2 mb-2">
                        <Lock className="w-3 h-3" /> Change Password
                    </Label>
                    <Input 
                        type="password" 
                        placeholder="Enter new password to reset..." 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        className="bg-white"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">Leave blank to keep current password.</p>
                </div>
                
                {editModal.user?.role === "student" ? renderStudentForm() : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Experience (Years)</Label>
                          <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                        </div>
                        <div>
                          <Label>Subject</Label>
                          <Input value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Label>Qualifications</Label>
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

      {/* --- VIEW MODAL --- */}
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

      {/* --- DELETE MODAL --- */}
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

      {/* --- MANAGE ACCESS MODAL (Manual Override) --- */}
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
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            Note: These settings override the automated permissions. Use only for exceptions.
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Manual Selection</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {["9", "10", "11", "12", "JEE Main", "JEE Advanced", "NEET", "MHT-CET", "Foundation", "Board", "Physics", "Chemistry", "Mathematics", "Biology", "English", "Hindi", "Marathi", "Geography", "Information Technology", "Computer Science", "Electronics"].map((tag) => {
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