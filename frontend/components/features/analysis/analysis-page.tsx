"use client"

import * as React from "react"
import { PostList } from "@/components/features/analysis/post-list"
import { PostDetail } from "@/components/features/analysis/post-detail"
import type { Post } from "@/lib/types/post"
import { fetchAllPosts } from "@/lib/api/post"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AnalysisPage() {
  const [allPosts, setAllPosts] = React.useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = React.useState<Post[]>([])
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch all posts when component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const posts = await fetchAllPosts()
        setAllPosts(posts)
        setFilteredPosts(posts)

        // Select the first post if none is selected
        if (posts.length > 0 && !selectedPost) {
          setSelectedPost(posts[0])
        }
      } catch (err) {
        setError("Failed to fetch post data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter posts based on search term
  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(allPosts)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = allPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(lowercaseSearch) ||
          (post.content ? post.content.toLowerCase().includes(lowercaseSearch) : false),
      )
      setFilteredPosts(filtered)
    }
  }, [searchTerm, allPosts])

  // Function to handle post selection
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post)
  }

  // Show loading state
  if (isLoading && filteredPosts.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-1/4 border-r flex flex-col">
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/4 border-r">
        <PostList
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={handleSelectPost}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isLoading={isLoading}
        />
      </div>
      <div className="w-3/4">{selectedPost && <PostDetail post={selectedPost} />}</div>
    </div>
  )
}

