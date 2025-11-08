import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import { sessions } from '@/lib/sessions';

const dataDir = join(process.cwd(), 'data');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt:', { email, password });

    // Load users from database
    let users = [];
    try {
      const usersPath = join(dataDir, 'users.json');
      users = JSON.parse(readFileSync(usersPath, 'utf8'));
    } catch (error) {
      console.error('Error loading users:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    // Find user by email
    const user = users.find((u: any) => u.email === email);
    
    // Fallback for default admin user
    const ADMIN_EMAIL = 'Duneworksstudios@gmail.com';
    const ADMIN_PASSWORD = 'Duneworks2025';
    
    const isValidUser = (user && user.password === password) || 
                       (email === ADMIN_EMAIL && password === ADMIN_PASSWORD);
    
    if (isValidUser) {
      const sessionId = crypto.randomUUID();
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      
      sessions.set(sessionId, { email, expires });
      
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      });
      
      console.log('Login successful');
      return response;
    }

    console.log('Login failed - invalid credentials');
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
