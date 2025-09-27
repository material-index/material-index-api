# Database Schema

## 🗄️ Supabase Database Structure

This document outlines the database schema for the Material Index API, focusing on the tables that will be exposed through the API.

## 📊 Exposed Tables

### Materials Table
```sql
CREATE TABLE public.materials (
  id bigint NOT NULL,
  name text,
  description text,
  material_category_id bigint,
  alternative_names text,
  scientific_name text,
  distribution text,
  variation_name text,
  custom_id uuid DEFAULT gen_random_uuid(),
  version double precision,
  is_verified boolean NOT NULL,
  source text,
  ingredients ARRAY,
  created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  created_by uuid,
  slug character varying,
  group_image_url text,
  CONSTRAINT materials_pkey PRIMARY KEY (id),
  CONSTRAINT materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT materials_material_category_id_fkey FOREIGN KEY (material_category_id) REFERENCES public.material_categories(id)
);
```

**Key Fields:**
- `id`: Primary key (bigint)
- `name`: Material name
- `description`: Detailed description
- `material_category_id`: Foreign key to material_categories
- `alternative_names`: Alternative names for the material
- `scientific_name`: Scientific/technical name
- `is_verified`: Verification status
- `slug`: URL-friendly identifier
- `group_image_url`: Primary image URL

### Material Categories Table
```sql
CREATE TABLE public.material_categories (
  id bigint NOT NULL,
  name text NOT NULL DEFAULT ''::text,
  tooltip text DEFAULT ''::text,
  parent_id bigint,
  created_by uuid,
  CONSTRAINT material_categories_pkey PRIMARY KEY (id),
  CONSTRAINT material_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT material_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.material_categories(id)
);
```

**Key Fields:**
- `id`: Primary key (bigint)
- `name`: Category name
- `tooltip`: Short description
- `parent_id`: Self-referencing foreign key for hierarchy

### Material Properties Table
```sql
CREATE TABLE public.material_properties (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  material_id bigint NOT NULL,
  value numeric,
  value_min numeric,
  value_max numeric,
  test_standard text,
  notes text,
  source text,
  is_verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  property_id bigint,
  property_category bigint,
  unit text,
  created_by uuid,
  CONSTRAINT material_properties_pkey PRIMARY KEY (id),
  CONSTRAINT material_properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT material_properties_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id),
  CONSTRAINT material_properties_property_category_fkey FOREIGN KEY (property_category) REFERENCES public.property_categories(id),
  CONSTRAINT material_properties_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
```

**Key Fields:**
- `id`: Primary key (auto-generated)
- `material_id`: Foreign key to materials
- `property_id`: Foreign key to properties
- `value`: Primary property value
- `value_min`/`value_max`: Value range
- `test_standard`: Testing standard used
- `is_verified`: Verification status

### Properties Table
```sql
CREATE TABLE public.properties (
  slug text NOT NULL DEFAULT ''::text,
  name text NOT NULL DEFAULT ''::text,
  unit text NOT NULL DEFAULT ''::text,
  data_type text NOT NULL DEFAULT ''::text,
  category_id bigint NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_by uuid,
  alternative_name text,
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.property_categories(id),
  CONSTRAINT properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
```

**Key Fields:**
- `id`: Primary key (auto-generated)
- `slug`: URL-friendly identifier
- `name`: Property name
- `unit`: Measurement unit
- `data_type`: Data type (numeric, text, boolean)
- `category_id`: Foreign key to property_categories

### Property Categories Table
```sql
CREATE TABLE public.property_categories (
  id bigint NOT NULL,
  name text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  created_by uuid,
  CONSTRAINT property_categories_pkey PRIMARY KEY (id),
  CONSTRAINT property_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
```

**Key Fields:**
- `id`: Primary key (bigint)
- `name`: Category name
- `description`: Category description

## 🔗 Relationships

### Entity Relationship Diagram
```
materials (1) ←→ (N) material_properties (N) ←→ (1) properties
    ↓
material_categories (1) ←→ (N) materials

properties (N) ←→ (1) property_categories
```

### Key Relationships
1. **Materials → Material Categories**: Many-to-one
2. **Materials → Material Properties**: One-to-many
3. **Properties → Material Properties**: One-to-many
4. **Property Categories → Properties**: One-to-many
5. **Material Categories → Material Categories**: Self-referencing (hierarchy)

