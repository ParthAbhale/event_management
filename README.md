# EventSphere — Event Management System

Production-ready event management web app built with **React + Vite** on the frontend and **Firebase (Auth, Firestore, Storage)** on the backend.

## Features

- Email/password signup and login
- Google authentication
- Persistent auth sessions
- Dynamic navbar with profile avatar and user state
- Profile page with editable name and uploaded avatar
- Create, edit, and cancel events
- Browse all public events
- Search + filter by title, category, date, and status
- Join/register for events
- Cancel registration
- Bookmark events
- Dashboard with created/joined/saved events and activity history
- Firestore-backed action log collection
- Responsive premium UI with animations, skeleton states, and toast notifications
- Dark mode toggle
- Share event link

## Tech Stack

- React
- Vite
- Firebase Auth
- Cloud Firestore
- Firestore image storage
- React Router DOM
- Framer Motion
- React Hot Toast
- Lucide React
- date-fns

## Project Structure

```text
src/
  components/
    common/
    events/
    layout/
    profile/
  context/
  hooks/
  pages/
  services/
  styles/
  utils/
firebase/
  firestore.rules
  storage.rules
```

## Firestore Collections Used

### `users/{uid}`
- uid
- name
- email
- photoURL
- createdAt
- updatedAt

### `events/{eventId}`
- title
- description
- location
- dateTime
- category
- organizer { userId, name, email, photoURL }
- bannerImage
- status
- attendeeCount
- createdAt
- updatedAt

### `registrations/{eventId_uid}`
- eventId
- userId
- userName
- userEmail
- userPhotoURL
- timestamp

### `bookmarks/{eventId_uid}`
- eventId
- userId
- timestamp

### `activities/{activityId}`
- userId
- eventId
- actionType
- meta
- timestamp

## Firebase Setup

1. Create a Firebase project.
2. Add a **Web App** inside Firebase project settings.
3. Enable **Authentication**:
   - Email/Password
   - Google
4. Create a **Cloud Firestore** database in production or test mode.
5. Create **Firestore image storage**.
6. Copy `.env.example` to `.env` and fill in the values.

```bash
cp .env.example .env
```

7. Paste the values from Firebase project settings into `.env`.

## Install and Run

```bash
npm install
npm run dev
```

For production build:

```bash
npm run build
npm run preview
```

## Firestore Rules Deployment

Create or update your Firebase CLI config, then deploy rules.

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

When `firebase init` asks for rules file paths, point them to:
- `firebase/firestore.rules`
- `firebase/storage.rules`

## Notes About Security

- Only authenticated users can create events.
- Only the event organizer can update or cancel an event.
- Only the registration owner can cancel their registration.
- Only the bookmark owner can add/remove bookmarks.
- Activity logs are append-only from the client.

## Deployment Guide

### Option 1: Vercel
1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all `VITE_FIREBASE_*` environment variables.
4. Deploy.

### Option 2: Firebase Hosting
```bash
firebase init hosting
npm run build
firebase deploy --only hosting
```

Set the hosting public directory to:
```text
dist
```

Enable single-page app rewrite to `index.html` during setup.

## Important Implementation Notes

- No event data is hardcoded into the UI.
- All event/profile/registration/bookmark/activity data comes from Firebase.
- The only generated visual fallback is user avatar generation when a user has no uploaded or Google profile photo.
- Event banners are required while creating an event.
- The app intentionally avoids composite-index-heavy queries so first-time setup is smoother.

## Known Setup Requirement

This project cannot run until valid Firebase environment variables are added, because all data is sourced from Firebase.
