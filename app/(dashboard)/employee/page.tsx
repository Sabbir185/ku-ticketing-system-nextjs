"use client"
import EmployeeDashboard from "@/components/dashboard/EmployeDashboard";
import { Ticket, User } from "@/types/tickets";
import React from "react";
const demoTickets: Ticket[] = [
  {
    id: "1",
    title: "Login Issues",
    description: "Cannot access my account after password reset",
    priority: "high",
    status: "open",
    category: "technical",
    createdBy: "user1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
  },
  {
    id: "2",
    title: "Billing Question",
    description: "Need clarification on last month's invoice",
    priority: "medium",
    status: "in-progress",
    category: "billing",
    createdBy: "user2",
    assignedTo: "employee1",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
  },
  {
    id: "3",
    title: "Feature Request",
    description: "Would like to see dark mode option in the dashboard",
    priority: "low",
    status: "resolved",
    category: "general",
    createdBy: "user3",
    assignedTo: "employee2",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    comments: [],
  },
];

const Page = () => {
    
   const user: User = {
         id: Date.now().toString(),
         email: `employee@example.com`,
         name: `Test employee`,
         role : "employee"
       };
      
       
         const handleViewTicket = (ticket: Ticket) => {
           console.log('Viewing ticket:', ticket);
           // In a real app, this would navigate to a ticket detail page
         };
  return (
    <EmployeeDashboard
      user={user}
      tickets={demoTickets}
      onViewTicket={handleViewTicket}
    />
  );
};

export default Page;
