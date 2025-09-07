# 🛍️ Apparel - Secure MERN E-commerce Platform
## 🚀 Features

### 🔐 Security Features
- **OWASP Top 10 Compliance** - Addresses all critical security vulnerabilities
- **Dual Authentication** - JWT + Auth0 OIDC integration
- **CSRF Protection** - Comprehensive token-based protection
- **Input Validation** - Client & server-side validation with Zod
- **Rate Limiting** - Endpoint-specific rate limiting
- **Security Headers** - Helmet.js implementation
- **File Upload Security** - Secure image upload with validation
- **NoSQL Injection Prevention** - Input sanitization middleware

### 🛒 E-commerce Features
- **Product Management** - CRUD operations for products
- **Shopping Cart** - Persistent cart with user sessions
- **Order Management** - Complete order lifecycle
- **User Profiles** - Profile management with image uploads
- **Admin Dashboard** - Administrative interface
- **Search & Filtering** - Advanced product search
- **Responsive Design** - Mobile-first approach

### 🎨 UI/UX Features
- **Modern UI** - Built with React and Tailwind CSS
- **Component Library** - Reusable UI components
- **Form Validation** - Real-time validation feedback
- **Loading States** - Smooth user experience
- **Error Handling** - Comprehensive error management

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens
- **Auth0** - Identity and access management

### Security & Validation
- **Helmet.js** - Security headers
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation
- **Zod** - TypeScript-first schema validation
- **CSRF** - Cross-site request forgery protection
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Auth0 Account** (for OIDC authentication)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/wgnadun/Apparel.git
cd Apparel
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create environment files in both `server/` and `client/` directories:

#### Server Environment (`.env`)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/apparel
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/apparel

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=your-auth0-audience

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Client Environment (`.env`)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# The application will automatically create collections on first run
```

### 5. Run the Application

```bash
# Start the server (from server directory)
cd server
npm run dev

# Start the client (from client directory, in a new terminal)
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔧 Development Scripts

### Server Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
```

### Client Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
Apparel/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── admin-view/ # Admin-specific components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── common/     # Shared components
│   │   │   └── shopping-view/ # Shopping components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── helpers/            # Helper functions
│   └── server.js           # Server entry point
├── docs/                   # Documentation
├── SECURITY_IMPLEMENTATION_BLOG.md
└── README.md
```

## 🔐 Security Implementation

This project implements comprehensive security measures:

### Authentication & Authorization
- **JWT Tokens** with secure cookie storage
- **Auth0 OIDC** for enterprise SSO
- **Role-based access control** (Admin/User)
- **Session management** with automatic expiration

### Input Validation & Sanitization
- **Client-side validation** with Zod schemas
- **Server-side validation** with Express Validator
- **XSS protection** with input sanitization
- **NoSQL injection prevention**

### Security Headers & Rate Limiting
- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** per endpoint type
- **CSRF protection** with token validation

### File Upload Security
- **File type validation** (images only)
- **File size limits** (5MB max)
- **Malicious filename detection**
- **Cloudinary integration** for secure storage

## 🧪 Testing

### Security Testing
```bash
# Test CSRF protection
curl -X POST http://localhost:5000/api/shop/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "123", "quantity": 1}'
# Should return 403 Forbidden

# Test with CSRF token
curl -X GET http://localhost:5000/api/csrf-token
# Get token and include in subsequent requests
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername": "test@example.com", "password": "password"}'
```

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
MONGODB_URI=your-production-mongodb-uri
AUTH0_DOMAIN=your-production-auth0-domain
CLIENT_URL=https://your-domain.com
```

### Build for Production
```bash
# Build client
cd client
npm run build

# Start server in production mode
cd ../server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth0/login` - Auth0 login redirect
- `GET /api/auth0/callback` - Auth0 callback handler

### Product Endpoints
- `GET /api/shop/products` - Get all products
- `GET /api/shop/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)

### Cart Endpoints
- `GET /api/shop/cart/:userId` - Get user cart
- `POST /api/shop/cart` - Add item to cart
- `PUT /api/shop/cart/:itemId` - Update cart item
- `DELETE /api/shop/cart/:itemId` - Remove cart item

### Order Endpoints
- `POST /api/shop/order` - Create order
- `GET /api/shop/order/list/:userId` - Get user orders
- `GET /api/admin/orders` - Get all orders (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OWASP](https://owasp.org/) for security guidelines
- [Auth0](https://auth0.com/) for authentication services
- [MongoDB](https://www.mongodb.com/) for database services
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

## 📞 Support

If you have any questions or need help:

- 🐛 Issues: [GitHub Issues](https://github.com/wgnadun/Apparel/issues)
- 🧑‍💻 Author: [Nadun Dananjaya](https://github.com/wgnadun)

## 🔗 Related Links

- [Security Implementation Blog](SECURITY_IMPLEMENTATION_BLOG.md)
- [Validation Implementation Guide](VALIDATION_IMPLEMENTATION.md)
- [CSRF Implementation Details](CSRF_IMPLEMENTATION.md)