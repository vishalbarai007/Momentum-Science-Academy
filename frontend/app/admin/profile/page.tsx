"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Mail, Phone, Shield, Calendar, Edit, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@momentum.edu",
    phone: "+91 98765 00000",
    role: "Super Admin",
    joinDate: "January 1, 2020",
  })

  const handleSave = () => {
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminSidebar>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your admin account details</p>
        </div>

        {saved && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <Card className="p-8 border-0 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
              A
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {profile.role}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: "Email", value: profile.email },
                { icon: Phone, label: "Phone", value: profile.phone },
                { icon: Shield, label: "Role", value: profile.role },
                { icon: Calendar, label: "Member Since", value: profile.joinDate },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Security Notice */}
        <Card className="p-6 border-0 shadow-lg bg-muted/50">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Security Information</h3>
              <p className="text-muted-foreground text-sm">
                As an administrator, you have full access to the system. Password changes for admin accounts must be
                done directly in the database by the developer for security reasons.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminSidebar>
  )
}
