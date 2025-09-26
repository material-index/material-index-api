import { useState } from 'react'
import { Copy, Check, Download, Code, Package, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/lib/utils'

export default function SdkPage() {
  const [activeSdk, setActiveSdk] = useState('typescript')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  const sdks = [
    {
      id: 'typescript',
      name: 'TypeScript/JavaScript',
      description: 'Full-featured SDK with TypeScript support for web and Node.js applications',
      icon: '📦',
      installation: 'npm install @material-index/sdk',
      example: `import { MaterialIndexClient } from '@material-index/sdk';

const client = new MaterialIndexClient({
  apiKey: 'your-api-key'
});

// Get all materials
const materials = await client.materials.list({
  page: 1,
  limit: 20,
  category_id: 1
});

// Search materials
const searchResults = await client.materials.search({
  q: 'aluminum',
  property_filters: {
    density: { min: 2000, max: 3000 }
  }
});

console.log(materials.data);`
    },
    {
      id: 'python',
      name: 'Python',
      description: 'Async Python SDK with data science features and pandas integration',
      icon: '🐍',
      installation: 'pip install material-index-sdk',
      example: `import asyncio
from material_index import MaterialIndexClient

async def main():
    client = MaterialIndexClient(api_key="your-api-key")
    
    # Get all materials
    materials = await client.materials.list(
        page=1,
        limit=20,
        category_id=1
    )
    
    # Search materials
    search_results = await client.materials.search(
        q="aluminum",
        property_filters={
            "density": {"min": 2000, "max": 3000}
        }
    )
    
    # Convert to pandas DataFrame
    materials_df = await client.materials.to_dataframe()
    print(materials_df.head())
    
    await client.close()

asyncio.run(main())`
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

  const activeSdkData = sdks.find(sdk => sdk.id === activeSdk)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">SDKs & Libraries</h1>
        <p className="text-lg text-muted-foreground">
          Official SDKs and libraries to help you integrate the Material Index API into your applications.
        </p>
      </div>

      {/* SDK Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sdks.map((sdk) => (
          <div
            key={sdk.id}
            className={`border rounded-lg p-6 cursor-pointer transition-colors ${
              activeSdk === sdk.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setActiveSdk(sdk.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{sdk.icon}</div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{sdk.name}</h3>
                <p className="text-muted-foreground">{sdk.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active SDK Details */}
      {activeSdkData && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{activeSdkData.name} SDK</h2>
            
            {/* Installation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Installation</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="code-block">
                    <code>{activeSdkData.installation}</code>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(activeSdkData.installation)}
                >
                  {copiedCode === activeSdkData.installation ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Start */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quick Start</h3>
              <div className="relative">
                <pre className="code-block">
                  <code>{activeSdkData.example}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(activeSdkData.example)}
                >
                  {copiedCode === activeSdkData.example ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">SDK Features</h2>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="text-center p-4 font-medium">TypeScript</th>
                <th className="text-center p-4 font-medium">Python</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4">Type Safety</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">Async Support</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">React Integration</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">❌</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">Pandas Integration</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">Data Science Tools</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">Node.js Support</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">❌</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">Jupyter Notebooks</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Links */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Download & Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">TypeScript SDK</h3>
            </div>
            <p className="text-muted-foreground">
              Download the latest version from npm or view the source code on GitHub.
            </p>
            <div className="flex space-x-2">
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                npm install
              </Button>
              <Button variant="outline" size="sm">
                <Code className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Python SDK</h3>
            </div>
            <p className="text-muted-foreground">
              Install from PyPI or clone the repository for development.
            </p>
            <div className="flex space-x-2">
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                pip install
              </Button>
              <Button variant="outline" size="sm">
                <Code className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Code Examples</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Basic Usage</h3>
            <p className="text-muted-foreground text-sm">
              Get started with a simple API call to fetch materials.
            </p>
            <div className="code-block text-xs">
              <code>{`// TypeScript
const materials = await client.materials.list();

# Python
materials = await client.materials.list()`}</code>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Advanced Search</h3>
            <p className="text-muted-foreground text-sm">
              Search materials with property filters and pagination.
            </p>
            <div className="code-block text-xs">
              <code>{`// TypeScript
const results = await client.materials.search({
  q: 'aluminum',
  property_filters: {
    density: { min: 2000, max: 3000 }
  }
});

# Python
results = await client.materials.search(
    q="aluminum",
    property_filters={
        "density": {"min": 2000, "max": 3000}
    }
)`}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


