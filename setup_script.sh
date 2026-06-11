#!/bin/bash
set -e

mkdir -p .husky
mkdir -p client/public/{fonts,images}
mkdir -p client/src/app/\(auth\) client/src/app/\(dashboard\) client/src/app/\(marketing\) client/src/app/api/auth/\[...nextauth\]
mkdir -p client/src/components/{ui,layout,forms,dashboard,upload,notebook,history,subscription,admin}
mkdir -p client/src/{hooks,lib,store,types,styles}
mkdir -p server/src/{config,controllers,middleware,models,routes,services,utils,types}

cat << 'EOF' > package.json
{
  "name": "handnote-ai-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "test": "turbo run test",
    "prepare": "husky install"
  },
  "devDependencies": {
    "eslint": "^8",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0",
    "turbo": "^1.10.0"
  }
}
EOF

cat << 'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "public/dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
EOF

cat << 'EOF' > .eslintrc.json
{
  "root": true,
  "env": {
    "node": true,
    "es2021": true
  },
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "import"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "import/order": ["error", { "alphabetize": { "order": "asc" } }]
  },
  "overrides": [
    {
      "files": ["client/**/*.ts", "client/**/*.tsx"],
      "env": {
        "browser": true
      },
      "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "next/core-web-vitals"
      ]
    }
  ]
}
EOF

cat << 'EOF' > .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

cat << 'EOF' > .gitignore
# Dependency directories
node_modules/

# Next.js build output
.next/
out/
build/

# Server build output
dist/

# Environment variables
.env
.env.*
!.env.example
!.env.local.example

# OS Files
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Uploads/Coverage
uploads/
coverage/
EOF

cat << 'EOF' > .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

cat << 'EOF' > .lintstagedrc.json
{
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,css}": [
    "prettier --write"
  ]
}
EOF

cat << 'EOF' > .env.example
NODE_ENV=development
EOF

cat << 'EOF' > README.md
# HandNote AI

```text
  _   _                 _ _   _       _         _    ___ 
 | | | | __ _ _ __   __| | \ | | ___ | |_ ___  / \  |_ _|
 | |_| |/ _` | '_ \ / _` |  \| |/ _ \| __/ _ \/ _ \  | | 
 |  _  | (_| | | | | (_| | |\  | (_) | ||  __/ ___ \ | | 
 |_| |_|\__,_|_| |_|\__,_|_| \_|\___/ \__\___/_/   \_\___|
```

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

## Project Overview
HandNote AI allows students to upload assignment questions (PDF, DOCX, or images). The system extracts the questions using OCR, sends them to OpenAI for answer generation, and renders the answers onto realistic handwritten notebook-style pages. The final output is a downloadable PDF.

## Features
- OCR for extracting text from assignments
- AI-powered answer generation via OpenAI
- Realistic handwritten rendering
- Custom handwriting profiles
- Downloadable PDF exports
- Subscription and credit management

## Prerequisites
- Node.js 18+
- MongoDB
- npm 9+
- OpenAI API Key

## Installation
1. Clone the repository
2. Run `npm install` in the root to install all monorepo dependencies.

## Environment Setup
1. Copy `.env.example` to `.env` in the root.
2. Copy `client/.env.local.example` to `client/.env.local` and fill in values.
3. Copy `server/.env.example` to `server/.env` and fill in values.

## Running Dev Servers
Run the following command from the root directory to start both client (localhost:3000) and server (localhost:5000):
```bash
npm run dev
```

## Project Structure
- `/client`: Next.js frontend
- `/server`: Node.js Express backend

## API Documentation
API docs will be available at `http://localhost:5000/api/docs` (Swagger placeholder).

## Contributing
Please read CONTRIBUTING.md (placeholder) for details on our code of conduct, and the process for submitting pull requests to us.

## License
MIT License
EOF

cat << 'EOF' > client/package.json
{
  "name": "client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.0.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.290.0",
    "next": "14",
    "react": "18",
    "react-dom": "18",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.48.0",
    "react-hot-toast": "^2.4.1",
    "react-query": "^3.39.3",
    "tailwind-merge": "^2.0.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.6"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.0.0",
    "eslint-config-next": "14",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}
EOF

cat << 'EOF' > client/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "next.config.ts"],
  "exclude": ["node_modules"]
}
EOF

