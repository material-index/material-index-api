# SDK Design

## 🎯 SDK Overview

The Material Index SDKs provide developers with easy-to-use libraries to interact with the Material Index API. We'll develop SDKs for TypeScript/JavaScript and Python, with a focus on developer experience and type safety.

## 📦 TypeScript/JavaScript SDK

### Package Structure
```
material-index-sdk/
├── src/
│   ├── client/
│   │   ├── MaterialIndexClient.ts
│   │   ├── types/
│   │   │   ├── Material.ts
│   │   │   ├── Property.ts
│   │   │   ├── Category.ts
│   │   │   └── index.ts
│   │   └── endpoints/
│   │       ├── MaterialsEndpoint.ts
│   │       ├── PropertiesEndpoint.ts
│   │       ├── CategoriesEndpoint.ts
│   │       └── index.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── pagination.ts
│   │   └── filters.ts
│   └── index.ts
├── examples/
│   ├── basic-usage.ts
│   ├── search-materials.ts
│   └── filter-by-properties.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

### Core Client Class
```typescript
import { MaterialIndexClient } from 'material-index-sdk';

const client = new MaterialIndexClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.material-index.com/v1',
  timeout: 30000,
  retries: 3
});
```

### Type Definitions
```typescript
// Material types
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

export interface MaterialCategory {
  id: number;
  name: string;
  tooltip: string;
  parent_id?: number;
  children?: MaterialCategory[];
}

export interface PropertyCategory {
  id: number;
  name: string;
  description: string;
}
```

### API Methods
```typescript
// Materials
const materials = await client.materials.list({
  page: 1,
  limit: 20,
  category_id: 1,
  search: 'aluminum',
  verified: true
});

const material = await client.materials.get(1);
const searchResults = await client.materials.search({
  q: 'aluminum alloy',
  category_id: 1,
  property_filters: {
    density: { min: 2000, max: 3000 }
  }
});

// Categories
const categories = await client.categories.list();
const category = await client.categories.get(1);
const categoryMaterials = await client.categories.getMaterials(1);

// Properties
const properties = await client.properties.list();
const property = await client.properties.get(1);
const propertyCategories = await client.propertyCategories.list();
```

### Advanced Features
```typescript
// Pagination helper
const allMaterials = await client.materials.listAll({
  category_id: 1,
  verified: true
});

// Batch operations
const materials = await client.materials.getBatch([1, 2, 3, 4, 5]);

// Real-time updates (WebSocket)
const subscription = client.materials.subscribe(1, (material) => {
  console.log('Material updated:', material);
});

// Caching
const client = new MaterialIndexClient({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 1000
  }
});
```

## 🐍 Python SDK

### Package Structure
```
material_index_sdk/
├── material_index/
│   ├── __init__.py
│   ├── client.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── material.py
│   │   ├── property.py
│   │   ├── category.py
│   │   └── base.py
│   ├── endpoints/
│   │   ├── __init__.py
│   │   ├── materials.py
│   │   ├── properties.py
│   │   └── categories.py
│   └── utils/
│       ├── __init__.py
│       ├── pagination.py
│       └── filters.py
├── examples/
│   ├── basic_usage.py
│   ├── search_materials.py
│   └── data_science_example.py
├── tests/
├── pyproject.toml
└── README.md
```

### Core Client Class
```python
import asyncio
from material_index import MaterialIndexClient

# Async client
async def main():
    client = MaterialIndexClient(
        api_key="your-api-key",
        base_url="https://api.material-index.com/v1",
        timeout=30,
        retries=3
    )
    
    # Use the client
    materials = await client.materials.list(
        page=1,
        limit=20,
        category_id=1,
        search="aluminum",
        verified=True
    )
    
    await client.close()

# Sync client
from material_index import MaterialIndexClientSync

client = MaterialIndexClientSync(api_key="your-api-key")
materials = client.materials.list(page=1, limit=20)
```

### Data Models
```python
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Material(BaseModel):
    id: int
    name: str
    description: str
    material_category_id: int
    alternative_names: List[str]
    scientific_name: str
    distribution: str
    variation_name: str
    custom_id: str
    version: float
    is_verified: bool
    source: str
    ingredients: List[int]
    created_at: datetime
    updated_at: datetime
    slug: str
    group_image_url: Optional[str] = None
    category: Optional['MaterialCategory'] = None
    properties: Optional[List['MaterialProperty']] = None
    images: Optional[List['MaterialImage']] = None

class MaterialProperty(BaseModel):
    id: int
    material_id: int
    property: 'Property'
    value: float
    value_min: Optional[float] = None
    value_max: Optional[float] = None
    test_standard: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = None
    is_verified: bool
    unit: Optional[str] = None

