# Material Index API Gateway

A comprehensive API platform that exposes a Supabase material database through a modern, developer-friendly interface. Inspired by Redoc, it provides interactive documentation, SDKs, and a pay-as-you-go billing system.

## 🚀 Quick Start

### 📖 For Developers
1. **New to the project?** Start with [Architecture](./docs/ARCHITECTURE.md) to understand the system
2. **Ready to code?** Follow [API Implementation](./docs/API_ENDPOINTS_IMPLEMENTATION.md) for backend development
3. **Security concerns?** Review [Security](./docs/SECURITY.md) for comprehensive security measures
4. **Deployment ready?** Check [Deployment](./docs/DEPLOYMENT.md) for production setup

### 🛠️ For Contributors
- **Project Status**: See [Project Status](./docs/PROJECT_STATUS.md) for current milestones
- **Implementation Plan**: Follow [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) for development phases
- **API Reference**: Use [API Specification](./docs/API_SPECIFICATION.md) for endpoint details

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Redis (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd material-index-api
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   nano .env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:3000/docs

## 📁 Project Structure

```
material-index-api/
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Express.js API gateway
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── python-sdk/             # Python SDK (future)
├── typescript-sdk/         # TypeScript SDK (future)
├── docs/                   # Documentation
├── .env                    # Environment variables
└── README.md
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

## 📚 Documentation

### 🏗️ Architecture & Design
- [**Architecture**](./docs/ARCHITECTURE.md) - System design, components, and data flow
- [**Tech Stack**](./docs/TECH_STACK.md) - Technology choices, rationale, and setup
- [**Database Schema**](./docs/DATABASE_SCHEMA.md) - Supabase database structure and relationships

### 🔌 API Development
- [**API Specification**](./docs/API_SPECIFICATION.md) - Complete API endpoint documentation
- [**API Implementation**](./docs/API_ENDPOINTS_IMPLEMENTATION.md) - Detailed implementation guide for backend development
- [**SDK Design**](./docs/SDK_DESIGN.md) - TypeScript and Python SDK architecture

### 🛡️ Security & Deployment
- [**Security**](./docs/SECURITY.md) - Comprehensive security measures, OAuth 2.0, MFA, and best practices
- [**Deployment**](./docs/DEPLOYMENT.md) - Production deployment and infrastructure setup

### 📋 Project Management
- [**Project Status**](./docs/PROJECT_STATUS.md) - Current development status, milestones, and roadmap
- [**Implementation Plan**](./docs/IMPLEMENTATION_PLAN.md) - Step-by-step development phases

## 🌐 API Endpoints

### Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.material-index.com/v1`

### Main Endpoints
- `GET /materials` - List materials with pagination and filtering
- `GET /materials/{id}` - Get specific material
- `GET /materials/search` - Search materials
- `GET /categories` - List material categories
- `GET /properties` - List material properties

## 🔑 Authentication

All API requests require an API key in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

## 📊 Rate Limiting

- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

## 🚀 Deployment

### SSH Server Deployment
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Deploy to SSH server
rsync -avz --delete frontend/dist/ user@ssh.material-index.com:/api/
rsync -avz --delete backend/dist/ user@ssh.material-index.com:/api/backend/

# Restart services
ssh user@ssh.material-index.com
cd /api/backend
pm2 restart material-index-api
```

## 🛠️ Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Query** - Data fetching
- **React Router** - Routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - Database and auth
- **Redis** - Caching and rate limiting
- **Joi** - Validation
- **Winston** - Logging

## 📈 Features

### 🔧 Core Features
- ✅ **Interactive Documentation** - Redoc-inspired API docs
- ✅ **Multi-language SDKs** - TypeScript and Python
- ✅ **Real-time Updates** - WebSocket support
- ✅ **Developer Dashboard** - Usage analytics
- ✅ **Search & Filtering** - Advanced query capabilities
- ✅ **Pagination** - Efficient data loading
- ✅ **Caching** - Redis-based performance optimization

### 🛡️ Enhanced Security
- ✅ **OAuth 2.0 & OpenID Connect** - Modern authentication standards
- ✅ **Multi-Factor Authentication (MFA)** - TOTP with backup codes
- ✅ **Advanced Rate Limiting** - Adaptive throttling and DDoS protection
- ✅ **Comprehensive Input Validation** - SQL injection prevention
- ✅ **Security Auditing** - Automated vulnerability scanning and fuzz testing
- ✅ **Dependency Management** - Automated security updates
- ✅ **Security Headers** - CSP, XSS protection, and more

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- Documentation: [docs/](./docs/)
- Issues: [GitHub Issues](https://github.com/material-index/api/issues)
- Email: support@material-index.com

---

**Built with ❤️ by the Material Index Team**


