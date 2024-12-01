"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  Row,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { Loader, PencilLine, Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableDemoProps<TData> {
  isPending?: boolean;
  data: TData[];
  columns: ColumnDef<TData>[];
  onDelete?: (row: TData) => void;
  onEdit?: (row: TData) => void;
}

export function DataTableDemo<TData>({
  isPending = false,
  data = [],
  columns = [],
  onDelete,
  onEdit,
}: DataTableDemoProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-white-table dark:bg-[#242424]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-gray-700 dark:text-[#A7A7A7] text-xs font-medium px-4 py-4 ${header.column.columnDef?.className}`}
                  >
                    {header.column.columnDef.id === "select" ? (
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) =>
                          table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                      />
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow className="w-full">
                <TableCell
                  colSpan={columns.length}
                  className="h-[60vh] flex items-center justify-center"
                >
                  <div className="animate-spin text-gray-400 dark:text-[#B6B6B6] text-4xl flex justify-center">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.column.columnDef?.className} text-black-blue-100 dark:text-[#B6B6B6] text-sm font-normal px-4 py-4`}
                    >
                      {cell.column.columnDef.id === "actions" ? (
                        <div className="flex items-center justify-center space-x-2">
                          {onEdit && (
                            <PencilLine
                              className="cursor-pointer"
                              size={20}
                              strokeWidth={1.5}
                              onClick={() => onEdit(row.original)}
                            />
                          )}
                          {onDelete && (
                            <Trash2
                              className="cursor-pointer"
                              size={20}
                              strokeWidth={1.5}
                              onClick={() => onDelete(row.original)}
                            />
                          )}
                        </div>
                      ) : cell.column.columnDef.id === "select" ? (
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
                          aria-label="Select row"
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
