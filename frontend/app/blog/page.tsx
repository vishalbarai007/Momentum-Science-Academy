"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const blogs = [
    {
      id: 1,
      title: "Top 10 Tips for JEE Main Success",
      excerpt:
        "Master the strategies that helped our AIR 329 topper crack JEE Main with flying colors. Learn time management, revision techniques, and more.",
      category: "JEE",
      date: "2024-12-15",
      author: "Prof. R.P. Singh",
      readTime: "8 min read",
      image: "/student-studying-for-jee-exam-preparation.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "NEET 2024: Complete Biology Guide",
      excerpt:
        "Comprehensive preparation guide covering all important topics, shortcuts, and strategies for NEET Biology section.",
      category: "NEET",
      date: "2024-12-10",
      author: "Ms. Priya Nair",
      readTime: "12 min read",
      image: "/biology-neet-preparation-medical-entrance.jpg",
    },
    {
      id: 3,
      title: "Common Math Mistakes to Avoid",
      excerpt:
        "Learn from common pitfalls and boost your accuracy in math exams. These tips will help you score better.",
      category: "Mathematics",
      date: "2024-12-05",
      author: "Prof. R.P. Singh",
      readTime: "6 min read",
      image: "/mathematics-equations-formulas-study.jpg",
    },
    {
      id: 4,
      title: "Board Exam Time Management",
      excerpt: "Effective strategies to manage your time during board examinations and maximize your score.",
      category: "Board Exams",
      date: "2024-11-28",
      author: "Dr. P.V. Shukla",
      readTime: "5 min read",
      image: "/student-time-management-exam-preparation.jpg",
    },
    {
      id: 5,
      title: "Physics Numericals: Short Tricks",
      excerpt: "Master physics numerical problems with quick calculation methods and formula shortcuts.",
      category: "Physics",
      date: "2024-11-20",
      author: "Prof. Anil Kumar",
      readTime: "10 min read",
      image: "/physics-formulas-numerical-problems.jpg",
    },
    {
      id: 6,
      title: "Organic Chemistry Reactions Summary",
      excerpt: "Complete cheat sheet of important organic chemistry reactions for NEET and JEE preparation.",
      category: "Chemistry",
      date: "2024-11-15",
      author: "Dr. Seema Verma",
      readTime: "15 min read",
      image: "/organic-chemistry-reactions-molecules.jpg",
    },
  ]

  const categories = ["All", "JEE", "NEET", "Board Exams", "Mathematics", "Physics", "Chemistry"]

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const featuredBlog = blogs.find((b) => b.featured)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Knowledge Hub
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tips, strategies, and insights from our expert faculty to help you succeed
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredBlog && activeCategory === "All" && !searchQuery && (
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featuredBlog.image || "/placeholder.svg"}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-primary font-medium text-sm mb-2">{featuredBlog.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredBlog.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredBlog.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> {featuredBlog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {new Date(featuredBlog.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {featuredBlog.readTime}
                      </span>
                    </div>
                    <Link href={`/blog/${featuredBlog.id}`}>
                      <Button className="w-fit">
                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs
                .filter((b) => !b.featured || activeCategory !== "All" || searchQuery)
                .map((blog, i) => (
                  <Card
                    key={blog.id}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                        <span>-</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">By {blog.author}</span>
                        <Link
                          href={`/blog/${blog.id}`}
                          className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
                        >
                          Read More <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-8 opacity-90">Get exclusive tips and resources delivered to your inbox every week</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-primary hover:bg-white/90">Subscribe</Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