cat << 'EOF' > client/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        notebook: {
          cream: '#fefce8',
          'line-blue': '#bfdbfe',
          'margin-red': '#fca5a5',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        }
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        kalam: ['Kalam', 'cursive'],
        patrick: ['Patrick Hand', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        notebook: '2px',
      },
      boxShadow: {
        'notebook-page': '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
};

export default config;
EOF

cat << 'EOF' > client/next.config.ts
import type { NextConfig } from 'next';

/**
 * Next.js Configuration for HandNote AI
 * 
 * Future Features to be added:
 * - Image optimization configurations (formats, sizes)
 * - Bundle analysis plugins integration
 * - Security headers configuration
 * - Internationalization (i18n) setup
 * - PWA configurations
 */
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'your-s3-bucket-domain.s3.amazonaws.com',
      //   pathname: '/**',
      // }
    ],
  },
  async redirects() {
    return [
      // Authentication redirects handled client-side via middleware.ts usually,
      // but if server-side auth check is available at root:
      // {
      //   source: '/',
      //   has: [{ type: 'cookie', key: 'token' }], // example
      //   destination: '/dashboard',
      //   permanent: false,
      // },
    ];
  },
};

export default nextConfig;
EOF

cat << 'EOF' > client/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

cat << 'EOF' > client/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HandNote AI
EOF

cat << 'EOF' > client/public/fonts/placeholder.txt
// Placeholder for handwriting fonts (e.g., Caveat, Kalam, Patrick Hand)
EOF

cat << 'EOF' > client/public/images/placeholder.txt
// Static images, logos, og-image will go here
EOF

touch client/public/favicon.ico

cat << 'EOF' > client/src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Add base styles here */
}
EOF

cat << 'EOF' > client/src/app/layout.tsx
/**
 * Root layout for the application.
 * Will contain ThemeProvider, AuthProvider, and ToastProvider.
 */
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* TODO: Add Providers here */}
        {children}
      </body>
    </html>
  );
}
EOF

# UI Components
for comp in Button Input Modal Badge Card Tooltip Spinner; do
cat << EOF > client/src/components/ui/${comp}.tsx
/**
 * Base UI Component: ${comp}
 * Reusable primitive built with Tailwind variants and accessible HTML.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} component
  return <div>${comp} Component Placeholder</div>;
};
EOF
done

# Layout Components
for comp in Header Sidebar Footer MobileNav PageWrapper; do
cat << EOF > client/src/components/layout/${comp}.tsx
/**
 * Layout Component: ${comp}
 * Structural component used across multiple pages.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} layout
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Form Components
for comp in LoginForm RegisterForm UploadForm HandwritingUploadForm; do
cat << EOF > client/src/components/forms/${comp}.tsx
/**
 * Form Component: ${comp}
 * Handles user input, validation via react-hook-form + zod, and submission.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} logic
  return <form>${comp} Form Placeholder</form>;
};
EOF
done

# Dashboard Components
for comp in DashboardStats RecentAssignments CreditMeter; do
cat << EOF > client/src/components/dashboard/${comp}.tsx
/**
 * Dashboard Component: ${comp}
 * Displays user specific data and stats in the dashboard.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} UI
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Upload Components
for comp in FileDropzone UploadProgress FilePreview; do
cat << EOF > client/src/components/upload/${comp}.tsx
/**
 * Upload Component: ${comp}
 * Sub-components for the assignment file upload flow.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} logic
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Notebook Components
for comp in NotebookPreview PageRenderer HandwritingSelector; do
cat << EOF > client/src/components/notebook/${comp}.tsx
/**
 * Notebook Component: ${comp}
 * Renders the realistic handwritten output on ruled pages.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} rendering logic
  return <div>${comp} Placeholder</div>;
};
EOF
done

# History Components
for comp in AssignmentCard AssignmentList FilterBar; do
cat << EOF > client/src/components/history/${comp}.tsx
/**
 * History Component: ${comp}
 * Shows past generated assignments with filtering and pagination.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} list/filtering
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Subscription Components
for comp in PricingCard CreditBadge UpgradeModal; do
cat << EOF > client/src/components/subscription/${comp}.tsx
/**
 * Subscription Component: ${comp}
 * Manages user credits and SaaS subscription plans.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} view
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Admin Components
for comp in AdminUserTable AdminStats AdminLogs; do
cat << EOF > client/src/components/admin/${comp}.tsx
/**
 * Admin Component: ${comp}
 * Restricted views for platform administrators.
 */
