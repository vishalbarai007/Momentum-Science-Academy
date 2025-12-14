"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Upload, CheckCircle, X } from "lucide-react"

// Define the shape of our form data
interface FormData {
  title: string
  description: string
  resourceType: string
  subject: string
  classLevel: string
  examType: string
  fileLink: string
  visibility: 'publish' | 'draft'
}

const initialFormData: FormData = {
  title: "",
  description: "",
  resourceType: "",
  subject: "",
  classLevel: "",
  examType: "Not Applicable",
  fileLink: "",
  visibility: "publish", // Default to 'publish'
}

export default function TeacherUploadPage() {
  const router = useRouter()
  
  // State for all form inputs
  const [formData, setFormData] = useState<FormData>(initialFormData)
  
  // State for process tracking
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  /**
   * Universal handler for all text and select inputs.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsUploading(true);

  // 1. Get Authentication Token
  const token = localStorage.getItem("token");
  if (!token) {
    // Handle case where token is missing (user should be logged out or redirected)
    console.error("Authentication token not found. Please log in again.");
    setIsUploading(false);
    // You might want to router.push("/login") here
    return;
  }

  // 2. Prepare the Request Body (maps directly to the ResourceUploadRequest DTO)
  const payload = {
    title: formData.title,
    description: formData.description,
    resourceType: formData.resourceType,
    subject: formData.subject,
    classLevel: formData.classLevel,
    // Set to null if 'Not Applicable' to match backend DTO expectation
    examType: formData.examType === "Not Applicable" ? null : formData.examType,
    fileLink: formData.fileLink,
    visibility: formData.visibility, // "publish" or "draft"
  };

  try {
    // 3. Make the API Call
    const response = await fetch("http://localhost:8080/api/v1/resources/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // AUTHENTICATION: Pass the JWT token
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify(payload),
    });

    // 4. Handle Errors
    if (!response.ok) {
      const errorText = await response.text();
      // In a real app, you would use a toast/notification here to show the user the errorText
      console.error("Resource Upload Failed:", errorText);
      throw new Error(errorText || "Upload failed with status " + response.status);
    }

    // 5. Handle Success
    // const data = await response.json(); // Uncomment if you need the response data
    
    setIsUploading(false);
    setUploadSuccess(true);
    setFormData(initialFormData); // Clear form state

    // Redirect after success
    setTimeout(() => {
      router.push("/teacher/resources");
    }, 2000);

  } catch (err) {
    // 6. Handle Network/Catch Errors
    console.error("API Call Error:", err);
    // If you had an setError state, you would use it here: setError("An unexpected error occurred.");
    setIsUploading(false);
    // You may want to show a temporary error message to the user here.
  }
};

  if (uploadSuccess) {
    return (
      <TeacherSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 border-0 shadow-xl text-center max-w-md animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your resource has been uploaded and is now available to students.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to resources...</p>
          </Card>
        </div>
      </TeacherSidebar>
    )
  }

  return (
    <TeacherSidebar>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Upload Resource</h1>
          <p className="text-muted-foreground">Share study materials with students across all classes</p>
        </div>

        <Card className="p-8 border-0 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="title">Resource Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Calculus - Complete Solutions"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe what this resource covers..."
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Resource Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="resourceType">Resource Type *</label>
                <select
                  id="resourceType"
                  name="resourceType"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="pq">Previous Year Questions (PYQ)</option>
                  <option value="notes">Study Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="imp">Important Topics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select subject</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="classLevel">Class/Level *</label>
                <select
                  id="classLevel"
                  name="classLevel"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={formData.classLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select class</option>
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="examType">Exam Type</label>
                <select 
                  id="examType"
                  name="examType"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={formData.examType}
                  onChange={handleInputChange}
                >
                  <option>Not Applicable</option>
                  <option>JEE Main</option>
                  <option>JEE Advanced</option>
                  <option>NEET</option>
                  <option>MHT-CET</option>
                  <option>Board Exam</option>
                </select>
              </div>
            </div>

            {/* File Link */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="fileLink">File Link *</label>
              <input
                id="fileLink"
                name="fileLink"
                type="text"
                placeholder="Enter link to the file here"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.fileLink}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Visibility */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="publish"
                  checked={formData.visibility === 'publish'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-500"
                />
                <div>
                  <p className="font-medium">Publish Now</p>
                  <p className="text-xs text-muted-foreground">Resource will be visible to students immediately</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="draft" 
                  checked={formData.visibility === 'draft'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-500" 
                />
                <div>
                  <p className="font-medium">Save as Draft</p>
                  <p className="text-xs text-muted-foreground">Review later before publishing</p>
                </div>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 py-6"
                disabled={isUploading || !formData.fileLink || !formData.title || !formData.resourceType || !formData.subject || !formData.classLevel}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resource
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-6 bg-transparent"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </TeacherSidebar>
  )
}