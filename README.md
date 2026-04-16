# ready2Wheel — Premium Vehicle Rental Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Firebase-10-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" />
</div>

---

## 1. Project Overview

**ready2Wheel** is a full-featured, production-ready vehicle rental platform built for the Indian market. Users can discover cars, bikes, scooters, cycles, trucks, and vans near their pincode — and book them by the hour, day, week, or month. The platform features a stunning LiquidGlass (glassmorphism) UI, real-time Firestore data, and a full admin panel.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + LiquidGlass system |
| Animations | Framer Motion |
| Routing | React Router DOM v6 |
| State | Zustand (client) + React Query v5 (server) |
| Backend | Firebase (Auth, Firestore, Storage, Functions) |
| Icons | Lucide React |

---

## 3. Features

### Authentication
- Email/Password sign-up and login
- Email verification flow
- Forgot/reset password
- Protected routes with role-based access
- Persistent auth state via Zustand

### Vehicle Management
- Browse vehicles with infinite scroll pagination
- Filter by type, fuel, transmission, sort order
- PIN code based availability search (`serviceablePincodes`)
- Detailed vehicle page with image gallery
- Real-time star ratings and reviews
- Wishlist / favorites

### Booking System
- 3-step booking flow: Dates → Location → Confirm
- Smart pricing engine (hourly / daily / weekly / monthly)
- 18% GST calculation
- Booking history per user
- Monthly availability calendar with booked-date highlighting

### Admin Panel
- Analytics dashboard (revenue, bookings, users)
- Full vehicle CRUD with image upload to Firebase Storage
- Booking management with status transitions (pending → confirmed → active → completed/cancelled/rejected)
- User management with role promotion/demotion

### LiquidGlass UI
- Glassmorphism cards with `backdrop-blur`
- Light/Dark mode with localStorage persistence
- Framer Motion page transitions and staggered list animations
- Mobile-first responsive design

### PWA
- `manifest.json` for installability
- Theme color and icons configured

---

## 4. Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (free Spark plan works for development)

### Installation

```bash
git clone https://github.com/your-org/ready2wheel.git
cd ready2wheel
npm install
```

### Firebase Setup (see Section 6)

Copy the env file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 5. Folder Structure

```
ready2wheel/
├── index.html                   # Vite HTML entry
├── firebase.json                # Firebase hosting/functions config
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore composite indexes
├── storage.rules                # Storage security rules
├── .env.example                 # Environment variable template
├── functions/                   # Firebase Functions (Node.js)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts             # Cloud functions
├── public/
│   └── manifest.json            # PWA manifest
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Root component with providers
    ├── routes.tsx               # React Router route definitions
    ├── index.css                # Global styles + Tailwind directives
    ├── types/
    │   └── index.ts             # All TypeScript interfaces
    ├── services/
    │   ├── firebase.ts          # Firebase app initialization
    │   ├── auth.ts              # Authentication helpers
    │   ├── firestore.ts         # Firestore CRUD operations
    │   └── storage.ts           # Firebase Storage uploads
    ├── store/
    │   ├── authStore.ts         # Zustand auth store
    │   ├── vehicleStore.ts      # Zustand vehicle/filter store
    │   └── bookingStore.ts      # Zustand booking draft store
    ├── hooks/
    │   ├── useAuth.ts           # Auth state hook
    │   ├── useVehicles.ts       # Vehicle React Query hooks
    │   ├── useBookings.ts       # Booking React Query hooks
    │   └── useAdmin.ts          # Admin React Query hooks
    ├── theme/
    │   ├── ThemeProvider.tsx    # Light/dark mode context
    │   └── tokens.ts            # LiquidGlass CSS class tokens
    ├── utils/
    │   └── helpers.ts           # Pricing, formatting, validators
    ├── components/
    │   ├── Button.tsx           # Animated glass button
    │   ├── Card.tsx             # Glass card container
    │   ├── Input.tsx            # Glass input with label/error
    │   ├── Modal.tsx            # Animated modal overlay
    │   ├── Navbar.tsx           # Responsive navigation
    │   ├── Footer.tsx           # Site footer
    │   ├── Layout.tsx           # Page layout wrapper
    │   ├── ProtectedRoute.tsx   # Auth guard component
    │   └── UI.tsx               # StarRating, Badge, EmptyState, Spinner
    └── features/
        ├── Home.tsx             # Landing page
        ├── Dashboard.tsx        # User dashboard
        ├── HowItWorks.tsx       # How-it-works page
        ├── Wishlist.tsx         # Wishlist page
        ├── auth/
        │   ├── Login.tsx
        │   ├── SignUp.tsx
        │   ├── ForgotPassword.tsx
        │   └── EmailVerification.tsx
        ├── vehicles/
        │   ├── VehicleList.tsx      # Browse + infinite scroll
        │   ├── VehicleDetail.tsx    # Vehicle detail + gallery
        │   ├── VehicleCard.tsx      # Grid card component
        │   └── VehicleSearch.tsx    # Filter panel
        ├── bookings/
        │   ├── BookingFlow.tsx      # 3-step booking modal
        │   ├── BookingHistory.tsx   # User's past bookings
        │   └── AvailabilityCalendar.tsx
        └── admin/
            ├── AdminDashboard.tsx   # Admin tabs + analytics
            ├── VehicleCRUD.tsx      # Vehicle management
            ├── BookingMgmt.tsx      # Booking management
            └── UserMgmt.tsx         # User management
```

