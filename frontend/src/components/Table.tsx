import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Paginations from './Paginations';

interface TableProps {
  title: string;
  button: ReactNode;
  data: any[];
  columns: string[];
  rowsPerPage?: number;
  filters?: ReactNode;
}

function Table({ title, button, data, columns, rowsPerPage = 5, filters }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = data.length;
  const numberOfPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (currentPage > numberOfPages) {
      setCurrentPage(numberOfPages);
    }
  }, [currentPage, numberOfPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-1 text-xs text-gray-400">
              Vista de registros y administración general del sistema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {button}
            <span className="inline-flex items-center rounded border border-border-dark bg-bg-panel px-3 py-1.5 text-xs text-gray-300">
              Total registros: <strong className="ml-2 text-white">{totalItems}</strong>
            </span>
          </div>
        </div>

        {filters && (
          <div className="flex flex-wrap items-center gap-3 border-t border-border-dark/60 pt-4">
            {filters}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded border border-border-dark bg-bg-panel custom-scrollbar">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-dark bg-black/40">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-dark/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-xs text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-bg-panel/50 hover:bg-bg-panel transition duration-150"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3 text-xs text-gray-200">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-4 pt-4 border-t border-border-dark/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-400">
          Mostrando <span className="font-semibold text-white">{startItem}</span> -{' '}
          <span className="font-semibold text-white">{endItem}</span> de{' '}
          <span className="font-semibold text-white">{totalItems}</span> resultados
        </div>

        <Paginations
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}

export default Table;
