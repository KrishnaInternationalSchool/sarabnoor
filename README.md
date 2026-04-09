# Sarab Noor NGO Management Platform

Full-stack NGO management platform for **Sarab Noor**, designed with a soft, minimal, humanitarian visual direction inspired by the public brand brief.

## Stack

- Frontend: Next.js App Router + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Payments: Razorpay test mode with signature verification
- Deployment target: Vercel (`frontend`) + Render (`backend`)

## Folder Structure

```text
sarabnoor/
  frontend/
  backend/
```

## Implemented Modules

### Public user app

- Home page with soft editorial branding
- Campaign listing page
- Campaign detail page
- Signup and login
- Razorpay donation checkout flow
- User dashboard
- Donation history
- Volunteer application with profile photo and identity documents
- Notification center

### Admin panel

- Admin dashboard stats
- Donation listing and CSV export
- Campaign create, edit, and delete
- Volunteer verification and rejection workflow
- Content update posting

### Backend

- JWT authentication
- Role-based access control
- Joi validation
- Razorpay order creation and payment verification
- MongoDB models for users, campaigns, donations, volunteer applications, notifications, uploads, and updates
- File uploads persisted in MongoDB

## Environment Files

- Frontend env template: [frontend/.env.example](C:\Users\tutej\OneDrive\Desktop\sarabnoor\frontend\.env.example)
- Backend env template: [backend/.env.example](C:\Users\tutej\OneDrive\Desktop\sarabnoor\backend\.env.example)

## Local Setup

### 1. Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas database
- Razorpay test account

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend runs by default on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs by default on `http://localhost:3000`.

## Seeded Test Data

Sample campaign data lives in:

- [backend/src/scripts/sample-data.json](C:\Users\tutej\OneDrive\Desktop\sarabnoor\backend\src\scripts\sample-data.json)

Default admin credentials come from backend environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Campaigns

- `GET /api/campaigns`
- `GET /api/campaigns/:slug`
- `POST /api/campaigns` admin
- `PUT /api/campaigns/:id` admin
- `DELETE /api/campaigns/:id` admin

### Donations

- `POST /api/donations/create-order`
- `POST /api/donations/verify`
- `GET /api/donations/mine`
- `GET /api/donations` admin

### Volunteers

- `POST /api/volunteers/apply`
- `GET /api/volunteers/mine`
- `GET /api/volunteers` admin
- `PATCH /api/volunteers/:id/review` admin

### Notifications and content

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/updates`
- `POST /api/updates` admin

## Deployment Guide

### MongoDB Atlas

1. Create a cluster and database named `sarabnoor`.
2. Add a database user.
3. Add Render outbound IP rules or temporarily allow broader access while testing.
4. Copy the connection string into `backend/.env`.

### Render deployment for backend

1. Push the repository to GitHub.
2. Create a Render Web Service pointing to the repo root and set the service root to `backend`.
3. Use:

```bash
Build Command: npm install
Start Command: npm start
```

4. Add backend environment variables from `.env.example`.
5. After deploy, note the live API URL, for example:

```text
https://your-backend-name.onrender.com/api
```

### Vercel deployment for frontend

1. Import the same repo into Vercel.
2. Set the project root to `frontend`.
3. Add:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
```

4. Deploy and note the frontend URL, for example:

```text
https://your-frontend-name.vercel.app
```

## Deployment Commands

### Frontend

```bash
cd frontend
vercel --prod
```

### Backend

Deploy the `backend` service from GitHub in Render, or use the Render dashboard with:

```bash
npm install
npm start
```

## Live Hosted URLs

I could not generate real hosted URLs from this environment because:

- Node.js and npm were not available locally in the workspace
- deployment credentials for Vercel, Render, MongoDB Atlas, and Razorpay were not provided
- outbound deployment actions were not available here

Use these placeholders after deployment:

- Frontend URL: `https://your-frontend-name.vercel.app`
- Backend URL: `https://your-backend-name.onrender.com/api`

## Notes On Branding

The requested visual tone was implemented as:

- soft cream and sand palette
- elegant serif-led typography
- minimal spacing-heavy layout
- calm, emotionally warm copy

Direct extraction from `https://sarabnoor.com/` could not be fully verified from this environment, so the branding treatment is an inference based on the request and the referenced organization name.

## Important Limitation

This environment did not include a working Node.js toolchain, package manager, git, or deploy credentials. Because of that, I created the production-oriented codebase, env templates, seed data, and deployment instructions, but I could not run installs, execute builds, validate runtime behavior, or publish the app live from here.
