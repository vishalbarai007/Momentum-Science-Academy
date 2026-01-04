"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface RoleGuardProps {
  children: React.ReactNode
  // Change allowedRole to accept a single string OR an array of strings
  allowedRoles: string[] | string; 
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (!token) {
      // Default redirect to login if not authenticated
      router.replace("/login") 
      return
    }

    // Check if the user's role is in the allowed list
    if (userRole && allowedRoles.includes(userRole)) {
      setAuthorized(true)
    } else {
      toast.error("Unauthorized Access")
      // Redirect based on their actual role to prevent infinite loops
      if (userRole === "student") router.replace("/student/dashboard")
      else if (userRole === "teacher") router.replace("/teacher/dashboard")
      else router.replace("/")
    }
  }, [router, allowedRoles])

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return <>{children}</>
}