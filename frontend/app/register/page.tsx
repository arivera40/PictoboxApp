"use client"

import { BackButton } from "@/components/auth/back-button"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackButton />
      <RegisterForm />
    </div>
  )
}
