# Azure Horizon Hotel - Deployment Guide

This guide explains how to deploy the Azure Horizon Hotel application using Vercel for the frontend and Railway.com for the backend.

## Prerequisites

- A MongoDB Atlas account for database hosting
- Accounts on Vercel and Railway.com
- Git repository for your project

## Backend Deployment (Railway.com)

1. **Prepare your backend:**
   - Ensure you have a `.env` file in the `backend` directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

2. **Deploy to Railway:**
   - Sign up at [Railway.com](https://railway.app)
   - Connect your GitHub repository
   - Create a new project and link it to your repository
   - Railway will automatically detect the `railway.toml` configuration
   - Add the required environment variables in the Railway dashboard:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secret string for JWT token generation
   - Deploy the project

3. **Get your backend URL:**
   - After successful deployment, copy the Railway deployment URL (e.g., `https://your-project-production.up.railway.app`)

## Frontend Deployment (Vercel)

1. **Update frontend environment variables:**
   - In the `frontend/.env` file, update the backend URL:
     ```
     VITE_API_URL=your_railway_backend_url
     ```

2. **Deploy to Vercel:**
   - Sign up at [Vercel](https://vercel.com)
   - Import your GitHub repository
   - In the project settings, add the environment variable:
     - Key: `VITE_API_URL`
     - Value: Your Railway backend URL from step 1
   - Vercel will automatically detect the Vite configuration and build the project
   - Deploy the project

## Environment Variables

### Backend (Railway.com)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Port number (default: 5000)

### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL

## Configuration Files

### Railway Configuration (`railway.toml`)
This file configures the Railway deployment with proper build phases and environment variables.

### Vercel Configuration (`frontend/vercel.json`)
This file ensures proper routing for the React application with client-side routing.

## Deployment Steps Summary

1. Fork/clone this repository
2. Set up MongoDB Atlas database
3. Deploy backend to Railway.com
4. Update frontend `.env` with backend URL
5. Deploy frontend to Vercel
6. Configure environment variables in both platforms

## Post-Deployment

After deployment:

1. **Verify the backend** by visiting your Railway URL (should return "Azure Horizon Backend API")
2. **Verify the frontend** by visiting your Vercel URL
3. **Test the full application** by registering a user and making a booking

## Troubleshooting

- **Backend not connecting to database**: Verify your `MONGODB_URI` is correct and accessible
- **Frontend can't connect to backend**: Check that `VITE_API_URL` is properly set in Vercel environment variables
- **Authentication issues**: Ensure `JWT_SECRET` is the same in both development and production
- **CORS issues**: The backend is configured to allow all origins in this setup, but you may want to restrict it in production

## Scaling

- **Frontend**: Vercel automatically handles scaling for static assets
- **Backend**: Railway allows you to scale resources in the dashboard
- **Database**: MongoDB Atlas provides scaling options in their dashboard