---

## 6. Firebase Setup Guide

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.

2. Enable **Authentication → Email/Password** in the Auth section.

3. Create a **Firestore database** (start in test mode, then apply `firestore.rules`).

4. Enable **Firebase Storage** (apply `storage.rules`).

5. In Project Settings → Your Apps, add a Web app and copy the config object.

6. Populate your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

7. Deploy Firestore rules and indexes:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use your_project_id
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

8. *(Optional)* Deploy Firebase Functions:
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```

---

## 7. Authentication

### Flows

| Flow | Route | Description |
|------|-------|-------------|
| Sign Up | `/signup` | Creates user in Firebase Auth + Firestore `users` collection. Sends verification email. |
| Sign In | `/login` | Authenticates with email/password. Redirects to intended page. |
| Email Verification | `/verify-email` | Prompts user to verify, with resend option. |
| Forgot Password | `/forgot-password` | Sends Firebase password reset email. |
| Protected Routes | Any `/dashboard`, `/wishlist`, `/admin` | Redirects unauthenticated users to `/login`. Redirects unverified users to `/verify-email`. |

### How It Works

- `useAuth` hook subscribes to `onAuthStateChanged` and fetches the Firestore user profile.
- `useAuthStore` (Zustand, persisted) holds `user` and `firebaseUser`.
- `ProtectedRoute` reads from `useAuth` and guards based on `isAuthenticated`, `emailVerified`, and `role`.

---

## 8. Vehicle Management

### Firestore Schema (`vehicles/{id}`)

```typescript
{
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'car' | 'bike' | 'scooter' | 'cycle' | 'truck' | 'van';
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
  seats: number;
  description: string;
  features: string[];
  images: string[];           // Firebase Storage URLs
  thumbnailUrl: string;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  isAvailable: boolean;
  serviceablePincodes: string[];   // array-contains queries
  rating: number;
  reviewCount: number;
  location: { address, city, state, pincode };
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CRUD

- **List**: `getVehicles()` — paginated via `startAfter` cursor, filtered by Firestore queries
- **Read**: `getVehicleById(id)`
- **Create/Update/Delete**: Admin-only via `VehicleCRUD` component

---

## 9. Booking System

### Flow

1. User opens `BookingFlow` modal from a vehicle detail page
2. **Step 1 — Dates**: Pick start/end date+time; pricing is calculated client-side
3. **Step 2 — Location**: Enter serviceable pincode + address
4. **Step 3 — Confirm**: Review all details and submit
5. Booking saved to Firestore with status `pending`
6. Cloud Function `onBookingCreated` validates the booking

### Booking Schema (`bookings/{id}`)

```typescript
{
  vehicleId, vehicleName, vehicleThumbnail: string;
  userId, userName, userEmail, userPhone: string;
  pickupPincode, pickupAddress: string;
  startDate, endDate: Timestamp;
  durationType: 'hourly' | 'daily' | 'weekly' | 'monthly';
  durationValue: number;
  totalAmount: number;           // includes 18% GST
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt, updatedAt: Timestamp;
}
```

### Pricing Engine

```
baseAmount = pricePerUnit × durationValue
taxAmount  = baseAmount × 0.18   (18% GST)
totalAmount = baseAmount + taxAmount
```

Duration is auto-detected: ≥30 days → monthly, ≥7 days → weekly, ≥1 day → daily, else hourly.

### Firebase Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onBookingCreated` | Firestore onCreate | Validates booking; rejects if vehicle unavailable |
| `calculateBookingPrice` | HTTPS Callable | Server-side pricing calculation |
| `onBookingStatusChange` | Firestore onUpdate | Logs status transitions (extensible for emails) |
| `onUserCreated` | Auth onCreate | Logs new user registration |

---

## 10. Admin Panel

Access at `/admin` (requires `role: 'admin'` in Firestore user document).

### Features

| Tab | Capability |
|-----|-----------|
| Overview | KPI cards: users, vehicles, bookings, revenue |
| Vehicles | Full CRUD: create, edit, delete, upload images |
| Bookings | View all bookings, filter by status, advance status transitions |
| Users | View all users, promote/demote admin role |

### Access Control

To make a user admin, either:
- Use the Admin Panel → Users tab → "Make Admin"
- Directly update Firestore: `users/{uid}` → `role: "admin"`

---

## 11. Theming & UI (LiquidGlass)

### LiquidGlass Principles

- **Translucent cards**: `backdrop-blur-xl bg-white/10 border border-white/20`
- **Glowing borders**: hover states with increased border opacity
- **Layered depth**: multiple blur levels for navbar, cards, modals
- **Animated interactions**: Framer Motion `whileHover`, `whileTap`, staggered children

### Dark/Light Mode

- `ThemeProvider` uses a React context + `localStorage`
- Toggled via the sun/moon button in the Navbar
- Tailwind `darkMode: 'class'` — the `.dark` class is applied to `<html>`

### Customization

Edit `tailwind.config.js` to change colors, animations, or add new design tokens. Edit `src/theme/tokens.ts` to modify the glass class presets.

---

## 12. Security

### Firestore Rules Summary

| Collection | Public Read | Auth Write | Admin Write |
|-----------|-------------|------------|-------------|
| `users` | ❌ | Owner only | ✅ |
| `vehicles` | ✅ | ❌ | ✅ |
| `bookings` | Owner only | Verified owner | ✅ |
| `reviews` | ✅ | Verified users | ✅ |
| `serviceable_pincodes` | ✅ | ❌ | ✅ |

### Function Validation

`onBookingCreated` validates:
- Required fields present
- `totalAmount > 0`
- Vehicle exists and is available

---

## 13. Performance Optimizations

- **Infinite scroll pagination**: Firestore cursor-based (`startAfter`)
- **React Query caching**: 5-minute stale time
- **Framer Motion lazy animations**: `whileInView` for below-the-fold sections
- **Code splitting**: React Router lazy loading can be added per route
- **Image optimization**: Firestore Storage serves images via CDN

---

## 14. Future Roadmap

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] SMS/email notifications via SendGrid
- [ ] Real-time booking updates (Firestore listeners)
- [ ] Google Maps integration for vehicle pickup
- [ ] Driver/delivery partner module
- [ ] Loyalty points & discount codes
- [ ] Multi-language support (i18n)
- [ ] Native mobile app (React Native)

---

## 15. Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Full Deployment (Hosting + Functions + Rules)

```bash
npm run build
firebase deploy
```

---

## 16. Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow the existing code style (TypeScript strict mode, functional components, no class components).

---

## 17. License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ for seamless mobility in India
</div>
