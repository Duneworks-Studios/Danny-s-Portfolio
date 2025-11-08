export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

export const fallbackGallery: GalleryPhoto[] = [
  {
    id: 'fallback-1',
    title: 'Midnight Apex',
    description: 'Long-exposure of a GT3 slicing through a mountain pass.',
    category: 'Automotive',
    imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fallback-2',
    title: 'Rainlight',
    description: 'Supercar reflections after the storm.',
    category: 'Automotive',
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fallback-3',
    title: 'Neon Rush',
    description: 'City speed trails captured at 1/2 second.',
    category: 'Cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fallback-4',
    title: 'Golden Hour Glide',
    description: 'Porsche 911 lit by the last rays of the sun.',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fallback-5',
    title: 'Track Silence',
    description: 'Empty apex before the endurance race begins.',
    category: 'Cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1511397053363-8127223e3d43?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fallback-6',
    title: 'Carbon Detail',
    description: 'Macro shot revealing raw graphite weave.',
    category: 'Street',
    imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=90'
  }
];
