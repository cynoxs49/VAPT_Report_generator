# VAPT Report Generator

## Development Mode

An application for generating and managing Vulnerability Assessment and Penetration Testing (VAPT) reports.

## The Master Checklist Summary

```
Phase 1  → Install all dependencies ✅
Phase 2  → Create folder structure ✅
Phase 3  → Config files (vite + tsconfig paths) ✅
Phase 4  → Write all TypeScript types
Phase 5  → Write constants/enums
Phase 6  → Create dummy data
Phase 7  → Setup Axios
Phase 8  → Zustand stores (shells)
Phase 9  → React Router setup
Phase 10 → API function shells
Phase 11 → Build pages and components
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Query** - Server state management
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── findings/      # Finding-related components
│   ├── layout/        # Layout components
│   ├── preview/       # Preview components
│   └── ui/            # UI primitives
├── pages/             # Page components
├── stores/            # Zustand stores (auth, findings, projects, ui)
├── hooks/             # Custom React hooks
├── lib/               # Utilities (axios, queryClient)
├── types/             # TypeScript type definitions
├── constants/         # Enums and constants
├── assets/            # Static assets
└── api/               # API integration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Features

- Dashboard for VAPT project management
- Finding documentation and organization
- Report preview functionality
- Secure authentication
- Auto-save capabilities
- Responsive UI
