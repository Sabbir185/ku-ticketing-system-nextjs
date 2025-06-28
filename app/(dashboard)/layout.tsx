"use client";
import Header from "@/components/dashboard/Header";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/tickets";
import React, { ReactNode,  useEffect } from "react";
import { useRouter } from "next/navigation";
const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { logout, user, loading } = useAuth() as {
    user: User;
    loading: boolean;
    logout: () => void;
  };
  console.log("🚀 ~ const{logout,user,loading}=useAuth ~ user:", user);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }
  return (
    <div className="min-h-screen bg-gray-50">
      
      {children}
    </div>
  );
};

export default Layout;