export const ${comp} = () => {
  // TODO: Implement ${comp} management
  return <div>${comp} Placeholder</div>;
};
EOF
done

# Routes
for route in "\(auth\)/login" "\(auth\)/register" "\(auth\)/forgot-password" "\(dashboard\)/dashboard" "\(dashboard\)/upload" "\(dashboard\)/history" "\(dashboard\)/settings" "\(marketing\)/landing" "\(marketing\)/pricing" "\(marketing\)/about"; do
mkdir -p client/src/app/${route}
cat << EOF > client/src/app/${route}/page.tsx
/**
 * Route: ${route}
 * Page component representing the ${route} view.
 */
export default function Page() {
  // TODO: Assemble ${route} page components
  return <div>${route} Page Placeholder</div>;
}
EOF
done

# App API routes
cat << 'EOF' > client/src/app/api/auth/[...nextauth]/route.ts
/**
 * Next.js API Route for NextAuth.js (or similar proxy auth)
 * Handles authentication callbacks.
 */
export async function GET() {
  return new Response("Auth Callback Placeholder");
}
export async function POST() {
  return new Response("Auth Callback Placeholder");
}
EOF

# Hooks
for hook in useAuth useUpload useAssignment useToast useTheme useDebounce useLocalStorage; do
cat << EOF > client/src/hooks/${hook}.ts
/**
 * Custom Hook: ${hook}
 * Encapsulates reusable React state and side effects.
 */
export const ${hook} = () => {
  // TODO: Implement ${hook} logic
  return {};
};
EOF
done

# Lib
cat << 'EOF' > client/src/lib/api.ts
/**
 * Axios instance with interceptors, base URL, auth header injection
 */
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
// TODO: Add request/response interceptors
EOF

cat << 'EOF' > client/src/lib/auth.ts
/**
 * Auth helper functions (e.g. token extraction, role checks)
 */
export const isAuthenticated = () => {
  // TODO: Implement auth check
  return false;
};
EOF

cat << 'EOF' > client/src/lib/utils.ts
/**
 * General utility functions (e.g. clsx + tailwind-merge)
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

cat << 'EOF' > client/src/lib/validators.ts
/**
 * Zod schemas for form validation across the client
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
// TODO: Add more validation schemas
EOF

cat << 'EOF' > client/src/lib/constants.ts
/**
 * App-wide constants (routes, limits, config values)
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
};

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
EOF

# Stores
cat << 'EOF' > client/src/store/authStore.ts
/**
 * Zustand store: User auth state
 */
import { create } from 'zustand';

interface AuthState {
  user: null | { id: string; name: string };
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
EOF

cat << 'EOF' > client/src/store/uploadStore.ts
/**
 * Zustand store: Upload and processing state
 */
import { create } from 'zustand';

interface UploadState {
  progress: number;
  setProgress: (val: number) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));
EOF

cat << 'EOF' > client/src/store/uiStore.ts
/**
 * Zustand store: UI state (sidebar open, theme, modals)
 */
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
EOF

# Types
for type in user assignment handwriting subscription api; do
cat << EOF > client/src/types/${type}.ts
/**
 * TypeScript definitions for ${type} entity
 */
export interface ${type^} {
  id: string;
  // TODO: Complete ${type} interface properties
}
EOF
done

# Styles
cat << 'EOF' > client/src/styles/notebook.css
/**
 * Notebook page specific styles (lines, margins, textures)
 */
.notebook-page {
  /* TODO: Add CSS for ruled lines and margins */
}
EOF

# Server Files
cat << 'EOF' > server/package.json
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.4",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "sharp": "^0.32.6",
    "uuid": "^9.0.1",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/mongoose": "^5.11.97",
    "@types/morgan": "^1.9.9",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.9.0",
    "@types/nodemailer": "^6.4.14",
    "@types/passport": "^1.0.15",
    "@types/passport-google-oauth20": "^2.0.14",
    "@types/uuid": "^9.0.7",
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
EOF

