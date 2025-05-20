"use client"

import { Play, Pause, MoreVertical, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function AudioCard({ audio, isPlaying, isActive, onPlay, onDownload, onDelete }) {
  // Format date
  const formatDate = (date) => {
    if (!date) return "Unknown date"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to safely get voice type
  const getVoiceType = (audio) => {
    if (!audio || !audio.voiceType) return "Default"
    const parts = audio.voiceType.split("-")
    return parts.length > 0 ? parts[parts.length - 1] : "Default"
  }

  return (
    <div
      className={cn(
        "flex items-center p-3 rounded-lg transition-colors",
        isActive ? "bg-gray-800/50" : "hover:bg-gray-800/30",
      )}
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 bg-gray-800/70 rounded-md flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 18V6L21 12L9 18Z"
              stroke="#888888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{audio.name}</h3>
        <div className="flex items-center text-xs text-gray-400 mt-1">
          <span>{formatDate(audio.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>{audio.category || "General"}</span>
          <span className="mx-2">•</span>
          <span>F ({audio.voiceLanguage || "en-US"})</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 hover:bg-gray-700/50"
          onClick={onPlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 hover:bg-gray-700/50"
          onClick={onDownload}
          aria-label="Download"
        >
          <Download className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-gray-700/50"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
            <DropdownMenuItem onClick={onDownload} className="text-gray-300 hover:text-white">
              Download
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem className="text-red-400 hover:text-red-300" onClick={onDelete}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

