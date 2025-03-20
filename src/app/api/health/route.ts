import { NextResponse } from 'next/server';

// Simple health check route for Docker
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
} 