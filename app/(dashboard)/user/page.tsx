"use client";

import { fetchUserTickets } from "@/app/actions/ticket/ticketActions";
import Header from "@/components/dashboard/Header";
import UserDashboard from "@/components/dashboard/UserDashboard";
import TicketDetails from "@/components/ticketDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, User } from "@/types/tickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth() as {
    user: User;
    loading: boolean;
    logout: () => void;
  };

  const getTickets = async () => {
    setLoading(true);
    const data = await fetchUserTickets(new FormData());
    if (data.success) {
      setTickets(data?.data?.docs || []);
    }
    setLoading(false);
    
  };

  useEffect(() => {
    getTickets();
  }, []);

  const handleCreateTicket = (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <>
      <Header user={user} onLogout={logout} />

      <UserDashboard
        user={user}
        tickets={tickets}
        onCreateTicket={handleCreateTicket}
        onViewTicket={handleViewTicket}
      />

      <Dialog
        open={!!selectedTicket}
        onOpenChange={() => setSelectedTicket(null)}
      >
        <DialogContent className="!max-w-4xl !w-full">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && <TicketDetails isUser={true} data={selectedTicket}  />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
