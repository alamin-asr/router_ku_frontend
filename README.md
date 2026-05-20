# ROUTER Club Website — ECE Discipline, Khulna University

A full-featured, responsive React + Vite + Tailwind CSS website for the ROUTER student technology club.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`

## 🔑 Demo Login Credentials

| Role   | Email                        | Password   |
|--------|------------------------------|------------|
| Admin  | admin@router.ku.ac.bd        | admin123   |
| Member | arif@ku.ac.bd                | member123  |

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx         — Sticky navbar with mobile menu
│   ├── Hero.jsx           — Full-screen hero section
│   ├── About.jsx          — Mission, vision, stats
│   ├── Activities.jsx     — 6 activity domain cards
│   ├── Events.jsx         — Upcoming + past events
│   ├── Workshops.jsx      — Workshop listing + registration modal
│   ├── Competitions.jsx   — Team competition registration
│   ├── Projects.jsx       — Filterable project showcase
│   ├── Team.jsx           — Club committee members
│   ├── Gallery.jsx        — Filterable photo gallery
│   ├── JoinUs.jsx         — Membership registration form
│   ├── Footer.jsx         — Links, contact, social
│   └── dashboard/
│       ├── Profile.jsx
│       ├── MyWorkshops.jsx
│       ├── MyCompetitions.jsx
│       ├── DashboardProjects.jsx
│       └── Announcements.jsx
├── pages/
│   ├── HomePage.jsx       — Main public page (all sections)
│   ├── LoginPage.jsx      — Auth login
│   ├── RegisterPage.jsx   — New member registration
│   ├── DashboardPage.jsx  — Member dashboard (protected)
│   ├── AdminPage.jsx      — Admin panel (admin only)
│   └── admin/
│       ├── AdminOverview.jsx
│       ├── AdminMembers.jsx
│       ├── AdminEvents.jsx
│       ├── AdminWorkshops.jsx
│       ├── AdminCompetitions.jsx
│       ├── AdminProjects.jsx
│       └── AdminAnnouncements.jsx
├── context/
│   └── AuthContext.jsx    — Auth state + localStorage
└── data/
    └── mockData.js        — Club data (events, workshops, etc.)
```

## ✨ Features

### Public Site
- Hero with circuit background and stats
- About with mission, vision, statistics
- 6 activity domain cards
- Events calendar (upcoming + past)
- Workshop registration (with seat tracker)
- Competition team registration
- Filterable project showcase
- Club team profiles
- Filterable gallery
- Membership join form
- Fully responsive navbar + footer

### Member Dashboard (`/dashboard`)
- Profile (editable)
- My Workshops (registered)
- My Competitions (registered)
- Projects (view all club projects)
- Announcements

### Admin Panel (`/admin`)
- Overview with stats + charts
- Members management (view, filter, search)
- Events management (add, edit, delete)
- Workshops management (add, edit, delete, seat tracking)
- Competitions management (add, edit, delete)
- Projects management (add, edit, delete)
- Announcements (post, edit, delete)

## 🛠 Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- React Router v6
- Lucide React icons
- DM Sans + Rajdhani (Google Fonts)
- localStorage for state persistence
# router_ku_frontend
