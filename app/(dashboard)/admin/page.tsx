"use client";
import { fetchEmployeeTickets, getDashboard } from "@/app/actions/ticket/ticketActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types/tickets";
import { CheckCircle,  TicketIcon, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


const Page = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    console.log("🚀 ~ Page ~ dashboardData:", dashboardData)
  

  const getDashboardData = async () => {
    const data = await getDashboard();
    if (data.success) {
      setDashboardData(data?.data || []);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

    // Chart data
  const statusData = [
    { name: 'Open', value: dashboardData?.openTickets, color: '#ef4444' },
    { name: 'Closed', value: dashboardData?.closedTickets, color: '#6b7280' }
  ];

  const priorityData = [
    { name: 'High', count: dashboardData?.highPriorityTickets, color: '#ef4444' },
    { name: 'Medium', count: dashboardData?.mediumPriorityTickets, color: '#f59e0b' },
    { name: 'Low', count: dashboardData?.lowPriorityTickets, color: '#10b981' }
  ];
  // const 
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none bg-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalTickets || 0}</div>
          </CardContent>
        </Card>
      
        <Card className="border-none bg-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData?.openTickets || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.closedTickets || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none bg-slate-100">
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

        <Card className="border-none bg-slate-100">
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
