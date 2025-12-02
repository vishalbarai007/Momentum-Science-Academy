"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Upload, CheckCircle, X } from "lucide-react"

export default function TeacherUploadPage() {
  const router = useRouter()
  const [fileSelected, setFileSelected] = useState(false)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(true)
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsUploading(false)
    setUploadSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/teacher/resources")
    }, 2000)
  }

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
              <label className="block text-sm font-medium mb-2">Resource Title *</label>
              <input
                type="text"
                placeholder="e.g., Calculus - Complete Solutions"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="Describe what this resource covers..."
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Resource Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resource Type *</label>
                <select
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                >
                  <option value="">Select type</option>
                  <option>Previous Year Questions (PYQ)</option>
                  <option>Study Notes</option>
                  <option>Assignment</option>
                  <option>Important Topics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                <label className="block text-sm font-medium mb-2">Class/Level *</label>
                <select
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                <label className="block text-sm font-medium mb-2">Exam Type</label>
                <select className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>Not Applicable</option>
                  <option>JEE Main</option>
                  <option>JEE Advanced</option>
                  <option>NEET</option>
                  <option>MHT-CET</option>
                  <option>Board Exam</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload File *</label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  fileSelected ? "border-emerald-500 bg-emerald-50" : "border-border hover:border-emerald-500"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload
                  className={`w-10 h-10 mx-auto mb-3 ${fileSelected ? "text-emerald-500" : "text-muted-foreground"}`}
                />
                <p className="font-medium mb-1">{fileSelected ? fileName : "Drag and drop your file here"}</p>
                <p className="text-sm text-muted-foreground mb-3">or click to browse</p>
                <p className="text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, XLS, PPT (Max 50MB)</p>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.ppt"
                  onChange={handleFileSelect}
                />
              </div>
              {fileSelected && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-emerald-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {fileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFileSelected(false)
                      setFileName("")
                    }}
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="publish"
                  defaultChecked
                  className="w-4 h-4 text-emerald-500"
                />
                <div>
                  <p className="font-medium">Publish Now</p>
                  <p className="text-xs text-muted-foreground">Resource will be visible to students immediately</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <input type="radio" name="visibility" value="draft" className="w-4 h-4 text-emerald-500" />
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
                disabled={isUploading || !fileSelected}
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
