# ⚡ Quick Start Guide

Get your portfolio running in 5 minutes!

## 🚀 Installation

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📸 Add Your Photos

1. Navigate to `/public/photos/`
2. Add your images with these names:
   - `photo1.jpg`
   - `photo2.jpg`
   - `photo3.png`
   - etc.

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

The gallery will automatically detect and display all your photos!

---

## ✏️ Customize Content

### 1. Update Projects

Edit: `/app/development/page.tsx`

Find the `projects` array and update with your own projects:

```typescript
const projects = [
  {
    id: 1,
    name: 'Your Project Name',
    description: 'Your project description',
    tech: ['Next.js', 'TypeScript', 'etc'],
    github: 'https://github.com/yourusername/repo',
    demo: 'https://yourproject.com',
    gradient: 'from-cyan-500 to-blue-500',
  },
  // Add more projects...
];
```

### 2. Update About Section

Edit: `/app/about/page.tsx`

Update the bio text with your own story.

### 3. Update Contact Info

Edit: `/app/contact/page.tsx`

Make sure your email and Linktree URLs are correct:
- Email: `Danielleebuckley@gmail.com`
- Linktree: `https://linktr.ee/Volraiden`
- Discord: `https://discord.gg/duneworks`

---

## 🎨 Customize Colors

Edit: `tailwind.config.js`

```javascript
colors: {
  primary: {
    DEFAULT: '#00D9FF', // Change this
  },
  secondary: {
    DEFAULT: '#9D4EDD', // Change this
  },
}
```

---

## 🌐 Deploy

### Easiest Way: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and deploy via [vercel.com](https://vercel.com)

See `DEPLOYMENT.md` for more deployment options.

---

## 📁 Project Structure

```
/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── photography/          ← Photo gallery
│   ├── development/          ← Projects page
│   ├── about/                ← About page
│   └── contact/              ← Contact page
│
├── components/
│   └── Navigation.tsx        ← Nav bar
│
├── public/
│   └── photos/               ← Add your photos here!
│
└── tailwind.config.js        ← Customize colors
```

---

## 🎯 What's Included

- ✅ Glassmorphic design
- ✅ Smooth Framer Motion animations
- ✅ Dynamic photo gallery with lightbox
- ✅ Responsive on all devices
- ✅ Optimized for performance
- ✅ SEO-friendly
- ✅ Zero configuration needed

---

## 💡 Tips

1. **High-quality photos:** Use at least 1920x1080 resolution
2. **Optimize images:** Keep file sizes under 500KB each
3. **Test on mobile:** Check how it looks on your phone
4. **Update regularly:** Keep your projects and photos fresh

---

## 🔧 Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Start production server
npm run lint       # Lint code
```

---

## ❓ Need Help?

- 📖 Read the full [README.md](./README.md)
- 🚀 Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- 📧 Email: Danielleebuckley@gmail.com

---

**That's it! You're ready to go! 🎉**

