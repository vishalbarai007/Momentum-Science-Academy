"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { Search, Eye, Phone, Mail, UserPlus, Save, Loader2, Database } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLeads, updateLeadStatus } from "@/lib/api"
import { getSchoolData, updateSheetRow } from "@/app/actions/sheets"
import { toast } from "sonner"

const SCHOOLS = [
  "SVM", "Vidyavikasini", "Holy-Family", "J.B.S", "SKC", "St. Joseph-Vasai",
  "Mother Mary - East", "J.B.Ludhani", "Kapol", "Kalindi", "Mother Teresa",
  "St Joseph-Nallasopara", "St Aloysius", "Mother Mary-West"
];

const RESPONSE_OPTIONS = [
  "Ringing", "Out of Town", "Will Visit", "Admission Taken", 
  "Not Interested", "Call Busy", "Call Cut", "Call Later", 
  "Wrong Number", "Network Issue"
];

export default function AdminLeadsPage() {
  // --- State for Database Leads ---
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewModal, setViewModal] = useState<{ open: boolean; lead: any }>({ open: false, lead: null })
  const [dbLeads, setDbLeads] = useState<any[]>([])
  const [dbLoading, setDbLoading] = useState(true)

  // --- State for Google Sheets ---
  const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0])
  const [sheetLeads, setSheetLeads] = useState<any[]>([])
  const [sheetLoading, setSheetLoading] = useState(false)
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null)

  useEffect(() => {
    fetchDbLeads()
  }, [])

  useEffect(() => {
    fetchSheetData()
  }, [selectedSchool])

  const fetchDbLeads = async () => {
    try {
      const data = await getLeads()
      const formattedData = data.map((lead: any) => ({
        ...lead,
        status: lead.status.toLowerCase(),
        date: new Date(lead.createdAt).toLocaleDateString(),
      }))
      setDbLeads(formattedData)
    } catch (err) {
      console.error(err)
    } finally {
      setDbLoading(false)
    }
  }

  const fetchSheetData = async () => {
    setSheetLoading(true)
    const data = await getSchoolData(selectedSchool)
    setSheetLeads(data)
    setSheetLoading(false)
  }

  const handleSheetInputChange = (index: number, field: string, value: string) => {
    const newLeads = [...sheetLeads]
    newLeads[index][field] = value
    setSheetLeads(newLeads)
  }

  const saveSheetRow = async (index: number) => {
    const lead = sheetLeads[index]
    setUpdatingRowId(lead.rowNumber)
    const result = await updateSheetRow(selectedSchool, lead.rowNumber, lead)
    if (result.success) toast.success("Sheet updated")
    else toast.error("Update failed")
    setUpdatingRowId(null)
  }

  const filteredDbLeads = dbLeads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateDbStatus = async (id: number, newStatus: string) => {
    setDbLeads(dbLeads.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead)))
    try {
      await updateLeadStatus(id, newStatus.toUpperCase())
    } catch (err) {
      fetchDbLeads()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested": return "bg-purple-100 text-purple-700"
      case "contacted": return "bg-amber-100 text-amber-700"
      case "enrolled": return "bg-emerald-100 text-emerald-700"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AdminSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-muted-foreground">Manage leads from Database and Google Sheets</p>
      </div>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" /> Website Leads
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Sheets
          </TabsTrigger>
        </TabsList>

        {/* --- TAB: DATABASE LEADS --- */}
        <TabsContent value="database">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <select className="px-4 py-2 border rounded-lg" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="interested">Interested</option>
              <option value="contacted">Contacted</option>
              <option value="enrolled">Enrolled</option>
            </select>
          </div>

          <div className="space-y-4">
            {dbLoading ? <div className="text-center py-10">Loading...</div> : 
              filteredDbLeads.map((lead) => (
                <Card key={lead.id} className="p-5 border-0 shadow-lg">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{lead.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {lead.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(lead.status)}`}>{lead.status}</span>
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">{lead.program}</span>
                          <span className="text-xs text-muted-foreground">{lead.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewModal({ open: true, lead })}>View</Button>
                      {lead.status !== "enrolled" && (
                        <select className="px-3 py-1 text-sm border rounded-lg" value={lead.status} onChange={(e) => updateDbStatus(lead.id, e.target.value)}>
                          <option value="interested">Interested</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                        </select>
                      )}
                    </div>
                  </div>
                </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- TAB: GOOGLE SHEETS --- */}
        <TabsContent value="sheets" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {SCHOOLS.map((school) => (
              <Button key={school} variant={selectedSchool === school ? "default" : "outline"} size="sm" onClick={() => setSelectedSchool(school)}>
                {school}
              </Button>
            ))}
          </div>

          <Card className="p-0 overflow-hidden border-0 shadow-xl">
            {sheetLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div> : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Calling Date</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Follow Up</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Called By</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheetLeads.map((lead, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.mobile}</TableCell>
                      <TableCell>
                        <Input className="w-32 h-8" value={lead.callingDate} onChange={(e) => handleSheetInputChange(idx, 'callingDate', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <select className="w-36 h-8 text-xs border rounded bg-background" value={lead.response} onChange={(e) => handleSheetInputChange(idx, 'response', e.target.value)}>
                          <option value="-">Select</option>
                          {RESPONSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input className="w-28 h-8" value={lead.followUp} onChange={(e) => handleSheetInputChange(idx, 'followUp', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input className="h-8" value={lead.comments} onChange={(e) => handleSheetInputChange(idx, 'comments', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input className="w-24 h-8" value={lead.calledBy} onChange={(e) => handleSheetInputChange(idx, 'calledBy', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Button size="icon" className="h-8 w-8" onClick={() => saveSheetRow(idx)} disabled={updatingRowId === lead.rowNumber}>
                          {updatingRowId === lead.rowNumber ? <Loader2 className="animate-spin w-3 h-3" /> : <Save className="w-3 h-3" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Database View Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, lead: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Lead Details</DialogTitle></DialogHeader>
          {viewModal.lead && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                  {viewModal.lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewModal.lead.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(viewModal.lead.status)}`}>{viewModal.lead.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{viewModal.lead.phone}</p></div>
                <div><p className="text-sm text-muted-foreground">Program</p><p className="font-medium">{viewModal.lead.program}</p></div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="p-3 bg-muted rounded-lg">{viewModal.lead.message || "No message."}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminSidebar>
  )
}