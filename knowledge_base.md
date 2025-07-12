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
| 2025-07-12 | Functionality and Performance Enhancements (d2a5955) | Implemented general code changes to enhance functionality and improve performance. |
| 2025-07-12 | Post-Spin UI Updates (d67659f)                       | Replaced "Spin Now" with "Next Player" button and added redirection to form page. |
| 2025-07-12 | SpinnerSegment Type Fix (af1c282)                    | Fixed a type mismatch for `SpinnerSegment` in `SpinnerPage.tsx`.              |
| 2025-07-11 | Supabase Schema Migration (012174e)                  | Created database tables and initial data.                                     |
| 2025-07-11 | Supabase Project Connection (b077575)                | Added Supabase configuration and types.                                       |
| 2025-07-11 | Spinner Button and Flow Refactor (8a856de)           | Consolidated UI and improved user flow for the spinner.                       |
| 2025-07-11 | Initial Commit (367af92)                             | Initial commit from remix.                                                    |

> 🕓 *Update this table regularly as new features or fixes are added.*

---

#### 5. **AI Agent Guidance Notes (Optional)**

* This file is meant to help AI agents and contributors onboard quickly.
* Reference it whenever introducing a new feature or debugging context-sensitive issues.
* Use clear naming conventions, and keep descriptions concise but informative.

---
