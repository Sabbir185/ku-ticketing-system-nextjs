"use client";

import { profileAction } from "@/app/actions/profile";
import { User } from "@/schemas/user.schema";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userInfo = await profileAction();
        if (userInfo?.success && userInfo?.data) {
          setUser(userInfo.data);
          if (userInfo?.data?.role === "ADMIN") {
            router.push("/admin");
          }
          if (userInfo?.data?.role === "EMPLOYEE") {
            router.push("/employee");
          }
          if (userInfo?.data?.role === "USER") {
            router.push("/user");
          }
        } else {
          setUser(null);
          router.push("/");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [router]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
