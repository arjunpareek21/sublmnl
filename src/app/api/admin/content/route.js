import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    // Get content type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "homepage"

    // Connect to the database
    const db = await connectToDatabase()

    // Fetch content items of the specified type
    const contentItems = await db.collection("content").find({ type, isActive: true }).sort({ order: 1 }).toArray()

    // Transform the data to ensure _id is a string
    const formattedContent = contentItems.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }))

    return NextResponse.json({
      success: true,
      content: formattedContent,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch content",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const { title, content, order, type } = await request.json()

    if (!title || !content || !type) {
      return NextResponse.json({ success: false, message: "Title, content, and type are required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    const newContentItem = {
      title,
      content,
      order: order || 0,
      type,
      isActive: true,
      createdAt: new Date(),
      createdBy: new ObjectId(), // In a real app, this would be the user's ID
    }

    const result = await db.collection("content").insertOne(newContentItem)

    return NextResponse.json({
      success: true,
      content: {
        ...newContentItem,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

