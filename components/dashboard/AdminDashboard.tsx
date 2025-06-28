import React, { Children, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import { Ticket, User } from '@/types/tickets';
import EmployeeManagement from './admin/EmployeeManagement';
import CategoryManagement from './admin/CategoryManagement';
import AdminSidebar from './admin/AdminSidebar';

interface AdminDashboardProps {
  user: User;
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const AdminDashboard = ({ user, tickets, onViewTicket }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for employees and categories - in real app this would come from props/context
  const [employees, setEmployees] = useState<User[]>([
    { id: 'emp1', name: 'John Smith', email: 'john@company.com', role: 'employee' },
    { id: 'emp2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'employee' },
    { id: 'admin1', name: 'Mike Admin', email: 'mike@company.com', role: 'admin' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', name: 'Technical', description: 'Technical support issues', color: '#3b82f6' },
    { id: 'cat2', name: 'Billing', description: 'Billing and payment issues', color: '#10b981' },
    { id: 'cat3', name: 'General', description: 'General inquiries', color: '#f59e0b' },
    { id: 'cat4', name: 'Bug Report', description: 'Software bugs and issues', color: '#ef4444' },
  ]);

  const openTickets = tickets.filter(ticket => ticket.status === 'open');
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress');
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved');
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed');

  // Chart data
  const statusData = [
    { name: 'Open', value: openTickets.length, color: '#ef4444' },
    { name: 'In Progress', value: inProgressTickets.length, color: '#3b82f6' },
    { name: 'Resolved', value: resolvedTickets.length, color: '#10b981' },
    { name: 'Closed', value: closedTickets.length, color: '#6b7280' }
  ];

  const priorityData = [
    { name: 'Critical', count: tickets.filter(t => t.priority === 'critical').length },
    { name: 'High', count: tickets.filter(t => t.priority === 'high').length },
    { name: 'Medium', count: tickets.filter(t => t.priority === 'medium').length },
    { name: 'Low', count: tickets.filter(t => t.priority === 'low').length }
  ];

  const handleAddEmployee = (employeeData: Omit<User, 'id'>) => {
    const newEmployee: User = {
      ...employeeData,
      id: Date.now().toString(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleUpdateEmployee = (updatedEmployee: User) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
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
                  <div className="text-2xl font-bold">{tickets.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                  <Clock className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{openTickets.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressTickets.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{resolvedTickets.length}</div>
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
      
      case 'tickets':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewTicket={onViewTicket}
                      showAssignee={true}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="open" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewTicket={onViewTicket}
                      showAssignee={true}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewTicket={onViewTicket}
                      showAssignee={true}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resolvedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewTicket={onViewTicket}
                      showAssignee={true}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case 'employees':
        return (
          <EmployeeManagement
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );
      
      case 'categories':
        return (
          <CategoryManagement
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-600">System overview and management</p>
            </div>
          </div>
          <div className="flex-1 p-6">
           {Children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
