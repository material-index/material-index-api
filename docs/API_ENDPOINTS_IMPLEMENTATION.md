# API Endpoints Implementation Plan

## 🎯 Overview

This document provides a detailed implementation plan for the REST API endpoints based on the API Specification. It includes code structure, database queries, validation, and testing strategies.

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── materials.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── properties.controller.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── materials.service.ts
│   │   ├── categories.service.ts
│   │   ├── properties.service.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── materials.routes.ts
│   │   ├── categories.routes.ts
│   │   ├── properties.routes.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── material.types.ts
│   │   ├── category.types.ts
│   │   ├── property.types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── supabase.client.ts
│   │   ├── pagination.ts
│   │   ├── filters.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── controllers/
│   ├── services/
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Core Implementation

### 1. Supabase Client Setup

```typescript
// src/utils/supabase.client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Public client for read-only operations
export const supabasePublic = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY!
);
```

### 2. Type Definitions

```typescript
// src/types/material.types.ts
export interface Material {
  id: number;
  name: string;
  description: string;
  material_category_id: number;
  alternative_names: string[];
  scientific_name: string;
  distribution: string;
  variation_name: string;
  custom_id: string;
  version: number;
  is_verified: boolean;
  source: string;
  ingredients: number[];
  created_at: string;
  updated_at: string;
  slug: string;
  group_image_url?: string;
}

export interface MaterialWithRelations extends Material {
  category?: MaterialCategory;
  properties?: MaterialProperty[];
  images?: MaterialImage[];
}

export interface MaterialProperty {
  id: number;
  material_id: number;
  property: Property;
  value: number;
  value_min?: number;
  value_max?: number;
  test_standard?: string;
  notes?: string;
  source?: string;
  is_verified: boolean;
  unit?: string;
}

export interface MaterialCategory {
  id: number;
  name: string;
  tooltip: string;
  parent_id?: number;
  children?: MaterialCategory[];
}

export interface Property {
  id: number;
  slug: string;
  name: string;
  unit: string;
  data_type: 'numeric' | 'text' | 'boolean';
  category_id: number;
  alternative_name?: string;
  category?: PropertyCategory;
}

export interface PropertyCategory {
  id: number;
  name: string;
  description: string;
}

// Query interfaces
export interface MaterialQueryParams {
  page?: number;
  limit?: number;
  category_id?: number;
  search?: string;
  verified?: boolean;
  sort?: 'name' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
}

export interface MaterialSearchParams {
  q: string;
  category_id?: number;
  property_filters?: Record<string, { min?: number; max?: number }>;
  limit?: number;
}
```

### 3. Materials Service

