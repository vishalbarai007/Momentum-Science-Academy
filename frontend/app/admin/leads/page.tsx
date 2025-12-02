"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { Search, Eye, Phone, Mail, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewModal, setViewModal] = useState<{ open: boolean; lead: any }>({ open: false, lead: null })

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Aditya Kumar",
      email: "aditya@email.com",
      phone: "+91 98765 43210",
      program: "JEE",
      status: "new",
      message: "Interested in JEE Advanced batch",
      date: "Dec 15, 2024",
    },
    {
      id: 2,
      name: "Neha Sharma",
      email: "neha@email.com",
      phone: "+91 87654 32109",
      program: "NEET",
      status: "contacted",
      message: "Looking for NEET preparation",
      date: "Dec 14, 2024",
    },
    {
      id: 3,
      name: "Vikram Singh",
      email: "vikram@email.com",
      phone: "+91 76543 21098",
      program: "JEE",
      status: "interested",
      message: "Want to know about fee structure",
      date: "Dec 13, 2024",
    },
    {
      id: 4,
      name: "Priya Patel",
      email: "priya@email.com",
      phone: "+91 65432 10987",
      program: "MHT-CET",
      status: "enrolled",
      message: "Ready to join MHT-CET batch",
      date: "Dec 12, 2024",
    },
    {
      id: 5,
      name: "Rahul Gupta",
      email: "rahul@email.com",
      phone: "+91 54321 09876",
      program: "Foundation",
      status: "new",
      message: "Enquiry for Class 9 foundation",
      date: "Dec 11, 2024",
    },
  ])

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = (id: number, newStatus: string) => {
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700"
      case "contacted":
        return "bg-amber-100 text-amber-700"
      case "interested":
        return "bg-purple-100 text-purple-700"
      case "enrolled":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const statusCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    interested: leads.filter((l) => l.status === "interested").length,
    enrolled: leads.filter((l) => l.status === "enrolled").length,
  }

  return (
    <AdminSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-muted-foreground">Track and manage enquiries from potential students</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "New", count: statusCounts.new, color: "bg-blue-500" },
          { label: "Contacted", count: statusCounts.contacted, color: "bg-amber-500" },
          { label: "Interested", count: statusCounts.interested, color: "bg-purple-500" },
          { label: "Enrolled", count: statusCounts.enrolled, color: "bg-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="px-4 py-2 border border-border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status ({statusCounts.all})</option>
          <option value="new">New ({statusCounts.new})</option>
          <option value="contacted">Contacted ({statusCounts.contacted})</option>
          <option value="interested">Interested ({statusCounts.interested})</option>
          <option value="enrolled">Enrolled ({statusCounts.enrolled})</option>
        </select>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-5 border-0 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{lead.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {lead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" /> {lead.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {lead.program}
                    </span>
                    <span className="text-xs text-muted-foreground">{lead.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-16 md:ml-0">
                <Button size="sm" variant="outline" onClick={() => setViewModal({ open: true, lead })}>
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>
                {lead.status !== "enrolled" && (
                  <select
                    className="px-3 py-1 text-sm border border-border rounded-lg"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="enrolled">Enrolled</option>
                  </select>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, lead: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {viewModal.lead && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                  {viewModal.lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewModal.lead.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(viewModal.lead.status)}`}
                  >
                    {viewModal.lead.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{viewModal.lead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewModal.lead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{viewModal.lead.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{viewModal.lead.date}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="p-3 bg-muted rounded-lg">{viewModal.lead.message}</p>
              </div>
              {viewModal.lead.status === "interested" && (
                <Button
                  className="w-full"
                  onClick={() => {
                    updateStatus(viewModal.lead.id, "enrolled")
                    setViewModal({ open: false, lead: null })
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convert to Student
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminSidebar>
  )
}
