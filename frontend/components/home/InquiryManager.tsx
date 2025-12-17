"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { ArrowRight } from "lucide-react"

// Only load the heavy modal code when needed
const InquiryModal = dynamic(() => import('./InquiryModal'), { ssr: false })

export default function InquiryManager() {
  const [show, setShow] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          onClick={() => setShow(true)}
          size="lg"
          className="bg-linear-to-r from-primary to-secondary..."
        >
          Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        {/* ... other buttons ... */}
      </div>

      {show && <InquiryModal onClose={() => setShow(false)} />}
    </>
  )
}