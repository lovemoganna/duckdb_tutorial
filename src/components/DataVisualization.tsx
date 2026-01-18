import { useState, useMemo } from 'react';

interface DataVisualizationProps {
  data: Record<string, unknown>[];
  columns: string[];
  onClose: () => void;
}

// 简易图表组件 - SVG 基础实现
function BarChart({ data, xColumn, yColumn, title }: {
  data: Record<string, unknown>[];
  xColumn: string;
  yColumn: string;
  title: string;
}) {
  const processedData = useMemo(() => {
    const grouped = data.reduce((acc, row) => {
      const x = String(row[xColumn]);
      const y = Number(row[yColumn]) || 0;
      acc[x] = (acc[x] || 0) + y;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([label, value]) => ({ label, value }));
  }, [data, xColumn, yColumn]);

  const maxValue = Math.max(...processedData.map(d => d.value));
  const chartWidth = 400;
  const chartHeight = 200;
  const barWidth = chartWidth / processedData.length * 0.8;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      <svg width={chartWidth} height={chartHeight} className="border border-slate-300 dark:border-slate-600 rounded">
        {processedData.map((d, i) => {
          const barHeight = (d.value / maxValue) * (chartHeight - 40);
          const x = i * (chartWidth / processedData.length) + (chartWidth / processedData.length - barWidth) / 2;
          const y = chartHeight - 30 - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                className="hover:fill-blue-600 transition-colors"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-slate-600 dark:fill-slate-300"
              >
                {d.value}
              </text>
            </g>
          );
        })}
        {/* X轴标签 */}
        {processedData.map((d, i) => {
          const x = i * (chartWidth / processedData.length) + chartWidth / processedData.length / 2;
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs fill-slate-500 dark:fill-slate-400"
              transform={`rotate(-45 ${x} ${chartHeight - 10})`}
            >
              {d.label.length > 10 ? d.label.substring(0, 10) + '...' : d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function PieChart({ data, labelColumn, valueColumn, title }: {
  data: Record<string, unknown>[];
  labelColumn: string;
  valueColumn: string;
  title: string;
}) {
  const processedData = useMemo(() => {
    const grouped = data.reduce((acc, row) => {
      const label = String(row[labelColumn]);
      const value = Number(row[valueColumn]) || 0;
      acc[label] = (acc[label] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(grouped).reduce((sum, v) => sum + v, 0);
    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value, percentage: (value / total) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [data, labelColumn, valueColumn]);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  let currentAngle = -Math.PI / 2; // Start from top

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <svg width={200} height={200}>
          {processedData.map((d, i) => {
            const angle = (d.percentage / 100) * 2 * Math.PI;
            const x1 = centerX + radius * Math.cos(currentAngle);
            const y1 = centerY + radius * Math.sin(currentAngle);
            const x2 = centerX + radius * Math.cos(currentAngle + angle);
            const y2 = centerY + radius * Math.sin(currentAngle + angle);

            const largeArcFlag = angle > Math.PI ? 1 : 0;
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const slice = (
              <path
                key={i}
                d={pathData}
                fill={colors[i % colors.length]}
                stroke="#fff"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );

            currentAngle += angle;
            return slice;
          })}
        </svg>

        <div className="space-y-2">
          {processedData.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {d.label}: {d.value} ({d.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatisticsPanel({ data, columns }: { data: Record<string, unknown>[]; columns: string[] }) {
  const stats = useMemo(() => {
    const result: Record<string, any> = {};

    columns.forEach(col => {
      const values = data.map(row => row[col]).filter(val => val != null);

      if (values.length === 0) {
        result[col] = { type: 'empty', count: 0 };
        return;
      }

      const numericValues = values.filter(val => typeof val === 'number') as number[];
      const stringValues = values.filter(val => typeof val === 'string') as string[];
      const booleanValues = values.filter(val => typeof val === 'boolean') as boolean[];

      if (numericValues.length > 0) {
        result[col] = {
          type: 'numeric',
          count: values.length,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          avg: numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length,
          unique: new Set(numericValues).size
        };
      } else if (booleanValues.length > 0) {
        const trueCount = booleanValues.filter(v => v).length;
        result[col] = {
          type: 'boolean',
          count: values.length,
          true: trueCount,
          false: booleanValues.length - trueCount,
          truePercent: (trueCount / booleanValues.length * 100).toFixed(1)
        };
      } else if (stringValues.length > 0) {
        result[col] = {
          type: 'string',
          count: values.length,
          unique: new Set(stringValues).size,
          avgLength: stringValues.reduce((sum, s) => sum + s.length, 0) / stringValues.length
        };
      }
    });

    return result;
  }, [data, columns]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">数据统计</h3>
      <div className="space-y-3">
        {Object.entries(stats).map(([col, stat]) => (
          <div key={col} className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">{col}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                <div className="text-slate-500 dark:text-slate-400">总数</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.count}</div>
              </div>
              {stat.type === 'numeric' && (
                <>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">最小</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.min}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">最大</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.max}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">平均</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.avg.toFixed(2)}</div>
                  </div>
                </>
              )}
              {stat.type === 'boolean' && (
                <>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">TRUE</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.true} ({stat.truePercent}%)</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">FALSE</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.false}</div>
                  </div>
                </>
              )}
              {stat.type === 'string' && (
                <>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">唯一值</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.unique}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded">
                    <div className="text-slate-500 dark:text-slate-400">平均长度</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stat.avgLength.toFixed(1)}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataVisualization({ data, columns, onClose }: DataVisualizationProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'stats'>('stats');
  const [xColumn, setXColumn] = useState(columns[0] || '');
  const [yColumn, setYColumn] = useState(columns[1] || columns[0] || '');

  const numericColumns = columns.filter(col =>
    data.some(row => typeof row[col] === 'number')
  );

  const stringColumns = columns.filter(col =>
    data.some(row => typeof row[col] === 'string')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-lg font-bold text-white">数据可视化</h2>
              <p className="text-xs text-white/80">{data.length} 行数据 · {columns.length} 列</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* 图表类型选择 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {[
                { id: 'stats', label: '统计', icon: '📈' },
                { id: 'bar', label: '柱状图', icon: '📊' },
                { id: 'pie', label: '饼图', icon: '🥧' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id as any)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                    chartType === type.id
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 图表配置 */}
          {(chartType === 'bar' || chartType === 'pie') && (
            <div className="flex gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              {chartType === 'bar' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      X轴列（分类）
                    </label>
                    <select
                      value={xColumn}
                      onChange={(e) => setXColumn(e.target.value)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {stringColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Y轴列（数值）
                    </label>
                    <select
                      value={yColumn}
                      onChange={(e) => setYColumn(e.target.value)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {numericColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {chartType === 'pie' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      标签列
                    </label>
                    <select
                      value={xColumn}
                      onChange={(e) => setXColumn(e.target.value)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {stringColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      数值列
                    </label>
                    <select
                      value={yColumn}
                      onChange={(e) => setYColumn(e.target.value)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {numericColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 图表显示 */}
          {chartType === 'stats' && (
            <StatisticsPanel data={data} columns={columns} />
          )}

          {chartType === 'bar' && (
            <BarChart
              data={data}
              xColumn={xColumn}
              yColumn={yColumn}
              title={`${xColumn} vs ${yColumn} 柱状图`}
            />
          )}

          {chartType === 'pie' && (
            <PieChart
              data={data}
              labelColumn={xColumn}
              valueColumn={yColumn}
              title={`${xColumn} 分布饼图`}
            />
          )}

          {/* 数据预览 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">数据预览</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    {columns.slice(0, 10).map((col, i) => (
                      <th key={i} className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {columns.slice(0, 10).map((col, j) => (
                        <td key={j} className="px-4 py-2 text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 max-w-xs truncate">
                          {row[col] === null ? (
                            <span className="text-slate-400 italic">NULL</span>
                          ) : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <div className="p-2 text-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800">
                  ... 还有 {data.length - 5} 行数据
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
