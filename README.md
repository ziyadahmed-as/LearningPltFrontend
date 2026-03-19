# LearnPlatform — Frontend

A modern React single-page application for the LearnPlatform learning management system. Features JWT authentication, role-based navigation, course browsing, student enrollment, Stripe payment checkout, admin user management, and a dark/light theme toggle — all integrated with the Django REST API backend.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 5** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with JWT interceptors |
| **Vanilla CSS** | Custom design system (no frameworks) |
| **Stripe Checkout** | Payment flow redirect |

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx              # Role-based nav + theme toggle
│   ├── context/
│   │   ├── AuthContext.jsx          # JWT auth state & token management
│   │   └── ThemeContext.jsx         # Dark/light mode persistence
│   ├── pages/
│   │   ├── HomePage.jsx             # Landing hero page
│   │   ├── LoginPage.jsx            # JWT login form
│   │   ├── RegisterPage.jsx         # User registration
│   │   ├── CoursesPage.jsx          # Browse all courses
│   │   ├── CourseDetailPage.jsx     # Course detail + enrollment
│   │   ├── MyEnrollmentsPage.jsx    # Student enrollment list + payments
│   │   ├── MyCoursesPage.jsx        # Instructor course management
│   │   ├── AdminUsersPage.jsx       # Admin user CRUD + stats
│   │   └── ProfilePage.jsx          # Edit user profile
│   ├── services/
│   │   └── api.js                   # Axios instance + all API functions
│   ├── App.jsx                      # Router + protected routes
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Full design system (dark + light)
├── index.html
├── vite.config.js                   # Dev server proxy to Django
├── Dockerfile
├── nginx.conf
└── package.json
```

---

## Pages & Features

| Page | Route | Role | Description |
|---|---|---|---|
| Home | `/` | Public | Hero landing with CTA buttons |
| Login | `/login` | Public | JWT authentication form |
| Register | `/register` | Public | Account creation |
| Courses | `/courses` | Public | Browse all published courses |
| Course Detail | `/courses/:id` | Public | View modules/lessons, enroll |
| My Enrollments | `/my-enrollments` | Student | View enrolled courses, pay for paid courses |
| My Courses | `/my-courses` | Instructor | Create/delete courses |
| Manage Users | `/admin/users` | Admin | User stats, role editing, deletion |
| Profile | `/profile` | Authenticated | Edit name, bio, profile picture |

---

## Design System

The app uses a custom CSS design system with dual theme support:

- **Dark Mode** — Deep navy backgrounds with purple gradient accents
- **Light Mode** — Clean white backgrounds with indigo/violet accents
- **Theme Toggle** — Persisted in `localStorage`, animates with smooth CSS transitions
- **Components** — Cards with gradient top-borders on hover, glassmorphic navbar, animated buttons, responsive grid layout
- **Typography** — Inter font from Google Fonts (300–900 weights)

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (20.x recommended)
- Backend running at `http://localhost:8000`

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

The app starts at `http://localhost:3000` with API requests proxied to `http://localhost:8000`.

### 3. Build for Production

```bash
npm run build
```

Output is in `dist/` — static files ready for any web server.

---

## Docker Setup

### Dockerfile

The frontend uses a multi-stage Docker build:
1. **Build stage** — Installs dependencies and creates production bundle
2. **Serve stage** — Serves static files with Nginx

### Build & Run

```bash
docker build -t learnplatform-frontend .
docker run -p 80:80 learnplatform-frontend
```

The app will be available at `http://localhost`.

### Environment Configuration

For production, update the API base URL by setting the `VITE_API_URL` environment variable before building:

```bash
docker build --build-arg VITE_API_URL=https://api.yoursite.com -t learnplatform-frontend .
```

---

## API Integration

All API calls go through `src/services/api.js` which provides:

- **Axios instance** with base URL `/api`
- **Request interceptor** — Attaches JWT `Authorization: Bearer` header automatically
- **Response interceptor** — Auto-refreshes expired tokens using the refresh token
- **Named exports** for every endpoint (`login`, `register`, `getCourses`, `enrollCourse`, etc.)

### Proxy Configuration (Development)

In `vite.config.js`, all `/api/*` requests are proxied to the Django backend:

```js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

---

## Authentication Flow

1. User submits credentials on `/login`
2. Backend returns `{ access, refresh }` JWT tokens
3. Tokens stored in `localStorage`
4. `AuthContext` fetches user profile via `/api/users/me/`
5. All subsequent requests include `Authorization: Bearer <access>` header
6. On 401, the interceptor auto-refreshes using the refresh token
7. If refresh fails, user is redirected to `/login`

---

## Protected Routes

Routes are guarded by the `ProtectedRoute` component:

```jsx
<ProtectedRoute allowedRoles={['STUDENT']}>
  <MyEnrollmentsPage />
</ProtectedRoute>
```

- No `allowedRoles` — any authenticated user
- With `allowedRoles` — only matching roles (redirects others to `/`)

---

## License

This project is for educational purposes as part of the LearnPlatform full-stack development course.
