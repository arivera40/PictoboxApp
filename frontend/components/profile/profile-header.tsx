"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ProfilePictureModal } from "./profile-pic-modal"

interface ProfileHeaderProps {
  username: string
  profilePic: string
  bio: string
  postsCount: number
  followersCount: number
  followingCount: number
  onProfilePicUpdate?: (newUrl: string) => void
}

export function ProfileHeader({
  username,
  profilePic,
  bio,
  postsCount,
  followersCount,
  followingCount,
  onProfilePicUpdate,
}: ProfileHeaderProps) {
  const [showProfilePicModal, setShowProfilePicModal] = useState(false)
  const [currentProfilePic, setCurrentProfilePic] = useState(profilePic)

  const handleProfilePicUpdate = (newUrl: string) => {
    setCurrentProfilePic(newUrl)
    onProfilePicUpdate?.(newUrl)
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Profile Picture - Clickable */}
        <div className="relative group">
          <Avatar
            className="h-24 w-24 md:h-32 md:w-32 cursor-pointer transition-all duration-200 group-hover:ring-4 group-hover:ring-blue-500/20"
            onClick={() => setShowProfilePicModal(true)}
          >
            <AvatarImage src={profilePic || "/placeholder.svg"} alt={username} className="object-cover" />
            <AvatarFallback className="text-lg md:text-xl">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-black/50 rounded-full h-24 w-24 md:h-32 md:w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
            onClick={() => setShowProfilePicModal(true)}
          >
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
              className="h-6 w-6 text-white"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>

          {/* Click hint */}
          <p className="text-xs text-muted-foreground text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to change
          </p>
        </div>

        <div className="flex flex-1 flex-col text-center md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <h1 className="text-2xl font-bold">{username}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowProfilePicModal(true)} className="md:hidden">
              Change Photo
            </Button>
          </div>

          <p className="mt-1 text-muted-foreground">{bio}</p>

          <div className="mt-4 flex justify-center gap-6 md:justify-start">
            <div className="text-center">
              <p className="font-bold">{postsCount}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{followersCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{followingCount}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
        </div>
      </div>

      <ProfilePictureModal
        open={showProfilePicModal}
        onClose={() => setShowProfilePicModal(false)}
        currentProfilePic={currentProfilePic}
        username={username}
        onProfilePicUpdated={handleProfilePicUpdate}
      />
    </>
  )
}
