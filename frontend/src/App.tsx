import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ApiDocsPage from '@/pages/ApiDocsPage'
import DashboardPage from '@/pages/DashboardPage'
import SdkPage from '@/pages/SdkPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<ApiDocsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sdk" element={<SdkPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </div>
  )
}

export default App

