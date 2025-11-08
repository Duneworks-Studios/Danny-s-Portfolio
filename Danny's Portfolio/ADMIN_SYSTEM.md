# Admin System Documentation

## Overview
The admin system provides secure access to manage portfolio content including photos and development projects.

## Access
- **Admin Login**: Press `Ctrl + L` on any page to reveal the admin access button
- **Direct URL**: Navigate to `/admin/login`
- **Credentials**:
  - Email: `duneworksstudios@gmail.com`
  - Password: `Duneworks2025`

## Features

### Authentication
- Session-based authentication with secure cookies
- 24-hour session expiration
- Protected admin routes with middleware
- Automatic logout functionality

### Photo Management
- Add new photos with title, description, category, and image URL
- Edit existing photos
- Delete photos with confirmation
- Categories: Automotive, Cinematic, Street, Portrait
- Real-time preview of photo cards

### Project Management
- Add new development projects
- Edit existing projects
- Delete projects with confirmation
- Technology stack management
- Gradient color selection for project cards
- Demo URL linking

### Data Storage
- JSON file-based storage (`/data/photos.json` and `/data/projects.json`)
- Automatic data persistence
- Fallback to hardcoded content when no admin data exists

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify session
- `DELETE /api/auth/login` - Logout

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Add new photo
- `PUT /api/photos` - Update photo
- `DELETE /api/photos?id={id}` - Delete photo

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Add new project
- `PUT /api/projects` - Update project
- `DELETE /api/projects?id={id}` - Delete project

## Security Features
- Credentials stored securely on server-side
- HTTP-only session cookies
- CSRF protection with SameSite cookies
- Input validation and sanitization
- Protected admin routes

## Frontend Integration
- Photos automatically appear on `/photography` page
- Projects automatically appear on `/development` page
- Real-time updates without page refresh
- Responsive design matching portfolio theme

## Usage Instructions

1. **Access Admin Panel**:
   - Press `Ctrl + L` on any page
   - Click the "Admin Login" button that appears
   - Enter credentials

2. **Manage Photos**:
   - Click "Add Photo" to create new entries
   - Fill in title, description, category, and image URL
   - Use edit/delete buttons on existing photos

3. **Manage Projects**:
   - Click "Add Project" to create new entries
   - Fill in project details and technologies
   - Select gradient colors for visual appeal
   - Use edit/delete buttons on existing projects

4. **View Changes**:
   - Changes appear immediately on the main portfolio pages
   - No refresh required
   - Fallback content shows when no admin data exists

## File Structure
```
/app/admin/
  /login/page.tsx          # Admin login page
  /dashboard/page.tsx      # Admin dashboard
/api/
  /auth/
    /login/route.ts        # Login/logout endpoints
    /verify/route.ts       # Session verification
  /photos/route.ts         # Photo CRUD operations
  /projects/route.ts       # Project CRUD operations
/data/
  photos.json              # Photo data storage
  projects.json            # Project data storage
/components/
  AdminAccess.tsx          # Hidden admin access button
middleware.ts              # Route protection
```

## Customization
- Modify credentials in `/app/api/auth/login/route.ts`
- Adjust session duration (currently 24 hours)
- Add new photo categories in the admin dashboard
- Customize project gradient options
- Extend API endpoints for additional features
