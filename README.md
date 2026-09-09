# FitTracker Frontend

Single-page application (SPA) built with React and Vite for strength workout tracking and routine management (v1.0.0 MVP).

---

## About This Project & Development Notes

- **Context & Objective:** Built as an intensive summer learning project to understand full-stack architecture using React and Laravel.
- **AI-Assisted Learning:** Developed utilizing AI tools as a pair-programming partner to explore unfamiliar patterns, reason through data modeling, and debug state synchronization.
- **UI & Styling Focus:** The primary goal was mastering core application logic and backend integration rather than manual styling. The visual layer relies on [Water.css](https://watercss.kognise.dev/) complemented by AI-assisted CSS adjustments for layout structure.

## Tech Stack

- **Framework & Tooling:** React, Vite
- **Routing:** React Router (with `<ProtectedRoute>` route guarding)
- **State Management:** React Context API (`AuthContext` with persistent session token)
- **HTTP Client:** Custom `fetch` wrapper (`apiClient`) with Bearer token injection

---

## Setup & Run

1. `npm install`
2. `npm run dev`

---

## Application Routes

| Path                    | View                | Description                                         | Protected |
| ----------------------- | ------------------- | --------------------------------------------------- | --------- |
| `/login`                | `LoginPage`         | User login and registration forms                   | No        |
| `/dashboard`            | `DashboardPage`     | User routine templates list                         | Yes       |
| `/routines/new`         | `RoutineCreatePage` | Routine template builder with exercise selection    | Yes       |
| `/routines/:id`         | `RoutineDetailPage` | Routine viewer and in-place editor                  | Yes       |
| `/routines/:id/workout` | `WorkoutPage`       | Live session logger with timer and past set prefill | Yes       |
| `/history`              | `HistoryPage`       | Chronological log of past completed sessions        | Yes       |
