"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function ContentManagementPage() {
  const { user } = useAuth()
  const [contentItems, setContentItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeContentType, setActiveContentType] = useState("homepage")
  const [showEditor, setShowEditor] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [editorContent, setEditorContent] = useState({
    title: "",
    content: "",
    order: 0,
    type: "homepage",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }

    fetchContent(activeContentType)
  }, [activeContentType, user, router])

  const fetchContent = async (type) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/content?type=${type}`)
      const data = await response.json()

      if (data.success) {
        setContentItems(data.content)
      } else {
        setError(data.message || "Failed to fetch content")
      }
    } catch (error) {
      setError("An error occurred while fetching content")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNew = () => {
    setCurrentItem(null)
    setEditorContent({
      title: "",
      content: "",
      order: contentItems.length + 1,
      type: activeContentType,
    })
    setShowEditor(true)
  }

  const handleEdit = (item) => {
    setCurrentItem(item)
    setEditorContent({
      title: item.title,
      content: item.content,
      order: item.order,
      type: item.type,
    })
    setShowEditor(true)
  }

  const handleSave = async () => {
    try {
      setError("")

      if (!editorContent.title || !editorContent.content) {
        setError("Title and content are required")
        return
      }

      const method = currentItem ? "PUT" : "POST"
      const url = currentItem ? `/api/admin/content/${currentItem._id}` : "/api/admin/content"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editorContent),
      })

      const data = await response.json()

      if (data.success) {
        setShowEditor(false)
        fetchContent(activeContentType)
      } else {
        setError(data.message || "Failed to save content")
      }
    } catch (error) {
      setError("An error occurred while saving content")
      console.error(error)
    }
  }

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this content item?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/content/${itemId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        fetchContent(activeContentType)
      } else {
        setError(data.message || "Failed to delete content")
      }
    } catch (error) {
      setError("An error occurred while deleting content")
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <button className="btn-primary" onClick={handleCreateNew}>
          Add New Content
        </button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mb-4 text-red-200">{error}</div>}

      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeContentType === "homepage"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveContentType("homepage")}
        >
          Homepage
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeContentType === "faq" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveContentType("faq")}
        >
          FAQ
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeContentType === "about"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveContentType("about")}
        >
          About
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeContentType === "how-it-works"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveContentType("how-it-works")}
        >
          How It Works
        </button>
      </div>

      {showEditor ? (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">{currentItem ? "Edit Content" : "Add New Content"}</h3>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={editorContent.title}
              onChange={(e) => setEditorContent((prev) => ({ ...prev, title: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
              Display Order
            </label>
            <input
              id="order"
              type="number"
              min="1"
              value={editorContent.order}
              onChange={(e) => setEditorContent((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
              className="input-field"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              rows={10}
              value={editorContent.content}
              onChange={(e) => setEditorContent((prev) => ({ ...prev, content: e.target.value }))}
              className="input-field"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="btn-secondary" onClick={() => setShowEditor(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      ) : isLoading ? (
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
      ) : contentItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No content found for this section. Add your first content item to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentItems.map((item) => (
            <div key={item._id} className="glass-card p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-400">Order: {item.order}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-primary/20 hover:bg-primary/30 rounded-full"
                    title="Edit Content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-full"
                    title="Delete Content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-700 pt-4">
                <p className="text-gray-300 line-clamp-3">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

