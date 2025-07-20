# PWA Development Rules - Progressive Web App Standards 2025

## Project Overview
This project converts the existing web app **spin-glow-win-it-09** (React + TailwindCSS) into a mobile-ready Progressive Web App (PWA) following 2025 standards.

## PWA Core Requirements - 2025 Standards

### Manifest Requirements
- **MUST** include a valid `manifest.json` with all required fields:
  - `name`, `short_name`, `description`
  - `start_url`, `display: "standalone"`
  - `theme_color`, `background_color`
  - `icons` array with at least 192x192 and 512x512 sizes
  - `orientation` preference
- **MUST** link manifest in `index.html` with `<link rel="manifest" href="/manifest.json">`
- **MUST** include theme-color meta tag: `<meta name="theme-color" content="#your-color">`

### Service Worker Requirements
- **MUST** implement service worker for offline functionality
- **MUST** use `vite-plugin-pwa` with `GenerateSW` strategy for React/Vite projects
- **MUST** cache static assets (JS, CSS, images, audio files)
- **MUST** implement offline fallback pages
- **MUST** handle cache updates and version management

### Icon Requirements
- **MUST** provide icons in multiple sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **MUST** use PNG format for compatibility
- **MUST** store icons in `/public/icons/` directory
- **MUST** include maskable icons for Android adaptive icons
- **SHOULD** provide favicon.ico for legacy browser support

### Mobile Optimization Requirements
- **MUST** be fully responsive across all screen sizes (320px to 1920px+)
- **MUST** include viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **MUST** implement touch-friendly UI elements (minimum 44px touch targets)
- **MUST** optimize for mobile performance (< 3s load time on 3G)

## Technology Stack Constraints

### React + TailwindCSS Integration
- **MUST** maintain existing React component architecture
- **MUST** preserve all TailwindCSS styling and responsive utilities
- **MUST** ensure PWA features don't break existing functionality
- **MUST** use React hooks for PWA state management (install prompts, offline status)

### Vite Configuration
- **MUST** use `vite-plugin-pwa` version 0.17.0 or later
- **MUST** configure workbox options for optimal caching
- **MUST** enable development mode PWA testing
- **MUST** configure proper build output for PWA assets

## Platform-Specific Requirements

### Android Compatibility
- **MUST** support Android 7.0+ (API level 24+)
- **MUST** implement WebAPK installation flow
- **MUST** handle Android back button behavior
- **MUST** support Android splash screens via manifest
- **SHOULD** implement Android-specific features (shortcuts, share target)

### iOS Compatibility  
- **MUST** support iOS 14.0+ and Safari 14+
- **MUST** include Apple-specific meta tags:
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
  - `<meta name="apple-mobile-web-app-title" content="App Name">`
- **MUST** provide Apple touch icons: `<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">`
- **MUST** handle iOS Safari quirks (viewport, safe areas, status bar)

## Implementation Standards

### Code Quality
- **MUST** follow existing React patterns and component structure
- **MUST** use TypeScript if project uses TypeScript
- **MUST** implement proper error handling for PWA features
- **MUST** add comprehensive comments for PWA-specific code
- **MUST** follow existing code formatting and linting rules

### Performance Requirements
- **MUST** achieve Lighthouse PWA score of 90+
- **MUST** maintain existing performance metrics
- **MUST** implement efficient caching strategies
- **MUST** minimize bundle size impact from PWA features
- **SHOULD** implement lazy loading for non-critical PWA features

### Testing Requirements
- **MUST** test PWA functionality across major browsers (Chrome, Safari, Firefox, Edge)
- **MUST** test installation flow on both Android and iOS
- **MUST** test offline functionality thoroughly
- **MUST** verify responsive design on various device sizes
- **MUST** test service worker updates and cache invalidation

## Security and Privacy

### Security Standards
- **MUST** serve over HTTPS in production
- **MUST** implement proper Content Security Policy (CSP)
- **MUST** validate all user inputs in PWA-specific features
- **MUST** secure any new API endpoints for PWA features

### Privacy Compliance
- **MUST** handle push notification permissions properly
- **MUST** respect user privacy preferences
- **MUST** implement proper data handling for offline storage
- **SHOULD** provide clear privacy information for PWA features

## Development Workflow

### File Organization
- **MUST** place PWA assets in `/public/` directory
- **MUST** organize icons in `/public/icons/` subdirectory
- **MUST** keep service worker configuration in `vite.config.ts`
- **MUST** create dedicated components for PWA features (install prompt, offline indicator)

### Version Control
- **MUST** commit PWA configuration files
- **MUST** include generated service worker in version control considerations
- **MUST** document PWA setup in project README
- **SHOULD** tag releases with PWA milestone markers

### Documentation Requirements
- **MUST** document PWA installation instructions
- **MUST** document browser compatibility matrix
- **MUST** document offline functionality scope
- **MUST** document deployment requirements (HTTPS, headers)

## Deployment and Production

### Build Configuration
- **MUST** configure proper build scripts for PWA assets
- **MUST** ensure service worker is properly generated and served
- **MUST** implement proper cache headers for PWA assets
- **MUST** configure server to serve manifest.json with correct MIME type

### Monitoring and Analytics
- **SHOULD** implement PWA-specific analytics (install events, offline usage)
- **SHOULD** monitor service worker performance and errors
- **SHOULD** track PWA adoption and usage metrics

## Future-Proofing

### Emerging Standards
- **SHOULD** prepare for Web App Manifest v3 features
- **SHOULD** consider implementing Web Share API
- **SHOULD** evaluate Background Sync for future implementation
- **SHOULD** monitor new PWA capabilities (File System Access, etc.)

### Maintenance
- **MUST** plan for regular PWA dependency updates
- **MUST** monitor browser compatibility changes
- **MUST** update PWA features based on user feedback
- **SHOULD** evaluate new PWA features annually

## Error Handling and Fallbacks

### Graceful Degradation
- **MUST** ensure app works without service worker support
- **MUST** provide fallbacks for unsupported PWA features
- **MUST** handle service worker registration failures gracefully
- **MUST** implement proper error boundaries for PWA components

### User Experience
- **MUST** provide clear feedback for PWA installation
- **MUST** indicate offline status to users
- **MUST** handle network transitions smoothly
- **SHOULD** provide helpful error messages for PWA issues