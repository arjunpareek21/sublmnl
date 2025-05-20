"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"

export function SubscriptionsTable({ subscriptions = [] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize filtered subscriptions to avoid recalculation on every render
  const filteredSubscriptions = useMemo(() => {
    if (!Array.isArray(subscriptions)) return []
    
    const searchString = searchTerm.toLowerCase().trim()
    if (!searchString) return subscriptions
    
    return subscriptions.filter((subscription) => {
      if (!subscription) return false
      
      // Handle both data structures: subscription.userId and subscription.user
      const userName = subscription.user?.name?.toLowerCase() || 
                       subscription.userId?.name?.toLowerCase() || ''
      const userEmail = subscription.user?.email?.toLowerCase() || 
                        subscription.userId?.email?.toLowerCase() || ''
      const subscriptionId = subscription.stripeSubscriptionId?.toLowerCase() || ''
      const customerId = subscription.stripeCustomerId?.toLowerCase() || ''
      
      return userName.includes(searchString) || 
             userEmail.includes(searchString) || 
             subscriptionId.includes(searchString) ||
             customerId.includes(searchString)
    })
  }, [subscriptions, searchTerm])

  // Format date with error handling
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Get appropriate badge classes based on subscription status
  const getStatusClasses = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      case "trialing":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`
      case "past_due":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
      case "canceled":
      case "unpaid":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
    }
  }

  // Get badge classes for cancellation status
  const getCancelClasses = (isCanceling) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    
    return isCanceling
      ? `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
      : `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700`
  }

  // Get user display info, handling both data structures
  const getUserInfo = (subscription) => {
    const user = subscription?.user || subscription?.userId || {}
    return {
      name: user.name || "Unknown",
      email: user.email || "No email"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search by user or subscription ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">User</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium">Start Date</th>
                <th scope="col" className="px-6 py-3 font-medium">Next Billing</th>
                <th scope="col" className="px-6 py-3 font-medium">Canceling</th>
                <th scope="col" className="px-6 py-3 font-medium">Subscription ID</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(subscriptions) || filteredSubscriptions.length === 0 ? (
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td colSpan={6} className="h-24 px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {!Array.isArray(subscriptions) 
                      ? "Invalid subscription data" 
                      : searchTerm 
                        ? "No matching subscriptions found" 
                        : "No subscriptions available"}
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription, index) => {
                  const userInfo = getUserInfo(subscription)
                  
                  return (
                    <tr 
                      key={subscription?.id || subscription?._id || index} 
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {userInfo.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {userInfo.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusClasses(subscription?.status)}>
                          {subscription?.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(subscription?.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(subscription?.currentPeriodEnd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getCancelClasses(subscription?.cancelAtPeriodEnd)}>
                          {subscription?.cancelAtPeriodEnd ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">
                        {subscription?.stripeSubscriptionId || "N/A"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredSubscriptions.length} of {Array.isArray(subscriptions) ? subscriptions.length : 0} subscriptions
      </div>
    </div>
  )
}