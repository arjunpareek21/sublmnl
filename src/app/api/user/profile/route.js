import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import { ObjectId } from "mongodb"

export async function PUT(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication error",
          error: "No valid authorization token found",
        },
        { status: 401 },
      )
    }

    // Extract the token (user ID in this case)
    const userId = authHeader.split(" ")[1]

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication error",
          error: "No token provided",
        },
        { status: 401 },
      )
    }

    // Parse request body
    const { firstName, lastName, email } = await request.json()

    // Validate input
    if (!firstName && !lastName && !email) {
      return NextResponse.json({ success: false, message: "At least one field must be provided" }, { status: 400 })
    }

    // Connect to the database
    const db = await connectToDatabase()

    // Prepare update object with only the fields that were provided
    const updateFields = {}
    if (firstName !== undefined) updateFields.firstName = firstName
    if (lastName !== undefined) updateFields.lastName = lastName
    if (email !== undefined) updateFields.email = email

    // Update the user in the database
    const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateFields })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Get the updated user
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    // Return success response with the updated user data
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName || "",
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

