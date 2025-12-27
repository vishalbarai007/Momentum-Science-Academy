'use client';

import { useState } from 'react';
import { getDashboardData } from '@/app/actions/sheets';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from "lucide-react";

export default function GoogleSheetDemo() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRead = async () => {
    setLoading(true);
    try {
      const result = await getDashboardData();
      if (result && result.leads) {
        setLeads(result.leads);
      }
    } catch (error) {
      console.error("Failed to fetch sheet data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 border rounded-xl bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Lead Records</h2>
        <Button onClick={handleRead} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            "Fetch Sheet Data"
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Mobile No</TableHead>
              <TableHead className="font-bold">Calling Date</TableHead>
              <TableHead className="font-bold">Response</TableHead>
              <TableHead className="font-bold">Follow Up</TableHead>
              <TableHead className="font-bold">Comments</TableHead>
              <TableHead className="font-bold">Called By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No data fetched. Click "Fetch Sheet Data" to load leads.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.mobile}</TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.response}
                    </span>
                  </TableCell>
                  <TableCell className="text-orange-600 font-semibold">{lead.followUp}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={lead.comments}>
                    {lead.comments}
                  </TableCell>
                  <TableCell>{lead.calledBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}