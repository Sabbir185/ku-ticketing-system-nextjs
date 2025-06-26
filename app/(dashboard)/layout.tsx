"use client";
import Header from "@/components/dashboard/Header";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/tickets";
import React, { ReactNode } from "react";
const Layout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth() as { user: User; logout: () => void };
  console.log("🚀 ~ Layout ~ user:", user)



  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      {children}
    </div>
  );
};

export default Layout;
