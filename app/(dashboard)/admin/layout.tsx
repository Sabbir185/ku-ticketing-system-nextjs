// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { profileUpdate } from "@/app/actions/profile";
import { UserIcon } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

interface AdminDashboardProps {
  children: React.ReactNode;
}

const AdminDashboard = ({ children }: AdminDashboardProps) => {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
  });
  const handleUpdate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    const response = await profileUpdate(data);
    if (response?.success) {
      toast.success(response?.message || "Profile updated successfully");
      // fetchUser();
    } else {
      toast.error(response?.message || "Failed to update profile");
    }
    setOpen(false);
  };
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex  h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="" />
            <div className="flex justify-between w-full mt-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h2>
              <div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name}{" "}
                  </span>
                  <div
                    className="bg-gray-200 p-2 rounded-full cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <UserIcon size={20} />
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Button className="mt-4 w-full" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
