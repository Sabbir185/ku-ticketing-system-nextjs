// @ts-nocheck

"use client"
import { deleteTicket, fetchEmployeeTickets } from '@/app/actions/ticket/ticketActions';
import { DataTable } from '@/components/DataTable';
import { Ticket } from '@/types/tickets';
import { Category } from '@prisma/client';
import {  Trash2, View } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const Page = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const getTickets = async () => {
      setLoading(true);
      const data = await fetchEmployeeTickets();
      if (data.success) {
        setTickets(data?.data || []);
        setLoading(false);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      getTickets();
    }, []);

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user",
      header: "User",
      enableSorting: false,
      enableHiding: false,
      cell: ({ cell }: { cell: { row: { original: Ticket } } }) => {
        const user = cell.row.original;
        console.log("🚀 ~ page ~ user:", user)
        return <p>{user?.user?.name}</p>;
      }      
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      enableHiding: false,
      cell: ({ cell }) => {
        const category = cell.row.original;
        return <p>{category?.category?.name}</p>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      enableHiding: false,
      cell: ({ cell }) => {
        const status = cell.row.original;
        return <p className={status?.status === "open" ? "text-green-500 capitalize" : "text-red-500 capitalize"}>{status?.status}</p>;
      }
    },{
      accessorKey: "priority",
      header: "Priority",
      enableSorting: false,
      enableHiding: false,
      cell: ({ cell }) => {
        const priority = cell.row.original;
        return <p className='capitalize'>{priority?.priority}</p>;
      },
    }
  ];

  const rowActions = [
    {
      label: "View",
      icon: <View className="h-4 w-4" />,
      onClick: (row: Category) => router.push(`/admin/tickets/${row.id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Category) => handleDelete(row.id),
    },
  ];
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this ticket?");
    if (confirmDelete) {
      const fd = new FormData();
      fd.append("id", id);
      const res = await deleteTicket(fd);
      if (res?.success) {
        toast.success(res?.message || "Ticket deleted successfully");
        getTickets();
      } else {
        toast.error(res?.message || "Failed to delete ticket",);
      }
    }
  };

  return (
     <div className="space-y-4">
             <DataTable
                    title="All tickets"
                    data={tickets}
                    columns={columns}
                    rowActions={rowActions}
                    isLoading={loading}
                    // tableActions={tableActions}
                    showSerialNumbers
                  />
          </div>
  )
}

export default Page