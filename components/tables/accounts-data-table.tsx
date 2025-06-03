"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLoader,
  IconMail,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  deleteUser,
  listUsers,
  suspendUser,
  unsuspendUser,
} from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { Input } from "../ui/input";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  is_admin: z.boolean(),
  is_suspended: z.boolean(),
  total_roadmaps: z.number(),
  joined_at: z.string(),
});

export const paginationOptionsSchema = z.object({
  total: z.number(),
  total_pages: z.number(),
  current_page: z.number(),
  limit: z.number(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: "Full Name",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/account/${row.original.id}`}
          className='flex items-center'
        >
          <span className='text-primary hover:underline'>
            {row.original.name}
          </span>
          <IconChevronRight className='inline ml-1 size-4' />
        </Link>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className='text-muted-foreground hover:text-primary px-1.5'
      >
        <IconMail className='mr-1' />
        <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
      </Badge>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) =>
      row.original.is_admin ? (
        <Badge variant='default' className='text-accent px-1.5'>
          <IconCheck /> Admin
        </Badge>
      ) : (
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          User
        </Badge>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-target`} className='sr-only'>
          Target
        </Label>
        <Select
          onValueChange={async (value) => {
            if (value === "suspend") {
              toast.promise(suspendUser(row.original.id), {
                loading: `Saving ${row.original.name}`,
                success: `User ${row.original.name} suspended`,
                error: `Failed to suspend user ${row.original.name}`,
              });
              row.original.is_suspended = true;
            } else {
              toast.promise(unsuspendUser(row.original.id), {
                loading: `Saving ${row.original.name}`,
                success: `User ${row.original.name} is now active`,
                error: `Failed to activate user ${row.original.name}`,
              });
              row.original.is_suspended = false;
            }
          }}
          defaultValue={row.original.is_suspended ? "suspend" : "active"}
        >
          <SelectTrigger id={`${row.original.id}-target`} className='w-32'>
            <SelectValue
              placeholder={
                row.original.is_suspended ? (
                  <span className='text-destructive'>Suspended</span>
                ) : (
                  <span className='text-primary'>Active</span>
                )
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className='text-primary' value='active'>
              Active
            </SelectItem>
            <SelectItem className='text-destructive' value='suspend'>
              Suspended
            </SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
  },
  {
    accessorKey: "roadmaps",
    header: "Roadmaps",
    cell: ({ row }) => {
      return row.original.total_roadmaps;
    },
    enableHiding: false,
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: ({ row }) => {
      return dayjs(row.original.joined_at).format("MMM D, YYYY HH:mm");
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
            size='icon'
          >
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem
            variant='destructive'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (table.options.meta as DataTableMeta).removeRow(row);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

type DataTableMeta = {
  removeRow: (row: Row<z.infer<typeof schema>>) => void;
};

export function DataTable({
  data: initialData,
  paginationOptions,
}: {
  data: z.infer<typeof schema>[];
  paginationOptions: z.infer<typeof paginationOptionsSchema>;
}) {
  const { session } = useAuth();
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: paginationOptions.current_page - 1,
    pageSize: paginationOptions.limit,
  });

  const [totalPages, setTotalPages] = React.useState(
    paginationOptions.total_pages
  );

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const [isPending, startTransition] = React.useTransition();
  React.useEffect(() => {
    const fetchData = async () => {
      const users = await listUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
      });

      startTransition(() => {
        setData(users.data.items);
        setPagination({
          pageIndex: users.data.current_page - 1,
          pageSize: pagination.pageSize,
        });
        setTotalPages(users.data.total_pages);
      });
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: totalPages,
    manualPagination: true,
    meta: {
      removeRow: (row: Row<z.infer<typeof schema>>) => {
        if (row.original.id === session?.user.id) {
          toast.error("You cannot delete your own account.");
          return;
        }

        toast.promise(deleteUser(row.original.id), {
          loading: `Deleting ${row.original.name}`,
          success: async () => {
            const users = await listUsers({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: debouncedSearch,
            });

            startTransition(() => {
              setData(users.data.items);
              setPagination({
                pageIndex: users.data.current_page - 1,
                pageSize: pagination.pageSize,
              });
              setTotalPages(users.data.total_pages);
            });
            return `User ${row.original.name} deleted`;
          },
          error: `Failed to delete user ${row.original.name}`,
        });
      },
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className='w-full flex-col justify-start gap-6'>
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='flex flex-row justify-between py-2'>
          <div className='flex flex-row items-center gap-2'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Accounts List
            </h2>
            {isPending && (
              <IconLoader className='size-6 animate-spin text-muted-foreground' />
            )}
          </div>
          <Input
            placeholder='Search...'
            onChange={(event) => setSearch(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className={cn(isPending && "bg-muted/25")}>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
