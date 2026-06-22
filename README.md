# YouTube Clone

A full-stack YouTube clone built with Next.js, Express, MongoDB, and WebRTC. Features video streaming, downloads, user subscriptions, comments with translation, video calls, and Google OAuth authentication.

## 🚀 Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Utility-first styling
- **Plyr** — Video player
- **Recharts** — Analytics charts
- **Socket.io Client** — Real-time peer id share
- **Zustand** — State management
- **@react-oauth/google** — Google One Tap authentication

### Backend
- **Node.js + Express 5** — API server
- **MongoDB + Mongoose** — Database
- **Socket.io** — WebSocket for video calls & heartbeat
- **Cloudinary** — Video & thumbnail storage
- **Razorpay** — Payment processing
- **Resend** — Email service (OTP, invoices)
- **Google Auth Library** — ID token verification
- **Multer** — File upload handling

## 📦 Features

### Authentication
- Email/Password registration with OTP verification
- Google OAuth with One Tap auto sign-in
- Guest guards and auth guards for route protection
- Location-based state selection

### Video Management
- Video upload with Cloudinary
- Thumbnail generation
- Video streaming with Plyr player
- Like/Unlike videos
- Search videos
- Auto-play next video
- Watch history tracking

### Comments
- Add, like, and dislike comments
- Translate comments to English

### Downloads
- Download videos with Cloudinary attachment URLs
- Per-plan download limits tracked daily
- Download history page

### Subscription Plans
- **Free** — No downloads, 5 min watch time/day
- **Bronze** (₹49/mo) — 1 download/day
- **Silver** (₹99/mo) — 10 downloads/day (Most Popular)
- **Gold** (₹199/mo) — Unlimited everything
- Monthly and yearly billing options via Razorpay

### Video Calls (WebRTC)
- Peer-to-peer video calls
- Room-based call creation and joining
- Socket.io signaling with STUN/TURN

### Profile & Channel
- Profile page with usage stats (pie chart)
- Channel creation with custom username
- Watch history and downloads page
- Watch Later & Liked Videos playlists

### UI/UX
- Dark theme by default
- Theme adaptive to location (south Indian states get light theme 10AM-12PM)
- Animated particle background on auth pages
- Responsive design (mobile sidebar, bottom nav)
- Glass-morphism cards

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Razorpay account
- Google Cloud Console project with OAuth 2.0 credentials
- Resend API key (for emails)

### 1. Clone the repository

```bash
git clone <repository-url>
cd Youtube-Clone
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env  # Create env file (see below for vars)
npm install
npm run dev
```

#### Server Environment Variables
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Frontend Setup

```bash
cd client
cp .env.local.example .env.local  # Create env file
npm install
npm run dev
```

#### Client Environment Variables
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add these **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://your-production-domain.com`
4. No **Authorized Redirect URIs** needed (uses popup mode)
5. Copy the Client ID to both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`

## 🧪 Running Locally

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── api/               # API client functions
│   │   ├── components/        # Shared components
│   │   ├── features/          # Feature modules
│   │   ├── hooks/             # Custom hooks
│   │   ├── libs/              # Utilities & context
│   │   └── types/             # TypeScript types
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   └── config/            # External service configs
│   └── package.json
└── README.md
```

## 🔐 Authentication Journey

### Initial Approach: Firebase
The project initially used **Firebase Authentication** with `signInWithRedirect` for Google sign-in. This approach had issues with:
- Cross-Origin-Opener-Policy conflicts in production
- Dependency on Firebase SDK (heavy bundle)
- Firebase Admin SDK required on the backend

### Migration: Google OAuth (@react-oauth/google)
Migrated to **`@react-oauth/google`** with **`google-auth-library`** for the following benefits:
- **Lighter bundle** — no Firebase SDK needed
- **One Tap** — Google One Tap auto sign-in via FedCM API
- **Direct token verification** — Backend verifies ID tokens with Google's API
- **Simpler flow** — Frontend gets credential → Backend verifies and creates user
- **No popup blocker issues** — One Tap uses the browser's built-in FedCM API

### Skipped Features (Due to Cost)
- **OTP-based email login** — Planned but skipped because the Resend/email service is paid. Only the email/password registration flow was implemented with OTP verification (for demo purposes).
- **SMS verification** — Too costly for a demo project.

## 🚢 Deployment

### Vercel (Frontend)
1. Connect your GitHub repo to Vercel
2. Set all `NEXT_PUBLIC_*` environment variables in Vercel dashboard
3. Deploy

### Backend Render
1. Set all server environment variables
2. Ensure CORS_ORIGINS includes your frontend URL
3. Deploy
4. first time will be slow as it goes under sleep if not active
   

## 📄 License

MIT
