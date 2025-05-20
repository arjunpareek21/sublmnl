"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"

export function PaymentsTable({ payments = [] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize filtered payments to avoid recalculation on every render
  const filteredPayments = useMemo(() => {
    if (!Array.isArray(payments)) return []
    
    const searchString = searchTerm.toLowerCase().trim()
    if (!searchString) return payments
    
    return payments.filter((payment) => {
      if (!payment) return false
      
      const userName = payment.user?.name?.toLowerCase() || ''
      const userEmail = payment.user?.email?.toLowerCase() || ''
      const paymentId = payment.stripePaymentId?.toLowerCase() || ''
      
      return userName.includes(searchString) || 
             userEmail.includes(searchString) || 
             paymentId.includes(searchString)
    })
  }, [payments, searchTerm])

  // Format currency with proper handling of different formats
  const formatCurrency = (amount, currency = "USD") => {
    if (amount === undefined || amount === null) return "N/A"
    
    try {
      // Handle different amount formats (cents vs dollars)
      const displayAmount = amount > 100 && Number.isInteger(amount) ? amount / 100 : amount
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (currency || "USD").toUpperCase(),
        minimumFractionDigits: 2
      }).format(displayAmount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      return `${amount} ${currency || "USD"}`
    }
  }

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

  // Get appropriate badge classes based on payment status
  const getStatusClasses = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    
    switch (status?.toLowerCase()) {
      case "succeeded":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
    }
  }

  // Get badge classes for payment type
  const getTypeClasses = () => {
    return "px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search by user or payment ID..."
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
                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                <th scope="col" className="px-6 py-3 font-medium">User</th>
                <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                <th scope="col" className="px-6 py-3 font-medium">Type</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(payments) || filteredPayments.length === 0 ? (
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td colSpan={6} className="h-24 px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {!Array.isArray(payments) 
                      ? "Invalid payment data" 
                      : searchTerm 
                        ? "No matching payments found" 
                        : "No payments available"}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <tr 
                    key={payment?.id || payment?._id || index} 
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(payment?.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {payment?.user?.name || "Unknown"}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {payment?.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(payment?.amount, payment?.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getTypeClasses()}>
                        {payment?.type === "subscription" ? "Subscription" : "One-time"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusClasses(payment?.status)}>
                        {payment?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">
                      {payment?.stripePaymentId || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPayments.length} of {Array.isArray(payments) ? payments.length : 0} payments
      </div>
    </div>
  )
}