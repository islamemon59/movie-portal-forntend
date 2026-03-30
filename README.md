# Movie Portal Frontend

A modern Next.js frontend for the Movie Portal application with comprehensive authentication, content discovery, reviews, and payment integration.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **UI Components**: shadcn/ui + Base UI
- **Validation**: Zod
- **Authentication**: Better Auth
- **Payments**: Stripe + SSLCommerz
- **Styling**: Tailwind CSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the environment template:

```bash
cp .env.example .env.local
```

Update with your configuration (see [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for details):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:3000/api/auth
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3001 in your browser.

### 4. Verify Backend Connection

Ensure the backend is running on `http://localhost:3000`:

```bash
curl http://localhost:3000/api/v1/health
```

## Project Structure

```
src/
├── hooks/              # Custom React hooks for API and auth
├── lib/                # Utilities (HTTP client, errors, auth, etc.)
├── config/             # Configuration (env variables)
├── types/              # TypeScript types and Zod schemas
├── components/         # React components
└── app/                # Next.js app directory
```

See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for complete documentation.

## Key Features

### 🔐 Authentication
- Email/password signup and login
- Email verification via OTP
- Google OAuth integration
- Better Auth for session management
- Automatic token injection in API requests

### 🎬 Content Discovery
- Browse movies and TV shows
- Search and filter by genre
- View detailed information
- Aggregate ratings and reviews

### ⭐ Reviews & Ratings
- Write and publish reviews
- Rate content (1-5 stars)
- Like and comment on reviews
- Admin moderation system

### 📋 Watchlist
- Add titles to personal watchlist
- View and manage saved content
- Persistent storage across sessions

### 💳 Payments
- Stripe checkout integration
- SSL Commerce payment support
- Subscription management
- Payment history tracking

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:3001

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## API Integration

All API communication uses the HTTP client at `src/lib/http.ts`.

### Example: Fetching Movies

```typescript
import { useTitles } from '@/hooks';

export function MoviesList() {
  const { data: movies } = useTitles({ page: 1, limit: 20 });
  
  return (
    <ul>
      {movies?.map(movie => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
}
```

### Example: Authentication

```typescript
import { useAuth } from '@/hooks';

export function LoginForm() {
  const { login, error } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };
}
```

## Error Handling

Consistent error handling across the app:

```typescript
import { ApiErrorHandler } from '@/lib/errors';

try {
  await someApiCall();
} catch (error) {
  const message = ApiErrorHandler.getErrorMessage(error);
  // Handle error appropriately
}
```

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on port 3000
- Check `.env.local` has correct API URLs
- Verify firewall allows localhost connections

### "401 Unauthorized"
- User session has expired
- Session token not in localStorage
- Try logging out and back in

### "CORS errors"
- Backend CORS configuration issue
- Verify `CORS_ORIGIN` in backend `.env`
- Check Origin header matches

## Documentation

- [Frontend Setup Guide](./FRONTEND_SETUP.md) - Detailed setup and usage
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - API documentation
- [Integration Guide](./FRONTEND_INTEGRATION_GUIDE.md) - API integration patterns

## Support

For issues:
1. Check the [Frontend Setup Guide](./FRONTEND_SETUP.md)
2. Review console logs and Network tab in DevTools
3. Verify backend is running and healthy
4. Check `.env.local` configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## 3. Backend endpoint expectations

The starter UI expects:

- `GET /api/v1/movies` returns an array of movies.
- Better Auth mounted at `http://localhost:5000/api/v1/auth`.
- `POST /api/v1/payments/sslcommerz/initiate` returns `{ "gatewayUrl": "..." }`.

## 4. Important files

- Query provider: `src/components/providers/app-providers.tsx`
- Axios client: `src/lib/http.ts`
- Better Auth client: `src/lib/auth-client.ts`
- Env validation: `src/config/env.ts`
- Movies API + schema: `src/lib/api/movies.ts`, `src/types/movie.ts`
- Payment helpers: `src/lib/payments/stripe.ts`, `src/lib/payments/sslcommerz.ts`

## 5. Scripts

```bash
npm run dev
npm run lint
npm run build
```
