

import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs'
import React from 'react'
import AdminDashboardBanner from './dashboardBanner'
import AdminDashboardStats from './dashboardStats'
import { LayoutDashboard, BarChart3, ImageIcon } from 'lucide-react'

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-1 h-12 bg-black rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-black">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Manage your store's content and analytics
              </p>
            </div>
          </div>
        </div>

        {/* Premium Tabs Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <Tabs defaultValue="banner" className="w-full">
            {/* Premium Tab List */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <TabsList className="bg-transparent border-0 p-0 h-auto w-full justify-start space-x-2">
                <TabsTrigger
                  value="banner"
                  className="flex items-center space-x-2 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-white hover:text-black rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Banner Management</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="flex items-center space-x-2 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-white hover:text-black rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics & Stats</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="relative">
              <TabsContent value="banner" className="m-0 p-0">
                <AdminDashboardBanner />
              </TabsContent>

              <TabsContent value="stats" className="m-0 p-0">
                <AdminDashboardStats />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;