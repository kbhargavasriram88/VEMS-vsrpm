# Vivekananda E.M High School Website

A complete production-ready school website built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

*   **Public Portal**: Home, About, Academics, Admissions, Faculty, Gallery, News & Events, Contact.
*   **Admin Dashboard**: Secure authentication (JWT), full CRUD for faculty, news, events, and gallery.
*   **Responsive Design**: Mobile-first approach using Tailwind CSS.
*   **PWA Ready**: Offline support, installable to home screen.
*   **SEO Optimized**: Meta tags, Open Graph, Sitemap, robots.txt.
*   **Image Management**: Integrated with Cloudinary.

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, React Router, Framer Motion, Axios.
*   **Backend**: Node.js, Express.js, Mongoose, JWT, Cloudinary, Multer.
*   **Database**: MongoDB.

## Step-by-Step Setup Guide

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed on your system.
Create a free account on [Cloudinary](https://cloudinary.com/).

### 2. Backend Setup
1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure environment variables: Open `backend/.env` and fill in your MongoDB URI and Cloudinary credentials.
4.  Start the server: `npm run dev` (or `node server.js`). Server runs on http://localhost:5000.

### 3. Frontend Setup
1.  Navigate to the frontend directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`. The app runs on http://localhost:5173.

## Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas.
2. Get the connection string and add it to your `.env` variables in production.

### Backend (Render / Railway / Heroku)
1. Push your code to a GitHub repository.
2. Connect your repo to Render as a "Web Service".
3. Set the root directory to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from your `.env` file into the Render dashboard.

### Frontend (Vercel / Netlify)
1. Connect your GitHub repository to Vercel.
2. Set the root directory to `frontend`.
3. Vercel will automatically detect Vite. The build command is `npm run build` and output directory is `dist`.
4. In the Vercel dashboard, add the environment variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend-url.onrender.com/api`).
5. Deploy!

## Initializing Admin Account
You will need to manually insert the first admin account directly into your MongoDB database using MongoDB Compass or mongosh. Use a bcrypt-hashed password.

Example document:
```json
{
  "username": "superadmin",
  "email": "admin@vivekananda.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin"
}
```
