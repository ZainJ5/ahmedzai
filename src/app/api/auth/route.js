import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// In production, use a strong secret stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // In a real app, you would check against a database
    // This is just for demonstration purposes
    if (username === 'admin' && password === 'admin123') {
      // Create JWT with limited payload data (avoid sensitive info)
      const token = jwt.sign(
        { 
          id: 1, // In production, use actual user ID
          username,
          role: 'admin',
        }, 
        JWT_SECRET, 
        { 
          expiresIn: '8h', // Shorter expiry time for security
          issuer: 'autohub-admin-portal',
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}