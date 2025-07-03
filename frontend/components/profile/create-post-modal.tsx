"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Post {
  postId: string
  imagePath: string
  caption: string
  likes: number
  comments: number
  postDate: string
}

interface CreatePostModalProps {
  open: boolean
  onClose: () => void
  onPostCreated: (post: Post) => void
  currentUsername: string
}

export function CreatePostModal({ open, onClose, onPostCreated, currentUsername }: CreatePostModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    caption: "",
    imageFile: null as File | null,
    imagePreview: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      caption: "",
      imageFile: null,
      imagePreview: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageFile || !formData.caption.trim()) {
      toast({
        title: "Missing information",
        description: "Please add both an image and caption for your post.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append("image", formData.imageFile)
      uploadData.append("caption", formData.caption)

      console.log("Creating post for user:", currentUsername)

      const response = await fetch(`http://localhost:5193/profile/${currentUsername}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      console.log("Post creation response:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Post creation failed:", errorText)
        throw new Error(`Failed to create post: ${response.status}`)
      }

      const newPostResponse = await response.json()
      console.log("New post response:", newPostResponse)

      // Create a properly formatted post object
      const newPost: Post = {
        postId: newPostResponse.postId || newPostResponse.id || Date.now().toString(),
        imagePath: newPostResponse.imagePath || newPostResponse.imageUrl || formData.imagePreview,
        caption: newPostResponse.caption || formData.caption,
        likes: newPostResponse.likes || 0,
        comments: newPostResponse.comments || 0,
        postDate: newPostResponse.postDate || newPostResponse.createdAt || new Date().toISOString(),
      }

      console.log("Formatted new post:", newPost)

      // Reset form first
      resetForm()

      // Show success toast
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      })

      // Call the callback with the new post
      onPostCreated(newPost)

      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Choose Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required disabled={isLoading} />
            {formData.imagePreview && (
              <div className="mt-2">
                <img
                  src={formData.imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-48 w-full rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your post..."
              value={formData.caption}
              onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
