### 📘 `knowledge_base.md` — Project Knowledge Base

---

#### 1. **Project Overview**

* **Project Name:** spin-glow-win-it-09
* **Purpose:** A web application that allows users to spin a wheel to win prizes.
* **Description:** This project is a React-based web application that features a spinning wheel game. It uses Supabase for backend services, including database storage and authentication. The frontend is built with Vite, React, and Shadcn UI components.
* **Tech Stack:** React, Vite, TypeScript, Shadcn UI, Supabase, Tailwind CSS
* **Target Platform (Web/Mobile/Desktop):** Web
* **Primary Users:** General users looking for a fun, interactive game.

---

#### 2. **Essential Files**

| File/Folder                   | Purpose/Description                                      |
| ----------------------------- | ---------------------------------------------------------- |
| `index.html`                  | Entry point for the frontend application.                  |
| `src/main.tsx`                | Core logic and functionality, renders the React app.       |
| `src/App.tsx`                 | Main application component, handles routing.               |
| `src/index.css`               | Global styling and layout rules.                           |
| `vite.config.ts`              | Vite configuration for the development and build process.  |
| `supabase/`                   | Supabase configuration and database migrations.            |
| `src/components/`             | Reusable UI components.                                    |
| `src/pages/`                  | View pages/screens for different routes.                   |
| `src/services/`               | Services for interacting with backend APIs.                |
| `src/integrations/supabase/`  | Handles all Supabase-related API functions and types.      |
| `public/audio/`               | Contains audio assets for the application.                 |
| `public/manifest.json`        | PWA manifest file for installable app experience.          |
| `src/components/PWA/`         | Components related to PWA functionality (e.g., install prompt). |
| `src/hooks/useAudioManager.ts` | Custom hook for managing audio playback.                   |
| `src/components/NewResultPopup.tsx` | Custom animated result popup component.              |

> ✏️ *Add or remove files based on actual project structure.*

---

#### 3. **App Features & Functionality**

* [x] User registration and authentication.
* [x] Spinning wheel game with configurable segments.
* [x] Result popup displaying the winning prize.
* [x] Admin dashboard for managing users and prizes.
* [x] Form for users to enter their details to participate.
* [x] Supabase integration for data persistence.

---

#### 4. **Development Timeline / Milestone Tracker**

| Date       | Feature/Update                                       | Notes or Context                                                              |
| ---------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| 2025-07-22 | Notification Banner Styling (5c30d78)                | Changed the styling of the notification banner.                               |
| 2025-07-22 | PWA Prompt Styling & Asset Compression (249e89a)     | Restyled PWA install prompt and configured Vite for Gzip/Brotli compression.  |
| 2025-07-22 | Performance Optimization (c9078d2)                   | Implemented lazy loading, compressed assets, optimized font loading, memoized UI components, and enhanced PWA capabilities. |
| 2025-07-21 | PWA Support for Offline Access (af5cce1)             | Transformed application into a PWA with service worker, manifest, and meta tags. |
| 2025-07-20 | PWA Development Rules and Workflow (cd6e273)         | Added documentation for PWA development rules and conversion workflow.        |
| 2025-07-19 | Animation Implementation (faae170, 8bc7c57, a30f109) | Integrated Framer Motion for UI animations and updated workflow files.        |
| 2025-07-17 | Audio Experience (64cc670, 361d65a, 0958368, 90612ce, 9f2f46f) | Implemented "Start Experience" overlay, added audio files, winning sound effects, and background music with toggle. |
| 2025-07-16 | Terms & Conditions and Admin UI (747796e, 1e2b028) | Added Terms & Conditions, and updated admin password timing and UI.           |
| 2025-07-15 | UI and UX Refinements (0adf52c, 87391ae, cdf7413)    | Implemented a custom animated result popup, simplified navigation, and improved responsiveness. |
| 2025-07-14 | Spinner Result Fix (6b2d70e)                         | Fixed mismatch between spinner result and popup reward.                       |
| 2025-07-14 | State Management Cleanup (efd5c35)                   | Removed localStorage tracking and cleaned up state updates.                   |
| 2025-07-14 | Spinner Animation and State Refactor (2d9d96e)       | Adjusted spin animation timing and cleaned up state management.               |
| 2025-07-14 | Spinner Visuals and Layout (b7d3fa6, b3ec97e)        | Enhanced spinner design with icons and improved visual alignment.             |
| 2025-07-13 | Spinner Page Refactor (3ce654c)                      | Modularized `SpinnerPage` and added a loading spinner.                        |
| 2025-07-13 | Styling and Configuration (39e394d)                  | Updated gradient classes and enhanced Tailwind CSS configuration.             |
| 2025-07-12 | Functionality and Performance Enhancements (d2a5955) | Implemented general code changes to enhance functionality and improve performance. |
| 2025-07-12 | Post-Spin UI Updates (d67659f)                       | Replaced "Spin Now" with "Next Player" button and added redirection to form page. |
| 2025-07-12 | SpinnerSegment Type Fix (af1c282)                    | Fixed a type mismatch for `SpinnerSegment` in `SpinnerPage.tsx`.              |
| 2025-07-11 | Supabase Schema Migration (012174e)                  | Created database tables and initial data.                                     |
| 2025-07-11 | Supabase Project Connection (b077575)                | Added Supabase configuration and types.                                       |
| 2025-07-11 | Spinner Button and Flow Refactor (8a856de)           | Consolidated UI and improved user flow for the spinner.                       |
| 2025-07-11 | Initial Commit (367af92)                             | Initial commit from remix.                                                    |
> 🕓 *Update this table regularly as new features or fixes are added.*

