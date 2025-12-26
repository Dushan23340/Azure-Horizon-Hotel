# Azure Horizon Hotel

A modern hotel booking application with separate frontend and backend.

## Project Structure

```
azure-horizon-elegance/
├── frontend/           # React frontend application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   └── ...             # Configuration files
└── backend/            # Node.js/Express backend API
    ├── controllers/    # Request handlers
    ├── models/         # Database models
    ├── routes/         # API routes
    ├── services/       # Business logic
    ├── utils/          # Utility functions
    ├── config/         # Configuration files
    ├── server.js       # Main server file
    └── package.json    # Backend dependencies
```

## Getting Started

### Frontend (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend (Node.js/Express)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example and set your environment variables

4. Start the server:
```bash
npm run dev
```

## Features

- **Frontend**: React application with TypeScript, shadcn/ui components, and responsive design
- **Backend**: RESTful API with Express, MongoDB for data storage, and JWT authentication
- **Room Management**: View available rooms and check availability
- **Booking System**: Complete booking functionality

## API Endpoints

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms/check-availability` - Check room availability for given dates

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB/Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express-validator for input validation