import React from "react";
import { Loader } from "./Loader";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key?: string;
  header: string | React.ReactNode;
  accessor?: ((row: T) => React.ReactNode) | keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No data found",
  emptyMessage = "There are no records to display at this time.",
  keyExtractor = (row, idx) => row._id || row.id || idx,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading data...</p>
      </div>
    );
  }

  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <EmptyState title={emptyTitle} message={emptyMessage} />
      </div>
    );
  }

  const renderCellContent = (col: Column<T>, row: T) => {
    if (col.accessor) {
      if (typeof col.accessor === "function") {
        return col.accessor(row);
      }
      return row[col.accessor as keyof T];
    }
    if (col.render) {
      return col.render(row);
    }
    if (col.key) {
      return row[col.key];
    }
    return null;
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col, cIdx) => (
              <th key={col.key || `col_${cIdx}`} className={`px-6 py-4 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {safeData.map((row, rIdx) => (
            <tr
              key={keyExtractor(row, rIdx)}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              {columns.map((col, cIdx) => (
                <td key={col.key || `cell_${rIdx}_${cIdx}`} className={`px-6 py-4 align-middle ${col.className || ""}`}>
                  {renderCellContent(col, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
