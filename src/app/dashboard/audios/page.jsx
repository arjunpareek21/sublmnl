"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Plus, Music2, AlertCircle } from "lucide-react"
import AudioCard from "@/components/audio/AudioCard"
import BottomPlayer from "@/components/audio/BottomPlayer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserAudiosPage() {
  const { user } = useAuth()
  const [audios, setAudios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [favorites, setFavorites] = useState({})
  const [activeTab, setActiveTab] = useState("all")
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [musicVolume, setMusicVolume] = useState(1.0)
  const [affirmationVolume, setAffirmationVolume] = useState(0.1)
  const [affirmationInterval, setAffirmationInterval] = useState(20)

  const audioPlayerRef = useRef(null)

  useEffect(() => {
    fetchAudios()
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("audioFavorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error loading favorites:", e)
      }
    }

    // Load volume settings from localStorage
    const savedMusicVolume = localStorage.getItem("musicVolume")

    if (savedMusicVolume) {
      setMusicVolume(Number.parseFloat(savedMusicVolume))
    }
  }, [])

  const fetchAudios = async () => {
    try {
      setIsLoading(true)
      setFetchError("")
      const response = await fetch("/api/user/audios")
     
      if (!response.ok) {
        throw new Error(`Failed to fetch audios: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setAudios(data.audios || [])
      } else {
        setFetchError(data.message || "Failed to fetch audio tracks")
      }
    } catch (error) {
      console.error("Error fetching audios:", error)
      setFetchError(error.message || "Failed to fetch audio tracks")
    } finally {
      setIsLoading(false)
    }
  }

 
  const handlePlay = (audio, index) => {
    try {
      setAudioError(false)

      // If clicking the currently playing track
      if (currentAudio && currentAudio.id === audio.id) {
        setIsPlaying(!isPlaying)
      } else {
        // If switching to a different track
        setCurrentAudio(audio)
        setCurrentIndex(index)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Audio control error:", error)
      setAudioError(true)
      setIsPlaying(false)
    }
  }

  const handlePlayPause = (playing) => {
    setIsPlaying(playing)
  }

  const handleDownload = (audio) => {
    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = audio.audioUrl || audio.filePath
    link.download = `${audio.name}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNext = () => {
    if (!audios.length) return

    const filteredAudios = activeTab === "favorites" ? audios.filter((audio) => favorites[audio.id]) : audios

    if (filteredAudios.length === 0) return

    const nextIndex = (currentIndex + 1) % filteredAudios.length
    const nextAudio = filteredAudios[nextIndex]
    const globalIndex = audios.findIndex((a) => a.id === nextAudio.id)

    setCurrentAudio(nextAudio)
    setCurrentIndex(globalIndex)
    setIsPlaying(true)
  }

  const handlePrevious = () => {
    if (!audios.length) return

    const filteredAudios = activeTab === "favorites" ? audios.filter((audio) => favorites[audio.id]) : audios

    if (filteredAudios.length === 0) return

    const prevIndex = (currentIndex - 1 + filteredAudios.length) % filteredAudios.length
    const prevAudio = filteredAudios[prevIndex]
    const globalIndex = audios.findIndex((a) => a.id === prevAudio.id)

    setCurrentAudio(prevAudio)
    setCurrentIndex(globalIndex)
    setIsPlaying(true)
  }

  const toggleFavorite = (audio) => {
    const newFavorites = { ...favorites }

    if (newFavorites[audio.id]) {
      delete newFavorites[audio.id]
    } else {
      newFavorites[audio.id] = true
    }

    setFavorites(newFavorites)
    localStorage.setItem("audioFavorites", JSON.stringify(newFavorites))
  }

  const handleTimeUpdate = (currentTime, totalDuration) => {
    setProgress(currentTime / totalDuration)
    setDuration(totalDuration)
  }

  const handleMusicVolumeChange = (volume) => {
    setMusicVolume(volume)
    localStorage.setItem("musicVolume", volume.toString())
  }

  const filteredAudios = activeTab === "favorites" ? audios.filter((audio) => favorites[audio.id]) : audios

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Audio Library</h1>
        <Button
          onClick={() => (window.location.href = "/create")}
          className="flex items-center gap-2 bg-gray-200 text-gray-900 hover:bg-gray-300"
        >
          <Plus className="h-4 w-4" />
          Create New Audio
        </Button>
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {audioError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Playback Error</AlertTitle>
          <AlertDescription>
            Audio playback is not available. Please check your audio file or try again later.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-24 w-full">
        {" "}
        {/* Add bottom padding for the player */}
        <Tabs
          defaultValue="all"
          onValueChange={setActiveTab}
          className="w-full inline-block rounded-full p-1 mb-6"
        >
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="all"
              className="rounded-full data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              All Tracks
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="rounded-full data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : audios.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 rounded-lg">
                <Music2 className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No audio tracks yet</h3>
                <p className="text-gray-400 mb-6">Create your first subliminal audio track to get started</p>
                <Button onClick={() => (window.location.href = "/create")}>Create Your First Audio</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {audios.map((audio, index) => (
                  <AudioCard
                    key={audio.id || audio._id}
                    audio={audio}
                    isPlaying={isPlaying && currentAudio && currentAudio.id === audio.id}
                    isActive={currentAudio && currentAudio.id === audio.id}
                    onPlay={() => handlePlay(audio, index)}
                    onDownload={() => handleDownload(audio)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAudios.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 rounded-lg">
                <Music2 className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No favorite tracks</h3>
                <p className="text-gray-400 mb-6">Add some tracks to your favorites to see them here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAudios.map((audio, index) => (
                  <AudioCard
                    key={audio.id || audio._id}
                    audio={audio}
                    isPlaying={isPlaying && currentAudio && currentAudio.id === audio.id}
                    isActive={currentAudio && currentAudio.id === audio.id}
                    onPlay={() => handlePlay(audio, index)}
                    onDownload={() => handleDownload(audio)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {currentAudio && (
        <BottomPlayer
          ref={audioPlayerRef}
          audioUrl={currentAudio.audioUrl || currentAudio.filePath}
          title={currentAudio.name}
          category={currentAudio.category || "General"}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleFavorite={() => toggleFavorite(currentAudio)}
          isFavorite={!!favorites[currentAudio.id]}
          onDownload={() => handleDownload(currentAudio)}
          affirmations={currentAudio.affirmations || []}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          musicVolume={musicVolume}
          onMusicVolumeChange={handleMusicVolumeChange}
          affirmationsVolume={currentAudio.volume || 0.2}
          repetitionInterval={currentAudio.repetitionInterval || 20}
          voiceSettings ={{
            voice: null,
            pitch: 1.0,
            rate: 1.0,
            voiceLanguage: currentAudio.voiceLanguage || "en-US",
            voicePitch: 1,
            voiceSpeed: 1,
            voiceType: currentAudio.voiceType || "default",
          }}
        />
      )}
    </div>
  )
}

