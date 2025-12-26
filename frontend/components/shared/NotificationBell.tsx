"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: number;
  message: string;
  redirectUrl: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  // 1. Poll for Unread Count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token")
        if(!token) return;
        
        const res = await fetch("http://localhost:8080/api/notifications/unread-count", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()
        
        if (data.count > unreadCount) {
           // Fetch latest to show toast
           const listRes = await fetch("http://localhost:8080/api/notifications", {
             headers: { "Authorization": `Bearer ${token}` }
           });
           const listData = await listRes.json();
           if (listData.length > 0) {
             toast.info("New Notification", {
               description: listData[0].message,
               action: { label: "View", onClick: () => router.push(listData[0].redirectUrl) }
             });
           }
        }
        setUnreadCount(data.count)
      } catch (e) {
        console.error("Polling error", e)
      }
    }

    const interval = setInterval(fetchCount, 15000) 
    fetchCount(); 
    return () => clearInterval(interval)
  }, [unreadCount, router])

  // 2. Fetch List
  const fetchNotificationsList = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (res.ok) setNotifications(await res.json())
  }

  // 3. Mark as Read
  const handleNotificationClick = async (id: number, url: string) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
    router.push(url)
  }

  return (
    <Popover onOpenChange={(open) => open && fetchNotificationsList()}>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
          <Bell className="w-6 h-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center border-2 border-background">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="p-4 border-b border-border font-semibold">Notifications</div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => handleNotificationClick(note.id, note.redirectUrl)}
                  className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 ${!note.read ? 'bg-primary/5' : ''}`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className="space-y-1">
                    <p className={`text-sm ${!note.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{note.message}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}