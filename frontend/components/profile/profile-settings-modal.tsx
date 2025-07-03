"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface ProfileSettingsData {
  username: string
  email: string
  bio: string
  phoneNumber: string
}

interface ProfileSettingsModalProps {
  open: boolean
  onClose: () => void
  currentData: ProfileSettingsData
  onProfileUpdated: (updatedData: ProfileSettingsData) => void
  currentUsername: string // Add this to know which profile we're updating
}

export function ProfileSettingsModal({
  open,
  onClose,
  currentData,
  onProfileUpdated,
  currentUsername,
}: ProfileSettingsModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")

  const [profileData, setProfileData] = useState({
    username: currentData.username,
    email: currentData.email,
    bio: currentData.bio,
    phoneNumber: currentData.phoneNumber,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (profileData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (profileData.bio.length > 150) {
      newErrors.bio = "Bio must be less than 150 characters"
    }

    if (profileData.phoneNumber && !/^\+?[\d\s\-()]{10,}$/.test(profileData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    } else if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:5193/profile/${currentUsername}/profile-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
          bio: profileData.bio,
          phoneNumber: profileData.phoneNumber,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      // Update localStorage with new username if it changed
      if (currentUsername !== profileData.username) {
        localStorage.setItem("username", profileData.username)
      }

      // Call the parent component's update handler
      // This will trigger the reroute logic in the page component
      onProfileUpdated({
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        phoneNumber: profileData.phoneNumber,
      })

      toast({
        title: "Profile updated!",
        description: "Your profile information has been successfully updated.",
      })

      // Close the modal - the parent will handle any rerouting
      onClose()
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:5193/profile/${currentUsername}/password-change`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }

      toast({
        title: "Password changed!",
        description: "Your password has been successfully updated.",
      })

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setActiveTab("profile")
    } catch (error) {
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Reset forms when closing
    setProfileData({
      username: currentData.username,
      email: currentData.email,
      bio: currentData.bio,
      phoneNumber: currentData.phoneNumber,
    })
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    setActiveTab("profile")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }))
                  }}
                  placeholder="Enter your username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                <p className="text-xs text-muted-foreground">Your username is how others will find and mention you</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                <p className="text-xs text-muted-foreground">
                  We'll use this email for important account notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: "" }))
                  }}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                <p className="text-xs text-muted-foreground">
                  We'll use this for account security and important notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                    if (errors.bio) setErrors((prev) => ({ ...prev, bio: "" }))
                  }}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                />
                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                <p className="text-xs text-muted-foreground">{profileData.bio.length}/150 characters</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                    if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: "" }))
                  }}
                  placeholder="Enter your current password"
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }))
                  }}
                  placeholder="Enter your new password"
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                  }}
                  placeholder="Confirm your new password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Security Tips */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 text-sm font-semibold">Password Security Tips:</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Use a combination of letters, numbers, and symbols</li>
                <li>• Make it at least 8 characters long</li>
                <li>• Don't use personal information or common words</li>
                <li>• Consider using a password manager</li>
              </ul>
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
