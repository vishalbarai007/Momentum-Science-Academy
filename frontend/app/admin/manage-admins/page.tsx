"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldAlert, UserPlus, Edit, Trash2, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AdminUser {
  id: number
  fullName: string
  email: string
  phone: string
}

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    // Basic Role Check on Mount
    const role = localStorage.getItem("userRole")
    if (role !== "super_admin") {
        toast.error("Unauthorized: Super Admin Access Required")
        router.push("/admin/dashboard")
        return
    }
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/api/v1/super-admin/admins", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setAdmins(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const token = localStorage.getItem("token")
    
    try {
        const url = editingAdmin 
            ? `http://localhost:8080/api/v1/super-admin/admins/${editingAdmin.id}`
            : "http://localhost:8080/api/v1/super-admin/create-admin"
        
        const method = editingAdmin ? "PUT" : "POST"

        const res = await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error(await res.text())

        toast.success(editingAdmin ? "Admin updated!" : "New Admin created!")
        setModalOpen(false)
        fetchAdmins()
        resetForm()
    } catch (err: any) {
        toast.error(err.message || "Operation failed")
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return
    
    const token = localStorage.getItem("token")
    try {
        const res = await fetch(`http://localhost:8080/api/v1/super-admin/admins/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
            toast.success("Admin deleted")
            fetchAdmins()
        }
    } catch (err) {
        console.error(err)
    }
  }

  const openEdit = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setFormData({ 
        fullName: admin.fullName, 
        email: admin.email, 
        phone: admin.phone || "", 
        password: "" // Keep blank unless changing
    })
    setModalOpen(true)
  }

  const resetForm = () => {
    setEditingAdmin(null)
    setFormData({ fullName: "", email: "", phone: "", password: "" })
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <AdminSidebar>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <ShieldAlert className="text-primary" /> Super Admin Console
            </h1>
            <p className="text-muted-foreground">Manage administrative access for the platform.</p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true) }} className="gap-2">
            <UserPlus className="w-4 h-4" /> Create New Admin
        </Button>
      </div>

      <Card>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {admins.map((admin) => (
                    <TableRow key={admin.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Shield className="w-4 h-4" />
                            </div>
                            {admin.fullName}
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.phone || "-"}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(admin)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(admin.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingAdmin ? "Edit Admin" : "Create New Admin"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password {editingAdmin && "(Leave blank to keep current)"}</label>
                    <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingAdmin ? "Save Changes" : "Create Admin"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </AdminSidebar>
  )
}
