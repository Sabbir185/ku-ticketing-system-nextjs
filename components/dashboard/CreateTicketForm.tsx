"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket, User } from "@/types/tickets";
import { fetchAllCategory } from "@/app/actions/ticket/category/ticketCategory";
import { toast } from "sonner";
import { createTicket } from "@/app/actions/ticket/ticketActions";

interface CreateTicketFormProps {
  user: User;
  onCreateTicket: (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">
  ) => void;
  onCancel: () => void;
}

const CreateTicketForm = ({
  onCancel,
}: CreateTicketFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [AllCategory, setAllCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAllCategoryWithoutPagination = async () => {
      const res = await fetchAllCategory();
      if (res?.success) {
        setAllCategory(res?.data || []);
      }
    };
    fetchAllCategoryWithoutPagination();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!selectedDepartment) {
      toast.error("Please select a department");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("categoryId", selectedDepartment); // for backend compatibility

    if (file) {
      formData.append("file", file);
    }

    const response = await createTicket(formData);
    if (response?.success) {
      toast.success(response?.message || "Ticket added successfully");
      onCancel();
      setLoading(false);
    } else {
      toast.error(response?.message || "Failed to add ticket");
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle>Create New Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} typeof="multipart/form-data" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Subject</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter subject"
              value={title}
              min={5}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => setSelectedDepartment(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {AllCategory?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your issue..."
              rows={6}
              minLength={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="mb-2">Upload File (optional)</Label>
            <Input
              accept="image/*,application/pdf"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex space-x-4">
            <Button disabled={loading} type="submit" className="flex-1 cursor-pointer">
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
            <Button
              
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTicketForm;
