"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Comment {
  commentId: number
  username: string
  profilePic: string
  content: string
  commentDate: string
  likes: number
  isLiked: boolean
}

interface PostDetail {
  postId: string
  imagePath: string
  caption: string
  likes: number
  postDate: string
  comments: Comment[]
}

interface UserDetail {
  username: string
  profilePic: string
}

interface PostDetailModalProps {
  open: boolean
  onClose: () => void
  postId: string | null
  user: UserDetail
}

export function PostDetailModal({ open, onClose, postId, user }: PostDetailModalProps) {
  const params = useParams()
  const { toast } = useToast()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [isUpdatingComment, setIsUpdatingComment] = useState(false)

  // Delete comment states
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null)
  const [isDeletingComment, setIsDeletingComment] = useState(false)

  const username = params.username as string

  useEffect(() => {
    if (open && postId) {
      fetchPostDetail(postId)
    }
  }, [open, postId, refreshTrigger])

  const refreshPost = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const fetchPostDetail = async (id: string) => {
    setCurrentUser(localStorage.getItem("username"));

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      // Replace with your .NET Core API endpoint
      const response = await fetch(`http://localhost:5193/profile/${username}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch post details")
      }

      const data = await response.json()
      setPost(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // const handleLikePost = async () => {
  //   if (!post) return

  //   try {
  //     const token = localStorage.getItem("token")
  //     const action = post.isLiked ? "unlike" : "like"

  //     const response = await fetch(`https://your-dotnet-api.com/api/posts/${post.postId}/${action}`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Failed to ${action} post`)
  //     }

  //     setPost((prev) =>
  //       prev
  //         ? {
  //             ...prev,
  //             isLiked: !prev.isLiked,
  //             likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
  //           }
  //         : prev,
  //     )
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update like. Please try again.",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleLikeComment = async (commentId: number) => {
    if (!post) return

    try {
      const token = localStorage.getItem("token")
      const comment = post.comments.find((c) => c.commentId === commentId)
      if (!comment) return

      const action = comment.isLiked ? "unlike" : "like"

      const response = await fetch(`https://your-dotnet-api.com/api/comment/${commentId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} comment`)
      }

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.commentId === commentId
                  ? {
                      ...c,
                      isLiked: !c.isLiked,
                      likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                    }
                  : c,
              ),
            }
          : prev,
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment like. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !post) return

    setIsSubmittingComment(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:5193/profile/${username}/posts/${post.postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments],
            }
          : prev,
      )

      setNewComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })

      refreshPost()
    } catch (error) {
      toast({
        title: "Failed to add comment",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(currentText)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingComment(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:5193/profile/${username}/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editCommentText.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.commentId === commentId
                  ? {
                      ...c,
                      content: editCommentText.trim(),
                    }
                  : c,
              ),
            }
          : prev,
      )

      setEditingCommentId(null)
      setEditCommentText("")

      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update comment",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setIsDeletingComment(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:5193/profile/${username}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.commentId !== commentId),
            }
          : prev,
      )

      setDeleteCommentId(null)

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to delete comment",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsDeletingComment(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="hidden">Post Details</DialogTitle>
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : post ? (
            <div className="flex h-[80vh] max-h-[600px]">
              {/* Image Section */}
              <div className="flex flex-1 items-center justify-center bg-black">
                <img
                  src={post.imagePath || "/placeholder.svg"}
                  alt={post.caption}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Content Section */}
              <div className="flex w-80 flex-col border-l">
                {/* Post Header */}
                <div className="flex items-center gap-3 border-b p-4">
                  <Avatar>
                    <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback>{post.caption.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{formatTimeAgo(post.postDate)}</p>
                  </div>
                </div>

                {/* Caption */}
                <div className="border-b p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{user.username}</span> {post.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.commentId} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.profilePic || "/placeholder.svg"} alt={comment.username} />
                          <AvatarFallback>{comment.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {editingCommentId === comment.commentId ? (
                            // Edit mode
                            <div className="space-y-2">
                              <Input
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="text-sm"
                                placeholder="Edit your comment..."
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateComment(comment.commentId)}
                                  disabled={isUpdatingComment || !editCommentText.trim()}
                                >
                                  {isUpdatingComment ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  disabled={isUpdatingComment}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <>
                              <div className="flex items-start justify-between">
                                <p className="text-sm flex-1">
                                  <span className="font-semibold">{comment.username}</span> {comment.content}
                                </p>
                                {/* Show edit/delete options only for user's own comments */}
                                {comment.username === currentUser && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <circle cx="12" cy="12" r="1" />
                                          <circle cx="12" cy="5" r="1" />
                                          <circle cx="12" cy="19" r="1" />
                                        </svg>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditComment(comment.commentId, comment.content)}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="mr-2"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setDeleteCommentId(comment.commentId)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="mr-2"
                                        >
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatTimeAgo(comment.commentDate)}</span>
                                {comment.likes > 0 && <span>{comment.likes} likes</span>}
                                <button
                                  onClick={() => handleLikeComment(comment.commentId)}
                                  className="font-semibold hover:text-foreground"
                                >
                                  {comment.isLiked ? "Unlike" : "Like"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Actions */}
                <div className="border-t p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* <Button variant="ghost" size="sm" onClick={handleLikePost}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={post.isLiked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-5 w-5 ${post.isLiked ? "text-red-500" : ""}`}
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </Button> */}
                      <Button variant="ghost" size="sm">
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
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-semibold">{post.likes} likes</p>
                  </div>

                  {/* Add Comment */}
                  <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 border-none p-0 focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      disabled={!newComment.trim() || isSubmittingComment}
                    >
                      {isSubmittingComment ? "Posting..." : "Post"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center">
              <p>Post not found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingComment}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentId && handleDeleteComment(deleteCommentId)}
              disabled={isDeletingComment}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingComment ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
