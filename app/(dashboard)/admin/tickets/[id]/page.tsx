// @ts-nocheck

"use client";

import { fetchTicket, resolveTicket } from "@/app/actions/ticket/ticketActions";
import { Badge } from "@/components/ui/badge"; // assuming this is your badge
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Ticket } from "@/types/tickets"; // Make sure this type exists
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TicketDetailsPage = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [resolving, setResolving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const response = await fetchTicket(id);
        console.log("🚀 ~ fetchData ~ response:", response);
        if (response?.success) {
          setTicket(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      }
    };

    fetchData();
  }, [params]);
  const handleResolveTicket = async () => {
    if (!ticket) return;

    setResolving(true);
    const formData = new FormData();
    formData.append("id", ticket.id);
    formData.append("reply", description);
    if (file) {
      formData.append("file", file);
    }

    const data = await resolveTicket(formData);
    console.log("🚀 ~ handleResolveTicket ~ data:", data);
    setResolving(false);

    if (data.success) {
      toast.success("Ticket resolved successfully!");
    } else {
      toast.error(data.message || "Failed to resolve ticket.");
    }
  };

  if (!ticket) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading ticket details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tickets
      </button>

      {/* Ticket Overview */}
      <div className="space-y-2 border-gray-50 rounded-lg p-5 shadow-sm bg-white relative">
        <h2 className="text-2xl font-semibold text-gray-800">{ticket.title}</h2>
        <p className="text-gray-600 my-7">{ticket.description}</p>
        {ticket?.replyFile && (
          <a
            href={ticket.replyFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View / Download File
          </a>
        )}
        <p>
          Created:{" "}
          {new Date(ticket.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short", // e.g. Jan, Feb
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary">{ticket.priority}</Badge>
          <Badge variant="outline">{ticket.status}</Badge>
          <Badge>{ticket.category?.name}</Badge>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Created By */}
        <div className="border-gray-50 rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Created By</h3>
          <p className="text-sm">{ticket.user?.name}</p>
          <p className="text-sm text-muted-foreground">{ticket.user?.email}</p>
          <p className="text-sm text-muted-foreground">{ticket.user?.phone}</p>
        </div>

        {/* Assigned Employee */}
        <div className="border-gray-50 rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">
            Assigned Employee
          </h3>
          <p className="text-sm">{ticket.employee?.name}</p>
          <p className="text-sm text-muted-foreground">
            {ticket.employee?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {ticket.employee?.phone}
          </p>
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== "closed" && (
        <div className="border-gray-50 rounded-lg p-5 bg-white shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">
            Add Reply & Resolve
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResolveTicket();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="description">Reply</Label>
              <Textarea
                id="description"
                placeholder="Add your reply..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="file">Attachment (optional)</Label>
              <Input
                type="file"
                name="attachment"
                id="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="application/pdf,image/*"
              />
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto cursor-pointer"
              disabled={resolving}
            >
              {resolving ? "Resolving..." : "Mark as Resolved"}
            </Button>
          </form>
        </div>
      )}
      {ticket.status === "closed" && (
        <div className="border-gray-50 rounded-lg p-5 bg-white shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">
            Ticket Resolved
          </h3>
          <p className="text-gray-600">{ticket.reply}</p>
          {ticket?.replyFile && (
            <a
              href={ticket.replyFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              View / Download File
            </a>
          )}
          {ticket?.reply && (
            <div className="text-sm text-gray-500">
              <p>Replied: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;
