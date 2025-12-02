"use client"

import type React from "react"

import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Gift, Copy, CheckCircle, Users, TrendingUp, DollarSign, Plus, Eye, RefreshCw } from "lucide-react"

interface Referral {
  id: string
  code: string
  referrerName: string
  referrerEmail: string
  referrerType: "student" | "parent" | "other"
  totalReferrals: number
  successfulConversions: number
  pendingReferrals: number
  totalEarnings: number
  status: "active" | "inactive"
  createdAt: string
}

interface ReferralLead {
  id: string
  referralCode: string
  leadName: string
  leadEmail: string
  leadPhone: string
  program: string
  status: "pending" | "converted" | "rejected"
  referredAt: string
}

const initialReferrals: Referral[] = [
  {
    id: "1",
    code: "MSA2024RP001",
    referrerName: "Rahul Patel",
    referrerEmail: "rahul.patel@email.com",
    referrerType: "student",
    totalReferrals: 12,
    successfulConversions: 8,
    pendingReferrals: 4,
    totalEarnings: 8000,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    code: "MSA2024SK002",
    referrerName: "Sunita Kapoor",
    referrerEmail: "sunita.k@email.com",
    referrerType: "parent",
    totalReferrals: 5,
    successfulConversions: 3,
    pendingReferrals: 2,
    totalEarnings: 3000,
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    code: "MSA2024AM003",
    referrerName: "Amit Mehta",
    referrerEmail: "amit.m@email.com",
    referrerType: "other",
    totalReferrals: 8,
    successfulConversions: 6,
    pendingReferrals: 2,
    totalEarnings: 6000,
    status: "active",
    createdAt: "2024-01-08",
  },
]

const referralLeads: ReferralLead[] = [
  {
    id: "1",
    referralCode: "MSA2024RP001",
    leadName: "Priya Sharma",
    leadEmail: "priya.s@email.com",
    leadPhone: "+91 98765 43210",
    program: "JEE Main",
    status: "converted",
    referredAt: "2024-01-10",
  },
  {
    id: "2",
    referralCode: "MSA2024RP001",
    leadName: "Karan Singh",
    leadEmail: "karan.s@email.com",
    leadPhone: "+91 87654 32109",
    program: "NEET",
    status: "pending",
    referredAt: "2024-01-15",
  },
  {
    id: "3",
    referralCode: "MSA2024SK002",
    leadName: "Neha Gupta",
    leadEmail: "neha.g@email.com",
    leadPhone: "+91 76543 21098",
    program: "MHT-CET",
    status: "converted",
    referredAt: "2024-01-12",
  },
]

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals)
  const [leads] = useState<ReferralLead[]>(referralLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"codes" | "leads">("codes")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const stats = {
    totalCodes: referrals.length,
    activeReferrers: referrals.filter((r) => r.status === "active").length,
    totalConversions: referrals.reduce((acc, r) => acc + r.successfulConversions, 0),
    totalPayouts: referrals.reduce((acc, r) => acc + r.totalEarnings, 0),
  }

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || referral.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const generateNewCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    const newCode = `MSA2024${initials}${String(referrals.length + 1).padStart(3, "0")}`

    const newReferral: Referral = {
      id: Date.now().toString(),
      code: newCode,
      referrerName: name,
      referrerEmail: formData.get("email") as string,
      referrerType: formData.get("type") as Referral["referrerType"],
      totalReferrals: 0,
      successfulConversions: 0,
      pendingReferrals: 0,
      totalEarnings: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setReferrals([newReferral, ...referrals])
    setCreateDialogOpen(false)
    showSuccess(`Referral code ${newCode} created successfully!`)
  }

  const toggleStatus = (referral: Referral) => {
    setReferrals(
      referrals.map((r) =>
        r.id === referral.id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r,
      ),
    )
    showSuccess(`Referral code ${referral.status === "active" ? "deactivated" : "activated"}`)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
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
            <h1 className="text-3xl font-bold">Referral Management</h1>
            <p className="text-muted-foreground">Track and manage referral codes and conversions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Generate Code
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Codes", value: stats.totalCodes, icon: Gift, color: "bg-blue-500" },
            { label: "Active Referrers", value: stats.activeReferrers, icon: Users, color: "bg-green-500" },
            { label: "Conversions", value: stats.totalConversions, icon: TrendingUp, color: "bg-orange-500" },
            {
              label: "Total Payouts",
              value: `₹${stats.totalPayouts.toLocaleString()}`,
              icon: DollarSign,
              color: "bg-purple-500",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("codes")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "codes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Referral Codes
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "leads"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Referred Leads
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === "codes" ? "Search by name or code..." : "Search leads..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "codes" && (
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Referral Codes Table */}
        {activeTab === "codes" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Referrals</TableHead>
                  <TableHead className="hidden lg:table-cell">Conversions</TableHead>
                  <TableHead className="hidden lg:table-cell">Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{referral.code}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(referral.code)}
                        >
                          {copiedCode === referral.code ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{referral.referrerName}</p>
                        <p className="text-xs text-muted-foreground">{referral.referrerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{referral.referrerType}</TableCell>
                    <TableCell className="hidden md:table-cell">{referral.totalReferrals}</TableCell>
                    <TableCell className="hidden lg:table-cell">{referral.successfulConversions}</TableCell>
                    <TableCell className="hidden lg:table-cell">₹{referral.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === "active" ? "default" : "secondary"}>{referral.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedReferral(referral)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(referral)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Referred Leads Table */}
        {activeTab === "leads" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead className="hidden md:table-cell">Program</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.leadName}</p>
                        <p className="text-xs text-muted-foreground">{lead.leadEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{lead.referralCode}</code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{lead.program}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.leadPhone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.referredAt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.status === "converted"
                            ? "default"
                            : lead.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Referral Code</DialogTitle>
              <DialogDescription>Create a new referral code for a referrer</DialogDescription>
            </DialogHeader>
            <form onSubmit={generateNewCode} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Referrer Name</label>
                <Input name="name" placeholder="Enter full name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="Enter email" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Referrer Type</label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate Code</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Referral Details</DialogTitle>
            </DialogHeader>
            {selectedReferral && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <code className="text-2xl font-bold font-mono">{selectedReferral.code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(selectedReferral.code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Referrer</p>
                    <p className="font-medium">{selectedReferral.referrerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedReferral.referrerEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedReferral.referrerType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={selectedReferral.status === "active" ? "default" : "secondary"}>
                      {selectedReferral.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Referrals</p>
                    <p className="font-medium">{selectedReferral.totalReferrals}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversions</p>
                    <p className="font-medium">{selectedReferral.successfulConversions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-medium">{selectedReferral.pendingReferrals}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Earnings</p>
                    <p className="font-medium text-green-600">₹{selectedReferral.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminSidebar>
  )
}
