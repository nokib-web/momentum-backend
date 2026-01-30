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

## User Management Endpoints

### 4. Get All Users
**Endpoint:** `GET /api/users`  
**Access:** Private (Admin only)  
**Description:** Get all users with pagination

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Example:**
```
GET /api/users?page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "MANAGER",
      "status": "ACTIVE",
      "createdAt": "2026-01-30T05:39:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Not authorized (not admin)

---

### 5. Update User Role
**Endpoint:** `PATCH /api/users/:id/role`  
**Access:** Private (Admin only)  
**Description:** Update a user's role

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "MANAGER"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MANAGER",
    "status": "ACTIVE",
    "createdAt": "2026-01-30T05:39:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid role
- `401` - Not authenticated
- `403` - Not authorized (not admin)
- `404` - User not found

---

### 6. Update User Status
**Endpoint:** `PATCH /api/users/:id/status`  
**Access:** Private (Admin only)  
**Description:** Activate or deactivate a user account

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "INACTIVE"
}
```

**Valid Status Values:**
- `ACTIVE`
- `INACTIVE`

**Success Response (200):**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MANAGER",
    "status": "INACTIVE",
    "createdAt": "2026-01-30T05:39:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid status or attempting to deactivate own account
- `401` - Not authenticated
- `403` - Not authorized (not admin)
- `404` - User not found

---

## Project Management Endpoints

### 7. Create Project
**Endpoint:** `POST /api/projects`  
**Access:** Private (All authenticated users)  
**Description:** Create a new project

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Website Project",
  "description": "Building a modern responsive website for client"
}
```

**Validation:**
- Name: 3-100 characters
- Description: 10-500 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Website Project",
    "description": "Building a modern responsive website for client",
    "status": "ACTIVE",
    "isDeleted": false,
    "createdBy": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-01-30T05:48:00.000Z",
    "updatedAt": "2026-01-30T05:48:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Not authenticated

---

### 8. Get All Projects
**Endpoint:** `GET /api/projects`  
**Access:** Private (All authenticated users)  
**Description:** Get all projects with pagination and filters

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `status` (optional) - Filter by status (ACTIVE, ARCHIVED, DELETED)

**Example:**
```
GET /api/projects?page=1&limit=10&status=ACTIVE
```

**Success Response (200):**
```json
{
  "success": true,
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "New Website Project",
      "description": "Building a modern responsive website for client",
      "status": "ACTIVE",
      "isDeleted": false,
      "createdBy": {
        "_id": "507f191e810c19729de860ea",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-30T05:48:00.000Z",
      "updatedAt": "2026-01-30T05:48:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

**Valid Status Values:**
- `ACTIVE`
- `ARCHIVED`
- `DELETED`

**Error Responses:**
- `401` - Not authenticated

---

### 9. Update Project
**Endpoint:** `PATCH /api/projects/:id`  
**Access:** Private (Admin only)  
**Description:** Update project details

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Project Name",
  "description": "Updated project description",
  "status": "ARCHIVED"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Project Name",
    "description": "Updated project description",
    "status": "ARCHIVED",
    "isDeleted": false,
    "createdBy": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-01-30T05:48:00.000Z",
    "updatedAt": "2026-01-30T06:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid status value
- `401` - Not authenticated
- `403` - Not authorized (not admin)
- `404` - Project not found or deleted

---

### 10. Delete Project
**Endpoint:** `DELETE /api/projects/:id`  
**Access:** Private (Admin only)  
**Description:** Soft delete a project (sets isDeleted=true, status=DELETED)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Not authorized (not admin)
- `404` - Project not found or already deleted

**Note:** This is a soft delete. The project is marked as deleted but remains in the database.

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
