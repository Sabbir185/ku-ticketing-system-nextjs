"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllCategory } from "@/app/actions/ticket/category/ticketCategory";



export default function DepartmentMultiSelect({ selected, setSelected }) {
  const [AllCategory, setAllCategory] = useState([]);
  const fetchAllCategoryWithoutPagination = async () => {
    const res = await fetchAllCategory();
    if (res?.success) {
      setAllCategory(res?.data || []);
    }
  };
  useEffect(() => {
    fetchAllCategoryWithoutPagination();
  },[]);
  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select departments"}
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px]">
        <div className="flex flex-col gap-2">
          {AllCategory.map((dept) => (
            <label
              key={dept.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(dept.id)}
                onCheckedChange={() => toggleSelection(dept.id)}
              />
              <span>{dept.name}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
