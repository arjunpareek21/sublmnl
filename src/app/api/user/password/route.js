import { NextResponse } from "next/server"

export async function PUT(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header found, returning 401")
      return NextResponse.json(
        {
          success: false,
          message: "Authentication error",
          error: "No valid authorization token found",
        },
        { status: 401 },
      )
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    if (!token) {
      console.log("No token found in authorization header, returning 401")
      return NextResponse.json(
        {
          success: false,
          message: "Authentication error",
          error: "No token provided",
        },
        { status: 401 },
      )
    }

    // In a real app, you would verify the token here
    // For this demo, we'll assume the token is valid if it exists

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    // In a real app, you would verify the current password and update the new password
    // For this demo, we'll just return success

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error updating user password:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update password",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

