// components/admin/PaymentsPageContent.jsx
"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PaymentsTable } from "@/components/stripe/admin/PaymentsTable"

export default function PaymentsPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/")
      return
    }

    // Fetch payments data from API
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/admin/payments")
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}: Failed to fetch payments`)
        }

        const data = await response.json()
        console.log("Payments data:", data)

        // Set payments even if it's an empty array
        setPayments(data.payments || [])
        
      } catch (error) {
        console.error("Error fetching payments:", error)
        // Don't set error, just set empty payments array
        setPayments([])
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchPayments()
    }
  }, [status, session, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>
        <div className="flex justify-center py-12">
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
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Payment History</h1>
      <PaymentsTable payments={payments} />
    </div>
  )
}