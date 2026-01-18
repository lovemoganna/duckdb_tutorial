// ============================================
// 高级教程组件 - 覆盖高频使用场景
// ============================================

import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLExplainer } from './SQLExplainer';
import { CodeBlock } from './CodeBlock';
import { DataFlowAnimation } from './DataFlowAnimation';

interface SectionProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (sectionId: string, blockId: string, content: string) => void;
  deleteNote: (sectionId: string, blockId: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
}

// ============================================
// 实时数据处理教程
// ============================================

export function RealTimeProcessingTutorial({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
  const noteProps = (blockId: string) => ({
    sectionId,
    blockId,
    notes: getNotesForBlock(sectionId, blockId),
    onAddNote: (content: string) => addNote(sectionId, blockId, content),
    onUpdateNote: updateNote,
    onDeleteNote: deleteNote,
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">实时数据处理实战</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从数据流到实时洞察，构建响应式数据管道"</p>

      <Paragraph {...noteProps('intro')}>
        实时数据处理是现代数据分析的核心能力。本教程将带你掌握 DuckDB 在实时数据处理中的关键技术，包括流数据摄取、增量计算、时间窗口分析和实时聚合等。
      </Paragraph>

      <InfoBox type="fastai" title="实时处理的三个层次" {...noteProps('layers')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">数据层</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">实时摄取、清洗、转换</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">计算层</h4>
            <p className="text-sm text-green-600 dark:text-green-400">增量计算、状态管理</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">洞察层</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">实时监控、异常检测</p>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时数据摄取架构</h3>

      <SQLExplainer
        sql={`-- 1. 创建实时数据表
CREATE TABLE sensor_readings (
    sensor_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    location VARCHAR
);

-- 2. 模拟实时数据流
CREATE OR REPLACE FUNCTION generate_sensor_data(num_rows INTEGER)
RETURNS TABLE(sensor_id INTEGER, temperature DECIMAL, humidity DECIMAL, location VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (random() * 100)::INTEGER + 1 AS sensor_id,
        (random() * 40 + 10)::DECIMAL(5,2) AS temperature,
        (random() * 60 + 20)::DECIMAL(5,2) AS humidity,
        CASE (random() * 3)::INTEGER
            WHEN 0 THEN 'warehouse_a'
            WHEN 1 THEN 'warehouse_b'
            ELSE 'warehouse_c'
        END AS location
    FROM generate_series(1, num_rows);
END;
$$ LANGUAGE plpgsql;

-- 3. 批量插入实时数据
INSERT INTO sensor_readings (sensor_id, temperature, humidity, location)
SELECT * FROM generate_sensor_data(1000);`}
        explanations={[
          { code: '实时数据表设计', explanation: '包含时间戳和传感器数据的标准化表结构', tip: '使用 TIMESTAMP DEFAULT CURRENT_TIMESTAMP 自动记录采集时间' },
          { code: '数据生成函数', explanation: '模拟物联网传感器数据的批量生成', tip: '使用随机函数创建多样化的测试数据' },
          { code: '批量插入优化', explanation: '一次插入大量数据，提高摄取效率', tip: '避免逐条插入，使用批量操作' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">时间窗口分析</h3>

      <CodeBlock
        title="滑动窗口聚合分析"
        code={`-- 最近1小时的温度统计（每10分钟滑动一次）
SELECT
    location,
    window_start,
    window_end,
    COUNT(*) AS reading_count,
    ROUND(AVG(temperature), 2) AS avg_temp,
    ROUND(MIN(temperature), 2) AS min_temp,
    ROUND(MAX(temperature), 2) AS max_temp,
    ROUND(STDDEV(temperature), 2) AS temp_stddev
FROM (
    SELECT *,
        -- 创建10分钟滑动窗口
        TIME_BUCKET('10 minutes', timestamp) AS window_start,
        TIME_BUCKET('10 minutes', timestamp) + INTERVAL '10 minutes' AS window_end
    FROM sensor_readings
    WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
) AS windowed_data
GROUP BY location, window_start, window_end
ORDER BY location, window_start DESC;

-- 温度异常检测（连续3次超过阈值）
WITH temperature_anomalies AS (
    SELECT
        sensor_id,
        location,
        timestamp,
        temperature,
        -- 计算移动平均和标准差
        AVG(temperature) OVER (
            PARTITION BY sensor_id
            ORDER BY timestamp
            ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
        ) AS rolling_avg,
        STDDEV(temperature) OVER (
            PARTITION BY sensor_id
            ORDER BY timestamp
            ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
        ) AS rolling_std
    FROM sensor_readings
    WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
),
anomaly_flags AS (
    SELECT *,
        CASE
            WHEN temperature > rolling_avg + 2 * rolling_std THEN 'high'
            WHEN temperature < rolling_avg - 2 * rolling_std THEN 'low'
            ELSE 'normal'
        END AS anomaly_type,
        ABS(temperature - rolling_avg) / NULLIF(rolling_std, 0) AS z_score
    FROM temperature_anomalies
)
SELECT
    sensor_id,
    location,
    COUNT(*) AS anomaly_count,
    AVG(z_score) AS avg_z_score,
    MAX(timestamp) AS latest_anomaly
FROM anomaly_flags
WHERE anomaly_type != 'normal'
    AND timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
GROUP BY sensor_id, location
HAVING COUNT(*) >= 3
ORDER BY anomaly_count DESC;`}
        {...noteProps('anomaly-detection')}
      />

      <InfoBox type="experiment" title="实时数据处理挑战" {...noteProps('challenges')}>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">挑战 1：实时仪表盘构建</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">构建一个实时温度监控仪表盘，支持多传感器数据展示、异常告警和历史趋势分析。</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">挑战 2：流数据处理管道</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">设计一个完整的流数据处理管道，从数据摄取到异常检测，实现端到端的实时分析。</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">挑战 3：预测性维护系统</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">基于历史传感器数据，构建设备故障预测模型，实现主动维护和故障预防。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
