// @ts-nocheck
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
import { deleteCategory } from "@/app/actions/ticket/category/ticketCategory";
import { toast } from "sonner";
import { DataTable, TableAction } from "@/components/DataTable";
import DepartmentMultiSelect from "@/components/DepartmentSelect";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/ticket/employee/employeeAction";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  departments?: { id: number }[];
}

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Fetching employees...");
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ticket/employee`
      );
      const data = await response.json();
      setEmployees(data?.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;
    if (selectedDepartments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("password", formData.password);
    fd.append("department", JSON.stringify(selectedDepartments));
    fd.append("role", "EMPLOYEE");

    let response = {};

    if (editingEmployee) {
      fd.append("id", editingEmployee.id);
      response = await updateEmployee(fd);
    } else {
      response = await createEmployee(fd);
    }

    if (response?.success) {
      toast.success(response?.message || "Employee saved successfully");
      resetForm();
      fetchEmployees();
    } else {
      toast.error(response?.message || "Failed to save employee");
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "", password: "" });
    setSelectedDepartments([]);
    setEditingEmployee(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    const fd = new FormData();
    fd.append("id", id);
    const res = await deleteCategory(fd);

    if (res?.success) {
      toast.success(res?.message || "Deleted successfully");
      fetchEmployees();
    } else {
      toast.error(res?.message || "Failed to delete");
    }
  };

  const handleEdit = (employee: Employee) => {
    console.log("🚀 ~ handleEdit ~ employee:", employee);
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: "",
    });
    setSelectedDepartments(employee.departments?.map((d) => d.id) || []);
    setIsModalOpen(true);
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "departments",
      header: "Departments",
      cell: ({ cell }) => {
        const coupon = cell.row.original;
        return <p>{coupon?.departments?.map((d) => d.name).join(", ")}</p>;
      },
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Employee) => handleEdit(row),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Employee) => handleDelete(row.id),
    },
  ];

  const tableActions: TableAction[] = [
    {
      label: (
        <Button type="button" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      ),
      onClick: () => {
        resetForm();
        setEditingEmployee(null);
        setIsModalOpen(true);
      },
      icon: null,
      primary: true,
    },
  ];

  return (
    <>
      <DataTable
        title="Employees"
        data={employees}
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
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
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

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>
            {!editingEmployee && (
              <>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required={!editingEmployee}
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <DepartmentMultiSelect
                    selected={selectedDepartments}
                    setSelected={setSelectedDepartments}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEmployee ? "Update" : "Add"} Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeePage;
