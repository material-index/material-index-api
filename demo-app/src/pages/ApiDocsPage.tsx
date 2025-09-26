import { useState, useEffect } from 'react'
import { Copy, Check, Play, Code, Database, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn, copyToClipboard, getMethodColor } from '@/lib/utils'

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState('materials')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  const endpoints = [
    {
      id: 'materials',
      title: 'Materials',
      description: 'Access material information, properties, and specifications',
      methods: [
        {
          method: 'GET',
          path: '/api/v1/materials',
          description: 'List all materials with pagination and filtering',
          example: `curl -X GET "https://api.material-index.com/v1/materials?page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        },
        {
          method: 'GET',
          path: '/api/v1/materials/{id}',
          description: 'Get a specific material by ID',
          example: `curl -X GET "https://api.material-index.com/v1/materials/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        },
        {
          method: 'GET',
          path: '/api/v1/materials/search',
          description: 'Search materials by name, description, or properties',
          example: `curl -X GET "https://api.material-index.com/v1/materials/search?q=aluminum" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        }
      ]
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Access material categories and hierarchical structure',
      methods: [
        {
          method: 'GET',
          path: '/api/v1/categories',
          description: 'List all material categories',
          example: `curl -X GET "https://api.material-index.com/v1/categories" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        },
        {
          method: 'GET',
          path: '/api/v1/categories/{id}',
          description: 'Get a specific category by ID',
          example: `curl -X GET "https://api.material-index.com/v1/categories/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        }
      ]
    },
    {
      id: 'properties',
      title: 'Properties',
      description: 'Access material properties and property definitions',
      methods: [
        {
          method: 'GET',
          path: '/api/v1/properties',
          description: 'List all available properties',
          example: `curl -X GET "https://api.material-index.com/v1/properties" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        },
        {
          method: 'GET',
          path: '/api/v1/property-categories',
          description: 'List all property categories',
          example: `curl -X GET "https://api.material-index.com/v1/property-categories" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        }
      ]
    }
  ]

  const handleCopyCode = async (code: string) => {
    try {
      await copyToClipboard(code)
      setCopiedCode(code)
      toast({
        title: "Copied!",
        description: "Code example copied to clipboard",
      })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const activeEndpointData = endpoints.find(ep => ep.id === activeEndpoint)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">API Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for the Material Index API. Learn how to integrate material data into your applications.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2">
        {endpoints.map((endpoint) => (
          <Button
            key={endpoint.id}
            variant={activeEndpoint === endpoint.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveEndpoint(endpoint.id)}
          >
            <Database className="mr-2 h-4 w-4" />
            {endpoint.title}
          </Button>
        ))}
      </div>

      {/* Endpoint Details */}
      {activeEndpointData && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{activeEndpointData.title}</h2>
            <p className="text-muted-foreground">{activeEndpointData.description}</p>
          </div>

          <div className="space-y-4">
            {activeEndpointData.methods.map((method, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={cn("endpoint-method", getMethodColor(method.method))}>
                      {method.method}
                    </span>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {method.path}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCode(method.example)}
                  >
                    {copiedCode === method.example ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-muted-foreground">{method.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">Example Request</span>
                  </div>
                  <div className="relative">
                    <pre className="code-block">
                      <code>{method.example}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(method.example)}
                    >
                      {copiedCode === method.example ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Try it out
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Parameters
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authentication Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Authentication</h3>
        <p className="text-muted-foreground">
          All API requests require authentication using an API key. Include your API key in the Authorization header:
        </p>
        <div className="code-block">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </div>
      </div>

      {/* Rate Limiting Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Rate Limiting</h3>
        <p className="text-muted-foreground">
          API requests are rate limited to ensure fair usage. Rate limits vary by plan:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Free tier: 1,000 requests per hour</li>
          <li>Pro tier: 10,000 requests per hour</li>
          <li>Enterprise: Custom limits</li>
        </ul>
      </div>

      {/* Response Format Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Response Format</h3>
        <p className="text-muted-foreground">
          All API responses are returned in JSON format with the following structure:
        </p>
        <div className="code-block">
          <code>{`{
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
}`}</code>
        </div>
      </div>
    </div>
  )
}


