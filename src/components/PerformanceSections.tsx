// ============================================
// 性能优化章节组件 - 简化版本
// ============================================

import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLExplainer } from './SQLExplainer';
import { CodeBlock } from './CodeBlock';

interface SectionProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (sectionId: string, blockId: string, noteId: string, content: string) => void;
  deleteNote: (sectionId: string, blockId: string, noteId: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
}

// ============================================
// 查询计划章节
// ============================================

export function QueryPlansSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">查询计划</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SQL 执行的路线图"</p>

      <Paragraph {...noteProps('p1')}>
        查询计划是数据库执行SQL查询时的详细执行方案。它描述了数据库如何访问数据、使用哪些索引、如何连接表、使用什么算法等。
      </Paragraph>

      <SQLExplainer
        sql={`EXPLAIN SELECT * FROM users WHERE age > 25;
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 25;`}
        explanations={[
          { code: 'EXPLAIN', explanation: '显示查询的执行计划，不实际执行查询', tip: '用于分析查询性能而不会影响数据库' },
          { code: 'EXPLAIN ANALYZE', explanation: '不仅显示执行计划，还实际执行查询并收集运行时统计信息', tip: '提供更准确的性能数据，但会实际执行查询' },
        ]}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 分析查询计划，识别性能瓶颈</p>
          <p><strong>挑战 2：</strong> 比较不同查询写法的执行效率</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 内存缓存章节
// ============================================

