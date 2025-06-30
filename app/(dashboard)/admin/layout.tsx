"use client";
import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminDashboardProps {
  children: React.ReactNode;
}

const AdminDashboard = ({ children }: AdminDashboardProps) => {
  const { logout, user, loading } = useAuth();
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex  h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="" />
            <div className="flex justify-between w-full">
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h2>
              <div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user?.name} </span>
                  <Button onClick={logout} variant="outline" className="cursor-pointer">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
