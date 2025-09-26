# Material Index API - Documentation & SDKs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Version](https://img.shields.io/badge/API%20Version-1.0.0-blue.svg)](https://api.material-index.com/v1)
[![Documentation](https://img.shields.io/badge/Documentation-OpenAPI%203.0-green.svg)](./docs/)

## 🌟 Overview

The **Material Index API** provides comprehensive access to material property data, enabling developers to build applications that require material information for engineering, design, and research purposes.

This repository contains:
- 📚 **Complete API Documentation**
- 🛠️ **SDKs for Multiple Languages**
- 📖 **Usage Examples and Guides**
- 🔧 **Developer Tools and Resources**

## 🚀 Quick Start

### API Access
```bash
# Base URL
https://api.material-index.com/v1

# Health Check
curl https://api.material-index.com/v1/health

# Get Materials
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.material-index.com/v1/materials
```

### SDK Installation

#### TypeScript/JavaScript
```bash
npm install @material-index/api-client
```

#### Python
```bash
pip install material-index-api
```

## 📚 Documentation

### API Reference
- **[OpenAPI Specification](./docs/openapi.yaml)** - Complete API reference
- **[API Endpoints](./docs/API_ENDPOINTS_IMPLEMENTATION.md)** - Detailed endpoint documentation
- **[Authentication](./docs/SECURITY.md)** - API key and JWT authentication
- **[Rate Limiting](./docs/SECURITY.md#rate-limiting)** - Usage limits and quotas

### Developer Guides
- **[Getting Started](./docs/API_SPECIFICATION.md)** - Quick start guide
- **[SDK Documentation](./docs/SDK_DESIGN.md)** - SDK usage examples
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture overview
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Data structure reference

## 🛠️ SDKs

### TypeScript/JavaScript SDK
```typescript
import { MaterialIndexAPI } from '@material-index/api-client';

const api = new MaterialIndexAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.material-index.com/v1'
});

// Get materials
const materials = await api.materials.list({
  page: 1,
  limit: 20,
  search: 'copper'
});
```

### Python SDK
```python
from material_index import MaterialIndexAPI

api = MaterialIndexAPI(api_key='your-api-key')

# Get materials
materials = api.materials.list(
    page=1,
    limit=20,
    search='copper'
)
```

## 📖 Examples

Check out our [examples directory](./examples/) for:
- **Basic API Usage** - Simple requests and responses
- **Advanced Search** - Complex filtering and pagination
- **SDK Integration** - Language-specific examples
- **Real-world Applications** - Complete use cases

## 🔧 Developer Tools

### API Testing
- **Postman Collection** - Import our collection for easy testing
- **Insomnia Workspace** - Ready-to-use API workspace
- **cURL Examples** - Command-line examples for all endpoints

### Code Generation
- **OpenAPI Generator** - Generate SDKs for any language
- **Type Definitions** - TypeScript interfaces and types
- **Schema Validation** - JSON Schema for request/response validation

## 🌐 API Endpoints

### Core Resources
- **Materials** - Material data and properties
- **Categories** - Material classification system
- **Properties** - Material property definitions
- **Search** - Advanced search and filtering

### System
- **Health Check** - API status and version
- **Rate Limits** - Usage monitoring and limits

## 🔐 Authentication

### API Key Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.material-index.com/v1/materials
```

### Supabase JWT (Advanced)
```bash
curl -H "Authorization: Bearer SUPABASE_JWT_TOKEN" \
     https://api.material-index.com/v1/materials
```

## 📊 Rate Limits

| Plan | Requests/Minute | Requests/Day | Burst Limit |
|------|-----------------|---------------|-------------|
| Free | 60 | 1,000 | 100 |
| Pro | 300 | 10,000 | 500 |
| Enterprise | 1,000 | 100,000 | 2,000 |

## 🚀 Deployment

The Material Index API is designed to run independently on any hosting platform:

### One.com Webspace
- **Frontend**: Static files (HTML, CSS, JS)
- **Backend**: Node.js API server
- **Database**: Supabase cloud database
- **No GitHub dependency** required for deployment

### Self-Hosted
- **Docker**: Containerized deployment
- **Kubernetes**: Scalable orchestration
- **Traditional**: Direct server deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/material-index/material-index-api.git

# Install dependencies
npm install

# Run documentation server
npm run docs:serve

# Run tests
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **API Status**: [status.material-index.com](https://status.material-index.com)
- **Community**: [GitHub Discussions](https://github.com/material-index/material-index-api/discussions)
- **Email**: [info@material-index.com](mailto:info@material-index.com)

## 🔗 Links

- **Website**: [material-index.com](https://material-index.com)
- **API Portal**: [api.material-index.com](https://api.material-index.com)
- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **Status Page**: [status.material-index.com](https://status.material-index.com)

---

**Material Index API** - Empowering developers with comprehensive material data 🚀