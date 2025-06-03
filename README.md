# 🏍️ MotoSpin

A Next.js application for discovering random motorcycles and saving your favorites. Built with TypeScript, Material-UI, and Firebase.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **API**: API Ninjas Motorcycles API
- **Styling**: Material-UI + CSS Modules

## 📁 Project Structure

This project follows Next.js 14 App Router conventions:

```
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API routes
│   │   └── health/        # Health check endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   │   ├── AuthForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserProfile.tsx
│   │   └── index.ts      # Barrel exports
│   ├── motorcycle/       # Motorcycle-related components
│   │   ├── MotorcycleCard.tsx
│   │   └── index.ts
│   ├── ui/               # Generic UI components
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   └── index.ts          # Main component exports
├── contexts/             # React Context providers
│   ├── AuthContext.tsx
│   └── MotorcycleContext.tsx
├── hooks/                # Custom React hooks
│   └── useAuthForm.ts
├── lib/                  # Utility libraries and configurations
│   ├── api.ts           # API configuration
│   └── firebase.ts      # Firebase configuration
├── public/              # Static assets
│   └── favicon.ico
├── services/            # Business logic and external services
│   └── motorcycleService.ts
├── types/               # TypeScript type definitions
│   └── motorcycle.ts
├── utils/               # Utility functions and constants
│   └── constants.ts
├── .env.local          # Environment variables (not tracked)
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- API Ninjas account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_NINJAS_KEY=your_api_ninjas_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Features

- 🔐 Firebase Authentication (Email/Password & Google)
- 🏍️ Random motorcycle discovery
- ⭐ Save favorite motorcycles
- 📱 Responsive design with Material-UI
- 🔒 Protected routes
- 🔄 Real-time data synchronization

## 🏗️ Architecture

### App Router Structure
- Uses Next.js 14 App Router for modern React patterns
- Server and Client Components properly separated
- API routes in `app/api/` directory

### Component Organization
- Components organized by feature/domain
- Barrel exports for clean imports
- Proper TypeScript interfaces

### State Management
- React Context for global state
- Custom hooks for reusable logic
- Firebase for data persistence

### Styling
- Material-UI for consistent design system
- Custom theming support
- Responsive breakpoints

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Material-UI Documentation](https://mui.com/) - comprehensive component library
- [Firebase Documentation](https://firebase.google.com/docs) - backend services

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
