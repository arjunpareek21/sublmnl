"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProfilePage() {
  const { user, updateProfile, requireAuth } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  useEffect(() => {
    if (!requireAuth()) return

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      })
    }
  }, [user, requireAuth])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setIsEditing(false)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null // This will be handled by requireAuth redirect
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 flex justify-center items-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500 text-green-200"
                : "bg-red-900/30 border border-red-500 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="glass-card p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">First Name</h3>
                  <p className="text-lg">{user.firstName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Last Name</h3>
                  <p className="text-lg">{user.lastName}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Email Address</h3>
                <p className="text-lg">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Subscription Plan</h3>
                <p className="text-lg capitalize">{user.subscription || "Free"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <div className="glass-card p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Change Password</h3>
              <button className="btn-secondary">Change Password</button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Subscription Management</h3>
              <button className="btn-secondary">Manage Subscription</button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-red-400">Danger Zone</h3>
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

