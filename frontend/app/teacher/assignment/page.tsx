"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherSidebar } from "@/components/shared/teacher-sidebar"
import { Upload, CheckCircle, Calendar, FileText } from "lucide-react"

// Define the shape of our form data for Assignments
interface AssignmentFormData {
  title: string
  description: string
  subject: string
  classLevel: number
  examType: string
  fileLink: string
  dueDate: string // Specific to assignments
  difficulty: string // Specific to assignments (Easy, Medium, Hard)
  visibility: 'publish' | 'draft'
}

const initialFormData: AssignmentFormData = {
  title: "",
  description: "",
  subject: "",
  classLevel: 0,
  examType: "Not Applicable",
  fileLink: "",
  dueDate: "",
  difficulty: "Medium",
  visibility: "publish",
}

export default function TeacherAssignmentUploadPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<AssignmentFormData>(initialFormData)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

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

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found.");
      setIsUploading(false);
      return;
    }

    // Prepare Payload mapping to Backend ResourceDTO
    // Note: We append Due Date and Difficulty to description since backend 
    // Resource model might not have dedicated columns for them yet, 
    // or we use them if you extended the model as discussed previously.
    const payload = {
      title: formData.title,
      // HACK: Storing metadata in description if backend doesn't have specific fields yet
      description: `${formData.description}\n\n[Metadata] Due: ${formData.dueDate} | Difficulty: ${formData.difficulty}`, 
      resourceType: "assignment", // Hardcoded for this page
      subject: formData.subject,
      targetClass: formData.classLevel,
      examType: formData.examType === "Not Applicable" ? null : formData.examType,
      fileLink: formData.fileLink,
      visibility: formData.visibility,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/resources/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      setIsUploading(false);
      setUploadSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => {
        router.push("/teacher/assignments"); // Redirect to assignments list
      }, 2000);

    } catch (err) {
      console.error("API Call Error:", err);
      setIsUploading(false);
      alert("Failed to upload assignment. Please try again.");
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
            <h2 className="text-2xl font-bold mb-2">Assignment Created!</h2>
            <p className="text-muted-foreground mb-4">
              The assignment has been posted successfully.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </Card>
        </div>
      </TeacherSidebar>
    )
  }

  return (
    <TeacherSidebar>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Assignment</h1>
          <p className="text-muted-foreground">Assign tasks, set due dates, and track student progress</p>
        </div>

        <Card className="p-8 border-0 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="title">Assignment Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Integration Practice Set - Week 4"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="description">Instructions / Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Detailed instructions for students..."
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Target Audience */}
            <div className="grid md:grid-cols-2 gap-4">
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
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            </div>

            {/* Assignment Specifics */}
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-2" htmlFor="dueDate">Due Date *</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="examType">Target Exam</label>
                    <select 
                        id="examType"
                        name="examType"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        value={formData.examType}
                        onChange={handleInputChange}
                    >
                        <option>Not Applicable</option>
                        <option>JEE Main</option>
                        <option>JEE Advanced</option>
                        <option>NEET</option>
                        <option>Board Exam</option>
                    </select>
                </div>
            </div>

            {/* File Link */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="fileLink">Question Paper Link (PDF/Doc) *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    id="fileLink"
                    name="fileLink"
                    type="text"
                    placeholder="Paste Google Drive / Dropbox link"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    value={formData.fileLink}
                    onChange={handleInputChange}
                    required
                />
              </div>
            </div>
            
            {/* Visibility Toggle */}
            <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                    type="radio"
                    name="visibility"
                    value="publish"
                    checked={formData.visibility === 'publish'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500"
                    />
                    <div>
                    <p className="font-medium text-sm">Publish Immediately</p>
                    </div>
                </label>
                <label className="flex-1 flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <input 
                    type="radio" 
                    name="visibility" 
                    value="draft" 
                    checked={formData.visibility === 'draft'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500" 
                    />
                    <div>
                    <p className="font-medium text-sm">Save as Draft</p>
                    </div>
                </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 py-6 text-lg"
                disabled={isUploading || !formData.fileLink || !formData.title || !formData.subject || !formData.dueDate}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Create Assignment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </TeacherSidebar>
  )
}