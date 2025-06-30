import { useState } from 'react';
import {
  AccessorKeyColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  PaginationState,
  Table as TanstackTable,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/16/solid';

interface TableProps<T> {
  data: Array<T>;
  columns: Array<AccessorKeyColumnDef<T>>;
  initialState?: InitialTableState;
}

export const Table = <T,>({ data, columns, initialState = {} }: TableProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    initialState,
    autoResetPageIndex: false,
  });

  return (
    <>
      <table className="border w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b-2">
              {hg.headers.map((h) => (
                <th key={h.id} className="p-2 text-left">
                  <button
                    className="cursor-pointer flex gap-1 items-center"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                    <SortIndicator dir={h.column.getIsSorted()} />
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-b">
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="p-2">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination<T> table={table} />
    </>
  );
};

interface SortIndicatorProps {
  dir: string | boolean;
}

const SortIndicator = ({ dir }: SortIndicatorProps) => {
  console.log(dir, 'dir');
  if (dir === 'asc') {
    return <ArrowUpIcon className="size-3" />;
  } else if (dir === 'desc') {
    return <ArrowDownIcon className="size-3" />;
  }
  return null;
};

interface TablePaginationProps<T> {
  table: TanstackTable<T>;
}

const TablePagination = <T,>({ table }: TablePaginationProps<T>) => {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex gap-2">
        <button className="border rounded p-1" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronDoubleLeftIcon className="size-5" />
          <span className="sr-only">First Page</span>
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-5" />
          <span className="sr-only">Previous Page</span>
        </button>
      </div>
      <div className="flex gap-2">
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRightIcon className="size-5" />
          <span className="sr-only">Next Page</span>
        </button>
        <button className="border rounded p-1" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          <ChevronDoubleRightIcon className="size-5" />
          <span className="sr-only">Last Page</span>
        </button>
      </div>
    </div>
  );
};
