"use client"

import { createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"

// Create the auth context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === "loading"

   // Add this code to format the user object
   const user = session?.user
   ? {
       ...session.user,
       // Format subscription for display if it exists
       subscription: session.user.subscription
         ? {
             ...session.user.subscription,
             // Convert expiresAt to string if it's a Date object
             expiresAt:
               session.user.subscription.expiresAt instanceof Date
                 ? session.user.subscription.expiresAt.toISOString()
                 : session.user.subscription.expiresAt,
             // Add a toString method to the subscription object
             toString: () => `${session.user.subscription.plan} (${session.user.subscription.status})`,
           }
         : null,
     }
   : null

  // Login function
  const login = async (email, password) => {
    try {
       console.log("Login function called", email, password)
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        return { success: false, error: 'Invalid Credentials!' }
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  // Register function
  const register = async ({ firstName, lastName, email, password }) => {
    try {
      // Call the register API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Registration API error:", response.status, errorText)
        throw new Error(`Registration failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        return { success: true }
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      if (!session?.user) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Profile update API error:", response.status, errorText)
        throw new Error(`Profile update failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        // NextAuth will update the session automatically on the next request
        return { success: true }
      } else {
        throw new Error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, error: error.message }
    }
  }

  // Check if user is authenticated
  const requireAuth = () => {
    if (loading) return false
    return !!session?.user
  }

  const value = {
    user: session?.user || null,
    loading,
    login,
    logout,
    register,
    updateProfile,
    requireAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

