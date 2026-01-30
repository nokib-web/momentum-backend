# Momentum Backend - RBAC System

A robust, production-ready Role-Based Access Control (RBAC) system built with Node.js, TypeScript, Express.js, and MongoDB. This backend provides secure authentication, user management, and project management with granular permission controls.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Three-tier permission system (Admin, Manager, Staff)
- **User Management** - Complete user lifecycle with invite system
- **Project Management** - CRUD operations with soft delete
- **Type Safety** - Full TypeScript implementation
- **Security** - Helmet, CORS, bcrypt password hashing
- **Validation** - Comprehensive input validation with express-validator
- **Error Handling** - Centralized error management
- **Pagination** - Efficient data retrieval with pagination support
- **Soft Delete** - Data preservation with soft delete pattern

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Design Decisions](#design-decisions)
- [Security Features](#security-features)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe development
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Security & Authentication
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Validation & Utilities
- **express-validator** - Request validation
- **dotenv** - Environment variable management
- **morgan** - HTTP request logger

### Development Tools
- **nodemon** - Auto-restart on file changes
- **TypeScript Compiler** - Type checking and compilation

## 🏗️ Architecture

### Project Structure

```
momentum-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── models/
│   │   ├── User.ts              # User schema with password hashing
│   │   ├── Invite.ts            # Invitation schema with expiry
│   │   ├── Project.ts           # Project schema with soft delete
│   │   └── index.ts             # Model exports
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User management logic
│   │   ├── projectController.ts # Project management logic
│   │   └── index.ts             # Controller exports
│   ├── routes/
│   │   ├── authRoutes.ts        # Authentication endpoints
│   │   ├── userRoutes.ts        # User management endpoints
│   │   ├── projectRoutes.ts     # Project management endpoints
│   │   └── index.ts             # Route exports
│   ├── middlewares/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── role.ts              # Role-based access control
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validate.ts          # Request validation chains
│   │   └── index.ts             # Middleware exports
│   ├── utils/
│   │   ├── jwt.ts               # JWT token utilities
│   │   ├── crypto.ts            # Cryptographic utilities
│   │   └── index.ts             # Utility exports
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── server.ts                # Application entry point
├── dist/                         # Compiled JavaScript (generated)
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── nodemon.json                  # Nodemon configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
└── API_DOCS.md                   # Detailed API documentation
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Client Application          │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Routes Layer                │
│  - Endpoint definitions             │
│  - Request validation               │
│  - Middleware application           │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Middleware Layer               │
│  - Authentication (JWT)             │
│  - Authorization (RBAC)             │
│  - Validation                       │
│  - Error handling                   │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Controllers Layer              │
│  - Business logic                   │
│  - Request/Response handling        │
│  - Data transformation              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Models Layer                │
│  - Data schemas                     │
│  - Database operations              │
│  - Data validation                  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         MongoDB Database            │
└─────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd momentum-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rbac_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Invitation System
INVITE_EXPIRY_HOURS=48
```

### Environment Variable Descriptions

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 5000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRE` | JWT token expiration time | 7d | No |
| `INVITE_EXPIRY_HOURS` | Invitation validity period | 48 | No |

**⚠️ Security Note:** Never commit `.env` to version control. Always use strong, unique values for `JWT_SECRET` in production.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/invite` - Create user invitation (Admin only)
- `POST /api/auth/register-via-invite` - Register with invite token

### User Management
- `GET /api/users` - Get all users with pagination (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)
- `PATCH /api/users/:id/status` - Update user status (Admin only)

### Project Management
- `POST /api/projects` - Create new project (Authenticated)
- `GET /api/projects` - Get all projects with filters (Authenticated)
- `PATCH /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Soft delete project (Admin only)

### System
- `GET /health` - Health check endpoint
- `GET /` - API welcome message

For detailed API documentation with request/response examples, see [API_DOCS.md](./API_DOCS.md)

## 🗄️ Database Schema

### User Model
```typescript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed, not returned),
  role: Enum ['ADMIN', 'MANAGER', 'STAFF'],
  status: Enum ['ACTIVE', 'INACTIVE'],
  invitedAt: Date,
  createdAt: Date
}
```

### Invite Model
```typescript
{
  email: String (lowercase),
  role: Enum ['ADMIN', 'MANAGER', 'STAFF'],
  token: String (unique, indexed),
  expiresAt: Date,
  acceptedAt: Date,
  createdAt: Date
}
```

### Project Model
```typescript
{
  name: String,
  description: String,
  status: Enum ['ACTIVE', 'ARCHIVED', 'DELETED'],
  isDeleted: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Design Decisions

### 1. Invite-Based Registration
**Decision:** Users can only register through admin-generated invite tokens.

**Rationale:**
- Prevents unauthorized registrations
- Maintains controlled user base
- Ensures proper role assignment
- Reduces spam and abuse

**Tradeoffs:**
- Requires admin intervention for new users
- Additional complexity in registration flow
- Better security and control

### 2. Soft Delete Pattern
**Decision:** Projects are soft-deleted (marked as deleted) rather than permanently removed.

**Rationale:**
- Data preservation for auditing
- Ability to restore accidentally deleted items
- Maintains referential integrity
- Compliance with data retention policies

**Tradeoffs:**
- Increased database size
- Additional query complexity (filtering deleted items)
- Better data safety and recoverability

### 3. JWT-Based Authentication
**Decision:** Stateless JWT tokens instead of session-based authentication.

**Rationale:**
- Scalability (no server-side session storage)
- Microservices-friendly
- Mobile app compatibility
- Reduced database queries

**Tradeoffs:**
- Cannot invalidate tokens before expiry
- Larger request payload
- Token refresh complexity
- Better performance and scalability

### 4. Role-Based Access Control (RBAC)
**Decision:** Three-tier role system (Admin, Manager, Staff).

**Rationale:**
- Clear permission hierarchy
- Flexible access control
- Easy to understand and maintain
- Scalable for future roles

**Implementation:**
- Middleware-based enforcement
- Type-safe role definitions
- Granular endpoint protection

### 5. TypeScript Implementation
**Decision:** Full TypeScript instead of JavaScript.

**Rationale:**
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

**Tradeoffs:**
- Additional build step
- Learning curve for team
- Better code quality and maintainability

### 6. Mongoose ODM
**Decision:** Mongoose for MongoDB interactions.

**Rationale:**
- Schema validation
- Middleware hooks (pre-save, etc.)
- Population for relationships
- Built-in type casting

**Tradeoffs:**
- Additional abstraction layer
- Performance overhead
- Better developer experience

## 🔒 Security Features

### Password Security
- **Bcrypt hashing** with 10 salt rounds
- **Minimum requirements**: 6 characters, uppercase, lowercase, number
- **Never returned** in API responses (select: false)
- **Secure comparison** using bcrypt.compare()

### JWT Security
- **Configurable expiration** (default: 7 days)
- **Secret key** from environment variables
- **Payload validation** on every request
- **User status check** (inactive users rejected)

### Input Validation
- **Express-validator** for all inputs
- **Type checking** with TypeScript
- **Mongoose schema validation**
- **Sanitization** of user inputs

### API Security
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** (recommended for production)
- **HTTPS** (recommended for production)

### Access Control
- **Authentication required** for protected routes
- **Role-based authorization**
- **Self-protection** (admins can't deactivate themselves)
- **Resource ownership** validation

## 💻 Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint
```

### Code Style

- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for classes and types
  - UPPER_CASE for constants
  
- **File Organization**:
  - One export per file (controllers, models)
  - Index files for barrel exports
  - Grouped by feature/domain

- **Error Handling**:
  - Try-catch in async functions
  - Pass errors to next() middleware
  - Centralized error handler

### Adding New Features

1. **Create Model** (if needed) in `/src/models`
2. **Create Controller** in `/src/controllers`
3. **Create Routes** in `/src/routes`
4. **Add Validation** in `/src/middlewares/validate.ts`
5. **Update Types** in `/src/types/index.ts`
6. **Mount Routes** in `/src/server.ts`
7. **Document API** in `API_DOCS.md`

## 🧪 Testing

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123"}'
```

**Create Project:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing the API"}'
```

### Testing with Postman

1. Import endpoints from `API_DOCS.md`
2. Set up environment variables for base URL and tokens
3. Use Bearer Token authentication for protected routes
4. Test all CRUD operations

### Recommended Test Cases

- ✅ User registration with valid/invalid invite tokens
- ✅ Login with correct/incorrect credentials
- ✅ Access protected routes without token
- ✅ Role-based access (staff trying admin routes)
- ✅ Pagination with various page sizes
- ✅ Input validation (invalid email, weak password)
- ✅ Soft delete and data persistence
- ✅ Token expiration handling

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure MongoDB Atlas or production database
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS for specific origins
- [ ] Set up logging (Winston, Bunyan)
- [ ] Configure monitoring (PM2, New Relic)
- [ ] Set up backup strategy
- [ ] Document deployment process

### Deployment Options

**Option 1: Traditional VPS (DigitalOcean, AWS EC2)**
```bash
# Build the application
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name momentum-backend
pm2 save
pm2 startup
```

**Option 2: Platform as a Service (Heroku, Railway)**
- Push code to repository
- Connect to platform
- Set environment variables
- Deploy automatically

**Option 3: Containerization (Docker)**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment-Specific Configuration

**Development:**
- Detailed error messages
- Morgan logging
- Hot reload with nodemon

**Production:**
- Minimal error details
- Structured logging
- Process management (PM2)
- HTTPS enforcement

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check `API_DOCS.md` for API details
- Review this README for architecture information

---

**Built with ❤️ using Node.js, TypeScript, and Express.js**
