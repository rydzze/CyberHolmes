"use client"
import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Post } from "@/lib/types/post"
import { formatDate, getConfidenceBadge } from "@/lib/utils/post"

interface PostListProps {
  posts: Post[]
  selectedPost: Post | null
  onSelectPost: (post: Post) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  isLoading: boolean
}

export function PostList({
  posts,
  selectedPost,
  onSelectPost,
  searchTerm,
  onSearchChange,
  isLoading,
}: PostListProps) {
  const [confidenceFilter, setConfidenceFilter] = useState<string | null>(null)

  const filteredPosts = posts.filter((post) => {
    // Apply confidence filter
    if (confidenceFilter) {
      const rating = post.analysis?.cvss_rating?.toLowerCase() || "neutral"

      return rating === confidenceFilter.toLowerCase()
    }
    return true
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search results..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="mr-1 h-3 w-3" />
                {confidenceFilter
                  ? `Filter: ${confidenceFilter.charAt(0).toUpperCase() + confidenceFilter.slice(1)}`
                  : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setConfidenceFilter(null)}>All Results</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("critical")}>Critical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("high")}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("low")}>Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("neutral")}>Neutral</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-xs text-muted-foreground pt-2">{filteredPosts.length} results found</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
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
        ) : filteredPosts.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <p className="text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedPost?.id === post.id ? "bg-muted" : ""}`}
              onClick={() => onSelectPost(post)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm line-clamp-1">{post.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {/* Enhanced capsule badge with better visibility */}
                <div className="flex-shrink-0">{getConfidenceBadge(post.analysis?.cvss_rating)}</div>
                <span className="text-xs text-muted-foreground ml-1">{formatDate(post.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {post.content?.slice(0, 250) || "No content available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

