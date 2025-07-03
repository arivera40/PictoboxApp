"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ProfilePictureModal } from "./profile-pic-modal"
import { ProfileSettingsModal } from "./profile-settings-modal"

interface ProfileHeaderProps {
  username: string
  email?: string
  phoneNumber?: string
  profilePic: string
  bio: string
  postsCount: number
  followersCount: number
  followingCount: number
  isOwnProfile?: boolean
  onProfilePicUpdate?: (newUrl: string) => void
  onProfileUpdate?: (data: { username: string; email: string; bio: string; phoneNumber: string }) => void
}

export function ProfileHeader({
  username,
  email = "",
  phoneNumber = "",
  profilePic,
  bio,
  postsCount,
  followersCount,
  followingCount,
  isOwnProfile = true,
  onProfilePicUpdate,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [showProfilePicModal, setShowProfilePicModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [currentProfilePic, setCurrentProfilePic] = useState(profilePic)
  const [currentProfileData, setCurrentProfileData] = useState({
    username,
    email,
    bio,
    phoneNumber,
  })

  const handleProfilePicUpdate = (newUrl: string) => {
    setCurrentProfilePic(newUrl)
    onProfilePicUpdate?.(newUrl)
  }

  const handleProfileUpdate = (updatedData: { username: string; email: string; bio: string; phoneNumber: string }) => {
    setCurrentProfileData(updatedData)
    onProfileUpdate?.(updatedData)
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Profile Picture - Only clickable if it's own profile */}
        <div className="relative group">
          <Avatar
            className={`h-24 w-24 md:h-32 md:w-32 ${
              isOwnProfile
                ? "cursor-pointer transition-all duration-200 group-hover:ring-4 group-hover:ring-blue-500/20"
                : ""
            }`}
            onClick={isOwnProfile ? () => setShowProfilePicModal(true) : undefined}
          >
            <AvatarImage src={currentProfilePic || "/placeholder.svg"} alt={username} className="object-cover" />
            <AvatarFallback className="text-lg md:text-xl">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Hover overlay - Only for own profile */}
          {isOwnProfile && (
            <>
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
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col text-center md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <h1 className="text-2xl font-bold">{currentProfileData.username}</h1>

              {/* Settings button - Only visible for own profile */}
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 hover:bg-gray-100"
                  title="Profile Settings"
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
                    className="h-5 w-5"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Button>
              )}
            </div>

            {/* Action buttons for mobile - Only for own profile */}
            {isOwnProfile && (
              <div className="flex gap-2 md:hidden">
                <Button variant="outline" size="sm" onClick={() => setShowProfilePicModal(true)}>
                  Change Photo
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
                  Settings
                </Button>
              </div>
            )}

            {/* Follow button for other users' profiles */}
            {!isOwnProfile && (
              <div className="flex gap-2">
                <Button>Follow</Button>
                <Button variant="outline">Message</Button>
              </div>
            )}
          </div>

          <p className="mt-1 text-muted-foreground">{currentProfileData.bio}</p>

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

      {/* Modals - Only render if it's own profile */}
      {isOwnProfile && (
        <>
          <ProfilePictureModal
            open={showProfilePicModal}
            onClose={() => setShowProfilePicModal(false)}
            currentProfilePic={currentProfilePic}
            username={username}
            onProfilePicUpdated={handleProfilePicUpdate}
          />

          <ProfileSettingsModal
            open={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            currentData={currentProfileData}
            onProfileUpdated={handleProfileUpdate}
            currentUsername={username}
          />
        </>
      )}
    </>
  )
}
