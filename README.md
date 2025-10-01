# Text to Speech Application

A modern, multilingual Text to Speech web application built with React and TypeScript. Supports both browser TTS and Google Cloud TTS with a beautiful, responsive UI.

## Features

- 🎤 **Dual TTS Support**: Browser TTS and Google Cloud TTS
- 🌍 **Multilingual Support**: Handles mixed languages (Hindi + English)
- 🎨 **Modern UI**: Beautiful, responsive design with minimal animations
- ⚙️ **Customizable**: Adjustable voice, speed, pitch, and volume
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔧 **Reusable Components**: Generic UI components for easy maintenance

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Slider.tsx
│   │   ├── TextArea.tsx
│   │   └── *.css          # Component-specific styles
│   └── TextToSpeech.tsx   # Main component
├── hooks/
│   ├── useTextToSpeech.ts # Browser TTS hook
│   └── useGoogleTTS.ts    # Google Cloud TTS hook
├── services/
│   └── googleTTS.ts       # Google Cloud TTS service
├── types/
│   ├── index.ts           # Main type definitions
│   └── googleTTS.ts       # Google TTS specific types
├── App.tsx
├── main.tsx
└── *.css                  # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### Browser TTS
- No setup required
- Uses the browser's built-in speech synthesis
- Supports multiple voices and languages
- Adjustable speed, pitch, and volume

### Google Cloud TTS
- Requires a Google Cloud TTS API key
- Higher quality voice synthesis
- Better multilingual support
- More voice options

## API Key Setup (Google Cloud TTS)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Text-to-Speech API
4. Create credentials (API Key)
5. Copy the API key and paste it in the application

## Features

### Voice Settings
- **Voice Selection**: Choose from available voices
- **Speed Control**: Adjust speech rate (0.5x - 2x)
- **Pitch Control**: Modify voice pitch (-2 to +2)
- **Volume Control**: Adjust volume (Browser TTS only)

### Multilingual Support
- Automatically detects language in text
- Supports mixed language content (Hindi + English)
- Optimizes voice selection based on content

### UI Components
- **Button**: Reusable button with variants (primary, secondary, danger)
- **Input**: Form input with validation and error states
- **Select**: Dropdown selection component
- **Slider**: Range input with custom styling
- **TextArea**: Multi-line text input with character/word count

## Development

### Adding New Features
1. Create new components in `src/components/ui/`
2. Add corresponding CSS files
3. Update type definitions in `src/types/`
4. Follow the existing pattern for consistency

### Styling
- Global styles in `src/index.css` and `src/App.css`
- Component-specific styles in individual CSS files
- Uses CSS custom properties for theming
- Responsive design with mobile-first approach

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository.