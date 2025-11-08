# 🎵 Background Music

## How to Add Your MP3 File

1. **Replace this file** with your actual MP3 file
2. **Rename it** to `background-music.mp3`
3. **Keep it in this folder** (`/public/music/`)

## File Requirements

- **Format**: MP3
- **Size**: Keep under 5MB for better loading
- **Quality**: 128kbps or higher recommended
- **Length**: Any length (will loop automatically)

## Features

✅ **Auto-play** when website loads  
✅ **Loop** continuously  
✅ **Volume control** (0-100%)  
✅ **Play/Pause** toggle  
✅ **Mute** button  
✅ **Expandable player** in bottom-right corner  
✅ **Visual indicator** when music is playing  

## Browser Compatibility

- ✅ Chrome/Edge (auto-play works)
- ✅ Firefox (auto-play works)
- ✅ Safari (may require user interaction first)
- ✅ Mobile browsers (may require user interaction first)

## Customization

You can modify the music player by editing:
- `/components/MusicPlayer.tsx` - Player functionality
- `/app/layout.tsx` - Music file path and settings

## Troubleshooting

If music doesn't auto-play:
1. Some browsers block auto-play until user interaction
2. Click the music player button to start manually
3. Check browser console for any errors
4. Ensure MP3 file is properly uploaded

---

**Note**: Make sure your MP3 file is properly licensed for use on your website!
