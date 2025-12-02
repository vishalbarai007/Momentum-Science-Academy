"use client"

import type React from "react"

import { useState } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Plus,
  FileText,
  Calendar,
  User,
  Tag,
  Globe,
  EyeOff,
} from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  status: "published" | "draft"
  views: number
  createdAt: string
  updatedAt: string
  featuredImage: string
}

const initialPosts: BlogPost[] = [
  {
    id: "1",
    title: "JEE Main 2024: Complete Preparation Guide",
    slug: "jee-main-2024-complete-preparation-guide",
    excerpt: "A comprehensive guide to prepare for JEE Main 2024 with tips from our expert faculty.",
    content: "Full content here...",
    category: "Exam Tips",
    author: "Prof. R.P. Singh",
    status: "published",
    views: 1250,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    featuredImage: "/jee-exam-preparation.jpg",
  },
  {
    id: "2",
    title: "NEET Biology: Cell Structure Made Easy",
    slug: "neet-biology-cell-structure-made-easy",
    excerpt: "Learn about cell structure with easy-to-understand explanations and diagrams.",
    content: "Full content here...",
    category: "Study Material",
    author: "Dr. Anjali Mehta",
    status: "published",
    views: 890,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14",
    featuredImage: "/biology-cell-structure.png",
  },
  {
    id: "3",
    title: "Success Story: AIR 329 in JEE Advanced",
    slug: "success-story-air-329-jee-advanced",
    excerpt: "Read how our student Arjun Verma achieved AIR 329 in JEE Advanced 2023.",
    content: "Full content here...",
    category: "Success Stories",
    author: "Admin",
    status: "published",
    views: 2100,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    featuredImage: "/student-success-celebration.jpg",
  },
  {
    id: "4",
    title: "MHT-CET vs JEE: Which to Choose?",
    slug: "mht-cet-vs-jee-which-to-choose",
    excerpt: "A detailed comparison to help you decide between MHT-CET and JEE.",
    content: "Full content here...",
    category: "Career Guidance",
    author: "Prof. S.K. Verma",
    status: "draft",
    views: 0,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    featuredImage: "/career-guidance-students.jpg",
  },
]

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [editorDialogOpen, setEditorDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const categories = ["Exam Tips", "Study Material", "Success Stories", "Career Guidance", "News"]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || post.category === filterCategory
    const matchesStatus = filterStatus === "all" || post.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSavePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string

    if (isEditing && selectedPost) {
      setPosts(
        posts.map((p) =>
          p.id === selectedPost.id
            ? {
                ...p,
                title,
                excerpt: formData.get("excerpt") as string,
                content: formData.get("content") as string,
                category: formData.get("category") as string,
                status: formData.get("status") as BlogPost["status"],
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : p,
        ),
      )
      showSuccess("Post updated successfully!")
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as string,
        author: "Admin",
        status: formData.get("status") as BlogPost["status"],
        views: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        featuredImage: "/blog-post-concept.png",
      }
      setPosts([newPost, ...posts])
      showSuccess("Post created successfully!")
    }
    setEditorDialogOpen(false)
    setSelectedPost(null)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (selectedPost) {
      setPosts(posts.filter((p) => p.id !== selectedPost.id))
      setDeleteDialogOpen(false)
      setSelectedPost(null)
      showSuccess("Post deleted successfully!")
    }
  }

  const togglePublish = (post: BlogPost) => {
    setPosts(
      posts.map((p) => (p.id === post.id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p)),
    )
    showSuccess(`Post ${post.status === "published" ? "unpublished" : "published"}!`)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setSelectedPost(post)
      setIsEditing(true)
    } else {
      setSelectedPost(null)
      setIsEditing(false)
    }
    setEditorDialogOpen(true)
  }

  return (
    <AdminSidebar>
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Button onClick={() => openEditor()} className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: posts.length, icon: FileText, color: "bg-blue-500" },
            {
              label: "Published",
              value: posts.filter((p) => p.status === "published").length,
              icon: Globe,
              color: "bg-green-500",
            },
            {
              label: "Drafts",
              value: posts.filter((p) => p.status === "draft").length,
              icon: EyeOff,
              color: "bg-orange-500",
            },
            {
              label: "Total Views",
              value: posts.reduce((acc, p) => acc + p.views, 0).toLocaleString(),
              icon: Eye,
              color: "bg-purple-500",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden lg:table-cell">Views</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={post.featuredImage || "/placeholder.svg"}
                        alt=""
                        className="w-16 h-10 rounded object-cover hidden sm:block"
                      />
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden lg:table-cell">{post.views.toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell">{post.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPost(post)
                            setPreviewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditor(post)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(post)}>
                          {post.status === "published" ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Globe className="w-4 h-4 mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedPost(post)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Editor Dialog */}
        <Dialog open={editorDialogOpen} onOpenChange={setEditorDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Post" : "Create New Post"}</DialogTitle>
              <DialogDescription>{isEditing ? "Update your blog post" : "Write a new blog post"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSavePost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={selectedPost?.title || ""}
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={selectedPost?.excerpt || ""}
                  placeholder="Brief description of the post"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={selectedPost?.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedPost?.status || "draft"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={selectedPost?.content || ""}
                  placeholder="Write your post content here..."
                  rows={10}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditorDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update Post" : "Create Post"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post Preview</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <img
                  src={selectedPost.featuredImage || "/placeholder.svg"}
                  alt=""
                  className="w-full h-48 rounded-lg object-cover"
                />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {selectedPost.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.createdAt}
                  </div>
                </div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <p className="text-muted-foreground">{selectedPost.excerpt}</p>
                <p className="text-sm">{selectedPost.content}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminSidebar>
  )
}
