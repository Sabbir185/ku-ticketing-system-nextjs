"use client"
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';



interface AdminDashboardProps {
  children: React.ReactNode;
}

const AdminDashboard = ({ children }: AdminDashboardProps) => {

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
           
            </div>
          </div>
          <div className="flex-1 p-6">
           {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
