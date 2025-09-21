# Smart Leader Real Estate - Setup Guide

This guide will help you set up and run the Smart Leader Real Estate project locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or MongoDB Atlas)
- Git

## Project Structure

```
smart-leader-real-estate/
├── frontend/          # Next.js application
├── backend/           # Express.js API
├── package.json       # Root package.json for scripts
├── README.md
└── SETUP.md
```

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Environment Setup

#### Frontend Environment

Copy the environment example file and configure it:

```bash
cd frontend
cp env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend Environment

Copy the environment example file and configure it:

```bash
cd backend
cp env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smart-leader-real-estate

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (for contact form notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=admin@smartleader.com

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@smartleader.com
ADMIN_PASSWORD=admin123456
```

### 3. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will connect to `mongodb://localhost:27017/smart-leader-real-estate`

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file

### 4. Seed Database (Optional)

To populate the database with sample data:

```bash
cd backend
node scripts/seed.js
```

This will create:

- Admin user (admin@smartleader.com / admin123456)
- Sample projects
- Sample contact submissions

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)

```bash
# From the root directory
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Run Separately

Frontend only:

```bash
cd frontend
npm run dev
```

Backend only:

```bash
cd backend
npm run dev
```

## Features

### Frontend (Next.js)

- **Home Page**: Hero section, featured projects, about preview, contact CTA
- **About Page**: Company history, mission/vision, team section
- **Projects Page**: Grid view of current projects with filtering
- **Project Details**: Detailed project information with image gallery
- **Previous Projects**: Portfolio of completed projects
- **Contact Page**: Contact form with validation
- **Admin Dashboard**: CMS for managing projects and contacts

### Backend (Express.js)

- **Authentication**: JWT-based admin authentication
- **Projects API**: CRUD operations for projects
- **Contacts API**: Contact form submissions and management
- **Admin API**: Dashboard statistics and user management
- **Email Notifications**: Contact form email alerts
- **Security**: Rate limiting, CORS, helmet, input validation

## Admin Access

### Default Admin Credentials

- Email: admin@smartleader.com
- Password: admin123456

### Admin Dashboard Features

- Project management (add, edit, delete, feature)
- Contact form submissions management
- User management
- Dashboard statistics
- Settings configuration

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Contacts

- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (Admin)
- `GET /api/contacts/:id` - Get single contact (Admin)
- `PUT /api/contacts/:id/status` - Update contact status (Admin)

### Admin

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/projects` - Admin projects view
- `GET /api/admin/contacts` - Admin contacts view
- `POST /api/admin/contacts/export` - Export contacts to CSV

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Database (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update connection string in production environment

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.com
```

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leader-real-estate
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-url.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=admin@smartleader.com
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check if MongoDB is running
   - Verify connection string
   - Check network access (for Atlas)

2. **Port Already in Use**

   - Change PORT in backend .env file
   - Kill existing processes on the port

3. **Email Not Sending**

   - Check email credentials
   - Verify SMTP settings
   - Check firewall/network restrictions

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development
2. **API Testing**: Use Postman or similar tools to test API endpoints
3. **Database**: Use MongoDB Compass for database management
4. **Logs**: Check console logs for debugging information

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the code comments
3. Check the API documentation
4. Create an issue in the repository

## License

This project is licensed under the MIT License.
