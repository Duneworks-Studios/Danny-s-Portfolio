import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');

export async function GET() {
  try {
    const photosPath = join(dataDir, 'photos.json');
    const photos = JSON.parse(readFileSync(photosPath, 'utf8'));
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const photo = await request.json();
    const photosPath = join(dataDir, 'photos.json');
    
    let photos = [];
    try {
      photos = JSON.parse(readFileSync(photosPath, 'utf8'));
    } catch {
      photos = [];
    }

    const newPhoto = {
      id: Date.now().toString(),
      ...photo,
      createdAt: new Date().toISOString()
    };

    photos.push(newPhoto);
    writeFileSync(photosPath, JSON.stringify(photos, null, 2));
    
    return NextResponse.json(newPhoto);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const photosPath = join(dataDir, 'photos.json');
    
    let photos = [];
    try {
      photos = JSON.parse(readFileSync(photosPath, 'utf8'));
    } catch {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const photoIndex = photos.findIndex((photo: any) => photo.id === id);
    if (photoIndex === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    photos[photoIndex] = { ...photos[photoIndex], ...updates };
    writeFileSync(photosPath, JSON.stringify(photos, null, 2));
    
    return NextResponse.json(photos[photoIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
    }

    const photosPath = join(dataDir, 'photos.json');
    
    let photos = [];
    try {
      photos = JSON.parse(readFileSync(photosPath, 'utf8'));
    } catch {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const photoIndex = photos.findIndex((photo: any) => photo.id === id);
    if (photoIndex === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    photos.splice(photoIndex, 1);
    writeFileSync(photosPath, JSON.stringify(photos, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
