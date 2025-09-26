import { useState } from 'react'
import { Key, Eye, EyeOff, Copy, Plus, Trash2, BarChart3, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/lib/utils'

export default function DashboardPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'mi_live_1234567890abcdef',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      requests: 15420,
      tier: 'Pro'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'mi_test_abcdef1234567890',
      created: '2024-01-10',
      lastUsed: '2024-01-19',
      requests: 2340,
      tier: 'Free'
    }
  ])

  const { toast } = useToast()

  const handleCopyApiKey = async (key: string) => {
    try {
      await copyToClipboard(key)
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy API key",
        variant: "destructive",
      })
    }
  }

  const maskApiKey = (key: string) => {
    return key.slice(0, 8) + '•'.repeat(key.length - 12) + key.slice(-4)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Developer Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage your API keys, monitor usage, and track your API consumption.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Total Requests</h3>
          </div>
          <div className="text-3xl font-bold">17,760</div>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Rate Limit</h3>
          </div>
          <div className="text-3xl font-bold">10,000</div>
          <p className="text-sm text-muted-foreground">Requests per hour</p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Plan</h3>
          </div>
          <div className="text-3xl font-bold">Pro</div>
          <p className="text-sm text-muted-foreground">Active subscription</p>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">API Keys</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Key
          </Button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{apiKey.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {showApiKey ? apiKey.key : maskApiKey(apiKey.key)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyApiKey(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                    {apiKey.tier}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <div className="font-medium">{apiKey.created}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Used:</span>
                  <div className="font-medium">{apiKey.lastUsed}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Requests:</span>
                  <div className="font-medium">{apiKey.requests.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Requests by Endpoint</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">GET /materials</span>
                <span className="text-sm font-medium">8,420</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GET /materials/search</span>
                <span className="text-sm font-medium">5,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GET /categories</span>
                <span className="text-sm font-medium">2,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GET /properties</span>
                <span className="text-sm font-medium">1,220</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Daily Usage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Today</span>
                <span className="text-sm font-medium">1,240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Yesterday</span>
                <span className="text-sm font-medium">1,180</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Week</span>
                <span className="text-sm font-medium">8,420</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month</span>
                <span className="text-sm font-medium">17,760</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limit Status */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Rate Limit Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Current Usage</span>
            <span>245 / 10,000 requests per hour</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '2.45%' }}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Rate limit resets in 23 minutes
          </p>
        </div>
      </div>
    </div>
  )
}


