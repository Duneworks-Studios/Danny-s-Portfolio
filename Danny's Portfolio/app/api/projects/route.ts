import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');

export async function GET() {
  try {
    const projectsPath = join(dataDir, 'projects.json');
    const projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    const projectsPath = join(dataDir, 'projects.json');
    
    let projects = [];
    try {
      projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
    } catch {
      projects = [];
    }

    const newProject = {
      id: Date.now().toString(),
      ...project,
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const projectsPath = join(dataDir, 'projects.json');
    
    let projects = [];
    try {
      projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
    } catch {
      return NextResponse.json({ error: 'No projects found' }, { status: 404 });
    }

    const projectIndex = projects.findIndex((project: any) => project.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[projectIndex] = { ...projects[projectIndex], ...updates };
    writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json(projects[projectIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const projectsPath = join(dataDir, 'projects.json');
    
    let projects = [];
    try {
      projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
    } catch {
      return NextResponse.json({ error: 'No projects found' }, { status: 404 });
    }

    const projectIndex = projects.findIndex((project: any) => project.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects.splice(projectIndex, 1);
    writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