class Property(BaseModel):
    id: int
    slug: str
    name: str
    unit: str
    data_type: str
    category_id: int
    alternative_name: Optional[str] = None
    category: Optional['PropertyCategory'] = None
```

### API Methods
```python
# Materials
materials = await client.materials.list(
    page=1,
    limit=20,
    category_id=1,
    search="aluminum",
    verified=True
)

material = await client.materials.get(1)
search_results = await client.materials.search(
    q="aluminum alloy",
    category_id=1,
    property_filters={
        "density": {"min": 2000, "max": 3000}
    }
)

# Categories
categories = await client.categories.list()
category = await client.categories.get(1)
category_materials = await client.categories.get_materials(1)

# Properties
properties = await client.properties.list()
property = await client.properties.get(1)
property_categories = await client.property_categories.list()
```

### Data Science Features
```python
import pandas as pd
import numpy as np

# Convert to pandas DataFrame
materials_df = await client.materials.to_dataframe(
    category_id=1,
    include_properties=True
)

# Material property analysis
density_data = materials_df['properties'].apply(
    lambda x: [p['value'] for p in x if p['property']['name'] == 'Density']
)

# Statistical analysis
density_stats = materials_df['density'].describe()

# Filtering and analysis
aluminum_materials = materials_df[
    materials_df['name'].str.contains('aluminum', case=False)
]

# Export to CSV
aluminum_materials.to_csv('aluminum_materials.csv', index=False)
```

## 🔧 SDK Features

### Common Features (Both SDKs)

#### 1. Enhanced Authentication
```typescript
// TypeScript - Multiple authentication methods
const client = new MaterialIndexClient({
  // API Key authentication
  apiKey: 'your-api-key',
  
  // OAuth 2.0 authentication
  oauth: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'https://your-app.com/callback'
  },
  
  // MFA configuration
  mfa: {
    enabled: true,
    backupCodes: ['code1', 'code2', 'code3']
  }
});

// OAuth 2.0 flow
const authUrl = await client.auth.getAuthorizationUrl();
const tokens = await client.auth.exchangeCodeForTokens(code);
```

```python
# Python - Multiple authentication methods
client = MaterialIndexClient(
    # API Key authentication
    api_key="your-api-key",
    
    # OAuth 2.0 authentication
    oauth={
        "client_id": "your-client-id",
        "client_secret": "your-client-secret",
        "redirect_uri": "https://your-app.com/callback"
    },
    
    # MFA configuration
    mfa={
        "enabled": True,
        "backup_codes": ["code1", "code2", "code3"]
    }
)

# OAuth 2.0 flow
auth_url = await client.auth.get_authorization_url()
tokens = await client.auth.exchange_code_for_tokens(code)
```

#### 2. Error Handling
```typescript
// TypeScript
try {
  const material = await client.materials.get(1);
} catch (error) {
  if (error instanceof MaterialIndexError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
  }
}
```

```python
# Python
try:
    material = await client.materials.get(1)
except MaterialIndexError as e:
    print(f"API Error: {e.message}")
    print(f"Status: {e.status}")
```

#### 3. Pagination
```typescript
// TypeScript
const allMaterials = await client.materials.listAll({
  category_id: 1
});
```

```python
# Python
all_materials = await client.materials.list_all(category_id=1)
```

#### 4. Caching
```typescript
// TypeScript
const client = new MaterialIndexClient({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    ttl: 300000
  }
});
```

```python
# Python
client = MaterialIndexClient(
    api_key="your-api-key",
    cache={"enabled": True, "ttl": 300}
)
```

#### 5. Retry Logic
```typescript
// TypeScript
const client = new MaterialIndexClient({
  apiKey: 'your-api-key',
  retries: 3,
  retryDelay: 1000
});
```

```python
# Python
client = MaterialIndexClient(
    api_key="your-api-key",
    retries=3,
    retry_delay=1.0
)
```

#### 6. Security Features
```typescript
// TypeScript - Security configuration
const client = new MaterialIndexClient({
  apiKey: 'your-api-key',
  
  // Security settings
  security: {
    // Rate limiting
    rateLimit: {
      enabled: true,
      requestsPerMinute: 60,
      burstLimit: 10
    },
    
    // Request throttling
    throttling: {
      enabled: true,
      delayMs: 100
    },
    
    // Input validation
    validation: {
      enabled: true,
      strictMode: true
    },
    
    // Secure headers
    headers: {
      'User-Agent': 'MaterialIndexSDK/1.0.0',
      'X-Client-Version': '1.0.0'
    }
  }
});
```

```python
# Python - Security configuration
client = MaterialIndexClient(
    api_key="your-api-key",
    
    # Security settings
    security={
        # Rate limiting
        "rate_limit": {
            "enabled": True,
            "requests_per_minute": 60,
            "burst_limit": 10
        },
        
        # Request throttling
        "throttling": {
            "enabled": True,
            "delay_ms": 100
        },
        
        # Input validation
        "validation": {
            "enabled": True,
            "strict_mode": True
        },
        
        # Secure headers
        "headers": {
            "User-Agent": "MaterialIndexSDK/1.0.0",
            "X-Client-Version": "1.0.0"
        }
    }
)
```

### TypeScript-Specific Features

#### 1. Full Type Safety
```typescript
// Complete type safety with TypeScript
const material: Material = await client.materials.get(1);
const density: number = material.properties?.find(p => p.property.name === 'Density')?.value || 0;
```

#### 2. React Integration
```typescript
// React hook for materials
import { useMaterials } from 'material-index-sdk/react';

