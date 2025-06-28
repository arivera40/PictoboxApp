"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  createdAt: string
}

interface CreatePostModalProps {
  open: boolean
  onClose: () => void
  onPostCreated: (post: Post) => void
}

export function CreatePostModal({ open, onClose, onPostCreated }: CreatePostModalProps) {
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

      // Replace with your .NET Core API endpoint
      const response = await fetch("http://localhost:5193/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      const newPost = await response.json()

      onPostCreated(newPost)

      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      })

      // Reset form
      setFormData({
        caption: "",
        imageFile: null,
        imagePreview: "",
      })

      onClose()
    } catch (error) {
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
    setFormData({
      caption: "",
      imageFile: null,
      imagePreview: "",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Choose Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
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
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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
