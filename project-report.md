# Project Report — YouTube Clone

## 1. Project Overview

**Project Name:** YouTube Clone (Sasta YouTube Clone)
**Stack:** Next.js 16 + Express 5 + MongoDB + WebRTC
**Duration:** Multi-sprint development cycle
**Deployment:** Frontend on Vercel, Backend on cloud server

A full-featured video streaming platform inspired by YouTube, built as a portfolio project to demonstrate full-stack development capabilities including video management, user authentication, subscription billing, real-time video calls, and responsive UI.

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Next.js App   │────▶│   Express API   │────▶│   MongoDB    │
│   (Vercel)      │◀────│   (Cloud VM)    │◀────│  (Atlas)     │
└─────────────────┘     └─────────────────┘     └──────────────┘
         │                       │
         │                       ├──────────────────────────────┐
         │                       │                              │
         ▼                       ▼                              ▼
┌─────────────────┐     ┌──────────────┐             ┌──────────────┐
│   Cloudinary    │     │   Razorpay   │             │   Resend     │
│ (Video/Images)  │     │  (Payments)  │             │   (Email)    │
└─────────────────┘     └──────────────┘             └──────────────┘

WebSocket (Socket.io) ──── Peer-to-Peer (WebRTC) ──── Video Calls
```

### 2.2 Frontend Architecture

- **Framework:** Next.js 16 with App Router (file-based routing)
- **State Management:** React Context for auth, Zustand for UI state (sidebar)
- **Styling:** Tailwind CSS 4 with CSS variables for theming
- **Routing Groups:**
  - `(auth)` — Sign in / Sign up pages
  - `(studio)` — Upload page
  - `[username]` — Dynamic channel pages
- **Components:** Shared layout components (Navbar, Sidebar), feature-specific components in `features/` directory

### 2.3 Backend Architecture

- **Framework:** Express 5 with TypeScript (tsx runner)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Custom auth middleware using userId header
- **File Uploads:** Multer → Cloudinary
- **Payments:** Razorpay order creation + webhook verification
- **Real-time:** Socket.io for video call signaling and watch heartbeat

---

## 3. Database Schema

### Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | User accounts, channels, subscriptions | name, email, username, subscription{}, channelName, userState |
| `videos` | Video metadata | name, description, videoURL, thumbnailURL, creatorId, likes, views |
| `comments` | Video comments | targetId, targetType, userId, body, likes[], dislikes[] |
| `playlists` | Watch Later & Liked Videos | userId, videoId, type (watchLater/like) |
| `payments` | Razorpay payment records | userId, razorpayOrderId, plan, status, amount |
| `downloads` | Download tracking for limits | userId, videoId, timestamp |
| `videoHistories` | Watch time tracking | userId, videoId, totalWatchedSeconds, lastHeartbeatAt |

---

## 4. Feature Details

### 4.1 Authentication System

**Two methods:**
1. **Email/Password** — User registers with name, email, username, password, and state. OTP sent via Resend for email verification. Login with email + password.
2. **Google OAuth** — Google One Tap or button click. Frontend receives credential → sends to backend → backend verifies with `google-auth-library` → creates/finds user.

**Auth Flow:**
```
[Google Button/One Tap]
        │
        ▼
[credentialResponse.credential]  ← ID Token
        │
        ▼
[POST /api/users/google { idToken, userState }]
        │
        ▼
[Backend: verifyIdToken()]  ← OAuth2Client
        │
        ▼
[Find or Create User in MongoDB]
        │
        ▼