function MaterialList() {
  const { materials, loading, error } = useMaterials({
    category_id: 1,
    limit: 20
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {materials.map(material => (
        <li key={material.id}>{material.name}</li>
      ))}
    </ul>
  );
}
```

#### 3. Node.js Integration
```typescript
// Node.js server-side usage
import { MaterialIndexClient } from 'material-index-sdk';

export async function GET(request: Request) {
  const client = new MaterialIndexClient({
    apiKey: process.env.MATERIAL_INDEX_API_KEY
  });

  const materials = await client.materials.list({
    category_id: 1,
    limit: 10
  });

  return Response.json(materials);
}
```

### Python-Specific Features

#### 1. Async/Await Support
```python
# Full async support
async def get_materials_async():
    client = MaterialIndexClient(api_key="your-api-key")
    materials = await client.materials.list()
    await client.close()
    return materials
```

#### 2. Data Science Integration
```python
# Pandas integration
import pandas as pd

materials_df = await client.materials.to_dataframe()
density_analysis = materials_df['density'].describe()

# NumPy integration
import numpy as np

density_array = np.array([m.properties['density'] for m in materials])
mean_density = np.mean(density_array)
```

#### 3. Jupyter Notebook Support
```python
# Jupyter notebook example
from material_index import MaterialIndexClient
import matplotlib.pyplot as plt

client = MaterialIndexClient(api_key="your-api-key")
materials = await client.materials.list(limit=100)

# Create visualization
density_data = [m.properties['density'] for m in materials if 'density' in m.properties]
plt.hist(density_data, bins=20)
plt.xlabel('Density (kg/m³)')
plt.ylabel('Frequency')
plt.title('Material Density Distribution')
plt.show()
```

## 📚 Documentation and Examples

### TypeScript SDK Documentation
```typescript
/**
 * Material Index SDK for TypeScript/JavaScript
 * 
 * @example
 * ```typescript
 * import { MaterialIndexClient } from 'material-index-sdk';
 * 
 * const client = new MaterialIndexClient({
 *   apiKey: 'your-api-key'
 * });
 * 
 * const materials = await client.materials.list({
 *   category_id: 1,
 *   limit: 20
 * });
 * ```
 */
```

### Python SDK Documentation
```python
"""
Material Index SDK for Python

Example:
    ```python
    from material_index import MaterialIndexClient
    
    client = MaterialIndexClient(api_key="your-api-key")
    materials = await client.materials.list(category_id=1, limit=20)
    ```
"""
```

## 🚀 Publishing and Distribution

### TypeScript SDK
- **NPM Package**: `@material-index/sdk`
- **CDN**: Available via unpkg.com
- **GitHub**: Source code and releases
- **Documentation**: GitHub Pages

### Python SDK
- **PyPI Package**: `material-index-sdk`
- **Conda**: Available via conda-forge
- **GitHub**: Source code and releases
- **Documentation**: Read the Docs

## 🔄 Versioning and Updates

### Semantic Versioning
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

### Update Strategy
- **Automatic Updates**: Patch versions
- **Manual Updates**: Minor and major versions
- **Deprecation**: 6-month notice for breaking changes
- **Migration Guides**: Detailed upgrade instructions

## 🧪 Testing Strategy

### Unit Tests
- **Coverage**: 90% minimum
- **Frameworks**: Jest (TypeScript), pytest (Python)
- **Mocking**: API responses and network calls

### Integration Tests
- **API Integration**: Test against staging API
- **Error Handling**: Test error scenarios
- **Performance**: Test with large datasets

### Example Tests
```typescript
// TypeScript
describe('MaterialIndexClient', () => {
  it('should fetch materials', async () => {
    const client = new MaterialIndexClient({ apiKey: 'test-key' });
    const materials = await client.materials.list();
    expect(materials.data).toBeDefined();
  });
});
```

```python
# Python
import pytest

@pytest.mark.asyncio
async def test_materials_list():
    client = MaterialIndexClient(api_key="test-key")
    materials = await client.materials.list()
    assert materials.data is not None
```