---

#### 5. **Recent Updates**

*   **Notification Banner Styling**:
    *   The styling of the notification banner has been updated.
*   **PWA Prompt Styling & Asset Compression**:
    *   The PWA install prompt has been restyled into a fixed banner at the top of the screen, using the application's theme colors and gradients.
    *   The Vite configuration now uses `vite-plugin-compression` to generate Gzip (.gz) and Brotli (.br) compressed assets during the build process, reducing bundle sizes and improving load times.
    *   A redundant text color class was removed from the `FormPage` title for style consistency.
*   **Performance Optimization**:
    *   `React.lazy` was implemented for `FormPage`, `SpinnerPage`, and `AdminPage` to code-split the application, reducing initial bundle size.
    *   `vite-plugin-compression` was configured to create gzipped versions of assets.
    *   Google Fonts stylesheet is preloaded in `index.html` to prevent blocking rendering.
    *   `Card` and its sub-components are wrapped with `React.memo` to prevent unnecessary re-renders.
    *   A `manifest.json` and `mobile-web-app-capable` meta tag were added to enhance PWA capabilities.
*   **PWA Support for Offline Access**:
    *   The application has been transformed into a Progressive Web App (PWA), enabling offline functionality and installation on user devices.
    *   `vite-plugin-pwa` was added to generate a service worker and manifest file.
    *   The web app manifest was configured with app icons, name, and theme colors.
    *   Necessary PWA meta tags were included in `index.html`.
    *   A `PwaUpdater` component was created for new version notifications.
    *   `vite-plugin-mkcert` was added for local HTTPS development.
*   **PWA Development Rules and Workflow**:
    *   Documentation for PWA development rules and conversion workflow was added.
*   **Animation Implementation**:
    *   Integrated the Framer Motion library to introduce animations throughout the application.
    *   Updated the animation workflow and rules to streamline the implementation of new animations.
*   **Audio Experience**:
    *   Implemented a "Start Experience" overlay on the Spinner Page to comply with browser autoplay policies for audio.
    *   Added background music, spin, and win sound effects to enhance the user experience.
    *   Integrated a mute toggle for audio control.
*   **Spinner Result Synchronization**: Fixed a critical bug where the reward displayed in the result popup did not match the segment the spinner visually landed on. The spin animation is now correctly synchronized with the calculated winning segment.
*   **State Management Overhaul**: Removed the use of `localStorage` for tracking offer distribution, making the Supabase database the single source of truth for spin results. This simplifies state management and prevents data inconsistencies.
*   **UI and UX Enhancements**:
    *   The spinner wheel design has been updated with a more premium look, including icons for each segment and improved visual alignment.
    *   The `SpinnerPage` has been refactored into smaller, modular components, and a loading spinner has been added to improve the user experience.
    *   The post-spin UI has been updated to replace the "Spin Now" button with a "Next Player" button, which redirects to the user details form.
*   **Code Refinements**:
    *   The project's Tailwind CSS configuration has been enhanced with updated gradient classes.
    *   The `SpinnerPage` and `SpinnerWheel` components have been refactored for better code organization and readability.
*   **Terms & Conditions**:
    *   Added a Terms & Conditions page to the application.
*   **Admin Panel**:
    *   The admin password expiry time has been updated.
    *   The reset icon has been replaced with a trash icon for better clarity.
*   **Result Popup**:
    *   A new custom animated result popup has been implemented for a better user experience.

#### 6. **AI Agent Guidance Notes (Optional)**

* This file is meant to help AI agents and contributors onboard quickly.
* Reference it whenever introducing a new feature or debugging context-sensitive issues.
* Use clear naming conventions, and keep descriptions concise but informative.

---
