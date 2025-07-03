"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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
  userId: number
  username: string
  email: string
  phoneNumber: string
  profilePic: string
  bio: string
  postsCount: number
  followersCount: number
  followingCount: number
  posts: Post[]
  isFollowing?: boolean
}

interface CurrentUser {
  username: string
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showSearchUsers, setShowSearchUsers] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userId, setUserId] = useState<number | null>(null)

  const username = params.username as string

  useEffect(() => {
    setUserId(Number(localStorage.getItem("userId")))

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`http://localhost:5193/profile/${username}`)
        console.log(response)

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "User not found",
              description: "The user you're looking for doesn't exist.",
              variant: "destructive",
            })
            router.push("/")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [router, username, refreshTrigger])

  const refreshProfile = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId)
  }

  const handleProfilePicUpdate = (newUrl: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            profilePic: newUrl,
          }
        : prev,
    )
    // Optionally refresh the entire profile to sync with server
    refreshProfile()
  }

  const handleProfileUpdate = (updatedData: { username: string; email: string; bio: string; phoneNumber: string }) => {
    const oldUsername = profile?.username
    const newUsername = updatedData.username

    // Update the profile state first
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            username: updatedData.username,
            email: updatedData.email,
            bio: updatedData.bio,
            phoneNumber: updatedData.phoneNumber,
          }
        : prev,
    )

    // Check if this is the user's own profile and if username changed
    const isOwnProfile = userId === profile?.userId
    const usernameChanged = oldUsername !== newUsername

    if (isOwnProfile && usernameChanged) {
      // Show a toast about the username change
      toast({
        title: "Username updated!",
        description: `Redirecting to your new profile: @${newUsername}`,
      })

      // Use router.replace to change the URL without adding to history
      // This prevents the user from going back to the old username URL
      router.replace(`/profile/${newUsername}`)
    }

    // Refresh the profile to sync with server
    refreshProfile()
  }

  const handleFollowToggle = async () => {
    if (!profile || !userId) return

    try {
      const token = localStorage.getItem("token")
      const action = profile.isFollowing ? "unfollow" : "follow"

      const response = await fetch(`http://localhost:5193/user/${username}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`)
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: !prev.isFollowing,
              followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
            }
          : prev,
      )

      toast({
        title: profile.isFollowing ? "Unfollowed" : "Following",
        description: `You are ${profile.isFollowing ? "no longer following" : "now following"} ${username}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  // Fallback data for preview
  const fallbackProfile: UserProfile = {
    userId: 1,
    username: username || "user",
    email: "user@example.com",
    phoneNumber: "973-555-6543",
    profilePic: "/placeholder.svg?height=100&width=100",
    bio: "Photography enthusiast | Nature lover | Travel addict",
    postsCount: 24,
    followersCount: 512,
    followingCount: 128,
    isFollowing: false,
    posts: [
      {
        postId: "1",
        imagePath: "/placeholder.svg?height=300&width=300",
        caption: "Amazing landscape photography",
        likes: 89,
        comments: 12,
        postDate: "2023-06-10T14:30:00Z",
      },
      {
        postId: "2",
        imagePath: "/placeholder.svg?height=300&width=300",
        caption: "Street art discovery",
        likes: 156,
        comments: 8,
        postDate: "2023-06-08T11:15:00Z",
      },
    ],
  }

  const userProfile = profile || fallbackProfile
  const isOwnProfile = userId === profile?.userId

  console.log("userProfile", isOwnProfile)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="container py-8">
        <ProfileHeader
          username={userProfile.username}
          email={userProfile.email}
          phoneNumber={userProfile.phoneNumber}
          profilePic={userProfile.profilePic}
          bio={userProfile.bio}
          postsCount={userProfile.postsCount}
          followersCount={userProfile.followersCount}
          followingCount={userProfile.followingCount}
          isOwnProfile={isOwnProfile}
          onProfilePicUpdate={handleProfilePicUpdate}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Action buttons - Show different buttons based on profile ownership */}
        <div className="mt-4 flex gap-2">
          {isOwnProfile ? (
            <>
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
            </>
          ) : (
            <>
              <Button onClick={handleFollowToggle}>{userProfile.isFollowing ? "Unfollow" : "Follow"}</Button>
              <Button variant="outline">Message</Button>
            </>
          )}
        </div>

        <Separator className="my-8" />

        <h2 className="mb-6 text-xl font-semibold">
          {isOwnProfile ? "Your Posts" : `${userProfile.username}'s Posts`}
        </h2>
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

      {/* Modals - Only show for own profile */}
      {isOwnProfile && (
        <>
          <CreatePostModal
            open={showCreatePost}
            onClose={() => {
              console.log("Closing create post modal")
              setShowCreatePost(false)
            }}
            currentUsername={username}
            onPostCreated={() => {
              console.log("Post created callback triggered:")

              // Close the modal explicitly
              setShowCreatePost(false)

              // Refresh the profile from server to ensure sync (after a short delay)
              setTimeout(() => {
                console.log("Refreshing profile from server")
                refreshProfile()
              }, 500)

              // Show success feedback
              toast({
                title: "Post added to profile!",
                description: "Your new post is now visible on your profile.",
              })
            }}
          />

          <SearchUsersModal open={showSearchUsers} onClose={() => setShowSearchUsers(false)} />
        </>
      )}

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
