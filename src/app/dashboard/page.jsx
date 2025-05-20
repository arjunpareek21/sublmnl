"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import AudioPlayer from "@/components/create/AudioPlayer"
import { CalendarIcon, CreditCardIcon, DownloadIcon, PlayIcon, PauseIcon, SettingsIcon } from "lucide-react"

export default function DashboardPage() {
  const { user, requireAuth } = useAuth()
  const [audios, setAudios] = useState([])
  const [favoriteAudios, setFavoriteAudios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [currentAudio, setCurrentAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [isLoadingPayments, setIsLoadingPayments] = useState(false)

  useEffect(() => {
    if (!requireAuth()) return

    // Fetch user's audio tracks
    const fetchAudios = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/audios")
        const data = await response?.json()

        if (data.success) {
          setAudios(data.audios)
        } else {
          console.error("Error fetching audios:", data.message)
        }
      } catch (error) {
        console.error("Error fetching audios:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch payment history
    const fetchPaymentHistory = async () => {
      try {
        setIsLoadingPayments(true)
        const response = await fetch("/api/user/payment-history")
        const data = await response?.json()

        if (data.success) {
          setPaymentHistory(data.payments || [])
        } else {
          console.error("Error fetching payment history:", data.message)
        }
      } catch (error) {
        console.error("Error fetching payment history:", error)
      } finally {
        setIsLoadingPayments(false)
      }
    }

    fetchAudios()
    fetchPaymentHistory()
  }, [requireAuth])

  const handlePlay = (audio) => {
    try {
      setAudioError(false)

      // If clicking the currently playing track
      if (currentAudio && currentAudio.id === audio.id) {
        setIsPlaying(!isPlaying)
      } else {
        // If switching to a different track
        setCurrentAudio(audio)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Audio control error:", error)
      setAudioError(true)
      setIsPlaying(false)
    }
  }

  const handleDownload = (audio) => {
    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = audio.audioUrl
    link.download = `${audio.name}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (!user) {
    return null // This will be handled by requireAuth redirect
  }

  // Get subscription details
  const subscriptionPlan = user?.subscription?.plan || "Free"
  const subscriptionStatus = user?.subscription?.status || "inactive"
  const expiryDate = user?.subscription?.expiresAt ? new Date(user.subscription.expiresAt) : null

  // Calculate remaining days if subscription is active
  const remainingDays = expiryDate ? Math.max(0, Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))) : 0

  // Filter audios based on active tab
  const displayedAudios = activeTab === "favorites" ? favoriteAudios : audios

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Your Dashboard
        </h1>
        <Link
          href="/create"
          className="bg-gradient-to-r from-primary to-purple-500 rounded-md py-2 px-5 hover:opacity-90 transition-opacity text-white font-medium"
        >
          Create New Audio
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Subscription Card */}
        <div className="glass-card p-6 col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Your Subscription</h2>
            <Link href="/dashboard/subscriptions" className="text-primary hover:underline text-sm flex items-center">
              <SettingsIcon className="h-4 w-4 mr-1" />
              Manage
            </Link>
          </div>

          <div className="flex items-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center mr-4">
              <CreditCardIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold capitalize">{subscriptionPlan}</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    subscriptionStatus === "active"
                      ? "bg-green-500/20 text-green-400"
                      : subscriptionStatus === "cancelled"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {subscriptionStatus === "active"
                    ? "Active"
                    : subscriptionStatus === "cancelled"
                      ? "Cancelled"
                      : "Inactive"}
                </span>
              </div>
              {expiryDate && (
                <p className="text-gray-300 flex items-center mt-1">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {subscriptionStatus === "active"
                    ? `Renews on ${formatDate(expiryDate)}`
                    : `Expires on ${formatDate(expiryDate)}`}
                  {subscriptionStatus === "active" && remainingDays > 0 && (
                    <span className="ml-2 text-sm text-gray-400">({remainingDays} days left)</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Plan Features</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm flex items-center">
                  <svg className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited audio creation
                </li>
                <li className="text-sm flex items-center">
                  <svg className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium voices
                </li>
                <li className="text-sm flex items-center">
                  <svg className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Background music
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Usage</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Audio Created</span>
                  <span>{audios.length} / Unlimited</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Next Payment</p>
              {subscriptionStatus === "active" ? (
                <div className="mt-2">
                  <p className="text-lg font-semibold">{formatCurrency(9.99)}</p>
                  <p className="text-sm text-gray-400">on {formatDate(expiryDate || new Date())}</p>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm">No upcoming payments</p>
                  <Link href="/pricing" className="text-primary text-sm hover:underline mt-1 inline-block">
                    View plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments Card */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Payments</h2>
            <Link href="/dashboard/payments" className="text-primary hover:underline text-sm">
              View all
            </Link>
          </div>

          {isLoadingPayments ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-6 w-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-2">No payment history yet</p>
              <Link href="/pricing" className="text-primary hover:underline text-sm">
                View pricing plans
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentHistory.slice(0, 3).map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <p className="font-medium">{payment.description || "Subscription Payment"}</p>
                    <p className="text-sm text-gray-400">{formatDate(payment.date)}</p>
                  </div>
                  <p className={`font-medium ${payment.status === "failed" ? "text-red-400" : "text-green-400"}`}>
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {audioError && (
        <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mb-4 text-red-200">
          Audio playback is not available in the preview. This would work in the actual application.
        </div>
      )}

      {currentAudio && (
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Now Playing</h3>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{currentAudio.name}</h4>
              <p className="text-sm text-gray-400">Created on {formatDate(currentAudio.createdAt)}</p>
            </div>
          </div>

          <AudioPlayer
            audioUrl={currentAudio.audioUrl}
            onError={() => setAudioError(true)}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            showAffirmations={true}
            affirmationsVolume={0.3}
          />
        </div>
      )}

      <div className="glass-card p-6">
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Tracks
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : displayedAudios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              {activeTab === "favorites"
                ? "You haven't favorited any audio tracks yet."
                : "You haven't created any subliminal audio tracks yet."}
            </p>
            {activeTab === "all" && (
              <Link
                href="/create"
                className="bg-gradient-to-r from-primary to-purple-500 rounded-md py-2 px-5 hover:opacity-90 transition-opacity text-white font-medium"
              >
                Create Your First Audio
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Voice</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedAudios.map((audio) => (
                  <tr key={audio.id} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4">{audio.name}</td>
                    <td className="py-3 px-4">{formatDate(audio.createdAt)}</td>
                    <td className="py-3 px-4">
                      {audio?.voiceType?.split("-").slice(-1)[0]} ({audio.voiceLanguage})
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => handlePlay(audio)}
                        className="p-2 bg-gradient-to-r from-primary/20 to-purple-500/20 hover:from-primary/30 hover:to-purple-500/30 rounded-full transition-colors"
                        aria-label={isPlaying && currentAudio?.id === audio.id ? "Pause" : "Play"}
                      >
                        {isPlaying && currentAudio?.id === audio.id ? (
                          <PauseIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <PlayIcon className="h-5 w-5 text-primary" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDownload(audio)}
                        className="p-2 bg-gradient-to-r from-primary/20 to-purple-500/20 hover:from-primary/30 hover:to-purple-500/30 rounded-full transition-colors"
                        aria-label="Download"
                      >
                        <DownloadIcon className="h-5 w-5 text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
