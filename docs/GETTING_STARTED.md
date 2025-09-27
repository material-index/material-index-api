# Getting Started with Material Index API

This guide will help you get up and running with the Material Index API in just a few minutes.

## 🎯 What is the Material Index API?

The Material Index API provides comprehensive access to material property data, enabling developers to build applications that require material information for engineering, design, and research purposes.

## 🚀 Quick Start

### 1. Get Your API Key

1. Visit [api.material-index.com](https://api.material-index.com)
2. Sign up for a free account
3. Generate your API key from the dashboard

### 2. Make Your First Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.material-index.com/v1/materials
```

### 3. Install an SDK (Optional)

#### TypeScript/JavaScript
```bash
npm install @material-index/api-client
```

```typescript
import { MaterialIndexAPI } from '@material-index/api-client';

const api = new MaterialIndexAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.material-index.com/v1'
});

// Get materials
const materials = await api.materials.list();
console.log(materials);
```

#### Python
```bash
pip install material-index-api
```

```python
from material_index import MaterialIndexAPI

api = MaterialIndexAPI(api_key='your-api-key')

# Get materials
materials = api.materials.list()
print(materials)
```

## 📋 API Overview

### Base URL
```
https://api.material-index.com/v1
```

### Authentication
All requests require an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

### Response Format
All responses are in JSON format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

## 🔍 Core Endpoints

### Materials
- `GET /materials` - List all materials
- `GET /materials/{id}` - Get specific material
- `GET /materials/search` - Search materials

### Categories
- `GET /categories` - List material categories
- `GET /categories/{id}` - Get specific category
- `GET /categories/{id}/materials` - Get materials in category

### Properties
- `GET /properties` - List material properties
- `GET /properties/{id}` - Get specific property
- `GET /property-categories` - List property categories

## 📊 Example Use Cases

### 1. Material Search
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials/search?q=aluminum"
```

### 2. Category Filtering
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials?category=1"
```

### 3. Pagination
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials?page=2&limit=10"
```

## 🔧 SDK Examples

### TypeScript/JavaScript SDK
```typescript
import { MaterialIndexAPI } from '@material-index/api-client';

const api = new MaterialIndexAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.material-index.com/v1'
});

// List materials with pagination
const materials = await api.materials.list({
  page: 1,
  limit: 20,
  search: 'steel'
});

// Get specific material
const material = await api.materials.get(1);

// Search materials
const searchResults = await api.materials.search({
  query: 'aluminum',
  category: 1
});
```

### Python SDK
```python
from material_index import MaterialIndexAPI

api = MaterialIndexAPI(api_key='your-api-key')

# List materials with pagination
materials = api.materials.list(
    page=1,
    limit=20,
    search='steel'
)

# Get specific material
material = api.materials.get(1)

# Search materials
search_results = api.materials.search(
    query='aluminum',
    category=1
)
```

## 🚦 Rate Limits

| Plan | Requests/Hour | Requests/Day |
|------|---------------|---------------|
| Free | 1,000 | 10,000 |
| Pro | 10,000 | 100,000 |
| Enterprise | Custom | Custom |

## 🔐 Security Best Practices

1. **Keep your API key secure** - Never expose it in client-side code
2. **Use HTTPS** - Always make requests over HTTPS
3. **Monitor usage** - Keep track of your API usage
4. **Rotate keys** - Regularly rotate your API keys

## 📚 Next Steps

- [API Reference](./API_REFERENCE.md) - Complete endpoint documentation
- [Authentication](./AUTHENTICATION.md) - Detailed authentication guide
- [SDKs](./SDKS.md) - Language-specific SDK documentation
- [Examples](./EXAMPLES.md) - Code examples and use cases

## 🆘 Need Help?

- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **Email**: [info@material-index.com](mailto:info@material-index.com)
- **GitHub**: [github.com/material-index/material-index-api](https://github.com/material-index/material-index-api)

---

**Ready to build with material data?** Let's get started! 🚀
