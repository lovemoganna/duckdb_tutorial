import { useState } from 'react';

interface SQLResultPreviewProps {
  headers: string[];
  rows: (string | number | null)[][];
  title?: string;
  description?: string;
  darkMode: boolean;
  highlightRows?: number[];
  highlightColumns?: number[];
  showRowNumbers?: boolean;
  maxHeight?: string;
}

export function SQLResultPreview({
  headers,
  rows,
  title,
  description,
  darkMode,
  highlightRows = [],
  highlightColumns = [],
  showRowNumbers = true,
  maxHeight = '400px'
}: SQLResultPreviewProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortColumn === null) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className={`my-6 rounded-xl overflow-hidden border shadow-lg ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* 标题栏 */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-slate-50 to-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {title || '查询结果'}
            </h4>
            {description && (
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            {rows.length} 行 × {headers.length} 列
          </span>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full text-sm">
          <thead className={`sticky top-0 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <tr>
              {showRowNumbers && (
                <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider border-b ${
                  darkMode ? 'text-slate-400 border-slate-700 bg-slate-900' : 'text-slate-500 border-slate-200 bg-slate-100'
                }`}>
                  #
                </th>
              )}
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b cursor-pointer transition-colors ${
                    highlightColumns.includes(index)
                      ? darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-800'
                      : darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'
                  } ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortColumn === index && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={darkMode ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
            {sortedRows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`transition-colors ${
                  highlightRows.includes(rowIndex)
                    ? darkMode ? 'bg-green-900/20 hover:bg-green-900/30' : 'bg-green-50 hover:bg-green-100'
                    : darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
              >
                {showRowNumbers && (
                  <td className={`px-3 py-3 text-xs font-mono ${
                    darkMode ? 'text-slate-500 bg-slate-900/50' : 'text-slate-400 bg-slate-50/50'
                  }`}>
                    {rowIndex + 1}
                  </td>
                )}
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 ${
                      highlightColumns.includes(cellIndex)
                        ? darkMode ? 'bg-amber-900/10' : 'bg-amber-50'
                        : ''
                    } ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                  >
                    {cell === null ? (
                      <span className={`italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>NULL</span>
                    ) : typeof cell === 'number' ? (
                      <span className="font-mono text-blue-500">{cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className={`px-4 py-2 text-xs border-t ${
        darkMode ? 'bg-slate-900/50 border-slate-700 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
      }`}>
        💡 点击列标题可排序
      </div>
    </div>
  );
}
