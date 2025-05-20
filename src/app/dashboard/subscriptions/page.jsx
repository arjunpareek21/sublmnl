"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react'

export default function SubscriptionDetails({ subscription }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case "canceled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Canceled
          </span>
        )
      case "past_due":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex items-center">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Past Due
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
            {status}
          </span>
        )
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel this subscription?")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/subscriptions/${subscription._id}/cancel`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel subscription")
      }

      alert("Subscription canceled successfully")
      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!confirm("Are you sure you want to reactivate this subscription?")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/subscriptions/${subscription._id}/reactivate`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reactivate subscription")
      }

      alert("Subscription reactivated successfully")
      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Subscription Details</h2>
        {getStatusBadge(subscription?.status)}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-md p-3 mb-4 text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">Customer</p>
          <p className="font-medium">{subscription?.user?.name || "Unknown"}</p>
          <p className="text-sm text-gray-400">{subscription?.user?.email || "Unknown"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Stripe IDs</p>
          <p className="text-sm">
            <span className="text-gray-400">Subscription:</span> {subscription?.stripeSubscriptionId}
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Customer:</span> {subscription?.stripeCustomerId}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Current Period</p>
          <p className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
            {formatDate(subscription?.currentPeriodStart)} - {formatDate(subscription?.currentPeriodEnd)}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Auto Renew</p>
          <p className="flex items-center">
            {subscription?.cancelAtPeriodEnd ? (
              <XCircleIcon className="w-4 h-4 mr-1 text-red-400" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" />
            )}
            {subscription?.cancelAtPeriodEnd ? "No (Cancels at period end)" : "Yes"}
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        {subscription?.status === "active" && (
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
          >
            {isLoading ? "Processing..." : "Cancel Subscription"}
          </button>
        )}

        {subscription?.status === "canceled" && subscription?.cancelAtPeriodEnd && (
          <button
            onClick={handleReactivateSubscription}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md transition-colors"
          >
            {isLoading ? "Processing..." : "Reactivate Subscription"}
          </button>
        )}
      </div>
    </div>
  )
}