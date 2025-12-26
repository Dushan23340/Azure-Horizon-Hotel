# User Management Guide

This guide explains how to manage users in the Azure Horizon Hotel booking system.

## Features

- **User Authentication**: Register, login, and JWT token-based authentication
- **User Roles**: Admin and regular user roles
- **User Profiles**: Users can update their own profiles
- **Admin Management**: Admins can manage all users
- **Account Status**: Activate/deactivate user accounts
- **Password Management**: Users can change their passwords

## User Model

Users have the following fields:
- `name`: User's full name
- `email`: Unique email address (used for login)
- `password`: Hashed password (never returned in API responses)
- `role`: Either 'user' or 'admin' (default: 'user')
- `phone`: Optional phone number
- `isActive`: Boolean to activate/deactivate accounts (default: true)
- `lastLogin`: Timestamp of last login
- `createdAt` & `updatedAt`: Automatic timestamps

## API Endpoints

### Public Endpoints

#### Register User
```
POST /api/users/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "message": "User registered successfully",
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /api/users/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "message": "Login successful",
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "token": "jwt_token_here"
}
```

### Protected Endpoints (Require Authentication)

#### Get Current User Profile
```
GET /api/users/me
Headers: { "Authorization": "Bearer <token>" }
Response: { User object without password }
```

#### Update Current User Profile
```
PUT /api/users/me
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "name": "John Updated",
  "phone": "+1234567890",
  "email": "newemail@example.com"  // Optional, must be unique
}
```

#### Change Password
```
PUT /api/users/me/password
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Admin Only Endpoints

#### Get All Users (with pagination)
```
GET /api/users?page=1&limit=10&search=john
Headers: { "Authorization": "Bearer <admin_token>" }
Response: {
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Get User by ID
```
GET /api/users/:userId
Headers: { "Authorization": "Bearer <admin_token>" }
```

#### Update User
```
PUT /api/users/:userId
Headers: { "Authorization": "Bearer <admin_token>" }
Body: {
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "role": "admin",
  "isActive": true
}
```

#### Delete User
```
DELETE /api/users/:userId
Headers: { "Authorization": "Bearer <admin_token>" }
```

#### Activate/Deactivate User
```
PUT /api/users/:userId/status
Headers: { "Authorization": "Bearer <admin_token>" }
Body: {
  "isActive": false
}
```

## Setting Up Admin User

### Method 1: Using Seed Script

1. Set environment variables in `.env`:
```env
ADMIN_EMAIL=admin@azurehorizon.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Admin User
```

2. Run the seed script:
```bash
cd backend
node seeds/seedAdmin.js
```

### Method 2: Manual Creation

1. Register a user through the API
2. Update the user's role to 'admin' in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 7 days. Users need to login again after expiration.

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access**: Admin and user roles with different permissions
4. **Account Status**: Ability to deactivate accounts without deletion
5. **Input Validation**: All inputs are validated and sanitized
6. **Email Uniqueness**: Email addresses must be unique

## Usage Examples

### Frontend Integration

```typescript
// Login
const response = await fetch('http://localhost:5003/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, user } = await response.json();

// Store token
localStorage.setItem('token', token);

// Make authenticated request
const profile = await fetch('http://localhost:5003/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Admin Operations

```typescript
// Get all users (admin only)
const users = await fetch('http://localhost:5003/api/users?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Deactivate a user
await fetch(`http://localhost:5003/api/users/${userId}/status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ isActive: false })
});
```

## Best Practices

1. **Never expose passwords**: Passwords are never returned in API responses
2. **Use HTTPS in production**: Always use HTTPS for authentication endpoints
3. **Set strong JWT_SECRET**: Use a strong, random secret in production
4. **Regular password changes**: Encourage users to change passwords regularly
5. **Monitor lastLogin**: Track user activity using the lastLogin field
6. **Deactivate instead of delete**: Deactivate accounts to preserve data

## Environment Variables

Add these to your `.env` file:
```env
JWT_SECRET=your_very_secure_secret_key_here
ADMIN_EMAIL=admin@azurehorizon.com
ADMIN_PASSWORD=secure_admin_password
ADMIN_NAME=Admin User
```

## Error Handling

Common error responses:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Insufficient privileges (not admin)
- `400 Bad Request`: Validation errors
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

