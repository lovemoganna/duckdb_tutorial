import { useState, useMemo, useCallback } from 'react';
import { cn } from '../utils/cn';
import { OntologicalCard, OntologicalButton, LoadingState } from './DesignSystem';

interface DataVisualizationProps {
  data: Record<string, unknown>[];
  columns: string[];
  title?: string;
  onClose?: () => void;
}

type ChartType = 'table' | 'bar' | 'line' | 'pie' | 'scatter' | 'histogram';

interface ChartConfig {
  type: ChartType;
  xColumn: string;
  yColumn: string;
  colorColumn?: string;
}

export function EnhancedDataVisualization({
  data,
  columns,
  title = '数据可视化',
  onClose
}: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'insights'>('overview');
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    xColumn: columns[0] || '',
    yColumn: columns[1] || columns[0] || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // 数据统计信息
  const stats = useMemo(() => {
    const rowCount = data.length;
    const colCount = columns.length;

    const numericColumns = columns.filter(col =>
      data.some(row => typeof row[col] === 'number' && !isNaN(Number(row[col])))
    );

    const stats = numericColumns.map(col => {
      const values = data.map(row => Number(row[col])).filter(val => !isNaN(val));
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = values.length > 0 ? sum / values.length : 0;
      const min = values.length > 0 ? Math.min(...values) : 0;
      const max = values.length > 0 ? Math.max(...values) : 0;

      return {
        column: col,
        count: values.length,
        sum: sum.toFixed(2),
        avg: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2)
      };
    });

    return { rowCount, colCount, numericColumns, stats };
  }, [data, columns]);

  // 数据洞察
  const insights = useMemo(() => {
    const insights = [];

    // 检测数据类型分布
    const dataTypes = columns.map(col => {
      const sample = data.slice(0, 10).map(row => row[col]);
      const types = [...new Set(sample.map(val =>
        val === null ? 'null' :
        typeof val === 'number' ? 'number' :
        typeof val === 'boolean' ? 'boolean' :
        'string'
      ))];

      return { column: col, types };
    });

    insights.push({
      type: 'data-types',
      title: '数据类型分析',
      content: `检测到 ${columns.length} 列数据，其中 ${stats.numericColumns.length} 列为数值型`,
      details: dataTypes
    });

    // 检测空值
    const nullStats = columns.map(col => {
      const nullCount = data.filter(row => row[col] === null || row[col] === '').length;
      return { column: col, nullCount, percentage: (nullCount / data.length * 100).toFixed(1) };
    }).filter(stat => stat.nullCount > 0);

    if (nullStats.length > 0) {
      insights.push({
        type: 'null-values',
        title: '空值检测',
        content: `${nullStats.length} 列包含空值，建议进行数据清洗`,
        details: nullStats
      });
    }

    // 数值列统计
    if (stats.stats.length > 0) {
      insights.push({
        type: 'statistics',
        title: '数值统计',
        content: `共 ${stats.stats.length} 个数值列，可用于图表分析`,
        details: stats.stats
      });
    }

    return insights;
  }, [data, columns, stats]);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartConfig(prev => ({ ...prev, type }));
  }, []);

  const handleColumnChange = useCallback((column: string, axis: 'x' | 'y') => {
    setChartConfig(prev => ({
      ...prev,
      [axis === 'x' ? 'xColumn' : 'yColumn']: column
    }));
  }, []);

  const tabs = [
    { id: 'overview', label: '数据概览', icon: '📊' },
    { id: 'charts', label: '图表分析', icon: '📈' },
    { id: 'insights', label: '智能洞察', icon: '💡' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <OntologicalCard className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stats.rowCount} 行 × {stats.colCount} 列
              </p>
            </div>
          </div>
          {onClose && (
            <OntologicalButton variant="secondary" size="sm" onClick={onClose}>
              关闭
            </OntologicalButton>
          )}
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingState size="lg" />
            </div>
          ) : (
            <>
              {/* 数据概览 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 基本统计 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <OntologicalCard variant="elevated" className="text-center">
                      <div className="text-3xl mb-2">📊</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {stats.rowCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">总行数</div>
                    </OntologicalCard>
                    <OntologicalCard variant="elevated" className="text-center">
                      <div className="text-3xl mb-2">📋</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {stats.colCount}
                      </div>
                      <div className="text-sm text-slate-500">总列数</div>
                    </OntologicalCard>
                    <OntologicalCard variant="elevated" className="text-center">
                      <div className="text-3xl mb-2">🔢</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {stats.numericColumns.length}
                      </div>
                      <div className="text-sm text-slate-500">数值列</div>
                    </OntologicalCard>
                  </div>

                  {/* 数据预览表格 */}
                  <OntologicalCard>
                    <h3 className="text-lg font-semibold mb-4">数据预览</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800">
                            {columns.slice(0, 8).map((col, i) => (
                              <th key={i} className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.slice(0, 10).map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 stagger-item">
                              {columns.slice(0, 8).map((col, j) => (
                                <td key={j} className="px-4 py-3 text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 max-w-xs truncate">
                                  {row[col] === null ? (
                                    <span className="text-slate-400 italic">NULL</span>
                                  ) : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {data.length > 10 && (
                        <div className="p-3 text-center text-slate-500 dark:text-slate-400 text-sm">
                          ... 还有 {data.length - 10} 行数据
                        </div>
                      )}
                    </div>
                  </OntologicalCard>
                </div>
              )}

              {/* 图表分析 */}
              {activeTab === 'charts' && (
                <div className="space-y-6">
                  {/* 图表配置 */}
                  <OntologicalCard>
                    <h3 className="text-lg font-semibold mb-4">图表配置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">图表类型</label>
                        <select
                          value={chartConfig.type}
                          onChange={e => handleChartTypeChange(e.target.value as ChartType)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="bar">柱状图</option>
                          <option value="line">折线图</option>
                          <option value="pie">饼图</option>
                          <option value="scatter">散点图</option>
                          <option value="histogram">直方图</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">X轴字段</label>
                        <select
                          value={chartConfig.xColumn}
                          onChange={e => handleColumnChange(e.target.value, 'x')}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                        >
                          {columns.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Y轴字段</label>
                        <select
                          value={chartConfig.yColumn}
                          onChange={e => handleColumnChange(e.target.value, 'y')}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                        >
                          {columns.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </OntologicalCard>

                  {/* 图表显示 */}
                  <OntologicalCard>
                    <ChartRenderer
                      data={data}
                      config={chartConfig}
                      columns={columns}
                    />
                  </OntologicalCard>
                </div>
              )}

              {/* 智能洞察 */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {insights.map((insight, index) => (
                    <OntologicalCard key={index} className="stagger-item">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">
                          {insight.type === 'data-types' ? '🔍' :
                           insight.type === 'null-values' ? '⚠️' :
                           insight.type === 'statistics' ? '📈' : '💡'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">{insight.content}</p>

                          {insight.type === 'statistics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {insight.details.map((stat: any, i: number) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">{stat.column}</h4>
                                  <div className="space-y-1 text-sm">
                                    <div>总和: {stat.sum}</div>
                                    <div>平均: {stat.avg}</div>
                                    <div>最小: {stat.min}</div>
                                    <div>最大: {stat.max}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </OntologicalCard>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </OntologicalCard>
    </div>
  );
}

// 图表渲染器组件
function ChartRenderer({
  data,
  config,
  columns
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  columns: string[];
}) {
  const chartData = useMemo(() => {
    switch (config.type) {
      case 'bar':
      case 'line':
        return processBarLineData(data, config.xColumn, config.yColumn);
      case 'pie':
        return processPieData(data, config.xColumn, config.yColumn);
      case 'scatter':
        return processScatterData(data, config.xColumn, config.yColumn);
      case 'histogram':
        return processHistogramData(data, config.yColumn);
      default:
        return [];
    }
  }, [data, config]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {config.xColumn} vs {config.yColumn} {getChartTypeName(config.type)}
      </h3>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        {config.type === 'bar' && <BarChart data={chartData} />}
        {config.type === 'line' && <LineChart data={chartData} />}
        {config.type === 'pie' && <PieChart data={chartData} />}
        {config.type === 'scatter' && <ScatterChart data={chartData} />}
        {config.type === 'histogram' && <HistogramChart data={chartData} />}
      </div>
    </div>
  );
}

// 图表类型名称映射
function getChartTypeName(type: ChartType): string {
  const names = {
    table: '表格',
    bar: '柱状图',
    line: '折线图',
    pie: '饼图',
    scatter: '散点图',
    histogram: '直方图'
  };
  return names[type];
}

// 数据处理函数
function processBarLineData(data: Record<string, unknown>[], xCol: string, yCol: string) {
  const grouped = data.reduce((acc, row) => {
    const x = String(row[xCol] || 'Unknown');
    const y = Number(row[yCol]) || 0;
    acc[x] = (acc[x] || 0) + y;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

function processPieData(data: Record<string, unknown>[], labelCol: string, valueCol: string) {
  const grouped = data.reduce((acc, row) => {
    const label = String(row[labelCol] || 'Unknown');
    const value = Number(row[valueCol]) || 0;
    acc[label] = (acc[label] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

function processScatterData(data: Record<string, unknown>[], xCol: string, yCol: string) {
  return data.map(row => ({
    x: Number(row[xCol]) || 0,
    y: Number(row[yCol]) || 0,
    label: String(row[xCol] || 'Unknown')
  }));
}

function processHistogramData(data: Record<string, unknown>[], col: string) {
  const values = data.map(row => Number(row[col])).filter(val => !isNaN(val));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = 10;
  const binSize = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => ({
    label: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
    count: 0
  }));

  values.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
    bins[binIndex].count++;
  });

  return bins;
}

// 简化的图表组件
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = 600;
  const chartHeight = 300;

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
      {data.map((d, i) => {
        const barWidth = chartWidth / data.length * 0.8;
        const barHeight = (d.value / maxValue) * (chartHeight - 60);
        const x = i * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
        const y = chartHeight - 40 - barHeight;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
              className="hover:fill-blue-600 transition-colors cursor-pointer"
            />
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              className="text-xs fill-slate-600 dark:fill-slate-400"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = 600;
  const chartHeight = 300;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 40 - (d.value / maxValue) * (chartHeight - 60);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        className="hover:stroke-blue-600 transition-colors"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (chartWidth - 40) + 20;
        const y = chartHeight - 40 - (d.value / maxValue) * (chartHeight - 60);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#3b82f6"
            className="hover:r-6 transition-all cursor-pointer"
          />
        );
      })}
    </svg>
  );
}

function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chartSize = 300;
  const radius = chartSize / 2 - 20;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  let currentAngle = 0;

  return (
    <svg width={chartSize} height={chartSize} className="w-full h-auto">
      {data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');

        currentAngle = endAngle;

        return (
          <path
            key={i}
            d={pathData}
            fill={colors[i % colors.length]}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        );
      })}
    </svg>
  );
}

function ScatterChart({ data }: { data: { x: number; y: number; label: string }[] }) {
  const chartWidth = 600;
  const chartHeight = 300;

  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
      {data.map((d, i) => {
        const x = 40 + ((d.x - xMin) / (xMax - xMin || 1)) * (chartWidth - 80);
        const y = chartHeight - 40 - ((d.y - yMin) / (yMax - yMin || 1)) * (chartHeight - 80);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#3b82f6"
            className="hover:r-6 hover:fill-blue-600 transition-all cursor-pointer"
          />
        );
      })}
    </svg>
  );
}

function HistogramChart({ data }: { data: { label: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count));
  const chartWidth = 600;
  const chartHeight = 300;

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
      {data.map((d, i) => {
        const barWidth = chartWidth / data.length * 0.8;
        const barHeight = (d.count / maxCount) * (chartHeight - 60);
        const x = i * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
        const y = chartHeight - 40 - barHeight;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#22c55e"
              className="hover:fill-green-600 transition-colors cursor-pointer"
            />
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              className="text-xs fill-slate-600 dark:fill-slate-400"
            >
              {d.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
