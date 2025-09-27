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

### Database Access
```bash
# Supabase Database URL
https://likqvubiqoooqxrhvlsn.supabase.co

# Database Connection
Host: db.likqvubiqoooqxrhvlsn.supabase.co
Port: 5432
Database: postgres
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
import { MaterialIndexDatabase } from '@material-index/database-client';

const db = new MaterialIndexDatabase({
  supabaseUrl: 'https://likqvubiqoooqxrhvlsn.supabase.co',
  supabaseKey: 'your-supabase-key'
});

// Query materials
const materials = await db.materials.list({
  category: 'metals',
  limit: 20
});

// Search properties
const properties = await db.properties.search({
  query: 'density',
  dataType: 'number'
});
```

### Python SDK
```python
from material_index_database import MaterialIndexDatabase

db = MaterialIndexDatabase(
    supabase_url='https://likqvubiqoooqxrhvlsn.supabase.co',
    supabase_key='your-supabase-key'
)

# Query materials
materials = db.materials.list(
    category='metals',
    limit=20
)

# Search properties
properties = db.properties.search(
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

## 🔐 Database Security

### Row Level Security (RLS)
- **Public Access**: Read-only access to material data
- **Authenticated Access**: Enhanced query capabilities
- **Admin Access**: Full database management

### Data Privacy
- **No Personal Data**: No user information stored
- **Public Domain**: All material data is publicly available
- **Open Source**: Database schema and tools are open source

## 📚 Documentation

### Database Schema
- **Tables**: Complete table definitions
- **Relationships**: Foreign key relationships
- **Indexes**: Performance optimization indexes
- **Constraints**: Data validation rules

### API Documentation
- **Endpoints**: Database query endpoints
- **Authentication**: Supabase authentication
- **Rate Limiting**: Query rate limits
- **Error Handling**: Error response formats

## 🚀 Deployment

### Supabase Cloud
- **Hosted Database**: Fully managed PostgreSQL
- **Automatic Backups**: Daily automated backups
- **Scaling**: Automatic scaling based on usage
- **Monitoring**: Built-in performance monitoring

### Self-Hosted
- **PostgreSQL**: Standard PostgreSQL database
- **Docker**: Containerized deployment
- **Kubernetes**: Scalable orchestration

## 🤝 Contributing

### Data Contributions
- **Material Data**: Submit new material entries
- **Property Data**: Add new material properties
- **Category Data**: Suggest new material categories
- **Data Validation**: Help verify existing data

### Code Contributions
- **SDKs**: Improve language-specific SDKs
- **Tools**: Enhance database management tools
- **Documentation**: Improve data documentation
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
- **Database**: [db.material-index.com](https://db.material-index.com)
- **Supabase**: [supabase.com](https://supabase.com)
- **GitHub**: [github.com/material-index/material-index-api](https://github.com/material-index/material-index-api)

---

**Material Index Database** - Comprehensive material data for developers and researchers 🚀