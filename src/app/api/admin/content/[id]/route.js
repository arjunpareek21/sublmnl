import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import { ObjectId } from "mongodb"

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { title, content, order, type } = await request.json()

    if (!id || !title || !content || !type) {
      return NextResponse.json(
        { success: false, message: "ID, title, content, and type are required" },
        { status: 400 },
      )
    }

    const db = await connectToDatabase()

    const result = await db.collection("content").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          order: order || 0,
          type,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, message: "Content ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Soft delete by setting isActive to false
    const result = await db.collection("content").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

