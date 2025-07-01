"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions/ticket/category/ticketCategory";
import { toast } from "sonner";
import { DataTable, TableAction } from "@/components/DataTable";

interface Category {
  id: string;
  name: string;
}

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const fetchCategories = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/category`);
    const data = await response.json();
    setCategories(data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const fd = new FormData();
    fd.append("name", formData.name);

    type CategoryResponse = { success: boolean; message?: string };
    let response: CategoryResponse;
    if(editingCategory) {
      fd.append("id", editingCategory.id);
      response = await updateCategory(fd) as CategoryResponse;
    }else{
      response = await createCategory(fd) as CategoryResponse;
    }

    if (response?.success) {
      toast.success(response?.message || "Category added successfully");
      setIsModalOpen(false);
      setFormData({ name: "" });
      fetchCategories();
    } else {
      toast.error(response?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      const fd = new FormData();
      fd.append("id", id);
      const res = await deleteCategory(fd);
      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(res?.message || "Failed to delete category");
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      enableHiding: false,
    }
  ];

  const rowActions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Category) => handleEdit(row),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Category) => handleDelete(row.id),
    },
  ];

  const tableActions: TableAction[] = [
    {
      // @ts-ignore
      label: (
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      ),
      onClick: () => setIsModalOpen(true),
      icon: null,
      primary: true,
    },
  ];

  return (
    <>
      <DataTable
        title="Categories"
        // @ts-ignore
        data={categories}
        // @ts-ignore
        columns={columns}
        rowActions={rowActions}
        isLoading={loading}
        tableActions={tableActions}
        showSerialNumbers
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManagement;
