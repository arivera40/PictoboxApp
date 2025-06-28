"use client"

import { BackButton } from "@/components/auth/back-button"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackButton />
      <LoginForm />
    </div>
  )
}