export function MemoryCachingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">内存缓存</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据访问的加速器"</p>

      <Paragraph {...noteProps('p1')}>
        内存缓存通过将经常访问的数据存储在内存中，显著减少磁盘I/O操作，提升查询响应速度。
      </Paragraph>

      <CodeBlock
        title="缓存配置"
        code={`PRAGMA cache_size = 100000;  -- 设置缓存大小
SET memory_limit = '2GB';    -- 内存限制`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 配置合适的缓存大小</p>
          <p><strong>挑战 2：</strong> 创建热点数据缓存</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 并行处理章节
// ============================================

export function ParallelProcessingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">并行处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"多核并发的威力"</p>

      <Paragraph {...noteProps('p1')}>
        并行处理利用现代CPU的多核架构，将大数据集的处理任务分配给多个处理器核心同时执行，大幅提升查询性能。DuckDB 自动利用多核CPU进行并行查询处理。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并行查询配置</h3>

      <CodeBlock
        title="设置并行处理参数"
        code={`-- 设置并行线程数（默认为 CPU 核心数）
SET threads = 8;

-- 启用并行处理（默认启用）
PRAGMA enable_parallel_processing;

-- 查看当前配置
SELECT * FROM pragma_version();
SELECT * FROM pragma_table_info('pragma_threads');

-- 临时设置会话级别的线程数
SET threads = 4;

-- 检查系统信息
SELECT
    system() AS system_info,
    version() AS duckdb_version,
    current_setting('threads') AS current_threads;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并行查询优化</h3>

      <CodeBlock
        title="适合并行处理的查询类型"
        code={`-- 1. 大表扫描（并行读取数据块）
SELECT COUNT(*), AVG(amount), MAX(amount)
FROM large_sales_table
WHERE sale_date >= '2024-01-01';

-- 2. 聚合查询（并行计算不同分区）
SELECT
    product_category,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue,
    AVG(amount) AS avg_order_value
FROM orders
GROUP BY product_category;

-- 3. JOIN 操作（并行哈希连接）
SELECT
    c.customer_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;

-- 4. 复杂计算（并行向量处理）
SELECT
    transaction_id,
    amount,
    amount * 1.08 AS with_tax,
    ROUND(amount * 0.15, 2) AS tax_amount,
    CASE
        WHEN amount > 1000 THEN 'High Value'
        WHEN amount > 100 THEN 'Medium Value'
        ELSE 'Low Value'
    END AS value_category
FROM transactions
WHERE amount > 0;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并行处理监控</h3>

      <CodeBlock
        title="性能监控和调优"
        code={`-- 查看查询执行统计
EXPLAIN ANALYZE
SELECT COUNT(*), AVG(salary)
FROM employees
WHERE department = 'Engineering';

-- 监控系统资源使用
SELECT
    current_setting('threads') AS configured_threads,
    system() AS system_info;

-- 比较串行 vs 并行性能
-- 设置单线程
SET threads = 1;
.timer on
SELECT COUNT(*), SUM(amount), AVG(amount) FROM large_table;

-- 设置多线程
SET threads = 8;
.timer on
SELECT COUNT(*), SUM(amount), AVG(amount) FROM large_table;

-- 分析查询计划中的并行度
EXPLAIN
SELECT
    region,
    product_category,
    SUM(sales_amount) AS total_sales,
    COUNT(*) AS order_count
FROM sales_data
WHERE sale_year = 2024
GROUP BY region, product_category;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并行处理的限制</h3>

      <InfoBox type="warning" title="并行处理的局限性" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>小数据集：</strong> 对于小表，串行处理可能更快（启动开销）</li>
          <li><strong>索引查询：</strong> 点查询或索引扫描通常不需要并行</li>
          <li><strong>内存限制：</strong> 大量并行线程可能导致内存压力</li>
          <li><strong>I/O 瓶颈：</strong> 磁盘I/O速度限制了并行效果</li>
          <li><strong>事务冲突：</strong> 并发写入可能导致锁竞争</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="选择合适的并行策略"
        code={`-- 对于大表全扫描：使用更多线程
SET threads = 16;
SELECT COUNT(*), AVG(value) FROM huge_table;

-- 对于中等大小的聚合：使用适中线程数
SET threads = 4;
SELECT region, SUM(sales) FROM sales_data GROUP BY region;

-- 对于小表或索引查询：使用单线程即可
SET threads = 1;
SELECT * FROM users WHERE user_id = 12345;

-- 动态调整线程数
-- 可以根据系统负载动态调整
CREATE MACRO set_dynamic_threads(load_factor)
AS TABLE
    CASE
        WHEN load_factor > 0.8 THEN SET threads = 2  -- 高负载时减少线程
        WHEN load_factor < 0.3 THEN SET threads = 12 -- 低负载时增加线程
        ELSE SET threads = 6  -- 正常负载
    END;`}
        {...noteProps('code4')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">⚡ 性能提升场景</h4>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
            <li>• 大数据量聚合计算</li>
            <li>• 复杂JOIN操作</li>
            <li>• 全文搜索和模式匹配</li>
            <li>• 数学函数批量计算</li>
            <li>• 数据排序和分组</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🎯 最佳实践</h4>
          <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
            <li>• 根据CPU核心数设置线程</li>
            <li>• 监控系统资源使用情况</li>
            <li>• 为不同查询类型调整配置</li>
            <li>• 避免过度并行化</li>
            <li>• 定期性能测试和调优</li>
          </ul>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：并行性能测试</p>
            <p>创建大数据集，测试不同线程数下的查询性能，找出最佳配置。</p>
          </div>
          <div>
            <p className="font-semibold">任务 2：查询分析</p>
            <p>使用 EXPLAIN ANALYZE 分析哪些查询从并行处理中获益最多。</p>
          </div>
          <div>
            <p className="font-semibold">任务 3：资源监控</p>
            <p>在高负载情况下监控CPU、内存使用情况，调整并行配置。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 统计信息章节
// ============================================

export function StatisticsInfoSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">统计信息</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"查询优化的数据基础"</p>

      <Paragraph {...noteProps('p1')}>
        统计信息是查询优化器的决策依据，包括表的大小、列的分布、索引的选择性等信息。准确的统计信息能帮助生成最优的查询计划，提高查询性能。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">统计信息收集</h3>

      <CodeBlock
        title="统计信息管理命令"
        code={`-- 分析特定表
ANALYZE sales_data;

-- 分析整个数据库
ANALYZE;

-- 查看统计信息（DuckDB 方式）
SELECT * FROM pragma_table_info('sales_data');
SELECT * FROM pragma_storage_info('sales_data');

-- 查看列的统计信息
SELECT
    column_name,
    column_type,
    estimated_cardinality,
    estimated_selectivity
FROM pragma_column_stats('sales_data');

-- 查看表的总体统计
SELECT
    table_name,
    estimated_size,
    total_rows,
    has_primary_key,
    has_foreign_keys
FROM pragma_table_stats
WHERE table_name = 'sales_data';`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">统计信息类型</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">📊 表级统计</h4>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
            <li>• 总行数 (total_rows)</li>
            <li>• 表大小 (estimated_size)</li>
            <li>• 索引信息 (has_indexes)</li>
            <li>• 约束信息 (constraints)</li>
            <li>• 最后更新时间 (last_analyzed)</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">📈 列级统计</h4>
          <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
            <li>• 唯一值数量 (distinct_count)</li>
            <li>• NULL 值比例 (null_fraction)</li>
            <li>• 最小/最大值 (min_value/max_value)</li>
            <li>• 平均值和方差 (mean/variance)</li>
            <li>• 直方图分布 (histograms)</li>
          </ul>
        </div>
      </div>

      <CodeBlock
        title="查询统计信息详情"
        code={`-- 查看列的详细统计信息
SELECT
    column_name,
    column_type,
    has_stats,
    num_distinct,
    num_nulls,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats
WHERE tablename = 'sales_data';

-- DuckDB 风格的统计查询
CREATE TABLE sales_stats AS
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT customer_id) AS unique_customers,
    COUNT(DISTINCT product_id) AS unique_products,
    MIN(sale_date) AS first_sale_date,
    MAX(sale_date) AS last_sale_date,
    AVG(amount) AS avg_sale_amount,
    STDDEV(amount) AS stddev_sale_amount,
    MIN(amount) AS min_sale_amount,
    MAX(amount) AS max_sale_amount
FROM sales_data;

-- 查看统计结果
SELECT * FROM sales_stats;

-- 计算选择性（用于索引优化）
SELECT
    column_name,
    num_distinct::FLOAT / total_rows AS selectivity,
    CASE
        WHEN num_distinct::FLOAT / total_rows > 0.9 THEN '高选择性'
        WHEN num_distinct::FLOAT / total_rows > 0.1 THEN '中等选择性'
        ELSE '低选择性'
    END AS selectivity_category
FROM (
    SELECT
        'customer_id' AS column_name,
        COUNT(DISTINCT customer_id) AS num_distinct,
        COUNT(*) AS total_rows
    FROM sales_data
) stats;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">统计信息对查询优化的影响</h3>

      <CodeBlock
        title="统计信息驱动的查询优化"
        code={`-- 示例：索引选择性分析
CREATE INDEX idx_customer_id ON sales_data(customer_id);
CREATE INDEX idx_sale_date ON sales_data(sale_date);

-- 查询优化器会根据统计信息选择最佳索引
EXPLAIN ANALYZE
SELECT customer_id, SUM(amount)
FROM sales_data
WHERE customer_id = 12345
  AND sale_date >= '2024-01-01';

-- 查看索引使用情况
SELECT
    index_name,
    total_rows,
    distinct_rows,
    selectivity
FROM pragma_index_info('sales_data');

-- 强制更新统计信息
ANALYZE sales_data;

-- 对比有/无统计信息的查询计划
EXPLAIN
SELECT *
FROM sales_data
WHERE amount > (SELECT AVG(amount) FROM sales_data);

-- 查看优化器选择的连接策略
EXPLAIN
SELECT c.customer_name, COUNT(o.order_id)
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">统计信息维护</h3>

      <CodeBlock
        title="统计信息维护策略"
        code={`-- 定期更新统计信息
-- 方法1：完全重新分析
ANALYZE;

-- 方法2：增量更新（如果支持）
ANALYZE sales_data WITH INCREMENTAL;

-- 方法3：只分析特定列
ANALYZE sales_data (customer_id, product_id, amount);

-- 设置自动统计更新
-- DuckDB 会自动维护基本的统计信息
PRAGMA enable_progress_bar;
PRAGMA enable_print_progress;

-- 监控统计信息新鲜度
SELECT
    table_name,
    last_analyzed,
    CASE
        WHEN last_analyzed < CURRENT_DATE - INTERVAL '7 days' THEN '过时'
        WHEN last_analyzed < CURRENT_DATE - INTERVAL '1 day' THEN '较新'
        ELSE '最新'
    END AS freshness_status
FROM pragma_table_stats;

-- 创建统计信息监控视图
CREATE VIEW stats_monitor AS
SELECT
    t.table_name,
    t.total_rows,
    t.last_analyzed,
    COUNT(i.index_name) AS index_count,
    SUM(CASE WHEN i.is_unique THEN 1 ELSE 0 END) AS unique_index_count
FROM pragma_table_stats t
LEFT JOIN pragma_index_list i ON t.table_name = i.table
GROUP BY t.table_name, t.total_rows, t.last_analyzed;

-- 查看监控结果
SELECT * FROM stats_monitor;`}
        {...noteProps('code4')}
      />

      <InfoBox type="tip" title="统计信息最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>定期更新：</strong> 数据变化超过10%时重新分析</li>
          <li><strong>重点监控：</strong> 大表和频繁查询的列</li>
          <li><strong>平衡开销：</strong> 分析频率与查询性能的平衡</li>
          <li><strong>验证效果：</strong> 通过EXPLAIN验证查询计划改进</li>
          <li><strong>异常处理：</strong> 注意统计信息不准确时的手动干预</li>
        </ul>
      </InfoBox>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：统计信息分析</p>
            <p>分析不同表的统计信息完整性，找出缺失或过时的统计信息。</p>
          </div>
          <div>
            <p className="font-semibold">任务 2：查询计划对比</p>
            <p>在有/无统计信息的情况下比较查询计划，观察优化器决策的变化。</p>
          </div>
          <div>
            <p className="font-semibold">任务 3：性能监控</p>
            <p>建立统计信息维护和监控机制，定期检查统计信息的有效性。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 分区章节
// ============================================

export function PartitioningSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分区</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"大数据集的高效管理"</p>

      <Paragraph {...noteProps('p1')}>
        分区将大表分割成更小的、更易管理的片段。查询时可以只扫描相关的分区，大幅提升性能并简化维护。
      </Paragraph>

      <CodeBlock
        title="表分区"
        code={`-- 范围分区
CREATE TABLE sales (
    id INTEGER,
    date DATE,
    amount DECIMAL
) PARTITION BY RANGE (date);

-- 列表分区
CREATE TABLE logs (
    id INTEGER,
    level VARCHAR,
    message TEXT
) PARTITION BY LIST (level);`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计合适的分区策略</p>
          <p><strong>挑战 2：</strong> 比较分区表和非分区表的性能</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 向量化章节
// ============================================

export function VectorizationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">向量化</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SIMD 并行计算"</p>

      <Paragraph {...noteProps('p1')}>
        向量化利用现代CPU的SIMD（单指令多数据）指令，同时对多个数据元素执行相同的操作，大幅提升数值计算和数据处理的性能。
      </Paragraph>

      <CodeBlock
        title="向量化查询"
        code={`-- 向量化聚合
SELECT SUM(amount), AVG(price), COUNT(*)
FROM sales WHERE date >= '2024-01-01';

-- 向量化过滤
SELECT * FROM data
WHERE x > 100 AND y < 200 AND z BETWEEN 50 AND 150;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 观察向量化对不同数据类型的性能影响</p>
          <p><strong>挑战 2：</strong> 比较向量化查询和传统查询的性能差异</p>
        </div>
      </InfoBox>
    </div>
  );
}
