"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming you use sonner

interface RoleGuardProps {
  children: React.ReactNode
  allowedRole: "admin" | "teacher" | "student"
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // 1. Get data from LocalStorage
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    // 2. No Token? Redirect to Login
    if (!token) {
      router.replace(`/${allowedRole}/login`) // 'replace' prevents going back
      return
    }

    // 3. Wrong Role? Redirect to their specific dashboard or home
    if (userRole !== allowedRole) {
      toast.error("Unauthorized Access")
      router.replace("/") 
      return
    }

    // 4. Authorized
    setAuthorized(true)
  }, [router, allowedRole])

  // 5. Show nothing while checking (prevents flashing sensitive content)
  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return <>{children}</>
}