# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native music player application built with Expo. The project is currently in its initial state with only the basic Expo boilerplate code.

## Development Commands

### Starting the Development Server
```bash
npm start           # Start Expo development server
npm run android     # Start on Android device/emulator
npm run ios         # Start on iOS device/simulator
npm run web         # Start web development server
```

### Package Management
```bash
npm install         # Install dependencies
```

## Project Structure

```
RN-Music-Player/
├── App.js                 # Main application entry point with layout wrapper
├── index.js               # Entry point that registers the root component
├── app.json               # Expo configuration file
├── package.json           # Dependencies and scripts
├── assets/                # Static assets
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── components/            # Reusable UI components
│   ├── SongItem.js        # Individual song row component
│   ├── PlaylistItem.js    # Individual playlist row component
│   └── TabSwitcher.js     # Tab navigation component
└── screens/               # Screen components
    └── LibraryScreen.js   # Main library screen with song/playlist tabs
```

## Technology Stack

- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo SDK**: ~54.0.20
- **Expo Status Bar**: ~3.0.8

## Architecture Notes

This is currently a fresh Expo project with:
- Cross-platform support (iOS, Android, Web)
- Expo new architecture enabled (`newArchEnabled: true`)
- Edge-to-edge enabled for Android
- Portrait orientation lock

## Development Guidelines

- The project uses Expo's managed workflow
- No custom native code or build configurations present yet
- Standard Expo file structure and conventions
- Assets are configured for adaptive icons on Android and standard icons on iOS

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Use Expo Go app or run on simulator/emulator

## Notes

- This is a greenfield project ready for music player feature development
- No testing framework, linting, or build tools configured yet
- No backend or API integrations implemented
- Ready for implementing audio playback, playlist management, and UI components
- Use Context7 to check up-to-date docs when needed for implementing new libraries or frameworks, or adding features using them.