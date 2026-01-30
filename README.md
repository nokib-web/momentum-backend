# Momentum Backend

A TypeScript-based Node.js backend project with Express.js, built for role-based access control (RBAC) systems.

## 🚀 Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication
- **Security** - Helmet, CORS, bcryptjs for password hashing
- **Validation** - Express-validator for request validation
- **Development** - Hot reload with nodemon

## 📁 Project Structure

```
momentum-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── models/         # Mongoose models
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middleware
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── server.ts       # Application entry point
├── dist/               # Compiled JavaScript (generated)
├── node_modules/       # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── nodemon.json        # Nodemon configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📦 Dependencies

### Core Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution engine

### Authentication & Security
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Utilities
- **dotenv** - Environment variable management
- **express-validator** - Request validation
- **morgan** - HTTP request logger

### Development
- **nodemon** - Auto-restart on file changes

## 🔧 Environment Variables

See `.env.example` for all available environment variables:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)
- `INVITE_EXPIRY_HOURS` - Invitation expiry duration

## 📝 API Endpoints

### Health Check
```
GET /health
```
Returns server health status

### Root
```
GET /
```
Returns API welcome message

### Authentication
```
POST /api/auth/login
POST /api/auth/invite (Admin only)
POST /api/auth/register-via-invite
```

For detailed API documentation with request/response examples, see [API_DOCS.md](./API_DOCS.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

ISC