```typescript
// src/services/materials.service.ts
import { supabase } from '../utils/supabase.client';
import { Material, MaterialWithRelations, MaterialQueryParams, MaterialSearchParams } from '../types/material.types';

export class MaterialsService {
  async getMaterials(params: MaterialQueryParams = {}) {
    const {
      page = 1,
      limit = 20,
      category_id,
      search,
      verified,
      sort = 'name',
      order = 'asc'
    } = params;

    let query = supabase
      .from('materials')
      .select(`
        *,
        category:material_categories(*),
        properties:material_properties(
          *,
          property:properties(
            *,
            category:property_categories(*)
          )
        ),
        images:material_images(*)
      `);

    // Apply filters
    if (category_id) {
      query = query.eq('material_category_id', category_id);
    }

    if (verified !== undefined) {
      query = query.eq('is_verified', verified);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,scientific_name.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
        has_next: page < Math.ceil((count || 0) / limit),
        has_prev: page > 1
      }
    };
  }

  async getMaterialById(id: number): Promise<MaterialWithRelations> {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        *,
        category:material_categories(*),
        properties:material_properties(
          *,
          property:properties(
            *,
            category:property_categories(*)
          )
        ),
        images:material_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Material not found: ${error.message}`);
    }

    return data;
  }

  async searchMaterials(params: MaterialSearchParams) {
    const { q, category_id, property_filters, limit = 20 } = params;

    let query = supabase
      .from('materials')
      .select(`
        *,
        category:material_categories(*),
        properties:material_properties(
          *,
          property:properties(*)
        )
      `)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,scientific_name.ilike.%${q}%`);

    if (category_id) {
      query = query.eq('material_category_id', category_id);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    // Apply property filters if provided
    let filteredData = data || [];
    if (property_filters) {
      filteredData = filteredData.filter(material => {
        return material.properties?.some(prop => {
          const propertyName = prop.property.name.toLowerCase();
          const filter = property_filters[propertyName];
          
          if (filter && prop.value !== null) {
            if (filter.min !== undefined && prop.value < filter.min) return false;
            if (filter.max !== undefined && prop.value > filter.max) return false;
          }
          return true;
        });
      });
    }

    return { data: filteredData };
  }

  async getMaterialProperties(materialId: number) {
    const { data, error } = await supabase
      .from('material_properties')
      .select(`
        *,
        property:properties(
          *,
          category:property_categories(*)
        )
      `)
      .eq('material_id', materialId);

    if (error) {
      throw new Error(`Failed to fetch material properties: ${error.message}`);
    }

    return { data: data || [] };
  }
}
```

### 4. Materials Controller

```typescript
// src/controllers/materials.controller.ts
import { Request, Response, NextFunction } from 'express';
import { MaterialsService } from '../services/materials.service';
import { MaterialQueryParams, MaterialSearchParams } from '../types/material.types';

export class MaterialsController {
  private materialsService: MaterialsService;

  constructor() {
    this.materialsService = new MaterialsService();
  }

  async getMaterials(req: Request, res: Response, next: NextFunction) {
    try {
      const params: MaterialQueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
        search: req.query.search as string,
        verified: req.query.verified ? req.query.verified === 'true' : undefined,
        sort: req.query.sort as 'name' | 'created_at' | 'updated_at' || 'name',
        order: req.query.order as 'asc' | 'desc' || 'asc'
      };

      const result = await this.materialsService.getMaterials(params);
      
      res.json({
        data: result.data,
        pagination: result.pagination,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMaterialById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'Material ID must be a valid number'
          }
        });
      }

      const material = await this.materialsService.getMaterialById(id);
      
      res.json({
        data: material,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async searchMaterials(req: Request, res: Response, next: NextFunction) {
    try {
      const params: MaterialSearchParams = {
        q: req.query.q as string,
        category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
        property_filters: req.query.property_filters ? JSON.parse(req.query.property_filters as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20
      };

      if (!params.q) {
        return res.status(400).json({
          error: {
            code: 'MISSING_QUERY',
            message: 'Search query (q) is required'
          }
        });
      }

      const result = await this.materialsService.searchMaterials(params);
      
      res.json({
        data: result.data,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMaterialProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const materialId = parseInt(req.params.id);
      
      if (isNaN(materialId)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'Material ID must be a valid number'
          }
        });
      }

      const result = await this.materialsService.getMaterialProperties(materialId);
      
      res.json({
        data: result.data,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 5. Categories Service

```typescript
// src/services/categories.service.ts
import { supabase } from '../utils/supabase.client';
import { MaterialCategory } from '../types/material.types';

export class CategoriesService {
  async getCategories(): Promise<MaterialCategory[]> {
    const { data, error } = await supabase
      .from('material_categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    // Build hierarchical structure
    return this.buildCategoryTree(data || []);
  }

  async getCategoryById(id: number): Promise<MaterialCategory> {
    const { data, error } = await supabase
      .from('material_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Category not found: ${error.message}`);
    }

    return data;
  }

  async getMaterialsInCategory(categoryId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('materials')
      .select(`
        *,
        category:material_categories(*)
      `)
      .eq('material_category_id', categoryId)
      .range(offset, offset + limit - 1)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch materials in category: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
        has_next: page < Math.ceil((count || 0) / limit),
        has_prev: page > 1
      }
    };
  }

  private buildCategoryTree(categories: MaterialCategory[]): MaterialCategory[] {
    const categoryMap = new Map<number, MaterialCategory & { children: MaterialCategory[] }>();
    const rootCategories: MaterialCategory[] = [];

    // Initialize all categories with empty children arrays
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }
}
```

### 6. Properties Service

```typescript
// src/services/properties.service.ts
import { supabase } from '../utils/supabase.client';
import { Property, PropertyCategory } from '../types/material.types';

