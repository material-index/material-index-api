# Material Index Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Database Version](https://img.shields.io/badge/Database%20Version-1.0.0-blue.svg)](https://github.com/material-index/material-index-api)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green.svg)](https://supabase.com)

## 🌟 Overview

The **Material Index Database** is a comprehensive collection of material property data, designed to provide developers and researchers with access to structured material information for engineering, design, and research applications.

This repository contains:
- 📊 **Database Schema** - Complete database structure and relationships
- 🛠️ **SDKs for Multiple Languages** - Easy integration with your applications
- 📖 **Data Documentation** - Comprehensive material data specifications
- 🔧 **Database Tools** - Utilities for data management and migration

## 🚀 Quick Start

### API Gateway Access
```bash
# Material Index API Gateway
https://api.material-index.com/v1

# Database Schema Access
# Access material data through the API gateway
# No direct database access required
```

### SDK Installation

#### TypeScript/JavaScript
```bash
npm install @material-index/database-client
```

#### Python
```bash
pip install material-index-database
```

## 📊 Database Schema

### Core Tables

#### Materials
- **Primary Key**: `id` (integer)
- **Name**: Material name and variations
- **Category**: Material classification
- **Properties**: Associated material properties
- **Metadata**: Creation, updates, and verification status

#### Categories
- **Hierarchical Structure**: Parent-child relationships
- **Material Classification**: Organized material taxonomy
- **Slugs**: URL-friendly identifiers

#### Properties
- **Property Definitions**: Material property specifications
- **Units**: Measurement units and data types
- **Categories**: Property classification system
- **Searchability**: Filterable and searchable properties

### Relationships
```
Materials ←→ Categories (Many-to-One)
Materials ←→ Properties (Many-to-Many)
Properties ←→ Property Categories (Many-to-One)
```

## 🛠️ SDKs

### TypeScript/JavaScript SDK
```typescript
import { MaterialIndexAPI } from '@material-index/api-client';

const api = new MaterialIndexAPI({
  baseURL: 'https://api.material-index.com/v1',
  apiKey: 'your-api-key'
});

// Query materials
const materials = await api.materials.list({
  category: 'metals',
  limit: 20
});

// Search properties
const properties = await api.properties.search({
  query: 'density',
  dataType: 'number'
});
```

### Python SDK
```python
from material_index_api import MaterialIndexAPI

api = MaterialIndexAPI(
    base_url='https://api.material-index.com/v1',
    api_key='your-api-key'
)

# Query materials
materials = api.materials.list(
    category='metals',
    limit=20
)

# Search properties
properties = api.properties.search(
    query='density',
    data_type='number'
)
```

## 📊 Data Structure

### Material Data
```json
{
  "id": 1,
  "name": "Steel",
  "description": "A strong, low-cost material used in construction",
  "category_id": 1,
  "alternative_names": ["Iron alloy", "Carbon steel"],
  "scientific_name": "Ferrum",
  "distribution": "Global",
  "variation_name": "Stainless Steel 304",
  "is_verified": true,
  "source": "Material Index Database",
  "ingredients": ["Iron", "Carbon", "Chromium"],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Property Data
```json
{
  "id": 1,
  "name": "Density",
  "unit": "kg/m³",
  "description": "Mass per unit volume of a material",
  "property_category_id": 1,
  "data_type": "number",
  "is_filterable": true,
  "is_searchable": false
}
```

### Category Data
```json
{
  "id": 1,
  "name": "Metals",
  "description": "Materials primarily composed of metallic elements",
  "parent_id": null,
  "slug": "metals"
}
```

## 🔧 Database Tools

### Migration Scripts
```bash
# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Reset database
npm run reset
```

### Data Validation
```bash
# Validate data integrity
npm run validate

# Check data consistency
npm run check-consistency
```

## 📈 Data Statistics

- **Materials**: 10,000+ material entries
- **Categories**: 50+ material categories
- **Properties**: 200+ material properties
- **Property Categories**: 20+ property classifications
- **Data Sources**: Verified from multiple scientific sources
- **Update Frequency**: Weekly data updates

## 🔐 API Security

### Authentication
- **API Key Authentication**: Secure access with API keys
- **Rate Limiting**: Fair usage policies and limits
- **HTTPS Only**: All communications encrypted

### Data Privacy
- **No Personal Data**: No user information stored
- **Public Domain**: All material data is publicly available
- **Open Source**: API schema and tools are open source

## 📚 Documentation

### API Schema
- **Endpoints**: Complete API endpoint definitions
- **Data Models**: Material, category, and property schemas
- **Authentication**: API key authentication
- **Rate Limiting**: Query rate limits and policies

### API Documentation
- **Endpoints**: Material Index API endpoints
- **Authentication**: API key authentication
- **Rate Limiting**: Query rate limits
- **Error Handling**: Error response formats

## 🚀 API Gateway

### Material Index API
- **RESTful API**: Complete REST API for material data
- **Rate Limiting**: Built-in rate limiting and quotas
- **Authentication**: API key-based authentication
- **Documentation**: Complete API documentation

### SDK Integration
- **Multi-language**: TypeScript, Python, and more
- **Easy Integration**: Simple SDK installation and usage
- **Type Safety**: Full TypeScript support
- **Examples**: Comprehensive usage examples

## 🤝 Contributing

### Data Contributions
- **Material Data**: Submit new material entries through API
- **Property Data**: Add new material properties via API
- **Category Data**: Suggest new material categories
- **Data Validation**: Help verify existing data

### Code Contributions
- **SDKs**: Improve language-specific SDKs
- **API Client**: Enhance API client libraries
- **Documentation**: Improve API documentation
- **Testing**: Add comprehensive test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **Database Status**: [status.material-index.com](https://status.material-index.com)
- **Community**: [GitHub Discussions](https://github.com/material-index/material-index-api/discussions)
- **Email**: [info@material-index.com](mailto:info@material-index.com)

## 🔗 Links

- **Website**: [material-index.com](https://material-index.com)
- **API Gateway**: [api.material-index.com](https://api.material-index.com)
- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **GitHub**: [github.com/material-index/material-index-api](https://github.com/material-index/material-index-api)

---

**Material Index Database** - Comprehensive material data for developers and researchers 🚀