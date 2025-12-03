"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Trophy, TrendingUp, Medal, Target, ChevronDown, ChevronUp, Award, Users } from "lucide-react"

export default function StudentPerformancePage() {
  const [expandedTest, setExpandedTest] = useState<number | null>(null)

  const testResults = [
    {
      id: 1,
      name: "JEE Mock Test - December 2024",
      date: "Dec 10, 2024",
      totalMarks: 300,
      obtainedMarks: 245,
      rank: 12,
      totalStudents: 156,
      subjects: [
        { name: "Mathematics", total: 100, obtained: 85 },
        { name: "Physics", total: 100, obtained: 82 },
        { name: "Chemistry", total: 100, obtained: 78 },
      ],
    },
    {
      id: 2,
      name: "Physics Unit Test - Mechanics",
      date: "Dec 5, 2024",
      totalMarks: 50,
      obtainedMarks: 42,
      rank: 8,
      totalStudents: 145,
      subjects: [{ name: "Physics", total: 50, obtained: 42 }],
    },
    {
      id: 3,
      name: "Chemistry Weekly Test",
      date: "Nov 28, 2024",
      totalMarks: 40,
      obtainedMarks: 32,
      rank: 15,
      totalStudents: 150,
      subjects: [{ name: "Chemistry", total: 40, obtained: 32 }],
    },
    {
      id: 4,
      name: "Mathematics Chapter Test - Calculus",
      date: "Nov 20, 2024",
      totalMarks: 50,
      obtainedMarks: 46,
      rank: 3,
      totalStudents: 148,
      subjects: [{ name: "Mathematics", total: 50, obtained: 46 }],
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Rahul Sharma", score: 278, avatar: "R" },
    { rank: 2, name: "Priya Patel", score: 265, avatar: "P" },
    { rank: 3, name: "Amit Kumar", score: 258, avatar: "A" },
    { rank: 4, name: "Neha Singh", score: 252, avatar: "N" },
    { rank: 5, name: "Vikram Reddy", score: 248, avatar: "V" },
    { rank: 12, name: "Aditya Kumar (You)", score: 245, avatar: "A", isCurrentUser: true },
  ]

  const overallStats = {
    averageScore: 82,
    totalTests: 12,
    bestRank: 3,
    improvement: "+5%",
  }

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{overallStats.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-500">{overallStats.improvement}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{overallStats.bestRank}</p>
              <p className="text-sm text-muted-foreground">Best Rank</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{overallStats.totalTests}</p>
              <p className="text-sm text-muted-foreground">Tests Taken</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Test Results */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Test Results</h2>
          <div className="space-y-4">
            {testResults.map((test) => (
              <Card key={test.id} className="border-0 shadow-lg overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {test.obtainedMarks}/{test.totalMarks}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rank #{test.rank} of {test.totalStudents}
                        </p>
                      </div>
                      {expandedTest === test.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                        style={{ width: `${(test.obtainedMarks / test.totalMarks) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round((test.obtainedMarks / test.totalMarks) * 100)}% score
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedTest === test.id && (
                  <div className="px-5 pb-5 border-t border-border pt-4 animate-fade-in">
                    <h4 className="font-semibold mb-3">Subject-wise Breakdown</h4>
                    <div className="space-y-3">
                      {test.subjects.map((subject, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{subject.name}</span>
                            <span className="font-medium">
                              {subject.obtained}/{subject.total}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                (subject.obtained / subject.total) >= 0.8
                                  ? "bg-emerald-500"
                                  : subject.obtained / subject.total >= 0.6
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${(subject.obtained / subject.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Leaderboard
          </h2>
          <Card className="border-0 shadow-lg p-4">
            <p className="text-sm text-muted-foreground mb-4">JEE Mock Test - December 2024</p>
            <div className="space-y-3">
              {leaderboard.map((student, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    student.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      student.rank === 1
                        ? "bg-yellow-500 text-white"
                        : student.rank === 2
                          ? "bg-gray-400 text-white"
                          : student.rank === 3
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {student.rank <= 3 ? <Medal className="w-4 h-4" /> : student.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${student.isCurrentUser ? "text-primary" : ""}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Rank #{student.rank}</p>
                  </div>
                  <p className="font-bold">{student.score}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </StudentSidebar>
  )
}
