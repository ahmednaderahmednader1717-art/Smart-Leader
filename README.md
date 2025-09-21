# Smart Leader Project

A full-stack real estate website built with Next.js, Express.js, and MongoDB.

## Features

- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: Express.js with MongoDB
- **Pages**: Home, About, Projects, Contact, Admin Dashboard
- **Responsive Design**: Mobile-friendly interface
- **SEO Optimized**: Meta tags and OpenGraph support
- **Admin Panel**: CRUD operations for projects and contact management

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # Express.js API
├── package.json       # Root package.json for scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in both frontend and backend folders
   - Fill in your MongoDB connection string and other required variables

4. Run the development server:
   ```bash
   npm run dev
   ```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render or Heroku
- **Database**: MongoDB Atlas (cloud)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, MongoDB, Mongoose, JWT, Nodemailer
- **Deployment**: Vercel, Render/Heroku
