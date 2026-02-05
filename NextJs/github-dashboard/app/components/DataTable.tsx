'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    PaginationState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    pageCount?: number;
    pagination?: PaginationState;
    onPaginationChange?: (pagination: PaginationState) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: pageCount,
        onPaginationChange: (updater) => {
            if (onPaginationChange && pagination) {
                const nextPagination = typeof updater === 'function' ? updater(pagination) : updater;
                onPaginationChange(nextPagination);
            }
        },
        state: {
            sorting,
            pagination: pagination || { pageIndex: 0, pageSize: 10 },
        },
    });

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-100 dark:border-gray-800">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs py-5 px-6">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? 'flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 transition-colors'
                                                            : 'flex items-center gap-2'
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <div className="w-4 h-4">
                                                            {{
                                                                asc: <ChevronUp className="w-4 h-4" />,
                                                                desc: <ChevronDown className="w-4 h-4" />,
                                                            }[header.column.getIsSorted() as string] ?? <ChevronsUpDown className="w-4 h-4 opacity-30" />}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 border-gray-100 dark:border-gray-800 transition-colors group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6 text-gray-700 dark:text-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500 dark:text-gray-400 font-medium">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Updating results...
                                        </div>
                                    ) : (
                                        'No results found.'
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* TanStack Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                    Total results: <span className="font-bold text-gray-900 dark:text-white">{(pageCount || 0) * (pagination?.pageSize || 10)}</span>
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
