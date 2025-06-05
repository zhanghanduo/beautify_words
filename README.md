# Beautify Words

A tool for reating beautiful English learning flashcards and word visualization.

## Components

### 1. Word Card Generator (React App)
A modern React application built with Vite for generating customizable word cards.

**Features:**
- Interactive word card creation
- Modern UI with Tailwind CSS
- Export functionality with html2canvas
- Responsive design

**Tech Stack:**
- React 19
- Vite
- Tailwind CSS 4
- html2canvas

**Quick Start:**
```bash
cd word-card-generator
npm install
npm run dev
```

### 2. Natural HTML Flashcard
A standalone HTML file for displaying English learning flashcards with beautiful backgrounds.

**Features:**
- Clean, minimal design
- Phonetic transcriptions (UK & US)
- Chinese translations
- Responsive layout
- Dynamic background images

**Usage:**
Open `natural.html` directly in your browser.

## Development

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
```bash
# Install root dependencies
npm install

# Install React app dependencies
cd word-card-generator
npm install
```

### Available Scripts

**React App:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure
```
beautify_words/
├── word-card-generator/    # React application
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   └── package.json       # App dependencies
├── natural.html           # Standalone flashcard
├── package.json           # Root dependencies
└── README.md             # This file
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License 