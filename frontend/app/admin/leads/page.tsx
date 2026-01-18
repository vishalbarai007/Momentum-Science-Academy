"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" 
import { Search, Phone, Mail, Save, Loader2, Database, Plus, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLeads, updateLeadStatus } from "@/lib/api"
import { 
  getSchoolData, 
  updateSheetRow, 
  createSchoolSheet, 
  deleteSchoolSheet, 
  adminAddNewLead, 
  getAllSchoolSheets 
} from "@/app/actions/sheets"
import { toast } from "sonner"

const RESPONSE_OPTIONS = [
  "Ringing", "Out of Town", "Will Visit", "Admission Taken", 
  "Not Interested", "Call Busy", "Call Cut", "Call Later", 
  "Wrong Number", "Network Issue"
];

export default function AdminLeadsPage() {
  const [schools, setSchools] = useState<string[]>([])
  const [selectedSchool, setSelectedSchool] = useState("")
  const [dbLeads, setDbLeads] = useState<any[]>([])
  const [sheetLeads, setSheetLeads] = useState<any[]>([])
  
  const [dbLoading, setDbLoading] = useState(true)
  const [sheetLoading, setSheetLoading] = useState(false)
  const [isAddingSchool, setIsAddingSchool] = useState(false)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null)
  
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState<{ open: boolean; lead: any }>({ open: false, lead: null })
  
  const [newLeadForm, setNewLeadForm] = useState({ name: "", mobile: "" })
  const [newSchoolName, setNewSchoolName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Initialize schools from Google Sheets API on mount
  useEffect(() => {
    const initData = async () => {
      const titles = await getAllSchoolSheets();
      setSchools(titles);
      if (titles.length > 0) setSelectedSchool(titles[0]);
      fetchDbLeads();
    };
    initData();
  }, [])

  useEffect(() => {
    if (selectedSchool) fetchSheetData()
  }, [selectedSchool])

  const fetchDbLeads = async () => {
    try {
      const data = await getLeads();
      setDbLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDbLoading(false);
    }
  };

  const fetchSheetData = async () => {
    setSheetLoading(true)
    const data = await getSchoolData(selectedSchool)
    setSheetLeads(data)
    setSheetLoading(false)
  }

  const handleAddNewLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadForm.name || !newLeadForm.mobile) return toast.error("Please fill in all fields")
    if (!selectedSchool) return toast.error("Select a school first")

    setIsSubmittingLead(true)
    try {
      const result = await adminAddNewLead(selectedSchool, newLeadForm)
      if (result.success) {
        toast.success("Lead added successfully")
        setNewLeadForm({ name: "", mobile: "" })
        setAddLeadModalOpen(false)
        fetchSheetData()
      } else {
        toast.error("Failed to add lead")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmittingLead(false)
    }
  }

  const handleAddSchool = async () => {
    if (!newSchoolName.trim()) return;
    setIsAddingSchool(true);
    const result = await createSchoolSheet(newSchoolName.trim());
    if (result.success) {
      const updatedList = await getAllSchoolSheets(); // Refetch truth
      setSchools(updatedList);
      setSelectedSchool(newSchoolName.trim());
      setNewSchoolName("");
      toast.success("School sheet created");
    } else {
      toast.error(result.error || "Failed to add school");
    }
    setIsAddingSchool(false);
  }

  const handleDeleteSchool = async (schoolToDelete: string) => {
    if (!confirm(`Delete all data for ${schoolToDelete}?`)) return;
    const result = await deleteSchoolSheet(schoolToDelete);
    if (result.success) {
      const updatedList = await getAllSchoolSheets(); // Refetch truth
      setSchools(updatedList);
      if (selectedSchool === schoolToDelete) {
        setSelectedSchool(updatedList[0] || "");
      }
      toast.success("School removed");
    } else {
      toast.error("Deletion failed");
    }
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
    if (result.success) toast.success("Row saved")
    else toast.error("Save failed")
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Syncing directly with Google Sheets</p>
        </div>
        <Button onClick={() => setAddLeadModalOpen(true)} className="flex gap-2">
          <UserPlus className="w-4 h-4" /> Add Offline Lead
        </Button>
      </div>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="database" className="flex items-center gap-2"><Database className="w-4 h-4" /> Website Leads</TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2"><Save className="w-4 h-4" /> Sheets</TabsTrigger>
        </TabsList>

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
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{lead.name.charAt(0)}</div>
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

        <TabsContent value="sheets" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-xl border">
            <Input placeholder="Enter new school name..." value={newSchoolName} onChange={(e) => setNewSchoolName(e.target.value)} />
            <Button onClick={handleAddSchool} disabled={isAddingSchool}>
              {isAddingSchool ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Plus className="mr-2 w-4 h-4" />} Create Sheet
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {schools.length === 0 ? <p className="text-sm text-muted-foreground italic">No sheets found.</p> : schools.map((school) => (
              <div key={school} className="flex items-center border rounded-lg overflow-hidden">
                <Button variant={selectedSchool === school ? "default" : "ghost"} size="sm" className="rounded-none border-0" onClick={() => setSelectedSchool(school)}>{school}</Button>
                <button onClick={() => handleDeleteSchool(school)} className="px-2 h-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>

          <Card className="p-0 overflow-hidden border-0 shadow-xl">
            {sheetLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div> : (
              <div className="overflow-x-auto">
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
                    {sheetLeads.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No leads found.</TableCell></TableRow>
                    ) : sheetLeads.map((lead, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{lead.mobile}</TableCell>
                        <TableCell><Input className="w-32 h-8" value={lead.callingDate} onChange={(e) => handleSheetInputChange(idx, 'callingDate', e.target.value)} /></TableCell>
                        <TableCell>
                          <select className="w-36 h-8 text-xs border rounded" value={lead.response} onChange={(e) => handleSheetInputChange(idx, 'response', e.target.value)}>
                            <option value="-">Select</option>
                            {RESPONSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </TableCell>
                        <TableCell><Input className="w-28 h-8" value={lead.followUp} onChange={(e) => handleSheetInputChange(idx, 'followUp', e.target.value)} /></TableCell>
                        <TableCell><Input className="min-w-[150px] h-8" value={lead.comments} onChange={(e) => handleSheetInputChange(idx, 'comments', e.target.value)} /></TableCell>
                        <TableCell><Input className="w-24 h-8" value={lead.calledBy} onChange={(e) => handleSheetInputChange(idx, 'calledBy', e.target.value)} /></TableCell>
                        <TableCell>
                          <Button size="icon" className="h-8 w-8" onClick={() => saveSheetRow(idx)} disabled={updatingRowId === lead.rowNumber}>
                            {updatingRowId === lead.rowNumber ? <Loader2 className="animate-spin w-3 h-3" /> : <Save className="w-3 h-3" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addLeadModalOpen} onOpenChange={setAddLeadModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <form onSubmit={handleAddNewLead} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input placeholder="Full Name" value={newLeadForm.name} onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input placeholder="Mobile number" value={newLeadForm.mobile} onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddLeadModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmittingLead}>{isSubmittingLead ? "Adding..." : "Add to Sheet"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminSidebar>
  )
}