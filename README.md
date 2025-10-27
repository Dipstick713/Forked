# Forked 🍴

A Git-inspired social media platform where developers can share posts, fork content, and engage with the community.

## Overview

Forked reimagines social networking through the lens of version control. Just like Git allows developers to fork repositories and build upon existing code, Forked lets users fork posts to create their own variations and contributions.

## Key Features

- **Post & Share**: Create posts with text and images to share your thoughts and projects
- **Fork Posts**: Fork any post to create your own version, maintaining attribution to the original
- **Engage**: Like posts and follow other users to build your network
- **Rich Profiles**: Customize your profile with avatars and banner images
- **Real-time Feed**: Stay updated with posts from the community
- **Mobile Responsive**: Seamless experience across desktop and mobile devices

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Passport.js with GitHub OAuth
- **Deployment**: Docker & Docker Compose

## Getting Started

### Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
node index.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
