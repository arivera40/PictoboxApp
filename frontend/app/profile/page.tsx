"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Loading } from "@/components/ui/loading"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PostCard } from "@/components/profile/post-card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { CreatePostModal } from "@/components/profile/create-post-modal"
import { SearchUsersModal } from "@/components/profile/search-users-modal"
import { PostDetailModal } from "@/components/profile/post-detail-modal"

interface Post {
  postId: string
  imagePath: string
  caption: string
  likes: number
  comments: number
  postDate: string
}

interface UserProfile {
  username: string
  profilePic: string
  bio: string
  postsCount: number
  followersCount: number
  followingCount: number
  posts: Post[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showSearchUsers, setShowSearchUsers] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)

        // Replace with your .NET Core API endpoint
        const response = await fetch("http://localhost:5193/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [router, toast, refreshTrigger])

  const refreshProfile = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleProfilePicUpdate = (newUrl: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            profilePicUrl: newUrl,
          }
        : prev,
    )
    // Optionally refresh the entire profile to sync with server
    refreshProfile()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId)
  }

  if (isLoading) {
    return <Loading />
  }

  // Fallback data for preview
  const fallbackProfile: UserProfile = {
    username: "johndoe",
    profilePic: "/placeholder.svg?height=100&width=100",
    bio: "Photography enthusiast | Nature lover | Travel addict",
    postsCount: 42,
    followersCount: 1024,
    followingCount: 256,
    posts: [
      {
        postId: "1",
        imagePath: "/placeholder.svg?height=300&width=300",
        caption: "Beautiful sunset at the beach",
        likes: 120,
        comments: 14,
        postDate: "2023-06-15T18:30:00Z",
      },
      {
        postId: "2",
        imagePath: "/placeholder.svg?height=300&width=300",
        caption: "Morning coffee and work",
        likes: 89,
        comments: 7,
        postDate: "2023-06-10T09:15:00Z",
      },
      {
        postId: "3",
        imagePath: "/placeholder.svg?height=300&width=300",
        caption: "Hiking trip last weekend",
        likes: 215,
        comments: 23,
        postDate: "2023-06-05T16:45:00Z",
      },
    ],
  }

  const userProfile = profile || fallbackProfile

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="container py-8">
        <ProfileHeader
          username={userProfile.username}
          profilePic={userProfile.profilePic}
          bio={userProfile.bio}
          postsCount={userProfile.postsCount}
          followersCount={userProfile.followersCount}
          followingCount={userProfile.followingCount}
          onProfilePicUpdate={handleProfilePicUpdate}
        />
        <div className="mt-4 flex gap-2">
          <Button onClick={() => setShowCreatePost(true)}>
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
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Post
          </Button>
          <Button variant="outline" onClick={() => setShowSearchUsers(true)}>
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
              className="mr-2 h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Find Users
          </Button>
        </div>

        <Separator className="my-8" />

        <h2 className="mb-6 text-xl font-semibold">Your Posts</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {userProfile.posts.map((post) => (
            <PostCard
              key={post.postId}
              id={post.postId}
              imageUrl={post.imagePath}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
              createdAt={post.postDate}
              onClick={() => handlePostClick(post.postId)}
            />
          ))}
        </div>
      </main>

      <CreatePostModal
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={(newPost) => {
          refreshProfile()
          setShowCreatePost(false)
        }}
      />

      <SearchUsersModal open={showSearchUsers} onClose={() => setShowSearchUsers(false)} />

      <PostDetailModal 
        open={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId}
        user={{
          username: profile?.username ?? "default",
          profilePic: profile?.profilePic ?? "default",
        }}
      />
    </div>
  )
}
