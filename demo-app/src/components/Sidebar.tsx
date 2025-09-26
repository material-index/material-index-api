import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, BookOpen, Database, Settings, Code, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started'])
  const location = useLocation()

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const navigation = [
    {
      title: 'Getting Started',
      id: 'getting-started',
      icon: BookOpen,
      items: [
        { name: 'Introduction', href: '/docs', hash: '#introduction' },
        { name: 'Authentication', href: '/docs', hash: '#authentication' },
        { name: 'Rate Limiting', href: '/docs', hash: '#rate-limiting' },
        { name: 'Error Handling', href: '/docs', hash: '#error-handling' },
      ]
    },
    {
      title: 'API Reference',
      id: 'api-reference',
      icon: Database,
      items: [
        { name: 'Materials', href: '/docs', hash: '#materials' },
        { name: 'Categories', href: '/docs', hash: '#categories' },
        { name: 'Properties', href: '/docs', hash: '#properties' },
        { name: 'Property Categories', href: '/docs', hash: '#property-categories' },
      ]
    },
    {
      title: 'SDKs',
      id: 'sdks',
      icon: Code,
      items: [
        { name: 'TypeScript/JavaScript', href: '/sdk', hash: '#typescript' },
        { name: 'Python', href: '/sdk', hash: '#python' },
        { name: 'Installation', href: '/sdk', hash: '#installation' },
        { name: 'Examples', href: '/sdk', hash: '#examples' },
      ]
    },
    {
      title: 'Resources',
      id: 'resources',
      icon: FileText,
      items: [
        { name: 'Changelog', href: '/docs', hash: '#changelog' },
        { name: 'Support', href: '/docs', hash: '#support' },
        { name: 'Status', href: '/docs', hash: '#status' },
      ]
    }
  ]

  return (
    <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((section) => {
            const Icon = section.icon
            const isExpanded = expandedSections.includes(section.id)
            
            return (
              <div key={section.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto font-medium"
                  onClick={() => toggleSection(section.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        to={`${item.href}${item.hash}`}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          location.pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