export class PropertiesService {
  async getProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        category:property_categories(*)
      `)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }

    return data || [];
  }

  async getPropertyById(id: number): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        category:property_categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Property not found: ${error.message}`);
    }

    return data;
  }

  async getPropertyCategories(): Promise<PropertyCategory[]> {
    const { data, error } = await supabase
      .from('property_categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch property categories: ${error.message}`);
    }

    return data || [];
  }
}
```

### 7. Routes Setup

```typescript
// src/routes/materials.routes.ts
import { Router } from 'express';
import { MaterialsController } from '../controllers/materials.controller';
import { validateApiKey } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';
import { validateMaterialSearch } from '../middleware/validation.middleware';

const router = Router();
const materialsController = new MaterialsController();

// Apply middleware to all routes
router.use(validateApiKey);
router.use(rateLimitMiddleware(3600000, 1000)); // 1000 requests per hour

// Routes
router.get('/', materialsController.getMaterials.bind(materialsController));
router.get('/search', validateMaterialSearch, materialsController.searchMaterials.bind(materialsController));
router.get('/:id', materialsController.getMaterialById.bind(materialsController));
router.get('/:id/properties', materialsController.getMaterialProperties.bind(materialsController));

export default router;
```

```typescript
// src/routes/index.ts
import { Router } from 'express';
import materialsRoutes from './materials.routes';
import categoriesRoutes from './categories.routes';
import propertiesRoutes from './properties.routes';

const router = Router();

// API versioning
router.use('/v1/materials', materialsRoutes);
router.use('/v1/categories', categoriesRoutes);
router.use('/v1/properties', propertiesRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
```

### 8. Main Application Setup

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['https://api.material-index.com'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
```

```typescript
// src/server.ts
import app from './app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Material Index API Gateway running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// tests/services/materials.service.test.ts
import { MaterialsService } from '../../src/services/materials.service';
import { supabase } from '../../src/utils/supabase.client';

jest.mock('../../src/utils/supabase.client');

describe('MaterialsService', () => {
  let materialsService: MaterialsService;

  beforeEach(() => {
    materialsService = new MaterialsService();
  });

  describe('getMaterials', () => {
    it('should fetch materials with pagination', async () => {
      const mockData = [
        { id: 1, name: 'Aluminum 6061', material_category_id: 1 },
        { id: 2, name: 'Steel 316', material_category_id: 1 }
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockData,
                error: null,
                count: 2
              })
            })
          })
        })
      });

      const result = await materialsService.getMaterials({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });
  });
});
```

## 📊 Performance Optimization

### Database Indexes
```sql
-- Ensure these indexes exist for optimal performance
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(material_category_id);
CREATE INDEX IF NOT EXISTS idx_materials_verified ON materials(is_verified);
CREATE INDEX IF NOT EXISTS idx_materials_name_gin ON materials USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_material_properties_material ON material_properties(material_id);
CREATE INDEX IF NOT EXISTS idx_material_properties_property ON material_properties(property_id);
```

### Caching Strategy
```typescript
// src/middleware/cache.middleware.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      // Continue without cache if Redis is down
    }
    
    // Store original res.json
    const originalJson = res.json;
    res.json = function(data: any) {
      redis.setex(key, ttl, JSON.stringify(data));
      return originalJson.call(this, data);
    };
    
    next();
  };
};
```

## 🚀 Deployment Checklist

- [ ] Set up Supabase connection with proper RLS policies
- [ ] Configure Redis for caching and rate limiting
- [ ] Set up environment variables
- [ ] Implement authentication middleware
- [ ] Add comprehensive error handling
- [ ] Set up logging and monitoring
- [ ] Create database indexes
- [ ] Write unit and integration tests
- [ ] Configure PM2 for production
- [ ] Set up health checks
- [ ] Implement API documentation
- [ ] Configure CORS and security headers

