# API Specification

## 🌐 Base URL
```
Production: https://api.material-index.com/v1
Staging: https://staging-api.material-index.com/v1
```

## 🔐 Authentication

### API Key Authentication
All requests require an API key in the header:
```http
Authorization: Bearer YOUR_API_KEY
```

### Supabase JWT Authentication
For authenticated users:
```http
Authorization: Bearer SUPABASE_JWT_TOKEN
```

## 📊 Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Rate Limit Tiers
- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

## 📋 API Endpoints

### Materials

#### Get All Materials
```http
GET /materials
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `category_id` (integer): Filter by category ID
- `search` (string): Search in name and description
- `verified` (boolean): Filter by verification status
- `sort` (string): Sort field (name, created_at, updated_at)
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Aluminum 6061",
      "description": "High-strength aluminum alloy",
      "material_category_id": 1,
      "alternative_names": ["Al 6061", "AA6061"],
      "scientific_name": "Aluminum 6061-T6",
      "distribution": "Global",
      "variation_name": "T6 Temper",
      "custom_id": "uuid-string",
      "version": 1.0,
      "is_verified": true,
      "source": "Material Database v1.0",
      "ingredients": [1, 2, 3],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "slug": "aluminum-6061",
      "group_image_url": "https://example.com/image.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### Get Material by ID
```http
GET /materials/{id}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Aluminum 6061",
    "description": "High-strength aluminum alloy",
    "material_category_id": 1,
    "category": {
      "id": 1,
      "name": "Metals",
      "tooltip": "Metallic materials"
    },
    "alternative_names": ["Al 6061", "AA6061"],
    "scientific_name": "Aluminum 6061-T6",
    "distribution": "Global",
    "variation_name": "T6 Temper",
    "custom_id": "uuid-string",
    "version": 1.0,
    "is_verified": true,
    "source": "Material Database v1.0",
    "ingredients": [1, 2, 3],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "slug": "aluminum-6061",
    "group_image_url": "https://example.com/image.jpg",
    "properties": [
      {
        "id": 1,
        "property": {
          "id": 1,
          "name": "Density",
          "unit": "kg/m³",
          "data_type": "numeric"
        },
        "value": 2700,
        "value_min": 2680,
        "value_max": 2720,
        "test_standard": "ASTM B209",
        "notes": "Typical density for T6 temper",
        "source": "Material Properties Database",
        "is_verified": true
      }
    ],
    "images": [
      {
        "id": 1,
        "filename": "aluminum-6061-1.jpg",
        "original_filename": "aluminum_sample.jpg",
        "file_path": "/images/materials/aluminum-6061-1.jpg",
        "file_size": 1024000,
        "mime_type": "image/jpeg",
        "alt_text": "Aluminum 6061 sample",
        "is_primary": true
      }
    ]
  }
}
```

#### Search Materials
```http
GET /materials/search
```

**Query Parameters:**
- `q` (string, required): Search query
- `category_id` (integer): Filter by category
- `property_filters` (object): Filter by property values
- `limit` (integer): Max results (default: 20)

**Example:**
```http
GET /materials/search?q=aluminum&category_id=1&property_filters={"density":{"min":2000,"max":3000}}
```

### Material Categories

#### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Metals",
      "tooltip": "Metallic materials including alloys",
      "parent_id": null,
      "children": [
        {
          "id": 2,
          "name": "Aluminum Alloys",
          "tooltip": "Aluminum-based alloys",
          "parent_id": 1
        }
      ]
    }
  ]
}
```

#### Get Category by ID
```http
GET /categories/{id}
```

#### Get Materials in Category
```http
GET /categories/{id}/materials
```

### Properties

#### Get All Properties
```http
GET /properties
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "density",
      "name": "Density",
      "unit": "kg/m³",
      "data_type": "numeric",
      "category_id": 1,
      "alternative_name": "Specific Gravity",
      "category": {
        "id": 1,
        "name": "Physical Properties",
        "description": "Basic physical characteristics"
      }
    }
  ]
}
```

#### Get Property by ID
```http
GET /properties/{id}
```

### Property Categories

#### Get All Property Categories
```http
GET /property-categories
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Physical Properties",
      "description": "Basic physical characteristics of materials"
    }
  ]
}
```

## 🔍 Advanced Features

### Filtering and Search

#### Material Property Filtering
```http
GET /materials?filters[properties][density][min]=2000&filters[properties][density][max]=3000
```

#### Full-text Search
```http
GET /materials/search?q=aluminum alloy&fields=name,description,scientific_name
```

### Sorting and Pagination

#### Sorting Options
- `name`: Alphabetical by name
- `created_at`: By creation date
- `updated_at`: By last update
- `category`: By category name

#### Pagination
All list endpoints support pagination:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

## 📊 Response Formats

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "limit",
      "reason": "Value must be between 1 and 100"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "req_123456"
  }
}
```

### List Response with Pagination
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## 🚨 Error Codes

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

### Error Codes
- `INVALID_API_KEY`: API key is invalid or expired
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `VALIDATION_ERROR`: Request validation failed
- `MATERIAL_NOT_FOUND`: Material with given ID not found
- `CATEGORY_NOT_FOUND`: Category with given ID not found
- `PROPERTY_NOT_FOUND`: Property with given ID not found
- `INTERNAL_ERROR`: Internal server error

## 🔄 Webhooks (Future)

### Webhook Events
- `material.created`: New material added
- `material.updated`: Material updated
- `material.deleted`: Material removed
- `category.updated`: Category structure changed

### Webhook Payload
```json
{
  "event": "material.updated",
  "data": {
    "id": 1,
    "name": "Aluminum 6061",
    "changes": ["description", "properties"]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 📈 Usage Analytics

### Request Headers
```http
X-API-Key: your-api-key
X-Client-Version: 1.0.0
X-Request-ID: unique-request-id
```

### Response Headers
```http
X-Request-ID: unique-request-id
X-Response-Time: 150ms
X-Cache-Status: HIT
```
