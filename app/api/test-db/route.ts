import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const ping = await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      message: 'Connected to MongoDB successfully',
      ping: ping,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
