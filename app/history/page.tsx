"use client"

import { getEntries, deleteEntry } from "@/app/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { CheckIn } from "@/lib/checkin-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const moodOptions = [
  { value: 1, label: "Struggling", color: "bg-red-100 border-red-300 text-red-700" },
  { value: 2, label: "Low", color: "bg-orange-100 border-orange-300 text-orange-700" },
  { value: 3, label: "Okay", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
  { value: 4, label: "Good", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
  { value: 5, label: "Great", color: "bg-teal-100 border-teal-300 text-teal-700" },
]

function CheckInCard({
  checkIn,
  onDelete,
}: {
  checkIn: CheckIn
  onDelete: (id: string) => void
}) {
  const date = new Date(checkIn.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            {date}
          </CardTitle>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border",
              moodOptions[checkIn.mood - 1]?.color
            )}
          >
            {moodOptions[checkIn.mood - 1]?.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {checkIn.goals && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Goals
            </p>
            <p className="text-sm text-card-foreground whitespace-pre-wrap">
              {checkIn.goals}
            </p>
          </div>
        )}

        {checkIn.notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="text-sm text-card-foreground whitespace-pre-wrap">
              {checkIn.notes}
            </p>
          </div>
        )}

<Button
  variant="destructive"
  onClick={async () => {
    await fetch(`http://localhost:5000/api/entry/${checkIn.id}`, {
      method: "DELETE"
    });

    window.location.reload();
  }}
  className="mt-3 w-full"
>
  Delete
</Button>


      </CardContent>
    </Card>
  )
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [checkInsLoading, setCheckInsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    try {
      const res = await getEntries()

      const mapped = res.entries.map((e: any) => ({
        id: e.id,
        date: e.date || new Date().toISOString(),
        goals: e.goal,
        mood: Number(e.mood || 3),
        notes: e.note,
      }))

      setCheckIns(mapped)
    } catch (err) {
      console.log(err)
    } finally {
      setCheckInsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id)
      await loadEntries()
    } catch (err) {
      console.log(err)
      alert("Failed to delete")
    }
  }

  if (authLoading || checkInsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Check-In History
          </h1>
          <p className="text-muted-foreground mt-1">
            Review your past check-ins and reflections
          </p>
        </div>

        {sortedCheckIns.length === 0 ? (
          <Card className="shadow-sm border-border">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg text-card-foreground mb-2">
                No check-ins yet
              </CardTitle>
              <CardDescription>
                Complete your first daily check-in to see it here
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedCheckIns.map((checkIn) => (
              <CheckInCard
                key={checkIn.id}
                checkIn={checkIn}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
