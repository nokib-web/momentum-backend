# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Login
**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "STAFF"
  }
}
```

**Error Responses:**
- `401` - Invalid email or password
- `403` - Account is inactive
- `400` - Validation errors

---

### 2. Invite User
**Endpoint:** `POST /api/auth/invite`  
**Access:** Private (Admin only)  
**Description:** Create an invitation for a new user

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role": "MANAGER"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Invite created successfully",
  "inviteToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "expiresAt": "2026-02-01T11:39:00.000Z"
}
```

**Error Responses:**
- `400` - User already exists or pending invite exists
- `401` - Not authenticated
- `403` - Not authorized (not admin)
- `400` - Validation errors

**Valid Roles:**
- `ADMIN`
- `MANAGER`
- `STAFF`

---

### 3. Register via Invite
**Endpoint:** `POST /api/auth/register-via-invite`  
**Access:** Public  
**Description:** Register a new user account using an invite token

**Request Body:**
```json
{
  "name": "John Doe",
  "password": "Password123",
  "inviteToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "newuser@example.com",
    "role": "MANAGER"
  }
}
```

**Error Responses:**
- `404` - Invalid invite token
- `400` - Invite expired or already used
- `400` - User already exists
- `400` - Validation errors

---

## Common Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## User Roles & Permissions

### ADMIN
- Full system access
- Can invite users with any role
- Can manage all resources

### MANAGER
- Can manage projects
- Can view team members
- Limited administrative access

### STAFF
- Can view assigned projects
- Basic access level

---

## Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123"}'
```

**Invite User (requires admin token):**
```bash
curl -X POST http://localhost:5000/api/auth/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"email":"newuser@example.com","role":"MANAGER"}'
```

**Register via Invite:**
```bash
curl -X POST http://localhost:5000/api/auth/register-via-invite \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "password":"Password123",
    "inviteToken":"YOUR_INVITE_TOKEN_HERE"
  }'
```

### Using Postman

1. Import the endpoints into Postman
2. For protected routes, add the token to Authorization → Bearer Token
3. Set Content-Type to `application/json` in Headers

---

## Environment Variables

Required environment variables (see `.env.example`):

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time (e.g., "7d")
- `NODE_ENV` - Environment (development/production)
- `INVITE_EXPIRY_HOURS` - Invitation expiry duration (default: 48)
