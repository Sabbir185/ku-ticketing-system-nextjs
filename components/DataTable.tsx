// @ts-nocheck
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  Search,
  Filter,
  X,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

export interface PaginatedData<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RowData<T> {
  original: T;
  getValue: (key: string) => unknown;
}

export interface CellProps<T> {
  row: RowData<T>;
  getValue: (key: string) => unknown;
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (props: { cell: CellProps<T> }) => React.ReactNode;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: { label: string; value: string }[];
}

export interface Action<T> {
  label: unknown;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

export interface TableAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  primary?: boolean;
}

interface DataTableProps<T> {
  data: PaginatedData<T>;
  columns: Column<T>[];
  rowActions?: Action<T>[];
  tableActions?: TableAction[];
  onPageChange: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  showSerialNumbers?: boolean;
  preventAutoReload?: boolean;
  isSearchable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  rowActions,
  tableActions,
  onPageChange,
  onSearch,
  onFilter,
  isLoading = false,
  title,
  description,
  showSerialNumbers = true,
  preventAutoReload = true,
  isSearchable = false,
}: DataTableProps<T>) {
  // Provide default values for data to prevent undefined errors
  const safeData: PaginatedData<T> = {
    docs: data?.docs || [],
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalDocs: data?.totalDocs || 0,
    totalPages: data?.totalPages || 1,
    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const [tabVisibilityChanged, setTabVisibilityChanged] = useState(false);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const prevSearchTermRef = useRef<string>(searchTerm);
  const initialRenderRef = useRef(true);
  const dataRef = useRef<PaginatedData<T>>(safeData);

  // Store the data in a ref to compare when tab visibility changes
  useEffect(() => {
    dataRef.current = safeData;
  }, [data]);

  // Track tab visibility changes
  useEffect(() => {
    if (!preventAutoReload) return;

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";

      if (isVisible && !isTabFocused) {
        // Tab has become visible again
        setTabVisibilityChanged(true);
        setIsTabFocused(true);
      } else if (!isVisible && isTabFocused) {
        // Tab has become hidden
        setIsTabFocused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => setIsTabFocused(true));
    window.addEventListener("blur", () => setIsTabFocused(false));

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => setIsTabFocused(true));
      window.removeEventListener("blur", () => setIsTabFocused(false));
    };
  }, [isTabFocused, preventAutoReload]);

  // Reset tab visibility change flag after a short delay
  useEffect(() => {
    if (tabVisibilityChanged) {
      const timer = setTimeout(() => {
        setTabVisibilityChanged(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [tabVisibilityChanged]);

  // Track window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);

      // Clear the resize flag after a short delay
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        setIsResizing(false);
      }, 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Handle search with debounce
  useEffect(() => {
    // Skip the first render, resize events, and tab visibility changes
    if (initialRenderRef.current || isResizing || tabVisibilityChanged) {
      initialRenderRef.current = false;
      return;
    }

    // Only proceed if onSearch is provided and the search term has actually changed
    if (!onSearch || prevSearchTermRef.current === searchTerm) return;

    // Update the previous search term reference
    prevSearchTermRef.current = searchTerm;

    // Clear any existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Set a new timeout to debounce the search
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      searchDebounceRef.current = setTimeout(() => {
        onSearch(searchTerm);
      }, 500); // 500ms debounce
    }

    // Cleanup on unmount
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm, onSearch, isResizing, tabVisibilityChanged]);

  const renderCell = (row: T, column: Column<T>) => {
    // Handle the case where row might be undefined
    if (!row) {
      return null;
    }

    // Create a row data object with getValue method that safely handles undefined
    const rowData: RowData<T> = {
      original: row,
      getValue: (key: string) => {
        try {
          return row[key as keyof T];
        } catch (error) {
          console.warn(`Failed to get value for key "${key}"`, error);
          return undefined;
        }
      },
    };

    // Create a cell props object that matches the TanStack Table pattern
    const cellProps: CellProps<T> = {
      row: rowData,
      getValue: (key: string) => rowData.getValue(key),
    };

    if (column.cell) {
      return column.cell({ cell: cellProps });
    }

    if (typeof column.accessorKey === "function") {
      return column.accessorKey(row);
    }

    return row[column.accessorKey as keyof T];
  };

  const handleSearch = () => {
    if (onSearch && !isResizing && !tabVisibilityChanged) {
      onSearch(searchTerm);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (isResizing || tabVisibilityChanged) return;
    const newFilters = { ...filters };
    if (value === "all") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearFilters = () => {
    if (isResizing || tabVisibilityChanged) return;

    setFilters({});
    if (onFilter) {
      onFilter({});
    }
  };

  const handlePageChange = (page: number) => {
    if (isResizing || tabVisibilityChanged) return;
    onPageChange(page);
  };

  const searchableColumns = columns.filter((col) => col.searchable);
  const filterableColumns = columns.filter((col) => col.filterable);

  // Calculate the starting serial number based on the current page and limit
  const startingSerialNumber = (safeData.page - 1) * safeData.limit + 1;

  return (
    <Card className="shadow-sm border-none">
      {(title ||
        description ||
        tableActions ||
        searchableColumns.length > 0) && (
        <CardHeader className="">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {isSearchable && (
                <div className="relative w-full sm:w-auto flex">
                  <Search className="absolute left-2.5 top-[15px] h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-full sm:w-[200px] md:w-[250px] rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              )}
              {filterableColumns.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {Object.keys(filters).length > 0 && (
                    <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </Button>
              )}
              {tableActions && tableActions.length > 0 && (
                <div className="flex items-center gap-2">
                  {tableActions
                    .filter((action) => action.primary)
                    .map((action, index) => (
                      <Button
                        key={index}
                        onClick={(e) => {
                          if (!isResizing && !tabVisibilityChanged)
                            action.onClick();
                        }}
                        variant={action.variant || "default"}
                        size="sm"
                        className="h-9"
                      >
                        {action.icon && (
                          <span className="mr-2">{action.icon}</span>
                        )}
                        {action.label}
                      </Button>
                    ))}

                  {tableActions.filter((action) => !action.primary).length >
                    0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <span className="sr-only">More actions</span>
                          <MoreHorizontal className="h-4 w-4" />
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tableActions
                          .filter((action) => !action.primary)
                          .map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => {
                                if (!isResizing && !tabVisibilityChanged)
                                  action.onClick();
                              }}
                            >
                              {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                              )}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
            </div>
          </div>

          {showFilters && filterableColumns.length > 0 && (
            <div className="mt-4 border rounded-md p-3 bg-muted/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Filters</h4>
                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filterableColumns.map((column, index) => {
                  // Get the filter key: if accessorKey is a string, use it; otherwise skip
                  const filterKey =
                    typeof column.accessorKey === "string"
                      ? column.accessorKey
                      : undefined;
                  if (!filterKey) return null;
                  return (
                    <div key={index} className="flex flex-col space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        {column.header}
                      </label>
                      <Select
                        value={filters[filterKey] || "all"}
                        onValueChange={(value) =>
                          handleFilterChange(filterKey, value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {column.filterOptions?.map((option, optIndex) => (
                            <SelectItem key={optIndex} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardHeader>
      )}

      <CardContent className="p-2 border-none">
        <div className="rounded-md ">
          <Table className="">
            <TableHeader className="bg-muted">
              <TableRow className="border-none">
                {showSerialNumbers && (
                  <TableHead className="w-[60px] text-center">#</TableHead>
                )}
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-[80px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow >
                  <TableCell
                    colSpan={
                      columns.length +
                      (rowActions && rowActions.length > 0 ? 1 : 0) +
                      (showSerialNumbers ? 1 : 0)
                    }
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : safeData.docs.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell
                    colSpan={
                      columns.length +
                      (rowActions && rowActions.length > 0 ? 1 : 0) +
                      (showSerialNumbers ? 1 : 0)
                    }
                    className="h-24 text-center border-none"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No results found.</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">
                          Try adjusting your search or filters.
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                safeData.docs.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/50 border-b border-muted">
                    {showSerialNumbers && (
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {startingSerialNumber + rowIndex}
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {renderCell(row, column) as React.ReactNode}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="cursor-pointer"
                          >
                            {(typeof rowActions === "function"
                              ? rowActions(row)
                              : rowActions
                            ).map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => {
                                  if (!isResizing && !tabVisibilityChanged)
                                    action.onClick(row);
                                }}
                                className="cursor-pointer"
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex items-between justify-between pt-2 ">
        <div className="text-sm text-muted-foreground ">
          Showing <span className="font-medium">{safeData.docs.length}</span> of{" "}
          <span className="font-medium">{safeData.totalDocs}</span> results
        </div>

        <TablePagination
          currentPage={safeData.page}
          totalPages={safeData.totalPages}
          hasNextPage={safeData.hasNextPage}
          hasPrevPage={safeData.hasPrevPage}
          onPageChange={handlePageChange}
          isResizing={isResizing}
          isTabChanging={tabVisibilityChanged}
        />
      </CardFooter>
    </Card>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  isResizing: boolean;
  isTabChanging: boolean;
}

function TablePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isResizing,
  isTabChanging,
}: TablePaginationProps) {
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  // Calculate visible page numbers
  useEffect(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always include last page
      pages.push(totalPages);
    }

    setVisiblePages(pages);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="flex justify-end">
      <PaginationContent className="flex items-center gap-1 p-2 rounded-lg shadow-sm border bg-white">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevPage && !isResizing && !isTabChanging)
                onPageChange(currentPage - 1);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition hover:bg-gray-100 ${
              !hasPrevPage || isResizing || isTabChanging
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          />
        </PaginationItem>

        {/* Page Numbers and Ellipsis */}
        {visiblePages.map((page, index) => {
          if (page < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="px-2 py-1 text-gray-500" />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isResizing && !isTabChanging) onPageChange(page);
                }}
                isActive={page === currentPage}
                className={`px-3 py-1 rounded-md text-sm font-medium transition hover:bg-gray-100 ${
                  page === currentPage
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-gray-700"
                } ${isResizing || isTabChanging ? "pointer-events-none" : ""}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage && !isResizing && !isTabChanging)
                onPageChange(currentPage + 1);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition hover:bg-gray-100 ${
              !hasNextPage || isResizing || isTabChanging
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
