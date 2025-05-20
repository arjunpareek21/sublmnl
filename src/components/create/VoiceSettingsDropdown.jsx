"use client"

import { useState, useEffect } from "react"
import { Play, ChevronDown, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define voice personas with the specific voices requested
const VOICE_PERSONAS = [
  // Female voices
  {
    id: "amelie",
    name: "AMELIE",
    category: "NATURAL",
    color: "#FF5C8F",
    voicePattern: /amelie/i,
  },
  {
    id: "lily",
    name: "LILY",
    category: "STORYTELLING",
    color: "#9C5CFF",
    voicePattern: /lily|lili|female.*uk|english.*female/i,
  },
  {
    id: "google-hindi",
    name: "PRIYA",
    category: "PROFESSIONAL",
    color: "#5CFFB1",
    voicePattern: /google.*hindi|hindi/i,
  },
  {
    id: "google-us-english",
    name: "SAMANTHA",
    category: "CONVERSATIONAL",
    color: "#5CAAFF",
    voicePattern: /google.*us.*english|english.*us/i,
  },
  {
    id: "nicky",
    name: "NICKY",
    category: "SOOTHING",
    color: "#FF8C5C",
    voicePattern: /nicky/i,
  },

  // Male voices
  {
    id: "rishi",
    name: "RISHI",
    category: "NATURAL",
    color: "#5C7CFF",
    voicePattern: /rishi/i,
  },
  {
    id: "aaron",
    name: "AARON",
    category: "PROFESSIONAL",
    color: "#5CFFE1",
    voicePattern: /aaron/i,
  },
  {
    id: "arthur",
    name: "ARTHUR",
    category: "CONVERSATIONAL",
    color: "#C45CFF",
    voicePattern: /arthur/i,
  },
  {
    id: "thomas",
    name: "THOMAS",
    category: "STORYTELLING",
    color: "#FFD45C",
    voicePattern: /daniel|john|michael|male.*us|english.*us/i,
  },
  {
    id: "google-uk-english-male",
    name: "JAMES",
    category: "SOOTHING",
    color: "#5CFF7C",
    voicePattern: /google.*uk.*english.*male|uk.*english.*male/i,
  },
]

// Fallback patterns for common voices
const FALLBACK_PATTERNS = [
  { name: "AMELIE", pattern: /female|woman|girl|samantha/i },
  { name: "RISHI", pattern: /male|man|boy|daniel/i },
  { name: "SAMANTHA", pattern: /google.*female|chrome.*female/i },
  { name: "JAMES", pattern: /google.*male|chrome.*male/i },
]

export default function VoiceSettingsDropdown({ formData, updateFormData, affirmations = [] }) {
  const [availableVoices, setAvailableVoices] = useState([])
  const [mappedVoices, setMappedVoices] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingVoiceId, setPlayingVoiceId] = useState(null)
  const [testMessage, setTestMessage] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Initialize voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const updateBrowserVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)

        console.log(
          "Available voices:",
          voices.map((v) => `${v.name} (${v.lang})`),
        )

        // Map our personas to available browser voices
        let voiceMapping = VOICE_PERSONAS.map((persona) => {
          // Find the first matching voice for this persona
          const matchedVoice = voices.find((voice) => persona.voicePattern.test(voice.name.toLowerCase()))

          return {
            ...persona,
            systemVoice: matchedVoice || null,
            value: matchedVoice ? matchedVoice.name : null,
          }
        }).filter((voice) => voice.systemVoice !== null) // Only include voices that have a match

        // If we don't have enough matches, try fallback patterns
        if (voiceMapping.length < 2) {
          FALLBACK_PATTERNS.forEach((fallback) => {
            // Skip if we already have this persona
            if (voiceMapping.some((v) => v.name === fallback.name)) return

            // Find any voice that matches the fallback pattern
            const fallbackVoice = voices.find(
              (v) =>
                fallback.pattern.test(v.name.toLowerCase()) &&
                !voiceMapping.some((mapped) => mapped.systemVoice?.name === v.name),
            )

            if (fallbackVoice) {
              // Find the corresponding persona
              const persona = VOICE_PERSONAS.find((p) => p.name === fallback.name)
              if (persona) {
                voiceMapping.push({
                  ...persona,
                  systemVoice: fallbackVoice,
                  value: fallbackVoice.name,
                })
              }
            }
          })
        }

        // If still not enough, add any English voices
        if (voiceMapping.length < 2) {
          const englishVoices = voices.filter((v) => v.lang.startsWith("en-"))

          // Add any English voices we haven't already mapped
          englishVoices.forEach((voice, index) => {
            if (!voiceMapping.some((v) => v.systemVoice?.name === voice.name)) {
              // Find an unused persona
              const unusedPersonas = VOICE_PERSONAS.filter((p) => !voiceMapping.some((v) => v.name === p.name))

              if (unusedPersonas.length > 0) {
                const persona = unusedPersonas[index % unusedPersonas.length]
                voiceMapping.push({
                  ...persona,
                  systemVoice: voice,
                  value: voice.name,
                })
              }
            }
          })
        }

        // Ensure we have at least one voice
        if (voiceMapping.length === 0 && voices.length > 0) {
          // Just use the first available voice
          voiceMapping = [
            {
              ...VOICE_PERSONAS[0],
              systemVoice: voices[0],
              value: voices[0].name,
            },
          ]
        }

        console.log("Mapped voices:", voiceMapping)
        setMappedVoices(voiceMapping)

        // Set default voice if none selected
        if (!formData.voiceType && voiceMapping.length > 0) {
          updateFormData({ voiceType: voiceMapping[0].value })
        }
      }

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateBrowserVoices
      }

      updateBrowserVoices()
    }
  }, [formData.voiceType, updateFormData])

  // Test the voice with the first affirmation
  const testVoice = (voiceValue) => {
    const voiceToTest = voiceValue || formData.voiceType
    if (!voiceToTest) return

    // Find the voice in our mapped voices
    const voice = mappedVoices.find((v) => v.value === voiceToTest)
    if (!voice) return

    // Always use the first affirmation for consistency
    let testText = "This is a test of how your affirmations will sound with this voice."
    if (affirmations && affirmations.length > 0) {
      testText = affirmations[0]
    }

    setTestMessage(testText)
    setIsPlaying(true)
    setPlayingVoiceId(voice.id)

    // Use browser's speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a test utterance
      const utterance = new SpeechSynthesisUtterance(testText)

      // Apply voice settings
      const voices = window.speechSynthesis.getVoices()
      const selectedVoice = voices.find((v) => v.name === voice.value)

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Use default settings for rate, pitch and volume
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 0.8

      // Add event handlers
      utterance.onend = () => {
        setIsPlaying(false)
        setPlayingVoiceId(null)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setPlayingVoiceId(null)
      }

      // Speak the utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  // Get the currently selected voice
  const getSelectedVoice = () => {
    return mappedVoices.find((v) => v.value === formData.voiceType) || null
  }

  // Handle voice selection
  const handleSelectVoice = (voice) => {
    updateFormData({ voiceType: voice.value })
    setIsDropdownOpen(false)
  }

  const selectedVoice = getSelectedVoice()

  return (
    <div className="rounded-xl p-5 shadow-md">
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">VOICE</p>

        <div className="relative">
          {/* Selected voice display */}
          <div
            className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center">
              {selectedVoice && (
                <div
                  className="w-6 h-6 rounded-full mr-2.5 flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: selectedVoice.color }}
                >
                  {selectedVoice.name.charAt(0)}
                </div>
              )}
              <span className="font-medium">{selectedVoice ? selectedVoice.name : "Select a voice"}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
              {mappedVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={`flex items-center justify-between p-2.5 cursor-pointer hover:bg-gray-700 ${
                    formData.voiceType === voice.value ? "bg-gray-700" : ""
                  }`}
                  onClick={() => handleSelectVoice(voice)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-2.5 flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: voice.color }}
                    >
                      {voice.name.charAt(0)}
                    </div>
                    <span className="font-medium">{voice.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {voice.category}
                    </span>
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        testVoice(voice.value)
                      }}
                      disabled={isPlaying}
                    >
                      {isPlaying && playingVoiceId === voice.id ? (
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                        </div>
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={() => testVoice()}
          disabled={isPlaying || mappedVoices.length === 0}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full px-5 py-2 text-sm"
        >
          {isPlaying ? (
            <div className="animate-pulse">Testing...</div>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span>Test Voice</span>
            </>
          )}
        </Button>

        {testMessage && isPlaying && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-pulse flex space-x-1 mr-2">
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span>Playing</span>
          </div>
        )}
      </div>
    </div>
  )
}
