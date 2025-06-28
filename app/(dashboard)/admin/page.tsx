"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, User } from "@/types/tickets";
import { CheckCircle, Clock, TicketIcon, Users } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
  // Chart data
  const statusData = [
    { name: 'Open', value: demoTickets.length, color: '#ef4444' },
    { name: 'In Progress', value: demoTickets.length, color: '#3b82f6' },
    { name: 'Resolved', value: demoTickets.length, color: '#10b981' },
    { name: 'Closed', value: demoTickets.length, color: '#6b7280' }
  ];

  const priorityData = [
    { name: 'Critical', count: demoTickets.filter(t => t.priority === 'critical').length },
    { name: 'High', count: demoTickets.filter(t => t.priority === 'high').length },
    { name: 'Medium', count: demoTickets.filter(t => t.priority === 'medium').length },
    { name: 'Low', count: demoTickets.filter(t => t.priority === 'low').length }
  ];
const Page = () => {

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {demoTickets.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {demoTickets.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {demoTickets.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