[Return User Data → localStorage → Redirect to /]
```

**Guards:**
- `AuthGuard` — Redirects unauthenticated users to `/signup`
- `GuestGuard` — Redirects authenticated users away from auth pages

### 4.2 Video Management

- **Upload:** Form with video file + thumbnail, uploaded to Cloudinary via Multer
- **Streaming:** Plyr player with Cloudinary video URLs
- **Likes:** Toggle like/unlike with playlist tracking
- **Search:** MongoDB text search on video names/descriptions
- **Watch Time Tracking:** Heartbeat every ~30 seconds → update `totalWatchedSeconds` in `videoHistories`
- **Watch Limit:** Check middleware checks if user's daily watch time exceeds plan limit

### 4.3 Subscription Plans

| Plan | Monthly | Yearly | Downloads/Day | Watch Time |
|------|---------|--------|---------------|------------|
| Free | ₹0 | ₹0 | 0 | 5 min |
| Bronze | ₹49 | ₹499 | 1 | 7 min |
| Silver | ₹99 | ₹999 | 10 | 10 min |
| Gold | ₹199 | ₹1,999 | ∞ | ∞ |

- Razorpay handles payment processing
- On successful payment, user's subscription is upgraded with expiry date
- Invoice email sent via Resend
- Subscription auto-expires — middleware checks `expiresAt` on every request

### 4.4 Video Calls (WebRTC)

- Socket.io for signaling (offer/answer/ICE candidates)
- Room-based: user creates a room → gets a shareable link → others join
- STUN server: `stun:stun.l.google.com:19302`
- No TURN server (for demo purposes)

### 4.5 Comment System

- Add comments on videos
- Like/dislike comments (tracked by userId arrays)
- **Translation:** Comments can be translated to English using `@vitalets/google-translate-api`

### 4.6 Theme System

- Default: Dark mode
- Location-based: If user is in a South Indian state (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana) AND time is between 10:00-11:59 AM, theme switches to light mode
- Theme persisted via CSS variables

---

## 5. Development Journey & Challenges

### 5.1 Authentication: Firebase → Google OAuth (Major Migration)

**Initial Implementation:**
- Firebase Authentication with `signInWithRedirect`
- Firebase Admin SDK on backend to verify tokens
- Issues: Cross-Origin-Opener-Policy conflicts in production, heavy bundle

**Migration to @react-oauth/google:**
- Removed Firebase completely (both client `firebase` and server `firebase-admin`)
- Implemented `GoogleLogin` component with One Tap and auto-select
- Backend verifies ID tokens using `google-auth-library` (`OAuth2Client.verifyIdToken()`)
- **Challenge:** `useOneTap` on both signin and signup pages caused "initialize called multiple times" — fixed by keeping One Tap only on the login page
- **Challenge:** `ux_mode="redirect"` required redirect URIs in Google Cloud Console — switched back to default popup mode
- **Challenge:** Popup blocked by browser — One Tap works via FedCM API (browser-native), but button popup depends on browser settings

### 5.2 OTP-Based Registration (Skipped)

**Planned:** OTP-based email verification during registration
**Reason for skipping:** Resend email API is a paid service. OTP functionality was implemented in code (OTP generation, storage, verification) but sending real OTPs requires a paid Resend subscription. The flow exists as a demo for local development.

### 5.3 Video Upload & Cloudinary Integration

- Multer for file handling, then upload to Cloudinary
- Challenge: Large video files need timeout adjustments
- Solution: Cloudinary handles video transcoding and streaming optimization

### 5.4 Watch Time Tracking

- Implemented heartbeat system: client sends periodic updates while watching
- Backend tracks total watched seconds per user per video
- Challenge: Accurate tracking across page refreshes — used `sessionEndedAt` to detect abandoned sessions
- Watch limit check middleware prevents access when limit is exceeded

### 5.5 Razorpay Payment Integration

- Order creation on server, payment processing on client with Razorpay's SDK
- Webhook signature verification with HMAC SHA256
- Challenge: Testing payment flows — used Razorpay test mode

### 5.6 Socket.io for Real-Time Features

- **Video Calls:** Signaling for WebRTC peer connections
- **Watch Heartbeat:** Periodic time tracking updates
- Challenge: Handling user disconnection and room management

### 5.7 Deployment Issues

- **CORS:** Backend CORS configuration needed to allow frontend origin
- **Cross-Origin-Opener-Policy:** Set to `same-origin-allow-popups` in `next.config.ts` for Google Auth compatibility
- **Environment Variables:** Hardcoded client IDs in production caused auth failures — moved to env vars with fallbacks
- **Build Errors:** Next.js internal file errors (`validator.ts`) — pre-existing, not blocking

---

## 6. API Endpoints

### User Routes (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/google` | No | Google OAuth login/signup |
| POST | `/register` | No | Email registration with OTP |
| POST | `/login` | No | Email/password login |
| POST | `/verify-otp` | No | Verify OTP code |
| POST | `/create-channel` | Yes | Create channel |

### Video Routes (`/api/video`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all videos |
| GET | `/search?q=` | No | Search videos |
| GET | `/:vid` | No | Get video by ID |
| POST | `/upload` | Yes | Upload video + thumbnail |
| PUT | `/like/:vid` | Yes | Toggle like |
| GET | `/download/:videoId` | Yes | Download URL |
| GET | `/history` | Yes | Watch history |
| GET | `/downloads` | Yes | Download history |
| GET | `/today-stats` | Yes | Today's usage stats |
| POST | `/heartbeat` | Yes | Watch time heartbeat |
| POST | `/stop` | Yes | Stop watch session |

### Comment Routes (`/api/comments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Add comment |
| GET | `/:targetId` | No | Get comments |
| POST | `/like/:commentId` | Yes | Like comment |
| POST | `/dislike/:commentId` | Yes | Dislike comment |

### Playlist Routes (`/api/playlist`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Add to playlist |
| GET | `/` | Yes | Get playlist videos |

### Payment Routes (`/api/payments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-order` | Yes | Create Razorpay order |
| POST | `/verify-payment` | Yes | Verify payment |

### Translate Routes (`/api/translate`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | No | Translate text to English |

---

## 7. Key Learnings

1. **OAuth vs Firebase Auth:** Firebase is convenient but heavy. Google OAuth with direct token verification is lighter and gives more control.
2. **One Tap UX:** Google One Tap with auto_select provides frictionless login, but the initialization must be scoped to a single page to avoid conflicts.
3. **Popup Blockers:** Browser popup blocking is a common issue with OAuth flows. One Tap's FedCM API is the modern solution.
4. **WebRTC Complexity:** Peer-to-peer video calls require careful signaling and connection state management.
5. **Plan-Based Restrictions:** Enforcing download/watch limits requires middleware chaining and careful database queries.
6. **File Uploads:** Video uploads need proper timeout handling, chunked uploads for large files, and CDN integration for delivery.

---

## 8. Future Improvements

- Add TURN server for reliable video calls behind NAT
- Implement video streaming with HLS/DASH
- Add comment replies and nested threads
- Add user-to-user chat
- Implement admin dashboard
- Add video categories/tags
- Implement playlist management (create, edit, delete)
- Add video recommendations algorithm
- Add social sharing features

---

## 9. Conclusion

This project demonstrates a full-stack video platform with modern web technologies. Key architectural decisions include:
- Next.js App Router for SEO and performance
- Google OAuth with One Tap for frictionless auth
- Razorpay for payments with planned subscription tiers
- WebRTC for real-time video communication
- MongoDB for flexible document storage
- Cloudinary for media management at scale

The project successfully migrated from Firebase to Google OAuth, reducing bundle size and eliminating cross-origin issues while adding One Tap auto sign-in.
