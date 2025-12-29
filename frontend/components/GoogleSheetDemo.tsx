"use client"

import { useState, useEffect } from "react"
import { getSchoolData, updateSheetRow } from "@/app/actions/sheets"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

const SCHOOLS = [
    "SVM", "Vidyavikasini", "Holy-Family", "J.B.S", "SKC", "St. Joseph-Vasai",
    "Mother Mary - East", "J.B.Ludhani", "Kapol", "Kalindi", "Mother Teresa",
    "St Joseph-Nallasopara", "St Aloysius", "Mother Mary-West"
];

const RESPONSE_OPTIONS = [
    "Ringing",
    "Out of Town",
    "Will Visit",
    "Admission Taken",
    "Not Interested",
    "Call Busy",
    "Call Cut",
    "Call Later",
    "Wrong Number",
    "Network Issue"
];

export default function SchoolSheetManager() {
    const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0])
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    useEffect(() => {
        fetchData()
    }, [selectedSchool])

    const fetchData = async () => {
    setLoading(true)
    const data = await getSchoolData(selectedSchool)
    
    // Filter out rows where name and mobile are just dashes or empty
    const filteredData = data.filter(lead => 
        (lead.name !== "-" && lead.name !== "") || 
        (lead.mobile !== "-" && lead.mobile !== "")
    )
    
    setLeads(filteredData)
    setLoading(false)
}

    const handleInputChange = (index: number, field: string, value: string) => {
        const newLeads = [...leads]
        newLeads[index][field] = value
        setLeads(newLeads)
    }

    const saveRow = async (index: number) => {
        const lead = leads[index]
        setUpdatingId(lead.rowNumber)
        const result = await updateSheetRow(selectedSchool, lead.rowNumber, lead)

        if (result.success) {
            toast.success("Sheet updated successfully")
        } else {
            toast.error("Failed to update sheet")
        }
        setUpdatingId(null)
    }

    return (
        <div className="space-y-6">
            {/* School Selector */}
            <div className="flex flex-wrap gap-2">
                {SCHOOLS.map((school) => (
                    <Button
                        key={school}
                        variant={selectedSchool === school ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSchool(school)}
                    >
                        {school}
                    </Button>
                ))}
            </div>

            <Card className="p-4">
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Mobile</TableHead> {/* Removed colSpan="2" if present */}
                                <TableHead>Calling Date</TableHead>
                                <TableHead>Response</TableHead>
                                <TableHead>Follow Up</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Called By</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell>{lead.mobile}</TableCell>

                                    {/* Editable Calling Date */}
                                    <TableCell>
                                        <Input
                                            className="w-32"
                                            value={lead.callingDate}
                                            onChange={(e) => handleInputChange(idx, 'callingDate', e.target.value)}
                                        />
                                    </TableCell>

                                    {/* Response Dropdown */}
                                    <TableCell>
                                        <select
                                            className="w-40 px-2 py-1 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary"
                                            value={lead.response}
                                            onChange={(e) => handleInputChange(idx, 'response', e.target.value)}
                                        >
                                            <option value="-">Select Response</option>
                                            {RESPONSE_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </TableCell>

                                    <TableCell>
                                        <Input
                                            value={lead.followUp}
                                            onChange={(e) => handleInputChange(idx, 'followUp', e.target.value)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Input
                                            value={lead.comments}
                                            onChange={(e) => handleInputChange(idx, 'comments', e.target.value)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Input
                                            value={lead.calledBy}
                                            onChange={(e) => handleInputChange(idx, 'calledBy', e.target.value)}
                                            className="w-24"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            size="icon"
                                            onClick={() => saveRow(idx)}
                                            disabled={updatingId === lead.rowNumber}
                                        >
                                            {updatingId === lead.rowNumber ? <Loader2 className="animate-spin w-4" /> : <Save className="w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    )
}