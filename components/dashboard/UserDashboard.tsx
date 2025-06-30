"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Ticket as TicketIcon } from 'lucide-react';
import { Ticket, User } from '@/types/tickets';
import CreateTicketForm from './CreateTicketForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TicketCard from './TicketCard';

interface UserDashboardProps {
  user: User;
  tickets: Ticket[];
  onCreateTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  onViewTicket: (ticket: Ticket) => void;
}

const UserDashboard = ({ user, tickets, onCreateTicket, onViewTicket }: UserDashboardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const userTickets = tickets
  const openTickets = userTickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in-progress');
  const closedTickets = userTickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed');

  const handleCreateTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    onCreateTicket(ticketData);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="p-6">
        <CreateTicketForm
          user={user}
          onCreateTicket={handleCreateTicket}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
          <p className="text-gray-600">Manage your support requests</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className='border-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTickets.length}</div>
          </CardContent>
        </Card>
        <Card className='border-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{openTickets.length}</div>
          </CardContent>
        </Card>
        <Card className='border-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{closedTickets.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger className='cursor-pointer' value="all">All Tickets</TabsTrigger>
          <TabsTrigger className='cursor-pointer' value="open">Open</TabsTrigger>
          <TabsTrigger className='cursor-pointer' value="closed">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {userTickets.length === 0 ? (
            <Card className='border-none'>
              <CardContent className="py-8 text-center">
                <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets yet</h3>
                <p className="text-gray-600 mb-4">Create your first support ticket to get started</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
              userTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onViewTicket={onViewTicket}
                />
              ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewTicket={onViewTicket}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewTicket={onViewTicket}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
