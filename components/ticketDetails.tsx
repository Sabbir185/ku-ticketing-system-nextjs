"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface TicketProps {
  data: {
    title: string;
    description: string;
    priority: string;
    status: string;
    category: { name: string };
    user: { name: string; email: string; phone: string };
    employee: { name: string; email: string; phone: string };
    createdAt: string;
    updatedAt: string;
    reply?: string;
    file?: string;
    id: number;
    replyFile ?: string
  };
}

export default function TicketDetails({ data, isUser }: { data: TicketProps["data"], isUser: boolean }) {
  console.log("🚀 ~ TicketDetails ~ isUser:", isUser)
  console.log("🚀 ~ TicketDetails ~ data:", data);
  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="space-y-1">
        <div className="flex gap-5 my-5">
          <Badge variant="secondary">Priority : {data.priority}</Badge>
          <Badge variant="outline"> Status : {data.status}</Badge>
          <Badge> Category : {data.category?.name}</Badge>
        </div>
        <h3 className="font-semibold mb-1 text-gray-700">
          Subject : {data.title}
        </h3>
        <p className="text-gray-600">{data.description}</p>
        {data?.file && (
          <a
            href={data.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View / Download File
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isUser && (
          <div>
          <h3 className="font-semibold mb-1 text-gray-700">
            Assigned Employee
          </h3>
          <p className="text-sm">{data.employee?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.employee?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.employee?.phone}
          </p>
        </div>
        )}
        {
          !isUser && (
            <div>
          <h3 className="font-semibold mb-1 text-gray-700">
            Created By
          </h3>
          <p className="text-sm">{data.user?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.user?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.user?.phone}
          </p>
        </div>
          )
        }
      </div>

      <div className="text-sm text-gray-500">
        <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
      </div>

      {data.reply  && (
        <div className="mt-2">
          <h3 className="font-semibold text-lg mb-1">Reply</h3>
          <div className="space-y-3 max-h-60 overflow-auto">
              <div
                className="bg-gray-50 p-3 rounded-md  text-sm border-noe"
              >
                <p className="mb-1">{data?.reply}</p>
               
              </div>
          </div>
        </div>
      )}
      {
        data?.replyFile && (
          <a
            href={data.replyFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View / Download File
          </a>
        )
      }
      {
        data?.reply && (
          <div className="text-sm text-gray-500">
            <p>Replied: {new Date(data.updatedAt).toLocaleString()}</p>
          </div>
        )
      }
    </div>
  );
}
