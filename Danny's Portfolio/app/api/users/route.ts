import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

interface User {
  id: string;
  email: string;
  password: string;
  role?: string;
  createdAt: string;
}

function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

export async function GET() {
  try {
    const users = readUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = 'user' } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const users = readUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this password
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, password, role } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== users[userIndex].email) {
      if (users.some(user => user.email === email && user.id !== id)) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      email: email || users[userIndex].email,
      password: password || users[userIndex].password,
      role: role || users[userIndex].role
    };

    writeUsers(users);

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(userIndex, 1);
    writeUsers(users);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}