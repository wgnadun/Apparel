

import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs'
import React from 'react'
import AdminDashboardBanner from './dashboardBanner'
import AdminDashboardStats from './dashboardStats'

function AdminDashboard() {
  return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md">
    <Tabs defaultValue="banner">
      <TabsList className="border-b border-gray-300 mb-4 flex space-x-4">
  <TabsTrigger
    value="banner"
    className="px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    Banner Update
  </TabsTrigger>
  <TabsTrigger
    value="stats"
    className="px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    Stats
  </TabsTrigger>
</TabsList>


      <TabsContent value="banner" className="p-4 bg-gray-50 rounded-b-lg">
        <AdminDashboardBanner />
      </TabsContent>

      <TabsContent value="stats" className="p-4 bg-gray-50 rounded-b-lg">
        <AdminDashboardStats />
      </TabsContent>
    </Tabs>
  </div>
</div>

  )
}

export default AdminDashboard;