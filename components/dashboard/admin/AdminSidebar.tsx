"use client";
import React from "react";
import { Users, Ticket as TicketIcon, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    {
      id: "overview",
      title: "Overview",
      link: "/admin",
      icon: BarChart3,
    },
    {
      id: "tickets",
      title: "Tickets",
      link: "/admin/tickets",
      icon: TicketIcon,
    },
    {
      id: "employees",
      title: "Employees",
      link: "/admin/employees",
      icon: Users,
    },
    {
      id: "users",
      title: "Users",
      link: "/admin/users",
      icon: Users,
    },
    {
      id: "categories",
      title: "Categories",
      link: "/admin/categories",
      icon: TicketIcon,
    },
    // {
    //   id: "profile",
    //   title: "Profile",
    //   link: "/admin/profile",
    //   icon: Settings,
    // },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg mb-2.5">
            Ticket Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  className="!cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  <Link
                    href={item.link}
                    className={`flex items-center px-2 py-2 text-lg hover:bg-black hover:text-white ${
                      pathname === item.link || pathname === item.link + "/"
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
