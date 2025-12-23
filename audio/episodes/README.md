# 🎵 Audio Files Directory

This directory contains the MP3 audio files for podcast episodes.

## 📂 Expected Files

```
public/audio/episodes/
├── ep001.mp3  → Episodio 1: "La Legitimidad Narrativa"
├── ep002.mp3  → Episodio 2: "Miedo al Miedo"
└── ep003.mp3  → Episodio 3: "Emergencia y Propósito"
```

## 📝 File Naming Convention

- Format: `ep[episode_number].mp3`
- Episode number: Zero-padded 3 digits (001, 002, 003, ...)
- Must match the `audioUrl` field in [public/data/episodes.json](../../data/episodes.json)

## 🔗 Configuration

Episode data is defined in `public/data/episodes.json`:

```json
{
  "id": "001",
  "title": "La Legitimidad Narrativa",
  "audioUrl": "audio/episodes/ep001.mp3",
  "duration": "45:30"
}
```

The `audioUrl` path is relative to the `public/` directory.

## ✅ Audio Player Implementation

The AudioPlayer component ([src/components/AudioPlayer.tsx](../../../src/components/AudioPlayer.tsx)) uses the HTML5 Audio API:

- **Native audio playback** with `new Audio()`
- **Event listeners** for metadata, progress, and errors
- **BASE_URL support** for GitHub Pages deployment
- **Error handling** for missing or invalid files

## 📋 Requirements

- **Format**: MP3 (recommended) or other HTML5-supported formats (WAV, OGG, M4A)
- **Quality**: Minimum 128kbps, recommended 192kbps or higher
- **File size**: Consider optimization for web delivery
- **Metadata**: ID3 tags are optional (title, artist, etc.)

## 🚀 Deployment

After adding MP3 files:

1. Verify files exist in `public/audio/episodes/`
2. Check paths in `public/data/episodes.json`
3. Build: `npm run build`
4. Deploy: `npm run deploy` (GitHub Pages)

Files in `public/` are copied as-is to the build output (`dist/`).

## ⚠️ Current Status

**Directory created**: ✅  
**Audio files**: ⏳ Pending upload

The AudioPlayer is fully implemented and ready to play audio files once they are uploaded to this directory.

## 🔍 Testing Locally

```bash
# 1. Add MP3 files to this directory
# 2. Start dev server
npm run dev

# 3. Navigate to Podcast page
# 4. Click on an episode to open AudioPlayer
```

If a file is missing, the AudioPlayer will display an error message to the user.

---

**Last updated**: January 22, 2025  
**Implemented by**: GitHub Copilot  
**Commit**: `8b81699`
