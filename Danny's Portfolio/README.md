# 🚀 Daniel Buckley - Portfolio Website

A stunning, modern portfolio website built with Next.js 14, featuring glassmorphism design, smooth animations, and premium aesthetics.

## ✨ Features

- 🎨 **Glassmorphic Design** - Beautiful frosted glass effects with depth and layering
- 🌊 **Smooth Animations** - Powered by Framer Motion for fluid interactions
- 📱 **Fully Responsive** - Perfect on all devices (desktop, tablet, mobile)
- 📸 **Dynamic Photo Gallery** - Automatic image loading with lightbox viewer
- 🎯 **Modern Tech Stack** - Next.js 14 App Router, TypeScript, Tailwind CSS
- ⚡ **Zero Backend** - Completely static and ready to deploy
- 🎭 **3D Effects** - Hover animations, parallax, and depth effects

## 🎨 Pages

- **Home (`/`)** - Hero section with animated role cycling
- **Photography (`/photography`)** - Dynamic gallery with category filters and lightbox
- **Development (`/development`)** - Animated project cards with tech stacks
- **About (`/about`)** - Bio section with skills and Discord link
- **Contact (`/contact`)** - Email and Linktree social links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Add your photos:**
   - Place your photos in `/public/photos/`
   - Name them: `photo1.jpg`, `photo2.jpg`, `photo3.png`, etc.
   - Supported formats: jpg, jpeg, png, webp

3. **Customize your projects:**
   - Edit `/app/development/page.tsx`
   - Update the `projects` array with your own projects

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── photography/       # Photography gallery
│   ├── development/       # Development projects
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── Navigation.tsx     # Navigation bar
├── public/
│   └── photos/            # Your photography images
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## 🎨 Customization

### Update Your Information

**Contact Details:**
- Edit `/app/contact/page.tsx`
- Update email and Linktree links

**About Section:**
- Edit `/app/about/page.tsx`
- Customize bio, skills, and Discord link

**Projects:**
- Edit `/app/development/page.tsx`
- Update the `projects` array with your projects

### Color Scheme

Colors are defined in `tailwind.config.js`:
- Primary: Cyan (#00D9FF)
- Secondary: Violet (#9D4EDD)
- Dark: Custom dark theme

### Fonts

The site uses:
- **Inter** - Body text
- **Poppins** - Headings and display text

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click!

### Other Platforms

The site is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any static hosting service

**Build command:**
```bash
npm run build
```

**Output directory:** `.next`

## 📸 Adding Photos

1. Place photos in `/public/photos/`
2. Name them sequentially: `photo1.jpg`, `photo2.jpg`, etc.
3. The gallery will automatically detect and display them
4. Supports up to 50 photos (easily configurable)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image component

## 📝 Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🎯 Performance

- Optimized images with Next.js Image component
- Lazy loading for better performance
- Minimal bundle size
- Fast page transitions

## 📄 License

This project is open source and available for personal use.

## 🤝 Contact

- **Email:** Danielleebuckley@gmail.com
- **Linktree:** [linktr.ee/Volraiden](https://linktr.ee/Volraiden)
- **Discord:** [discord.gg/duneworks](https://discord.gg/duneworks)

---

Built with ❤️ by Daniel Buckley

