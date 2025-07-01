// @ts-nocheck
"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/tickets';

interface TicketCardProps {
  ticket: Ticket;
  onViewTicket: (ticket: Ticket) => void;
  showAssignee?: boolean;
}

const TicketCard = ({ ticket, onViewTicket, showAssignee = false }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
            {ticket?.title}
          </CardTitle>
          <div className="flex space-x-2">
            <Badge variant={getPriorityColor(ticket?.priority)}>
              {ticket?.priority}
            </Badge>
            <Badge variant={getStatusColor(ticket?.status)}>
              {ticket?.status?.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {ticket?.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Created: {new Date(ticket?.createdAt).toLocaleDateString()}</span>
          <span className="capitalize">{ticket?.category?.name}</span>
        </div>
        {showAssignee && ticket?.assignedTo && (
          <div className="text-xs text-gray-500 mb-4">
            Assigned to: {ticket?.assignedTo}
          </div>
        )}
        <Button 
          size="sm" 
          onClick={() => onViewTicket(ticket)}
          className="w-full cursor-pointer"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
