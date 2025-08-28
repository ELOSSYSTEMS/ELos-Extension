# EPP Wrapper - Chrome Extension

A sophisticated Chrome extension that provides AI-powered prompt rewriting capabilities for various AI chat platforms including ChatGPT, Claude, and Google Gemini.

## 🚀 Features

### Core Functionality
- **AI-Powered Prompt Rewriting**: Automatically enhances user prompts with intelligent suggestions
- **Multi-Platform Support**: Works seamlessly with ChatGPT, Claude, and Google Gemini
- **Multi-Language Support**: Hebrew (RTL), English, Spanish, and Portuguese
- **Dual-Mode Operation**: 
  - **Free Mode**: Local template-based rewriting
  - **Premium Mode**: OpenAI API or custom endpoint integration

### Smart Features
- **Intent Detection**: Automatically classifies prompts into categories:
  - Product copywriting
  - Advertising content
  - Code debugging
  - Translation
  - Summarization
- **Entity Extraction**: Recognizes quoted names and entities in prompts
- **Auto-Suggestions**: Appears after 2 seconds of idle typing
- **Manual Rewriting**: Floating action button for on-demand rewriting

### User Experience
- **Floating Plus Button**: Quick access in bottom-right corner
- **Overlay Suggestions**: Clean, modern UI with accept/dismiss options
- **Keyboard Shortcuts**: Tab to accept, Escape to dismiss
- **Responsive Design**: Adapts to different screen sizes and languages

## 🛠️ Technical Architecture

### Extension Structure
- **Manifest V3**: Modern Chrome extension architecture
- **Background Service Worker**: Handles premium API calls
- **Content Scripts**: Injected into AI chat platforms
- **React UI Components**: Modern, responsive interface
- **TypeScript**: Full type safety and development experience

### Build System
- **Vite**: Fast build tool with hot reload
- **TypeScript**: Type-safe development
- **React 18**: Modern UI framework
- **Chrome Extension APIs**: Native browser integration

## 📦 Installation

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ELOSSYSTEMS/ELos-Extension.git
   cd ELos-Extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/` folder

### Development Mode

For development with hot reload:
```bash
npm run dev
```

## ⚙️ Configuration

### Options Page
Access the extension options to configure:
- **Premium Mode**: Toggle between free and premium features
- **API Provider**: Choose between OpenAI or custom endpoints
- **API Keys**: Configure your OpenAI API key
- **Custom Endpoints**: Set up your own rewriting service

### Premium Features
- **OpenAI Integration**: Direct API calls to GPT-4o-mini
- **Custom Endpoints**: Use your own rewriting service
- **Advanced Rewriting**: More sophisticated prompt enhancement

## 🌍 Localization

The extension supports multiple languages with automatic detection:

- **Hebrew (he)**: RTL support with Hebrew-specific templates
- **English (en)**: Default language with comprehensive templates
- **Spanish (es)**: Spanish language support
- **Portuguese (pt)**: Portuguese language support

Language detection is automatic based on text content, with fallback to English.

## 🎯 Use Cases

### E-commerce
- Product description generation
- Marketing copy creation
- SEO-optimized content

### Development
- Code debugging assistance
- Error message interpretation
- Technical documentation

### Content Creation
- Translation tasks
- Text summarization
- Creative writing enhancement

## 🔧 Development

### Project Structure
```
extension/
├── background/          # Service worker
├── content/            # Content scripts
│   ├── injector.ts     # Input element detection
│   ├── listener.ts     # Idle detection
│   ├── overlay.tsx     # Suggestion UI
│   ├── plusmenu.tsx    # Floating button
│   ├── router.ts       # Intent routing
│   └── slotfill.ts     # Local templates
├── locales/            # Language packs
├── ui/                 # Options and popup
└── manifest.json       # Extension manifest
```

### Key Components

- **Intent Router**: Classifies user prompts into actionable categories
- **Locale Detection**: Automatically detects language from text content
- **Template System**: Local rewriting templates for each language and intent
- **API Integration**: Seamless fallback between local and premium features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.

## 🔗 Links

- [GitHub Repository](https://github.com/ELOSSYSTEMS/ELos-Extension)
- [Chrome Web Store](https://chrome.google.com/webstore) (Coming Soon)

---

**EPP Wrapper** - Enhancing AI interactions with intelligent prompt rewriting.
