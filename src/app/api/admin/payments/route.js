// app/api/admin/payments/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from "@/server/db"
import Payment from '@/server/models/Payment';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    // Optional: Check if user is admin
    // if (!session.user.isAdmin) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     message: 'Forbidden' 
    //   }, { status: 403 });
    // }
    
    // Connect to database
    await connectToDatabase();
    
    // Fetch all payments
    // You can add sorting, e.g., .sort({ createdAt: -1 }) for newest first
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email') // Populate user details
      .lean(); // Convert to plain JS objects for better performance
    
    return NextResponse.json({ 
      success: true, 
      payments 
    });
    
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch payments' 
    }, { status: 500 });
  }
}