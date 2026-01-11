# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GAS4U** is a Chrome Extension (Manifest V3) that provides an AI-assisted development environment for Google Apps Script (GAS). It features a Monaco Editor-based code editor with Gemini AI integration for code generation, explanation, and refactoring.

**Key Technologies:**
- React 18, TypeScript, Tailwind CSS
- Vite + @crxjs/vite-plugin for Chrome extension builds
- Monaco Editor for code editing
- Gemini API for AI features
- Google Apps Script API for project management

## Language Policy
- **User communication**: Japanese
- **Code comments**: English
- **Commit messages**: English
- **Documentation**: docs/以下の *.md は、既に日本語のものは継続して日本語で記述する

## Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build the extension
npm run build

# Run all quality checks
npm run check

# Preview built extension
npm run preview
```

### Taskfile Commands
```bash
# Install dependencies
task setup

# Development server
task dev

# Build extension
task build

# Type checking
task type-check

# Linting
task lint

# Run tests
task test

# Fix linting issues
task lint-fix

# Format code
task format

# Clean build artifacts
task clean
```

### Running Tests
```bash
# Run all tests
npm run test

# Run specific test file
npx vitest run src/lib/storage/manager.test.ts

# Test with coverage
npx vitest run --coverage
```

## Project Architecture

### Core Components

**Main Applications:**
- `src/popup/App.tsx` - Extension popup for API key management
- `src/editor/index.tsx` - Main editor interface with Monaco Editor
- `src/background/index.ts` - Service worker (background processes)

**Core Libraries (`src/lib/`):**
- `gemini/client.ts` - Gemini AI client for code generation and explanation
- `clasp/manager.ts` - GAS project management (load/save operations)
- `clasp/api.ts` - Google Apps Script API integration
- `storage/manager.ts` - Chrome storage management

**UI Components (`src/components/`):**
- `DiffViewer.tsx` - Visual diff viewer for code changes
- `PromptInput.tsx` - AI prompt input interface

**Type Definitions (`src/types/`):**
- `index.ts` - Core type definitions for the application

### Build Process
1. TypeScript compilation with strict checking
2. Vite bundling with Chrome extension optimizations
3. Output to `dist/` directory for Chrome extension loading

### Chrome Extension Structure
- Manifest V3 configuration
- Content scripts for editor integration
- Background service worker for authentication
- Popup window for settings

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration (modern React + TypeScript rules)
- Use Prettier for consistent formatting
- Prefer functional components with hooks

### Testing Strategy
- Use Vitest with JSDOM environment
- Mock Chrome APIs for extension-specific functionality
- Test both unit and integration scenarios

### Chrome Extension Best Practices
- Secure storage of API keys using Chrome storage
- Proper manifest permissions
- Handle extension lifecycle events appropriately
- Use content scripts for DOM manipulation

### AI Integration
- Gemini API integration for code generation
- Handle API errors gracefully
- Implement rate limiting considerations
- Secure API key storage and management

## Important Files

### Configuration
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Code formatting rules
- `Taskfile.yml` - Development task automation

### Key Source Files
- `src/background/index.ts` - Service worker implementation
- `src/popup/App.tsx` - Settings popup
- `src/editor/index.tsx` - Main editor component
- `src/lib/gemini/client.ts` - AI client
- `src/lib/clasp/manager.ts` - GAS project management

### Documentation
- `README.md` - User-facing documentation
- `docs/` - Technical documentation

## Testing Notes

### Test Environment
- Vitest with JSDOM environment for DOM-based testing
- Chrome API mocking for extension functionality
- Test files located alongside source files with `.test.ts` extension

### Test Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npx vitest

# Run specific test
npx vitest run src/lib/storage/manager.test.ts
```

## Chrome Extension Development

### Loading in Chrome
1. Build the extension: `npm run build`
2. Open Chrome extensions: `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select `dist/` directory

### Debugging
- Use Chrome DevTools for popup and content scripts
- Background service worker logs in "Inspect views"
- Content script debugging through page DevTools

## AI Features Implementation

### Gemini Integration
- API key storage in Chrome storage
- Code generation, explanation, and refactoring
- Error handling for API failures
- Rate limiting considerations

### Code Generation Flow
1. User inputs prompt in editor
2. Gemini API generates code suggestions
3. Diff viewer displays changes
4. User accepts/rejects changes
5. Code is applied to Monaco Editor

## Storage Management

### Chrome Storage Usage
- Secure API key storage
- User preferences and settings
- Project state management
- Extension-specific data persistence

### Storage Manager Location
- `src/lib/storage/manager.ts` - Main storage interface
- Handles Chrome storage operations with error handling
