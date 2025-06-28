"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface SuggestedUser {
  id: string
  username: string
  profilePicUrl: string
  mutualFollowers: number
  isFollowing: boolean
}

export function UserSuggestions() {
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock suggestions for demo
  const mockSuggestions: SuggestedUser[] = [
    {
      id: "s1",
      username: "nature_lens",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      mutualFollowers: 5,
      isFollowing: false,
    },
    {
      id: "s2",
      username: "city_explorer",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      mutualFollowers: 3,
      isFollowing: false,
    },
    {
      id: "s3",
      username: "art_daily",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      mutualFollowers: 8,
      isFollowing: false,
    },
  ]

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token")

      // Replace with your .NET Core API endpoint
      const response = await fetch("https://your-dotnet-api.com/api/users/suggestions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }

      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      // Use mock data for demo
      setSuggestions(mockSuggestions)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`https://your-dotnet-api.com/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to follow user")
      }

      setSuggestions((prev) => prev.map((user) => (user.id === userId ? { ...user, isFollowing: true } : user)))

      toast({
        title: "Following",
        description: "You are now following this user.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicUrl || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.mutualFollowers} mutual followers</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={user.isFollowing ? "outline" : "default"}
              onClick={() => handleFollow(user.id)}
              disabled={user.isFollowing}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
