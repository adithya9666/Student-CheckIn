"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface CheckIn {
  id: string
  date: string
  goals: string
  mood: number
  notes: string
  createdAt: string
}

interface CheckInContextType {
  checkIns: CheckIn[]
  addCheckIn: (checkIn: Omit<CheckIn, "id" | "createdAt">) => void
  getTodayCheckIn: () => CheckIn | undefined
  isLoading: boolean
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined)

export function CheckInProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`checkins-${user.id}`)
      if (stored) {
        setCheckIns(JSON.parse(stored))
      }
    } else {
      setCheckIns([])
    }
    setIsLoading(false)
  }, [user])

  const addCheckIn = (checkIn: Omit<CheckIn, "id" | "createdAt">) => {
    if (!user) return

    const newCheckIn: CheckIn = {
      ...checkIn,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    // Replace if same date exists, otherwise add
    const existingIndex = checkIns.findIndex((c) => c.date === checkIn.date)
    let updated: CheckIn[]

    if (existingIndex >= 0) {
      updated = [...checkIns]
      updated[existingIndex] = newCheckIn
    } else {
      updated = [newCheckIn, ...checkIns]
    }

    setCheckIns(updated)
    localStorage.setItem(`checkins-${user.id}`, JSON.stringify(updated))
  }

  const getTodayCheckIn = () => {
    const today = new Date().toISOString().split("T")[0]
    return checkIns.find((c) => c.date === today)
  }

  return (
    <CheckInContext.Provider value={{ checkIns, addCheckIn, getTodayCheckIn, isLoading }}>
      {children}
    </CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const context = useContext(CheckInContext)
  if (context === undefined) {
    throw new Error("useCheckIn must be used within a CheckInProvider")
  }
  return context
}
