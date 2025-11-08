import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const RENDERS_FILE = path.join(process.cwd(), 'data/renders.json');

interface Render {
  id: string;
  sceneName: string;
  imageUrl: string;
  createdAt: string;
}

// Initialize renders file if it doesn't exist
if (!fs.existsSync(RENDERS_FILE)) {
  fs.writeFileSync(RENDERS_FILE, JSON.stringify([], null, 2));
}

export async function GET() {
  try {
    const rendersData = fs.readFileSync(RENDERS_FILE, 'utf8');
    const renders: Render[] = JSON.parse(rendersData);
    
    // Return full render objects for the frontend
    return NextResponse.json(renders);
  } catch (error) {
    console.error('Error reading renders:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sceneName, imageUrl } = await request.json();
    
    if (!sceneName || !imageUrl) {
      return NextResponse.json(
        { error: 'Scene name and image URL are required' },
        { status: 400 }
      );
    }

    const rendersData = fs.readFileSync(RENDERS_FILE, 'utf8');
    const renders: Render[] = JSON.parse(rendersData);

    const newRender: Render = {
      id: Date.now().toString(),
      sceneName,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    renders.push(newRender);
    fs.writeFileSync(RENDERS_FILE, JSON.stringify(renders, null, 2));

    return NextResponse.json(newRender);
  } catch (error) {
    console.error('Error adding render:', error);
    return NextResponse.json(
      { error: 'Failed to add render' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Render ID is required' },
        { status: 400 }
      );
    }

    const rendersData = fs.readFileSync(RENDERS_FILE, 'utf8');
    const renders: Render[] = JSON.parse(rendersData);

    const renderIndex = renders.findIndex((render: Render) => render.id === id);
    if (renderIndex === -1) {
      return NextResponse.json(
        { error: 'Render not found' },
        { status: 404 }
      );
    }

    renders[renderIndex] = { ...renders[renderIndex], ...updates };
    fs.writeFileSync(RENDERS_FILE, JSON.stringify(renders, null, 2));

    return NextResponse.json(renders[renderIndex]);
  } catch (error) {
    console.error('Error updating render:', error);
    return NextResponse.json(
      { error: 'Failed to update render' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Render ID is required' },
        { status: 400 }
      );
    }

    const rendersData = fs.readFileSync(RENDERS_FILE, 'utf8');
    const renders: Render[] = JSON.parse(rendersData);

    const filteredRenders = renders.filter(render => render.id !== id);
    fs.writeFileSync(RENDERS_FILE, JSON.stringify(filteredRenders, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting render:', error);
    return NextResponse.json(
      { error: 'Failed to delete render' },
      { status: 500 }
    );
  }
}
