"use client"
import TicketCard from '@/components/dashboard/TicketCard'
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Ticket } from '@/types/tickets';
import { TabsList } from '@radix-ui/react-tabs'
import React from 'react'
const tickets: Ticket[] = [
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
const onViewTicket = (ticket: Ticket) => {
  console.log('Viewing ticket:', ticket);
  // In a real app, this would navigate to a ticket detail page
}
const page = () => {
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
              
              <TabsContent value="progress" className="space-y-4">
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
              
              <TabsContent value="resolved" className="space-y-4">
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
            </Tabs>
          </div>
  )
}

export default page