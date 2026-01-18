"use client"

import { AuthProvider } from "@/lib/auth-context"
import { CheckInProvider } from "@/lib/checkin-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CheckInProvider>{children}</CheckInProvider>
    </AuthProvider>
  )
}
