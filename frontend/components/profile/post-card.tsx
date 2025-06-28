"use client"

import { Card, CardContent } from "@/components/ui/card"

interface PostCardProps {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  createdAt: string
  onClick?: () => void
}

export function PostCard({ imageUrl, caption, likes, comments, createdAt, onClick }: PostCardProps) {
  return (
    <Card className="cursor-pointer transition-transform hover:scale-105" onClick={onClick}>
      <img src={imageUrl || "/placeholder.svg"} alt={caption} className="aspect-square w-full object-cover" />
      <CardContent className="p-4">
        <p className="mb-2 line-clamp-2">{caption}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
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
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{comments}</span>
          </div>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
