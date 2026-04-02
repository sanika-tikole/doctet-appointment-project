# MediBook — Healthcare Booking System

A modern, responsive Healthcare Appointment Booking System built with **React.js**, **Tailwind CSS v4**, and **Vite**.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| @tailwindcss/vite | 4 | Tailwind v4 Vite plugin |
| Vite | 7 | Build tool & dev server |
| Axios | 1 | HTTP requests + interceptors |
| Lucide React | 0.577 | Icon library |
| React Hot Toast | 2 | Toast notifications |

---

## Color Palette

| Name | Hex |
|---|---|
| Primary | `#6367FF` |
| Secondary | `#8494FF` |
| Soft Background | `#C9BEFF` |
| Accent | `#FFDBFD` |
| White | `#FFFFFF` |
| Text Dark | `#1F2937` |
| Light Gray | `#F3F4F6` |

Gradient used throughout: `#6367FF → #8494FF`

---

## Project Structure

```
docter appiontment project/
│
├── index.html                  # Vite entry point
├── vite.config.js              # Vite + React + Tailwind config
├── package.json                # Dependencies & scripts
│
└── src/
    ├── main.jsx                # React DOM root render
    ├── App.jsx                 # Router + layout shell
    │
    ├── styles/
    │   └── global.css          # Tailwind import + custom scrollbar
    │
    ├── context/
    │   └── AuthContext.jsx     # JWT auth state (login, logout, persist)
    │
    ├── services/
    │   └── api.js              # Axios instance + request/response interceptors
    │
    ├── components/
    │   ├── Navbar.jsx          # Sticky responsive navbar with hamburger menu
    │   ├── Footer.jsx          # Dark footer with links and contact info
    │   ├── DoctorCard.jsx      # Reusable doctor listing card
    │   ├── AppointmentCard.jsx # Reusable appointment status card
    │   └── ProtectedRoute.jsx  # Role-based route guard
    │
    └── pages/
        ├── Home.jsx            # Landing page with hero, stats, features, CTA
        ├── Login.jsx           # Login form with JWT auth
        ├── Register.jsx        # Register form with role selection
        ├── Doctors.jsx         # Doctor listing with search & filter
        ├── DoctorProfile.jsx   # Doctor detail with slots
        ├── BookAppointment.jsx # Booking form with date + time slot picker
        ├── MyAppointments.jsx  # Patient appointment history + cancel
        ├── PatientDashboard.jsx# Patient overview with stats & quick actions
        ├── DoctorDashboard.jsx # Doctor overview with appointment management
        └── AdminDashboard.jsx  # Admin stats + user management table
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
App runs at: `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Features Implemented

### Authentication
- **Context API** (`AuthContext.jsx`) manages `user` and `token` state globally
- JWT token stored securely in `localStorage` under `medibook_token`
- User data persisted in `localStorage` under `medibook_user`
- Session restored automatically on page refresh
- `login()` and `logout()` helper functions exposed via `useAuth()` hook
- Auto-logout on `401` response via Axios interceptor

### Routing (App.jsx)
- `BrowserRouter` + `Routes` + `Route` from React Router v7
- **Public routes:** `/`, `/login`, `/register`, `/doctors`, `/doctors/:id`
- **Protected routes:** `/book/:id`, `/patient-dashboard`, `/my-appointments`, `/doctor-dashboard`, `/admin-dashboard`
- `Navbar` and `Footer` wrap all pages inside a flex column layout
- Toast notifications (`react-hot-toast`) configured globally

### ProtectedRoute Component
- Redirects unauthenticated users to `/login`
- Supports `allowedRoles` prop — redirects users to their own dashboard if they access a forbidden route
- Shows a centered loading spinner while auth state is being restored

### Navbar
- Sticky top navigation with white background and subtle shadow
- **Left:** Stethoscope icon + "MediBook" brand name with gradient logo
- **Right (logged out):** Home · Doctors · Login · Register button
- **Right (logged in):** Home · Doctors · Dashboard · Logout button
- Role-aware Dashboard link (patient/doctor/admin routes)
- **Mobile:** Collapses to hamburger menu (`Menu` / `X` icons)
- Active route highlighting in `#6367FF`

### Footer
- Dark (`#1F2937`) background
- Brand section with logo and tagline
- Quick links column (Home, Doctors, Login, Register)
- Specializations column
- Contact column (email, phone, address with Lucide icons)
- Copyright bar with current year

### Home Page
- **Hero section:** Full gradient background (`#6367FF → #8494FF`), decorative blobs, glassmorphism preview card with sample doctors
- **Buttons:** "Find Doctors" (white) + "Get Started" (glass)
- **Stats banner:** 10,000+ Patients · 500+ Doctors · 4.9/5 Rating · 24/7 Support
- **Features section:** 3 cards on `#FFDBFD` background — Easy Booking · Verified Doctors · Secure Platform
- **Specializations section:** Pill-shaped filter chips linking to Doctors page
- **CTA banner:** Full gradient with "Get Started Today" button

### Login Page
- Centered card on `#C9BEFF → #FFDBFD` gradient background
- Email field with `Mail` icon
- Password field with show/hide toggle (`Eye` / `EyeOff`)
- Loading spinner on submit
- API call to `POST /auth/login` — stores JWT and redirects to role dashboard
- Link to Register page

