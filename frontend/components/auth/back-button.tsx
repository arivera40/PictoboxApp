import Link from "next/link"
import { Button } from "@/components/ui/button"

export function BackButton() {
  return (
    <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
      <Button variant="ghost" className="flex items-center gap-1">
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
          className="h-4 w-4"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back
      </Button>
    </Link>
  )
}
