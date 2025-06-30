import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TicketCard from './TicketCard';
import { Users, Ticket as TicketIcon, Clock } from 'lucide-react';
import { Ticket, User } from '@/types/tickets';

interface EmployeeDashboardProps {
  user: User;
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
}

const EmployeeDashboard = ({ user, tickets, onViewTicket }: EmployeeDashboardProps) => {
  const assignedTickets = tickets
  const openTickets = tickets.filter(ticket => ticket.status === 'open');
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Employee Dashboard</h2>
        <p className="text-gray-600">Manage and respond to support tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned to Me</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <TicketIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{closedTickets.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">My Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned" className="space-y-4">
          {assignedTickets.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No assigned tickets</h3>
                <p className="text-gray-600">Check the unassigned tab for tickets to work on</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onViewTicket={onViewTicket}
                />
              ))}
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
                showAssignee={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