### Register Page
- Same card design as Login
- Name, Email, Password fields
- **Role selector:** Visual toggle cards for `Patient` and `Doctor` with icons and descriptions
- API call to `POST /auth/register`

### DoctorCard Component
- Doctor photo or fallback initials avatar
- Availability badge (Available / Busy)
- Name with `BadgeCheck` verified icon
- Specialization in primary color
- Experience (years) + Star rating + review count
- "View Profile" button → `/doctors/:id`
- Hover: slight lift + shadow + border highlight

### Doctors Page
- Page header with search bar
- Specialization filter chips (10 categories + All)
- 3-column responsive grid (stacks on mobile)
- **Loading state:** 6 skeleton cards with pulse animation
- **Empty state:** Illustrated message with "Clear Filters" button
- Fallback mock data when API is unavailable

### Doctor Profile Page
- Back navigation to Doctors list
- **Left panel:** Doctor image/avatar, star rating, location, phone, email, "Book Appointment" button
- **Right panel:** Name, specialization, verified badge, experience badge, language tags
- About / Bio section
- Education section
- Available time slots grid — clicking any slot goes to booking
- Redirects to `/login` if user is not authenticated

### Book Appointment Page
- Back link to doctor profile
- Doctor name/specialization in header
- **Date picker** with minimum date set to today
- **Time slot grid** (12 slots) — only appears after a date is selected
- **Notes textarea** — optional symptom description
- **Booking summary card** — shows selected date and time before confirming
- **Success screen** — confirmation message with links to "My Appointments" and "Browse Doctors"
- API call to `POST /appointments`

### AppointmentCard Component
- Gradient accent top border
- Doctor or Patient info with icon (switchable via `showDoctor` prop)
- Status badges: Confirmed (green) · Pending (yellow) · Cancelled (red) · Completed (blue)
- Date and time with Lucide icons
- Optional notes display
- Cancel button (shown only for pending/confirmed appointments)

### Patient Dashboard
- Gradient welcome header with patient name
- **3 stat cards:** Total Bookings · Upcoming · Completed
- Quick action card → "Book Appointment" button
- Upcoming appointments grid with cancel support
- Past appointments section (last 3)
- Skeleton loading state

### Doctor Dashboard
- Gradient header with doctor's name and specialization
- **3 stat cards:** Total Appointments · Pending Requests · Patients Seen
- **Tabbed interface:**
  - **Upcoming Appointments tab:** List with Confirm (`✓`) and Cancel (`✗`) action buttons for pending requests
  - **Manage Slots tab:** Add / remove available time slots dynamically
- Toast feedback on all actions

### Admin Dashboard
- Gradient header with shield icon
- **3 stat cards:** Total Doctors · Total Patients · Total Appointments
- **Users table** with:
  - Searchable by name or email
  - Role filter dropdown (All / Doctor / Patient / Admin)
  - Role badges with color coding
  - Joined date column
  - Delete user action with confirmation
  - Skeleton loading rows
  - Row count display

### My Appointments Page
- Page header with "New Appointment" button
- Search bar (by doctor name or specialization)
- **Status filter tabs** with live counts: All · Pending · Confirmed · Completed · Cancelled
- 3-column responsive grid
- Cancel support for pending/confirmed appointments
- Empty state with illustration and booking CTA

### API Service (api.js)
- Axios instance with `baseURL` from `VITE_API_URL` env variable (fallback: `http://localhost:5000/api`)
- **Request interceptor:** Automatically attaches `Authorization: Bearer <token>` header
- **Response interceptor:** Clears localStorage and redirects to `/login` on `401 Unauthorized`

---

## User Roles

| Role | Dashboard Route | Access |
|---|---|---|
| `patient` | `/patient-dashboard` | Book appointments, view history |
| `doctor` | `/doctor-dashboard` | Manage appointments & slots |
| `admin` | `/admin-dashboard` | Full platform management |

---

## API Endpoints Expected (Backend)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login user, returns `{ user, token }` |
| POST | `/auth/register` | Register user, returns `{ user, token }` |
| GET | `/doctors` | List all doctors |
| GET | `/doctors/:id` | Get doctor by ID |
| POST | `/appointments` | Create appointment |
| GET | `/appointments/my` | Patient's appointments |
| GET | `/appointments/doctor` | Doctor's appointments |
| PATCH | `/appointments/:id/cancel` | Cancel appointment |
| PATCH | `/appointments/:id/confirm` | Confirm appointment (doctor) |
| GET | `/admin/stats` | Platform statistics |
| GET | `/admin/users` | All users list |
| DELETE | `/admin/users/:id` | Delete a user |

> **Note:** All pages include fallback mock data, so the UI works fully even without a backend connected.

---

## Design Patterns

- **Mobile-first** responsive design using Tailwind flex/grid utilities
- **Glassmorphism** elements on hero section (backdrop-blur, bg-white/20)
- **Skeleton loading** screens on all data-fetching pages
- **Toast notifications** for all user actions (success + error)
- **Smooth hover animations** — scale, shadow, color transitions
- **Rounded cards** (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) throughout
- **Gradient accents** on headers, buttons, and stat cards

## frontend : https://medibook-frontend-bfzd.onrender.com
