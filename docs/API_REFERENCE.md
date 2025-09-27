# API Reference

Complete reference for the Material Index API endpoints, parameters, and responses.

## 🌐 Base URL

```
https://api.material-index.com/v1
```

## 🔐 Authentication

All API requests require authentication using an API key:

```bash
Authorization: Bearer YOUR_API_KEY
```

## 📊 Response Format

All API responses follow a consistent JSON structure:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

## 🏗️ Materials Endpoints

### List Materials
```http
GET /materials
```

**Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `category` (integer, optional): Filter by category ID
- `search` (string, optional): Search in name and description

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials?page=1&limit=20&search=steel"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Steel",
      "description": "A strong, low-cost material used in construction",
      "material_category_id": 1,
      "alternative_names": "Iron alloy, Carbon steel",
      "scientific_name": "Ferrum",
      "distribution": "Global",
      "variation_name": "Stainless Steel 304",
      "custom_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "version": 1,
      "is_verified": true,
      "source": "Material Index Database",
      "ingredients": ["Iron", "Carbon", "Chromium"],
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "created_by": "admin",
      "slug": "steel",
      "group_image_url": "https://example.com/images/steel.png"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Get Material by ID
```http
GET /materials/{id}
```

**Parameters:**
- `id` (integer, required): Material ID

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials/1"
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Steel",
    "description": "A strong, low-cost material used in construction",
    "material_category_id": 1,
    "alternative_names": "Iron alloy, Carbon steel",
    "scientific_name": "Ferrum",
    "distribution": "Global",
    "variation_name": "Stainless Steel 304",
    "custom_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "version": 1,
    "is_verified": true,
    "source": "Material Index Database",
    "ingredients": ["Iron", "Carbon", "Chromium"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "created_by": "admin",
    "slug": "steel",
    "group_image_url": "https://example.com/images/steel.png"
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Search Materials
```http
GET /materials/search
```

**Parameters:**
- `q` (string, required): Search query
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `category` (integer, optional): Filter by category ID

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials/search?q=aluminum&page=1&limit=10"
```

## 🏷️ Categories Endpoints

### List Categories
```http
GET /categories
```

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/categories"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Metals",
      "description": "Materials primarily composed of metallic elements",
      "parent_id": null,
      "slug": "metals",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ],
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Get Category by ID
```http
GET /categories/{id}
```

### Get Materials in Category
```http
GET /categories/{id}/materials
```

**Parameters:**
- `id` (integer, required): Category ID
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)

## 🔬 Properties Endpoints

### List Properties
```http
GET /properties
```

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/properties"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Density",
      "unit": "kg/m³",
      "description": "Mass per unit volume of a material",
      "property_category_id": 1,
      "data_type": "number",
      "is_filterable": true,
      "is_searchable": false,
      "slug": "density",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ],
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Get Property by ID
```http
GET /properties/{id}
```

### List Property Categories
```http
GET /property-categories
```

### Search Properties
```http
GET /properties/search
```

**Parameters:**
- `q` (string, required): Search query
- `category` (integer, optional): Filter by property category ID

## 🚦 Rate Limiting

API requests are rate limited to ensure fair usage:

| Plan | Requests/Hour | Requests/Day |
|------|---------------|---------------|
| Free | 1,000 | 10,000 |
| Pro | 10,000 | 100,000 |
| Enterprise | Custom | Custom |

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid parameter value",
  "details": {
    "parameter": "limit",
    "value": "invalid",
    "expected": "integer between 1 and 100"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Material with ID 999 not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retry_after": 3600
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 🔍 Advanced Filtering

### Material Filtering
```bash
# Filter by category
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials?category=1"

# Search with pagination
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials/search?q=steel&page=2&limit=10"

# Multiple filters
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/materials?category=1&search=aluminum"
```

### Property Filtering
```bash
# Filter by property category
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/properties?category=1"

# Search properties
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.material-index.com/v1/properties/search?q=density"
```

## 📊 Response Metadata

All responses include metadata:

```json
{
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0",
    "request_id": "req_123456789",
    "processing_time": "45ms"
  }
}
```

## 🔗 Related Documentation

- [Getting Started](./GETTING_STARTED.md)
- [Authentication](./AUTHENTICATION.md)
- [SDKs](./SDKS.md)
- [Examples](./EXAMPLES.md)

---

**API Reference** - Complete endpoint documentation 🚀
