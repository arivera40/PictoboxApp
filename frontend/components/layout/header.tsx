"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isAuthenticated?: boolean
  onLogout?: () => void
}

export function Header({ isAuthenticated = false, onLogout }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <Link href="/" className="text-xl font-bold">
            Pictobox
          </Link>
        </div>
        <div className="ml-auto flex gap-2">
          {isAuthenticated ? (
            <Button variant="outline" className="bg-white" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="bg-white">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
