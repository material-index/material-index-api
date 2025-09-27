# Material Index Database Schema

This document describes the database schema for the Material Index API, focusing on material data, categories, and properties management.

## 🏗️ Database Overview

The Material Index database is designed to store and manage comprehensive material property data through a RESTful API gateway at `api.material-index.com`.

## 📊 Core Tables

### Materials Table
```sql
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    material_category_id INTEGER REFERENCES categories(id),
    alternative_names TEXT,
    scientific_name VARCHAR(255),
    distribution VARCHAR(255),
    variation_name VARCHAR(255),
    custom_id UUID UNIQUE,
    version INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT false,
    source VARCHAR(255),
    ingredients TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    group_image_url TEXT
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    description TEXT,
    property_category_id INTEGER REFERENCES property_categories(id),
    data_type VARCHAR(50) NOT NULL,
    is_filterable BOOLEAN DEFAULT true,
    is_searchable BOOLEAN DEFAULT false,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Property Categories Table
```sql
CREATE TABLE property_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔗 Relationships

### Material-Category Relationship
- **One-to-Many**: One category can have many materials
- **Foreign Key**: `materials.material_category_id → categories.id`
- **Hierarchical**: Categories can have parent categories

### Material-Property Relationship
- **Many-to-Many**: Materials can have multiple properties
- **Junction Table**: `material_properties` (not shown in core schema)
- **Property Values**: Stored in separate `material_property_values` table

### Property-Category Relationship
- **One-to-Many**: One property category can have many properties
- **Foreign Key**: `properties.property_category_id → property_categories.id`

## 📈 Indexes

### Performance Indexes
```sql
-- Materials indexes
CREATE INDEX idx_materials_category ON materials(material_category_id);
CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_materials_slug ON materials(slug);
CREATE INDEX idx_materials_verified ON materials(is_verified);

-- Categories indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Properties indexes
CREATE INDEX idx_properties_category ON properties(property_category_id);
CREATE INDEX idx_properties_filterable ON properties(is_filterable);
CREATE INDEX idx_properties_searchable ON properties(is_searchable);
```

### Search Indexes
```sql
-- Full-text search indexes
CREATE INDEX idx_materials_search ON materials USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_properties_search ON properties USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

## 🔐 Security

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON materials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON property_categories FOR SELECT USING (true);
```

## 📊 Data Types

### Material Data Types
- **id**: Integer (Primary Key)
- **name**: String (Required)
- **description**: Text (Optional)
- **category_id**: Integer (Foreign Key)
- **alternative_names**: Text (Comma-separated)
- **scientific_name**: String (Optional)
- **distribution**: String (Optional)
- **variation_name**: String (Optional)
- **custom_id**: UUID (Unique)
- **version**: Integer (Default: 1)
- **is_verified**: Boolean (Default: false)
- **source**: String (Optional)
- **ingredients**: Array of Strings
- **created_at**: Timestamp
- **updated_at**: Timestamp
- **created_by**: String (Optional)
- **slug**: String (Unique, URL-friendly)
- **group_image_url**: URL (Optional)

### Property Data Types
- **id**: Integer (Primary Key)
- **name**: String (Required)
- **unit**: String (Optional)
- **description**: Text (Optional)
- **property_category_id**: Integer (Foreign Key)
- **data_type**: String (Required: 'number', 'string', 'boolean')
- **is_filterable**: Boolean (Default: true)
- **is_searchable**: Boolean (Default: false)
- **slug**: String (Unique, URL-friendly)

## 🚀 API Integration

### Database Access
- **No Direct Access**: Database is accessed only through the API gateway
- **API Endpoint**: `https://api.material-index.com/v1`
- **Authentication**: API key required for all requests
- **Rate Limiting**: Built-in rate limiting and quotas

### Data Flow
```
Client → API Gateway → Database
     ↓
   Response ← API Gateway ← Database
```

## 📋 Schema Versioning

### Version Control
- **Schema Version**: 1.0.0
- **Migration Scripts**: Managed through API gateway
- **Backward Compatibility**: Maintained for API clients
- **Data Validation**: Enforced at API level

### Migration Strategy
1. **Backward Compatible**: New fields are optional
2. **Gradual Rollout**: Changes deployed incrementally
3. **Data Validation**: API validates all data before storage
4. **Error Handling**: Clear error messages for invalid data

## 🔧 Database Tools

### Schema Management
```bash
# Generate schema documentation
npm run schema:docs

# Validate schema consistency
npm run schema:validate

# Generate migration scripts
npm run schema:migrate
```

### Data Management
```bash
# Seed database with sample data
npm run data:seed

# Validate data integrity
npm run data:validate

# Export data for backup
npm run data:export
```

## 📚 API Endpoints

### Materials
- `GET /materials` - List all materials
- `GET /materials/{id}` - Get specific material
- `GET /materials/search` - Search materials

### Categories
- `GET /categories` - List all categories
- `GET /categories/{id}` - Get specific category
- `GET /categories/{id}/materials` - Get materials in category

### Properties
- `GET /properties` - List all properties
- `GET /properties/{id}` - Get specific property
- `GET /property-categories` - List property categories

## 🔗 Related Documentation

- [API Reference](./API_REFERENCE.md)
- [Getting Started](./GETTING_STARTED.md)
- [SDK Documentation](./SDK_DESIGN.md)
- [Security Policy](./SECURITY.md)

---

**Database Schema** - Complete material data structure for the Material Index API 🚀
