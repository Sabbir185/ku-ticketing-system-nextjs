"use client";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/tickets";
import React, { ReactNode,  useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { logout, user, loading } = useAuth() as {
    user: User;
    loading: boolean;
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  if (loading) {
    return  <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6 bg-muted">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>;
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
