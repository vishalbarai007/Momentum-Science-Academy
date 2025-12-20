"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Trophy, TrendingUp, Medal, Target, ChevronDown, ChevronUp, Award, Users, Loader2 } from "lucide-react"

// Types matching backend DTOs
interface Stats {
  averageScore: string
  totalTests: number
  bestRank: string
  improvement: string
}

interface TestResult {
  id: number
  name: string
  date: string
  marks: string // "45/50"
  rank: number
  totalStudents: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  score: string
  avatar: string
  isCurrentUser: boolean
}

export default function StudentPerformancePage() {
  const [expandedTest, setExpandedTest] = useState<number | null>(null)
  
  // Data States
  const [stats, setStats] = useState<Stats>({ averageScore: "0%", totalTests: 0, bestRank: "N/A", improvement: "0%" })
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  
  // Loading States
  const [loading, setLoading] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)
  
  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token")
            if(!token) return
            
            // Fetch Stats
            const statsRes = await fetch("http://localhost:8080/api/v1/performance/stats", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(statsRes.ok) setStats(await statsRes.json())
                
            // Fetch Results
            const resRes = await fetch("http://localhost:8080/api/v1/performance/results", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(resRes.ok) {
                const results = await resRes.json()
                setTestResults(results)
                // Automatically fetch leaderboard for the first test if available
                if (results.length > 0) {
                    fetchLeaderboard(results[0].id)
                    setExpandedTest(results[0].id)
                }
            }
        } catch (error) { console.error("Error fetching performance data", error) }
        finally { setLoading(false) }
    }
    fetchData()
  }, [])

  // 2. Fetch Leaderboard when a test is expanded
  const fetchLeaderboard = async (testId: number) => {
    setLoadingLeaderboard(true)
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/v1/performance/leaderboard/${testId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        if(res.ok) setLeaderboard(await res.json())
    } catch (error) { console.error("Error fetching leaderboard", error) }
    finally { setLoadingLeaderboard(false) }
  }

  const handleExpand = (testId: number) => {
    if (expandedTest === testId) {
        setExpandedTest(null)
    } else {
        setExpandedTest(testId)
        fetchLeaderboard(testId)
    }
  }

  // Helper to calculate percentage for progress bars
  const calculatePercentage = (marksStr: string) => {
    try {
        const [obtained, total] = marksStr.split("/").map(Number)
        if (!total) return 0
        return (obtained / total) * 100
    } catch { return 0 }
  }

  if (loading) return (
    <StudentSidebar>
        <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
    </StudentSidebar>
  )

  return (
    <StudentSidebar>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Performance</h1>
        <p className="text-muted-foreground">Track your test results and compare with peers</p>
      </div>

      {/* Overall Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Target className="w-6 h-6 text-white" /></div>
            <div><p className="text-3xl font-bold">{stats.averageScore}</p><p className="text-sm text-muted-foreground">Avg. Score</p></div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-white" /></div>
            <div><p className="text-3xl font-bold text-emerald-500">{stats.improvement}</p><p className="text-sm text-muted-foreground">Improvement</p></div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Trophy className="w-6 h-6 text-white" /></div>
            <div><p className="text-3xl font-bold">{stats.bestRank}</p><p className="text-sm text-muted-foreground">Best Rank</p></div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Award className="w-6 h-6 text-white" /></div>
            <div><p className="text-3xl font-bold">{stats.totalTests}</p><p className="text-sm text-muted-foreground">Tests Taken</p></div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Test Results */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Test Results</h2>
          <div className="space-y-4">
            {testResults.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">No graded tests found yet.</div>
            ) : (
                testResults.map((test) => (
                <Card key={test.id} className={`border-0 shadow-lg overflow-hidden transition-all ${expandedTest === test.id ? 'ring-2 ring-primary/20' : ''}`}>
                    <div className="p-5 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => handleExpand(test.id)}>
                    <div className="flex items-center justify-between">
                        <div>
                        <h3 className="font-bold text-lg mb-1">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{test.marks}</p>
                            <p className="text-sm text-muted-foreground">Rank #{test.rank} of {test.totalStudents}</p>
                        </div>
                        {expandedTest === test.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${calculatePercentage(test.marks)}%` }} />
                        </div>
                    </div>
                    </div>
                </Card>
                ))
            )}
          </div>
        </div>

        {/* Dynamic Leaderboard */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Leaderboard
          </h2>
          <Card className="border-0 shadow-lg p-4 min-h-[300px]">
            {expandedTest ? (
                <>
                    <p className="text-sm text-muted-foreground mb-4 font-medium border-b pb-2">
                        {testResults.find(t => t.id === expandedTest)?.name || "Loading..."}
                    </p>
                    {loadingLeaderboard ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
                    ) : leaderboard.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">No leaderboard data available.</p>
                    ) : (
                        <div className="space-y-3">
                        {leaderboard.map((student, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${student.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                student.rank === 1 ? "bg-yellow-500 text-white" : 
                                student.rank === 2 ? "bg-gray-400 text-white" : 
                                student.rank === 3 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                            }`}>
                                {student.rank <= 3 ? <Medal className="w-4 h-4" /> : student.rank}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                                {student.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${student.isCurrentUser ? "text-primary" : ""}`}>
                                {student.isCurrentUser ? "You" : student.name}
                                </p>
                                <p className="text-xs text-muted-foreground">Rank #{student.rank}</p>
                            </div>
                            <p className="font-bold text-sm">{student.score}</p>
                            </div>
                        ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                    <Trophy className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Select a test to view the leaderboard</p>
                </div>
            )}
          </Card>
        </div>
      </div>
    </StudentSidebar>
  )
}