## 🚫 Excluded Tables

The following tables contain user-specific data and are **NOT** exposed through the API:

### User Management Tables
- `auth.users` - Supabase auth users
- `user_roles` - User role assignments
- `user_preferences` - User preferences
- `privacy_settings` - Privacy settings

### Consent and Privacy Tables
- `consent_types` - Consent type definitions
- `user_consent` - User consent records
- `consent_audit_log` - Consent audit trail
- `data_subject_requests` - GDPR data requests

### Project and User Data Tables
- `projects` - User projects
- `project_materials` - Project material assignments

### Additional Material Tables
- `material_images` - Material images (handled separately)
- `material_ingredients` - Material composition
- `material_co2e_factors` - CO2 emission factors

## 🔒 Row Level Security (RLS)

### Public Access Policy
```sql
-- Allow public read access to materials
CREATE POLICY "Public read access to materials" ON public.materials
  FOR SELECT USING (true);

-- Allow public read access to material categories
CREATE POLICY "Public read access to material_categories" ON public.material_categories
  FOR SELECT USING (true);

-- Allow public read access to properties
CREATE POLICY "Public read access to properties" ON public.properties
  FOR SELECT USING (true);

-- Allow public read access to property categories
CREATE POLICY "Public read access to property_categories" ON public.property_categories
  FOR SELECT USING (true);

-- Allow public read access to material properties
CREATE POLICY "Public read access to material_properties" ON public.material_properties
  FOR SELECT USING (true);
```

### Authenticated User Policies
```sql
-- Enhanced access for authenticated users
CREATE POLICY "Authenticated user access to materials" ON public.materials
  FOR SELECT USING (auth.role() = 'authenticated');

-- Future: Admin write access
CREATE POLICY "Admin write access to materials" ON public.materials
  FOR ALL USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
```

## 📊 Database Indexes

### Performance Optimization
```sql
-- Material search indexes
CREATE INDEX idx_materials_name ON public.materials USING gin(to_tsvector('english', name));
CREATE INDEX idx_materials_description ON public.materials USING gin(to_tsvector('english', description));
CREATE INDEX idx_materials_category ON public.materials(material_category_id);
CREATE INDEX idx_materials_verified ON public.materials(is_verified);
CREATE INDEX idx_materials_slug ON public.materials(slug);

-- Property search indexes
CREATE INDEX idx_material_properties_material ON public.material_properties(material_id);
CREATE INDEX idx_material_properties_property ON public.material_properties(property_id);
CREATE INDEX idx_material_properties_verified ON public.material_properties(is_verified);

-- Category hierarchy indexes
CREATE INDEX idx_material_categories_parent ON public.material_categories(parent_id);
CREATE INDEX idx_property_categories_name ON public.property_categories(name);
```

## 🔄 Data Validation

### Constraints and Checks
```sql
-- Material constraints
ALTER TABLE public.materials ADD CONSTRAINT check_material_name_not_empty 
  CHECK (length(trim(name)) > 0);

-- Property value constraints
ALTER TABLE public.material_properties ADD CONSTRAINT check_value_range 
  CHECK (value_min IS NULL OR value_max IS NULL OR value_min <= value_max);

-- Category hierarchy constraints
ALTER TABLE public.material_categories ADD CONSTRAINT check_no_self_parent 
  CHECK (parent_id IS NULL OR parent_id != id);
```

## 📈 Data Statistics

### Expected Data Volumes
- **Materials**: 10,000 - 50,000 records
- **Material Properties**: 100,000 - 500,000 records
- **Properties**: 500 - 2,000 records
- **Material Categories**: 100 - 500 records
- **Property Categories**: 20 - 100 records

### Growth Projections
- **Materials**: +1,000/month
- **Properties**: +100/month
- **Material Properties**: +10,000/month

## 🛠️ Database Maintenance

### Regular Maintenance Tasks
1. **Index Optimization**: Monthly index analysis and optimization
2. **Statistics Updates**: Weekly statistics refresh
3. **Vacuum Operations**: Daily vacuum and analyze
4. **Backup Verification**: Daily backup integrity checks

### Monitoring Queries
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```
