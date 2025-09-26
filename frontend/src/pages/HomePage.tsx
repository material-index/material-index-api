import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Database, Zap, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Material Index API
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive API for accessing material properties, categories, and specifications. 
            Built for developers who need reliable, fast access to material data.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/docs">
              <BookOpen className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">
              <Database className="mr-2 h-4 w-4" />
              Get API Key
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose Material Index API?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with developers in mind, our API provides everything you need to integrate material data into your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized queries and caching ensure sub-100ms response times for most requests.
            </p>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with rate limiting, authentication, and 99.9% uptime SLA.
            </p>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Developer Friendly</h3>
            <p className="text-muted-foreground">
              Comprehensive SDKs, interactive documentation, and detailed code examples.
            </p>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Rich Data</h3>
            <p className="text-muted-foreground">
              Access to thousands of materials with properties, categories, and specifications.
            </p>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Community Driven</h3>
            <p className="text-muted-foreground">
              Open source, community contributions, and active development.
            </p>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Interactive Docs</h3>
            <p className="text-muted-foreground">
              Try API endpoints directly in the browser with our interactive documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Get Started in Minutes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start building with our API in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">Get Your API Key</h3>
            <p className="text-muted-foreground">
              Sign up for a free account and get your API key instantly.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">Choose Your SDK</h3>
            <p className="text-muted-foreground">
              Pick from TypeScript, Python, or use our REST API directly.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">Start Building</h3>
            <p className="text-muted-foreground">
              Make your first API call and start integrating material data.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/docs">
              View Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Trusted by Developers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-muted-foreground">Materials</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-muted-foreground">Properties</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </section>
    </div>
  )
}


