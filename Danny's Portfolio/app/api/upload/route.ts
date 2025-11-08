import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const publicDir = join(process.cwd(), 'public');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine upload directory based on category
    let uploadDir: string;
    switch (category) {
      case 'photo':
        uploadDir = join(publicDir, 'photos');
        break;
      case 'render':
        uploadDir = join(publicDir, 'renders');
        break;
      case 'profile':
        uploadDir = join(publicDir, 'profile');
        break;
      default:
        uploadDir = join(publicDir, 'uploads');
    }

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL path
    const publicPath = `/${category === 'photo' ? 'photos' : category === 'render' ? 'renders' : category === 'profile' ? 'profile' : 'uploads'}/${filename}`;

    return NextResponse.json({ 
      url: publicPath,
      filename: filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

