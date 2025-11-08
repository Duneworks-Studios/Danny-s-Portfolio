import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTACT_FILE = path.join(process.cwd(), 'data/contact.json');

interface ContactData {
  profilePicture: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  socialLinks: {
    discord?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
  updatedAt: string;
}

// Initialize contact file if it doesn't exist
if (!fs.existsSync(CONTACT_FILE)) {
  const defaultContact: ContactData = {
    profilePicture: "https://cdn.discordapp.com/guilds/1346430701792395315/users/909102922246275152/avatars/36fe0eeea8578b0dd4032fe8b2de8c7d.webp?size=1024",
    name: "Daniel Buckley",
    title: "CEO of Duneworks Studios",
    email: "Duneworksstudios@gmail.com",
    bio: "Passionate about photography, development, and creating stunning 3D renders. Leading Duneworks Studios to new heights.",
    socialLinks: {
      discord: "https://discord.gg/duneworks",
      github: "https://github.com/danielbuckley",
      linkedin: "https://linkedin.com/in/danielbuckley",
      twitter: "https://twitter.com/danielbuckley"
    },
    skills: [
      "Photography",
      "Web Development", 
      "3D Rendering",
      "Project Management",
      "Team Leadership"
    ],
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(CONTACT_FILE, JSON.stringify(defaultContact, null, 2));
}

export async function GET() {
  try {
    const contactData = fs.readFileSync(CONTACT_FILE, 'utf8');
    const contact: ContactData = JSON.parse(contactData);
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error reading contact data:', error);
    return NextResponse.json(
      { error: 'Failed to read contact data' },
      { status: 500 }
    );
  }
}

async function handleUpsert(request: NextRequest) {
  try {
    const contactData: ContactData = await request.json();
    
    // Validate required fields
    if (!contactData.name || !contactData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Add updated timestamp
    contactData.updatedAt = new Date().toISOString();

    // Write updated data
    fs.writeFileSync(CONTACT_FILE, JSON.stringify(contactData, null, 2));

    return NextResponse.json(contactData);
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Failed to update contact data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleUpsert(request);
}

export async function POST(request: NextRequest) {
  return handleUpsert(request);
}
