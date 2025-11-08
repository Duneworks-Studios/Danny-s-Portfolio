import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sessions } from '@/lib/sessions';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = sessions.get(sessionId);
    
    if (!session || session.expires < Date.now()) {
      sessions.delete(sessionId);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email: session.email });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
