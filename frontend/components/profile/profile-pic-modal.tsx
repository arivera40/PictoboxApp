"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface ProfilePictureModalProps {
  open: boolean
  onClose: () => void
  currentProfilePic: string
  username: string
  onProfilePicUpdated: (newProfilePicUrl: string) => void
}

export function ProfilePictureModal({
  open,
  onClose,
  currentProfilePic,
  username,
  onProfilePicUpdated,
}: ProfilePictureModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("profilePic", selectedFile)

      // Replace with your .NET Core API endpoint
      const response = await fetch("http://localhost:5193/profile/profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload profile picture")
      }

      const data = await response.json()

      // For demo purposes, use the preview URL
      const newProfilePicUrl = previewUrl || data.profilePicUrl

      onProfilePicUpdated(newProfilePicUrl)

      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been successfully updated.",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to update profile picture",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveProfilePic = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Replace with your .NET Core API endpoint
      const response = await fetch("http://localhost:5193/profile/profile-picture", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove profile picture")
      }

      onProfilePicUpdated("")

      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed.",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Failed to remove",
        description: error instanceof Error ? error.message : "Failed to remove profile picture",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Profile Picture */}
          <div className="text-center">
            <div className="mb-3">
              <Avatar className="mx-auto h-24 w-24">
                <AvatarImage
                  src={previewUrl || currentProfilePic || "/placeholder.svg"}
                  alt={username}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-muted-foreground">
              {previewUrl ? "Preview of new profile picture" : "Current profile picture"}
            </p>
          </div>

          {/* File Upload */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profilePic">Choose New Profile Picture</Label>
              <Input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Maximum size: 5MB</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {currentProfilePic && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveProfilePic}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  Remove Current Picture
                </Button>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedFile || isLoading}>
                  {isLoading ? "Uploading..." : "Update Picture"}
                </Button>
              </div>
            </div>
          </form>

          {/* Upload Tips */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 text-sm font-semibold">Tips for a great profile picture:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Use a clear, high-quality image</li>
              <li>• Make sure your face is well-lit and centered</li>
              <li>• Square images work best (1:1 aspect ratio)</li>
              <li>• Avoid busy backgrounds</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
