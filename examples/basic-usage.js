/**
 * Material Index API - Basic Usage Examples
 * 
 * This file demonstrates basic usage of the Material Index API
 * using vanilla JavaScript and fetch.
 */

// Configuration
const API_BASE_URL = 'https://api.material-index.com/v1';
const API_KEY = 'your-api-key-here'; // Replace with your actual API key

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Example 1: Health Check
async function checkAPIHealth() {
  try {
    const health = await apiRequest('/health');
    console.log('API Health:', health);
    return health;
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Example 2: Get Materials
async function getMaterials(page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const materials = await apiRequest(`/materials?${params}`);
    console.log('Materials:', materials);
    return materials;
  } catch (error) {
    console.error('Failed to get materials:', error);
  }
}

// Example 3: Search Materials
async function searchMaterials(query, page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const results = await apiRequest(`/materials/search?${params}`);
    console.log('Search Results:', results);
    return results;
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 4: Get Material by ID
async function getMaterialById(id) {
  try {
    const material = await apiRequest(`/materials/${id}`);
    console.log('Material:', material);
    return material;
  } catch (error) {
    console.error('Failed to get material:', error);
  }
}

// Example 5: Get Categories
async function getCategories() {
  try {
    const categories = await apiRequest('/categories');
    console.log('Categories:', categories);
    return categories;
  } catch (error) {
    console.error('Failed to get categories:', error);
  }
}

// Example 6: Get Properties
async function getProperties() {
  try {
    const properties = await apiRequest('/properties');
    console.log('Properties:', properties);
    return properties;
  } catch (error) {
    console.error('Failed to get properties:', error);
  }
}

// Example 7: Get Materials by Category
async function getMaterialsByCategory(categoryId, page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const materials = await apiRequest(`/categories/${categoryId}/materials?${params}`);
    console.log('Category Materials:', materials);
    return materials;
  } catch (error) {
    console.error('Failed to get category materials:', error);
  }
}

// Example 8: Advanced Search with Filters
async function advancedSearch(options = {}) {
  try {
    const {
      query = '',
      category = '',
      page = 1,
      limit = 20
    } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (query) {
      params.append('q', query);
    }
    
    if (category) {
      params.append('category', category);
    }
    
    const results = await apiRequest(`/materials/search?${params}`);
    console.log('Advanced Search Results:', results);
    return results;
  } catch (error) {
    console.error('Advanced search failed:', error);
  }
}

// Example 9: Pagination Helper
async function getAllMaterials(maxPages = 5) {
  const allMaterials = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore && page <= maxPages) {
    try {
      const response = await getMaterials(page, 100); // Get 100 per page
      
      if (response.data && response.data.length > 0) {
        allMaterials.push(...response.data);
        hasMore = response.pagination.has_next;
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`Failed to get page ${page}:`, error);
      break;
    }
  }
  
  console.log(`Retrieved ${allMaterials.length} materials across ${page - 1} pages`);
  return allMaterials;
}

// Example 10: Error Handling
async function robustAPICall(endpoint) {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await apiRequest(endpoint);
    } catch (error) {
      retries++;
      console.log(`Attempt ${retries} failed:`, error.message);
      
      if (retries >= maxRetries) {
        throw new Error(`API call failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

// Usage Examples
async function runExamples() {
  console.log('=== Material Index API Examples ===\n');
  
  // 1. Check API health
  console.log('1. Checking API health...');
  await checkAPIHealth();
  
  // 2. Get first page of materials
  console.log('\n2. Getting materials...');
  await getMaterials(1, 5);
  
  // 3. Search for copper materials
  console.log('\n3. Searching for copper materials...');
  await searchMaterials('copper', 1, 5);
  
  // 4. Get categories
  console.log('\n4. Getting categories...');
  await getCategories();
  
  // 5. Get properties
  console.log('\n5. Getting properties...');
  await getProperties();
  
  console.log('\n=== Examples completed ===');
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    apiRequest,
    checkAPIHealth,
    getMaterials,
    searchMaterials,
    getMaterialById,
    getCategories,
    getProperties,
    getMaterialsByCategory,
    advancedSearch,
    getAllMaterials,
    robustAPICall
  };
}

// Run examples if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runExamples().catch(console.error);
}
