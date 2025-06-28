"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  profilePicUrl: string
  bio: string
  isFollowing: boolean
  followersCount: number
}

interface SearchUsersModalProps {
  open: boolean
  onClose: () => void
}

export function SearchUsersModal({ open, onClose }: SearchUsersModalProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set())

  // Mock users for demo
  const mockUsers: User[] = [
    {
      id: "1",
      username: "alice_photos",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      bio: "Travel photographer | Nature lover",
      isFollowing: false,
      followersCount: 1250,
    },
    {
      id: "2",
      username: "bob_adventures",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      bio: "Adventure seeker | Mountain climber",
      isFollowing: true,
      followersCount: 890,
    },
    {
      id: "3",
      username: "creative_sarah",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      bio: "Digital artist | Coffee enthusiast",
      isFollowing: false,
      followersCount: 2100,
    },
    {
      id: "4",
      username: "foodie_mike",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      bio: "Food blogger | Recipe creator",
      isFollowing: false,
      followersCount: 3400,
    },
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery)
    } else {
      setUsers([])
    }
  }, [searchQuery])

  const searchUsers = async (query: string) => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Replace with your .NET Core API endpoint
      const response = await fetch(`https://your-dotnet-api.com/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to search users")
      }

      const searchResults = await response.json()
      setUsers(searchResults)

      // For demo purposes, filter mock users
      const filteredUsers = mockUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.bio.toLowerCase().includes(query.toLowerCase()),
      )
      setUsers(filteredUsers)
    } catch (error) {
      // Use mock data for demo
      const filteredUsers = mockUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.bio.toLowerCase().includes(query.toLowerCase()),
      )
      setUsers(filteredUsers)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async (userId: string, currentlyFollowing: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const action = currentlyFollowing ? "unfollow" : "follow"

      // Replace with your .NET Core API endpoint
      const response = await fetch(`https://your-dotnet-api.com/api/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`)
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isFollowing: !currentlyFollowing,
                followersCount: currentlyFollowing ? user.followersCount - 1 : user.followersCount + 1,
              }
            : user,
        ),
      )

      // Update following set
      setFollowingUsers((prev) => {
        const newSet = new Set(prev)
        if (currentlyFollowing) {
          newSet.delete(userId)
        } else {
          newSet.add(userId)
        }
        return newSet
      })

      toast({
        title: currentlyFollowing ? "Unfollowed" : "Following",
        description: `You are ${currentlyFollowing ? "no longer following" : "now following"} this user.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
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
              className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.profilePicUrl || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                      <p className="text-xs text-muted-foreground">{user.followersCount} followers</p>
                    </div>
                  </div>
                  <Button
                    variant={user.isFollowing || followingUsers.has(user.id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollowToggle(user.id, user.isFollowing || followingUsers.has(user.id))}
                  >
                    {user.isFollowing || followingUsers.has(user.id) ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <div className="py-8 text-center text-muted-foreground">No users found for "{searchQuery}"</div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">Start typing to search for users</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
