"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
    }
  }, [router])

  const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return { getAuthHeader, logout }
}
