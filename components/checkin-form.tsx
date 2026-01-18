"use client"

import React from "react"

import { addEntry } from "@/app/api";
import { useState, useEffect } from "react"
import { useCheckIn } from "@/lib/checkin-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const moodOptions = [
  { value: 1, label: "Struggling", color: "bg-red-100 border-red-300 text-red-700" },
  { value: 2, label: "Low", color: "bg-orange-100 border-orange-300 text-orange-700" },
  { value: 3, label: "Okay", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
  { value: 4, label: "Good", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
  { value: 5, label: "Great", color: "bg-teal-100 border-teal-300 text-teal-700" },
]

export function CheckInForm() {
  const { addCheckIn, getTodayCheckIn } = useCheckIn()
  const [goals, setGoals] = useState("")
  const [mood, setMood] = useState<number>(3)
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const todayCheckIn = getTodayCheckIn()

  useEffect(() => {
    if (todayCheckIn) {
      setGoals(todayCheckIn.goals)
      setMood(todayCheckIn.mood)
      setNotes(todayCheckIn.notes)
      setSubmitted(true)
    }
  }, [todayCheckIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Call our backend API
      await addEntry({
        goal: goals,
        mood: String(mood),
        note: notes,
      });
  
      // Keep local UI behaviour also
      const today = new Date().toISOString().split("T")[0];
  
      addCheckIn({
        date: today,
        goals,
        mood,
        notes,
      });
  
      setSubmitted(true);
  
      alert("Saved to database successfully! 🎉");
  
    } catch (err) {
      console.error(err);
      alert("Failed to save to database");
    }
  };
  

  const handleEdit = () => {
    setSubmitted(false)
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (submitted) {
    return (
      <Card className="shadow-sm border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-card-foreground">Check-In Complete</CardTitle>
          <CardDescription>{today}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Today&apos;s Goals</p>
            <p className="text-card-foreground whitespace-pre-wrap">{goals || "No goals set"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Mood</p>
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-medium border",
                moodOptions[mood - 1]?.color
              )}
            >
              {moodOptions[mood - 1]?.label}
            </span>
          </div>
          {notes && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-card-foreground whitespace-pre-wrap">{notes}</p>
            </div>
          )}
          <Button variant="outline" onClick={handleEdit} className="w-full mt-4 bg-transparent">
            Edit Check-In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">Daily Check-In</CardTitle>
        <CardDescription>{today}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goals" className="text-card-foreground">
              What are your goals for today?
            </Label>
            <Textarea
              id="goals"
              placeholder="List your main goals or tasks for today..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              className="bg-background resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-card-foreground">How are you feeling?</Label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all",
                    mood === option.value
                      ? cn(option.color, "ring-2 ring-offset-2 ring-primary/30")
                      : "bg-muted border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-card-foreground">
              Additional notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any thoughts, reflections, or things on your mind..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-background resize-none"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Check-In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
