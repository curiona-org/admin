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
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
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
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { deleteRoadmap, listRoadmaps } from "@/app/dashboard/roadmap/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { APIResponse, Filters } from "@/lib/services/api.service";
import { cn } from "@/lib/utils";
import { ListRoadmapsOutput } from "@/types/api-admin";
import Link from "next/link";
import { Input } from "../ui/input";

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  total_topics: z.number(),
  total_bookmarks: z.number(),
  created_at: z.string(),
  personalization_options: z.object({
    daily_time_availability: z.object({
      value: z.number(),
      unit: z.enum(["minutes", "hours", "days", "weeks", "months"]),
    }),
    total_duration: z.object({
      value: z.number(),
      unit: z.enum(["minutes", "hours", "days", "weeks", "months"]),
    }),
    skill_level: z.enum(["beginner", "intermediate", "advanced"]),
  }),
  creator: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    is_suspended: z.boolean(),
    joined_at: z.string(),
  }),
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/roadmap/${row.original.id}`}
          className='flex items-center'
        >
          <span className='text-primary hover:underline'>
            {row.original.title}
          </span>
          <IconChevronRight className='inline ml-1 size-4' />
        </Link>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "Skill Level",
    header: "Skill Level",
    cell: ({ row }) => {
      switch (row.original.personalization_options.skill_level) {
        case "beginner":
          return (
            <Badge
              variant='secondary'
              className='bg-blue-500 text-accent px-1.5 h-5'
            >
              Beginner
            </Badge>
          );
        case "intermediate":
          return (
            <Badge
              variant='secondary'
              className='bg-yellow-500 text-accent px-1.5 h-5'
            >
              Intermediate
            </Badge>
          );
        case "advanced":
          return (
            <Badge
              variant='secondary'
              className='bg-red-500 text-accent px-1.5 h-5'
            >
              Advanced
            </Badge>
          );
        default:
          return (
            <Badge variant='outline' className='text-accent px-1.5'>
              Unknown
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "total_topics",
    header: "Total Topics",
    cell: ({ row }) => {
      return row.original.total_topics;
    },
  },
  {
    accessorKey: "total_bookmark",
    header: "Total Bookmarks",
    cell: ({ row }) => {
      return row.original.total_bookmarks;
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className='text-muted-foreground hover:text-primary px-1.5'
      >
        <IconMail className='mr-1' />
        <a href={`mailto:${row.original.creator.email}`}>
          {row.original.creator.email}
        </a>
      </Badge>
    ),
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
  title = "",
  data: initialData,
  paginationOptions,
  dataSource = listRoadmaps,
}: {
  data: z.infer<typeof schema>[];
  paginationOptions: z.infer<typeof paginationOptionsSchema>;
  title?: string;
  dataSource?: (filters: Filters) => Promise<APIResponse<ListRoadmapsOutput>>;
}) {
  const [data, setData] = React.useState(() => initialData);
  const dataSourceFn = React.useCallback(
    (filters: Filters) => dataSource(filters),
    [dataSource]
  );

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
      const roadmaps = await dataSourceFn({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
      });

      startTransition(() => {
        setData(roadmaps.data.items);
        setPagination({
          pageIndex: roadmaps.data.current_page - 1,
          pageSize: pagination.pageSize,
        });
        setTotalPages(roadmaps.data.total_pages);
      });
    };

    fetchData();
  }, [
    dataSourceFn,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
  ]);

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
        toast.promise(deleteRoadmap(row.original.id), {
          loading: `Deleting ${row.original.title}`,
          success: async () => {
            const roadmaps = await listRoadmaps({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize,
              search: debouncedSearch,
            });

            startTransition(() => {
              setData(roadmaps.data.items);
              setPagination({
                pageIndex: roadmaps.data.current_page - 1,
                pageSize: pagination.pageSize,
              });
              setTotalPages(roadmaps.data.total_pages);
            });
            return `User ${row.original.title} deleted`;
          },
          error: `Failed to delete user ${row.original.title}`,
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
            <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
            {isPending && (
              <IconLoader className='size-6 animate-spin text-muted-foreground' />
            )}
          </div>
          <div className='flex flex-row items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  <IconLayoutColumns />
                  <span className='hidden lg:inline'>Customize Columns</span>
                  <span className='lg:hidden'>Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              placeholder='Search...'
              onChange={(event) => setSearch(event.target.value)}
              className='max-w-sm'
            />
          </div>
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
