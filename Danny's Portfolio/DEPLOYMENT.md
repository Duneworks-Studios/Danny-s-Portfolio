# 🚀 Deployment Guide

This guide will help you deploy your portfolio website to various platforms.

## Prerequisites

Before deploying, make sure you have:
- ✅ Added your photos to `/public/photos/`
- ✅ Updated your projects in `/app/development/page.tsx`
- ✅ Customized your bio in `/app/about/page.tsx`
- ✅ Verified contact information in `/app/contact/page.tsx`

## 🌐 Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! Your site is live 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Custom Domain

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 🔷 Netlify

### Via GitHub

1. **Push to GitHub** (see Vercel section)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

### Via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## ☁️ Cloudflare Pages

1. **Push to GitHub** (see Vercel section)

2. **Deploy on Cloudflare:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Pages"
   - Click "Create a project"
   - Connect to GitHub
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `.next`
   - Click "Save and Deploy"

---

## 📦 Static Export (Optional)

If you want to export as a fully static site:

### 1. Update next.config.js

Add this to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 2. Build Static Site

```bash
npm run build
```

This will create an `out/` directory with your static files.

### 3. Deploy to Any Static Host

You can now upload the `out/` folder to:
- GitHub Pages
- AWS S3
- Google Cloud Storage
- Any static hosting service

---

## 🔧 Environment Variables

This portfolio doesn't require any environment variables by default. However, if you add external services later (analytics, forms, etc.), you can add them:

### Vercel
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add your variables

### Netlify
1. Go to Site Settings
2. Navigate to "Build & Deploy" → "Environment"
3. Add your variables

### Cloudflare Pages
1. Go to Settings
2. Navigate to "Environment Variables"
3. Add your variables

---

## 📊 Adding Analytics (Optional)

### Google Analytics

1. Install package:
```bash
npm install @next/third-parties
```

2. Add to your `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🔒 Custom Domain & SSL

### Vercel
- SSL is automatic for all domains
- Add custom domain in project settings

### Netlify
- SSL is automatic for all domains
- Add custom domain in site settings

### Cloudflare Pages
- Automatic SSL via Cloudflare
- Full CDN benefits included

---

## ⚡ Performance Tips

1. **Optimize Images:**
   - Use WebP format when possible
   - Keep file sizes under 500KB
   - Recommended dimensions: 1920x1080

2. **Enable Caching:**
   - Automatic on Vercel, Netlify, and Cloudflare
   - No configuration needed

3. **Use CDN:**
   - All recommended platforms include CDN
   - Your site will be fast globally

---

## 🐛 Troubleshooting

### Build Fails

1. Check Node.js version (requires 18+)
2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   ```

### Images Not Loading

1. Verify images are in `/public/photos/`
2. Check file names match the pattern: `photo1.jpg`, `photo2.jpg`, etc.
3. Ensure file extensions are lowercase

### Styles Not Loading

1. Run:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

---

## 📞 Need Help?

If you encounter any issues:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review the [Vercel Documentation](https://vercel.com/docs)
- Contact: Danielleebuckley@gmail.com

---

**Happy Deploying! 🚀**

