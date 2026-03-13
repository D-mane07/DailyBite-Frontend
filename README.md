# DailyBite Frontend

React + Vite client for the DailyBite food ordering platform.

## What This App Includes

- User signup/signin and Google login
- Role-based UI flows (user, owner, delivery)
- Shop browsing by city
- Item search and cart management
- Checkout and order placement
- Owner order/status management
- Delivery assignment and delivery OTP flow
- Realtime-friendly architecture (works with Socket.IO backend)

## Tech Stack

- React 19
- Vite 7
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Firebase Auth

## Prerequisites

- Node.js 18+
- Running DailyBite backend API
- Firebase project credentials
- Geo API key (for geolocation/address lookup)

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_KEY=your-firebase-web-api-key
VITE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_GEO_API=your-geoapify-or-compatible-api-key
```

Notes:

- `VITE_AUTH_DOMAIN` is optional in code (fallback exists), but defining it is recommended.
- Never commit real production keys to public repositories.

## Backend URL Configuration

The API base URL is currently hardcoded in `src/App.jsx`:

```js
export const serverurl = "https://20.193.151.157:8000";
```

For local development, change it to your local backend URL, for example:

```js
export const serverurl = "http://localhost:8080";
```

## Install and Run

```bash
cd frontend
npm install
npm run dev
```

## Available Scripts

- `npm run dev` -> start Vite dev server
- `npm run build` -> build production bundle
- `npm run preview` -> preview built app
- `npm run lint` -> run ESLint

## App Routes (High Level)

- `/signup`, `/signin`, `/forgetpass`
- `/` home
- `/cartitem`, `/checkout`, `/placeorder`
- `/createeditshop`, `/additems`, `/edititem/:itemId`
- `/ownerorders`, `/userorders`
- `/trackorder/:orderId`, `/shop/:shopId`

## Deployment Notes

- `vercel.json` is configured for SPA rewrites to `index.html`.
- Ensure backend CORS includes your deployed frontend origin.
- If your backend uses cookie auth, requests should be sent with `withCredentials: true` (already used across the app).