cat << 'EOF' > server/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "index.ts"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOF

cat << 'EOF' > server/.env.example
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/handnote_ai
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=./uploads
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
EMAIL_FROM=noreply@handnoteai.com
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EOF

cat << 'EOF' > server/index.ts
/**
 * Server entry point (listen, graceful shutdown)
 */
import app from './src/app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TODO: Implement graceful shutdown for SIGTERM/SIGINT
EOF

cat << 'EOF' > server/src/app.ts
/**
 * Express app setup (middleware registration, route mounting)
 */
import express from 'express';

const app = express();

// TODO: Apply middleware (cors, helmet, rate-limiter, morgan)
// TODO: Mount routes

export default app;
EOF

cat << 'EOF' > server/src/config/db.ts
/**
 * MongoDB connection with retry logic
 */
export const connectDB = async () => {
  // TODO: Implement mongoose.connect with retry
};
EOF

cat << 'EOF' > server/src/config/env.ts
/**
 * Validated environment config using zod
 */
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  // TODO: Add other env variables
});

export const env = envSchema.parse(process.env);
EOF

cat << 'EOF' > server/src/config/cors.ts
/**
 * CORS configuration settings
 */
export const corsOptions = {
  // TODO: Configure allowed origins and methods
};
EOF

cat << 'EOF' > server/src/config/multer.ts
/**
 * Multer configuration for file uploads (limits, storage options)
 */
export const uploadConfig = {
  // TODO: Setup local or memory storage for multer
};
EOF

# Controllers
cat << 'EOF' > server/src/controllers/authController.ts
/**
 * Controller: authController
 * Purpose: Login, register, google OAuth, refresh, logout
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/uploadController.ts
/**
 * Controller: uploadController
 * Purpose: File upload and OCR trigger
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/assignmentController.ts
/**
 * Controller: assignmentController
 * Purpose: Create, get, list, delete assignments
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/handwritingController.ts
/**
 * Controller: handwritingController
 * Purpose: Upload and manage handwriting profiles
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/exportController.ts
/**
 * Controller: exportController
 * Purpose: PDF export and download
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/subscriptionController.ts
/**
 * Controller: subscriptionController
 * Purpose: Plans, credits, upgrades
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

cat << 'EOF' > server/src/controllers/adminController.ts
/**
 * Controller: adminController
 * Purpose: Admin user and system management
 * Handles incoming requests, interacts with services, and returns responses.
 */
import { Request, Response } from 'express';

export const handleRequest = async (req: Request, res: Response) => {
  // TODO: Implement controller logic
  res.send('Not implemented');
};
EOF

# Middleware
cat << 'EOF' > server/src/middleware/authMiddleware.ts
/**
 * Middleware: authMiddleware
 * Purpose: JWT verification, role checking
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

cat << 'EOF' > server/src/middleware/rateLimitMiddleware.ts
/**
 * Middleware: rateLimitMiddleware
 * Purpose: Per-route rate limiting with express-rate-limit
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

cat << 'EOF' > server/src/middleware/validateMiddleware.ts
/**
 * Middleware: validateMiddleware
 * Purpose: Request body validation with zod
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

cat << 'EOF' > server/src/middleware/uploadMiddleware.ts
/**
 * Middleware: uploadMiddleware
 * Purpose: File type/size validation
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

cat << 'EOF' > server/src/middleware/errorMiddleware.ts
/**
 * Middleware: errorMiddleware
 * Purpose: Global error handler
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

cat << 'EOF' > server/src/middleware/loggerMiddleware.ts
/**
 * Middleware: loggerMiddleware
 * Purpose: Request logging with morgan
 */
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement middleware logic
  next();
};
EOF

