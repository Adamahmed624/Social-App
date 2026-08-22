# Social App — Responsive Social Platform

A social media web app with authentication, a live feed, post creation, comments, and user profiles — built with React and a real backend integration via Axios.

🔗 **Live demo:** [social-app-eight-iota.vercel.app](https://social-app-eight-iota.vercel.app)

## Features

- **Authentication** — Login and Register flows with schema-based validation (Zod + React Hook Form)
- **Protected & Guest Routes** — route guarding so authenticated-only pages (feed, profile, settings) and guest-only pages (login/register) are properly separated
- **Feed** — post cards with loading skeleton states for a smoother UX
- **Post creation & comments** — create posts and view/add comments on a dedicated post details page
- **User profiles** — view and edit profile, with a loading skeleton state
- **Bookmarks** — save posts for later
- **Notifications**
- **Suggested friends / community sidebar**
- **Toast notifications** for user feedback (via React Toastify)

## Tech Stack

- **React 19** — component architecture, Context API for auth & profile state
- **React Router 7** — routing, including protected/guest route guards
- **TanStack React Query** — server-state management and data fetching
- **Axios** — REST API integration with the backend
- **React Hook Form + Zod** — form handling and schema validation
- **React Toastify** — user notifications
- **Tailwind CSS 4** — styling
- **Vite** — build tool and dev server

## Project Structure

```
src/
├── auth/
│   ├── login/ register/     # Auth forms
│   └── schema/               # Zod validation schemas
├── Context/                # AuthContext & ProfileContext (global state)
├── components/
│   ├── Home/                 # Feed, post cards, sidebar, skeletons
│   ├── PostDetails/            # Single post + comments
│   ├── CommentsSection/
│   ├── CreatPost/
│   ├── Profile/               # Profile view + skeleton
│   ├── BookmarkedPost/
│   ├── Notification/
│   ├── ProtectedRoute/ GuestRoute/  # Route guards
│   └── Navbar/ Layout/
```

## Getting Started

```bash
git clone https://github.com/Adamahmed624/Social-App.git
cd Social-App
npm install
npm run dev
```

## Author

**Adam Ahmed** — [GitHub](https://github.com/Adamahmed624)
