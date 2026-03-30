"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Title } from "@/hooks/use-api";

const columns: ColumnDef<Title>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => row.original.genres?.join(", ") || "N/A",
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    cell: ({ row }) => new Date(row.original.releaseDate).getFullYear(),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => row.original.rating.toFixed(1),
  },
];

type MoviesTableProps = {
  data: Title[];
  isLoading?: boolean;
  error?: string | null;
};

export function MoviesTable({ data, isLoading, error }: MoviesTableProps) {
  // TanStack Table relies on function-returning APIs that the React compiler flags.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="px-4 py-8 text-center text-muted-foreground">
          Loading movies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="px-4 py-8 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-muted/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data?.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-muted-foreground" colSpan={columns.length}>
                No movies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