# Models
cat << 'EOF' > server/src/models/User.ts
/**
 * Mongoose Model: User
 * Purpose: User schema for authentication and profile
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const User = mongoose.model('User', schema);
EOF

cat << 'EOF' > server/src/models/Assignment.ts
/**
 * Mongoose Model: Assignment
 * Purpose: Assignment schema storing extracted text and generated answers
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const Assignment = mongoose.model('Assignment', schema);
EOF

cat << 'EOF' > server/src/models/HandwritingProfile.ts
/**
 * Mongoose Model: HandwritingProfile
 * Purpose: Handwriting profile schema mapping user fonts/styles
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const HandwritingProfile = mongoose.model('HandwritingProfile', schema);
EOF

cat << 'EOF' > server/src/models/Subscription.ts
/**
 * Mongoose Model: Subscription
 * Purpose: Subscription schema tracking user plans and billing
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const Subscription = mongoose.model('Subscription', schema);
EOF

cat << 'EOF' > server/src/models/CreditTransaction.ts
/**
 * Mongoose Model: CreditTransaction
 * Purpose: Credit usage log for auditing tokens spent
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const CreditTransaction = mongoose.model('CreditTransaction', schema);
EOF

cat << 'EOF' > server/src/models/AuditLog.ts
/**
 * Mongoose Model: AuditLog
 * Purpose: Admin audit log for sensitive system actions
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // TODO: Define schema fields
});

export const AuditLog = mongoose.model('AuditLog', schema);
EOF

# Routes
for route in authRoutes uploadRoutes assignmentRoutes handwritingRoutes exportRoutes subscriptionRoutes adminRoutes; do
cat << EOF > server/src/routes/${route}.ts
/**
 * Express Route Map: ${route}
 * Binds endpoints to corresponding controller methods.
 */
import { Router } from 'express';

const router = Router();
// TODO: Define routes (e.g., router.get('/', controller))

export default router;
EOF
done

# Services
cat << 'EOF' > server/src/services/ocrService.ts
/**
 * Service: ocrService
 * Purpose: Tesseract OCR integration for extracting text from images/PDFs
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/openaiService.ts
/**
 * Service: openaiService
 * Purpose: OpenAI API integration for answering assignment questions
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/notebookService.ts
/**
 * Service: notebookService
 * Purpose: Logic to compose and render text onto notebook pages
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/handwritingService.ts
/**
 * Service: handwritingService
 * Purpose: Handles handwriting style parameters and font application
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/pdfService.ts
/**
 * Service: pdfService
 * Purpose: PDFKit or Puppeteer logic to stitch images into a final PDF
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/storageService.ts
/**
 * Service: storageService
 * Purpose: File storage abstraction (local disk or AWS S3)
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

cat << 'EOF' > server/src/services/emailService.ts
/**
 * Service: emailService
 * Purpose: Email notification dispatch via nodemailer
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {
  // TODO: Implement service logic
};
EOF

# Utils
cat << 'EOF' > server/src/utils/asyncHandler.ts
/**
 * Utility: Async error wrapper
 * Catches rejected promises in controllers and passes them to next(err)
 */
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
EOF

cat << 'EOF' > server/src/utils/ApiError.ts
/**
 * Utility: Custom API Error class
 * Standardizes error status codes and messages.
 */
export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
EOF

cat << 'EOF' > server/src/utils/ApiResponse.ts
/**
 * Utility: Standardized API response helper
 */
export class ApiResponse {
  constructor(public statusCode: number, public data: any, public message: string = "Success") {}
}
EOF

cat << 'EOF' > server/src/utils/logger.ts
/**
 * Utility: Winston logger configuration
 */
export const logger = {
  info: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
  // TODO: Integrate winston fully
};
EOF

cat << 'EOF' > server/src/utils/tokenUtils.ts
/**
 * Utility: JWT generation and verification helpers
 */
export const generateToken = (userId: string) => {
  // TODO: Implement jwt.sign
  return 'token';
};
EOF

cat << 'EOF' > server/src/utils/fileUtils.ts
/**
 * Utility: File validation, cleanup helpers
 */
export const deleteFile = async (path: string) => {
  // TODO: Implement fs.unlink
};
EOF

# Types
cat << 'EOF' > server/src/types/express.d.ts
/**
 * Extend Express Request to include custom properties (like authenticated user info)
 */
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any; // TODO: Replace 'any' with actual User type
    }
  }
}
EOF

cat << 'EOF' > server/src/types/index.ts
/**
 * Shared server-side type definitions
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
EOF
