"use client";

import {
  fetchEmployeeTickets,
  resolveTicket,
} from "@/app/actions/ticket/ticketActions";
import Header from "@/components/dashboard/Header";
import EmployeeDashboard from "@/components/dashboard/EmployeDashboard";
import TicketDetails from "@/components/ticketDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, User } from "@/types/tickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";

const Page = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolving, setResolving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const { logout, user, loading } = useAuth() as {
    user: User;
    loading: boolean;
    logout: () => void;
  };

  const getTickets = async () => {
    const data = await fetchEmployeeTickets();
    if (data.success) {
      setTickets(data?.data?.docs || []);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;

    setResolving(true);
    const formData = new FormData();
    formData.append("id", selectedTicket.id);
    formData.append("reply", description);
    if (file) {
      formData.append("file", file);
    }

    const data = await resolveTicket(formData);
    console.log("🚀 ~ handleResolveTicket ~ data:", data)
    setResolving(false);

    if (data.success) {
      toast.success("Ticket resolved successfully!");
      getTickets();
      setSelectedTicket(null);
    } else {
      toast.error(data.message || "Failed to resolve ticket.");
    }
  };

  return (
    <>
      <Header user={user} onLogout={logout} />

      <EmployeeDashboard
        user={user}
        tickets={tickets}
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

          {selectedTicket && (
            <>
              <TicketDetails data={selectedTicket} />

              {selectedTicket.status !== "closed" && (
                <div className="">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleResolveTicket();
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Add your reply..."
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                      <Input
                        type="file"
                        name="attachment"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept="application/pdf,image/*"
                      />
                    </div>
                    <Button className="mt-4" type="submit" disabled={resolving}>
                      {resolving ? "Resolving..." : "Mark as Resolved"}
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
