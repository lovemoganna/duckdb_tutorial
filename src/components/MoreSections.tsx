// ============================================
// 更多章节组件 - 简化版本
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
// 近似计算章节
// ============================================

// ============================================
// 分析函数进阶章节
// ============================================

export function AdvancedAnalyticsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分析函数进阶</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"统计学在 SQL 中的应用"</p>

      <Paragraph {...noteProps('p1')}>
        分析函数（Analytical Functions）是 SQL 中的高级统计工具，提供了丰富的统计计算功能。从简单的描述性统计到复杂的概率分布计算，都能在 SQL 中完成。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">描述性统计</h3>

      <CodeBlock
        title="基本统计量"
        code={`-- 计算数值列的统计信息
SELECT
    COUNT(*) AS total_count,
    COUNT(DISTINCT column_name) AS unique_count,
    AVG(column_name) AS mean_value,
    MEDIAN(column_name) AS median_value,
    MODE(column_name) AS mode_value,
    STDDEV(column_name) AS standard_deviation,
    VARIANCE(column_name) AS variance_value,
    MIN(column_name) AS min_value,
    MAX(column_name) AS max_value,
    QUANTILE(column_name, 0.25) AS q1,
    QUANTILE(column_name, 0.75) AS q3
FROM your_table;

-- 分组统计
SELECT
    category,
    COUNT(*) AS count_in_group,
    AVG(value) AS avg_in_group,
    STDDEV(value) AS std_in_group
FROM your_table
GROUP BY category;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">相关性和协方差</h3>

      <CodeBlock
        title="相关系数计算"
        code={`-- Pearson 相关系数
SELECT CORR(x, y) AS pearson_correlation
FROM your_table;

-- Spearman 秩相关系数
SELECT CORR(x, y, 'spearman') AS spearman_correlation
FROM your_table;

-- Kendall tau 相关系数
SELECT CORR(x, y, 'kendall') AS kendall_correlation
FROM your_table;

-- 计算协方差
SELECT COVAR_POP(x, y) AS population_covariance,
       COVAR_SAMP(x, y) AS sample_covariance
FROM your_table;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分布分析</h3>

      <CodeBlock
        title="正态分布检验"
        code={`-- Shapiro-Wilk 正态性检验
SELECT shapiro_wilk_test(column_name) AS normality_test
FROM your_table;

-- Kolmogorov-Smirnov 检验
SELECT ks_test(column_name, 'normal') AS ks_test_result
FROM your_table;

-- 计算偏度和峰度
SELECT
    SKEWNESS(column_name) AS skewness,
    KURTOSIS(column_name) AS kurtosis
FROM your_table;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">假设检验</h3>

      <CodeBlock
        title="t检验和F检验"
        code={`-- 单样本 t 检验
SELECT t_test(column_name, hypothesized_mean) AS t_test_result
FROM your_table;

-- 两样本 t 检验
SELECT t_test(sample1, sample2) AS two_sample_t_test
FROM (
    SELECT column_name AS sample1 FROM table1
    UNION ALL
    SELECT column_name AS sample2 FROM table2
);

-- F 检验（方差齐性检验）
SELECT f_test(group1_values, group2_values) AS f_test_result
FROM your_grouped_data;`}
        {...noteProps('code4')}
      />

      <InfoBox type="experiment" title="实践建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>先用描述性统计了解数据分布</li>
          <li>使用相关分析发现变量关系</li>
          <li>进行正态性检验选择合适的统计方法</li>
          <li>根据数据特点选择合适的假设检验</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// ============================================
// LATERAL JOIN 章节
// ============================================

export function LateralJoinSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">LATERAL JOIN</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"关联查询的进阶技巧"</p>

      <Paragraph {...noteProps('p1')}>
        LATERAL JOIN 是一种特殊的 JOIN，它允许在 ON 或 USING 子句中引用左侧表的列。这使得可以进行一些复杂的关联查询，特别是当右侧的子查询需要依赖左侧的数据时。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本概念</h3>

      <CodeBlock
        title="LATERAL JOIN 语法"
        code={`-- LATERAL JOIN 基本语法
SELECT t1.column1, t2.column2
FROM table1 t1
LATERAL (
    SELECT column2
    FROM table2 t2
    WHERE t2.foreign_key = t1.primary_key
    LIMIT 1  -- 可以限制结果数量
) t2 ON TRUE;  -- ON TRUE 因为条件已在子查询中

-- 也可以写成 LEFT LATERAL
SELECT t1.column1, sub.result
FROM table1 t1
LEFT LATERAL (
    SELECT some_function(t1.column1) AS result
) sub ON TRUE;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <CodeBlock
        title="查找每个用户最新的订单"
        code={`-- 为每个用户找到最近的订单
SELECT u.user_id, u.name, latest_order.order_date, latest_order.amount
FROM users u
LATERAL (
    SELECT order_date, amount
    FROM orders o
    WHERE o.user_id = u.user_id
    ORDER BY order_date DESC
    LIMIT 1
) latest_order ON TRUE;

-- 传统方式（效率较低）
SELECT u.user_id, u.name, o.order_date, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id
WHERE o.order_date = (
    SELECT MAX(order_date)
    FROM orders
    WHERE user_id = u.user_id
);`}
        {...noteProps('code2')}
      />

      <CodeBlock
        title="计算移动平均"
        code={`-- 计算每个产品最近7天的平均销量
SELECT p.product_id, p.name, stats.avg_sales, stats.total_sales
FROM products p
LATERAL (
    SELECT
        AVG(s.sales_amount) AS avg_sales,
        SUM(s.sales_amount) AS total_sales
    FROM sales s
    WHERE s.product_id = p.product_id
    AND s.sale_date >= CURRENT_DATE - INTERVAL '7 days'
) stats ON TRUE;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能考虑</h3>

      <InfoBox type="warning" title="性能提示" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>LATERAL JOIN 可能导致嵌套循环，注意查询效率</li>
          <li>对于大数据集，考虑使用窗口函数或 CTE 优化</li>
          <li>确保子查询中的条件能够有效过滤数据</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="优化示例"
        code={`-- 使用 LATERAL 但添加适当的索引
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date DESC);

-- 或者改用窗口函数
SELECT DISTINCT u.user_id, u.name,
       FIRST_VALUE(o.order_date) OVER w AS latest_date,
       FIRST_VALUE(o.amount) OVER w AS latest_amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id
WINDOW w AS (PARTITION BY u.user_id ORDER BY o.order_date DESC);`}
        {...noteProps('code4')}
      />
    </div>
  );
}

// ============================================
// QUALIFY 子句章节
// ============================================

export function QualifySection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">QUALIFY 子句</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"优雅地过滤窗口函数结果"</p>

      <Paragraph {...noteProps('p1')}>
        QUALIFY 子句是窗口函数的过滤器，它允许在应用窗口函数后根据计算结果进行过滤。与 HAVING 子句类似，但专门用于窗口函数。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本语法</h3>

      <CodeBlock
        title="QUALIFY 语法结构"
        code={`SELECT column1, column2, window_function() OVER (...) AS wf_result
FROM table_name
WHERE condition1  -- 先过滤原始行
GROUP BY column3  -- 可选的分组
HAVING condition2 -- 可选的分组过滤
WINDOW window_definition  -- 可选的窗口定义
QUALIFY condition3  -- 对窗口函数结果进行过滤
ORDER BY column4;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用</h3>

      <CodeBlock
        title="查找每个部门薪资最高的员工"
        code={`-- 使用 QUALIFY 查找每个部门薪资最高的员工
SELECT department, employee_name, salary
FROM employees
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
) = 1;

-- 等价的传统写法（更复杂）
SELECT department, employee_name, salary
FROM (
    SELECT department, employee_name, salary,
           ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
    FROM employees
) ranked
WHERE rn = 1;`}
        {...noteProps('code2')}
      />

      <CodeBlock
        title="查找销售额连续增长的产品"
        code={`-- 查找销售额连续3个月增长的产品
SELECT product_id, month, sales
FROM monthly_sales
QUALIFY sales > LAG(sales) OVER (
    PARTITION BY product_id
    ORDER BY month
)
AND LAG(sales) > LAG(sales, 2) OVER (
    PARTITION BY product_id
    ORDER BY month
);`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">与 HAVING 的区别</h3>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">特性</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">HAVING</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">QUALIFY</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">作用对象</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">GROUP BY 后的分组</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">窗口函数结果</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">执行顺序</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">GROUP BY 后</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">窗口函数后</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">可用聚合函数</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">✅</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">❌（用窗口函数）</td></tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="实践练习" {...noteProps('box1')}>
        查找每个季度销售额排名前3的产品，但只显示销售额超过10000的记录。
        <details className="mt-2">
          <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
          <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm">
            SELECT product_id, quarter, sales<br/>
            FROM quarterly_sales<br/>
            QUALIFY RANK() OVER (PARTITION BY quarter ORDER BY sales DESC) &lt;= 3<br/>
            AND sales &gt; 10000;
          </code>
        </details>
      </InfoBox>
    </div>
  );
}

// ============================================
// SAMPLE 采样章节
// ============================================

export function SamplingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">SAMPLE 采样</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"大数据集的快速预览"</p>

      <Paragraph {...noteProps('p1')}>
        SAMPLE 子句允许从大数据集中快速获取代表性样本，用于数据探索、快速分析和原型开发，而不必处理整个数据集。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">采样方法</h3>

      <CodeBlock
        title="SAMPLE 子句语法"
        code={`-- 基本语法
SELECT * FROM table_name
SAMPLE sample_size;

-- 支持多种采样方式
SELECT * FROM table_name
SAMPLE number ROWS;           -- 采样指定行数

SELECT * FROM table_name
SAMPLE percentage PERCENT;    -- 采样百分比

SELECT * FROM table_name
SAMPLE number PERCENT;        -- 按百分比采样

-- 分层采样（按列分组采样）
SELECT * FROM table_name
SAMPLE number ROWS BY column_name;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用</h3>

      <CodeBlock
        title="数据探索采样"
        code={`-- 从大数据集采样1000行进行快速分析
SELECT * FROM large_dataset
SAMPLE 1000 ROWS;

-- 采样10%的数据进行统计分析
SELECT
    AVG(salary) AS avg_salary,
    STDDEV(salary) AS salary_std,
    COUNT(*) AS sample_size
FROM employees
SAMPLE 10 PERCENT;

-- 按部门分层采样
SELECT department, AVG(salary), COUNT(*)
FROM employees
SAMPLE 100 ROWS BY department
GROUP BY department;`}
        {...noteProps('code2')}
      />

      <CodeBlock
        title="开发和测试场景"
        code={`-- 在开发阶段使用小样本测试查询
SELECT * FROM user_events
SAMPLE 1000 ROWS
WHERE event_date >= '2024-01-01';

-- 快速验证数据质量
SELECT
    COUNT(*) AS total_rows,
    COUNT(CASE WHEN column_name IS NULL THEN 1 END) AS null_count,
    AVG(LENGTH(column_name)) AS avg_length
FROM large_table
SAMPLE 10000 ROWS;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">采样算法</h3>

      <InfoBox type="tip" title="采样算法说明" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>系统采样</strong>：按固定间隔选择行，保持数据分布</li>
          <li><strong>随机采样</strong>：完全随机选择，保证无偏但可能丢失分布特征</li>
          <li><strong>分层采样</strong>：在每个分组内分别采样，保持分组比例</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="性能对比"
        code={`-- 大数据集：直接查询 vs 采样查询
-- 原始查询（可能需要几分钟）
SELECT AVG(sales_amount) FROM sales_2024;

-- 采样查询（几秒钟完成）
SELECT AVG(sales_amount) * 100 AS estimated_avg
FROM sales_2024
SAMPLE 1 PERCENT;`}
        {...noteProps('code4')}
      />

      <InfoBox type="warning" title="使用注意事项" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>采样结果是近似值，不是精确值</li>
          <li>对于需要精确结果的查询，不要使用采样</li>
          <li>采样不保证返回结果的排序</li>
          <li>LIMIT 子句在 SAMPLE 之后应用</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// ============================================
// 全文搜索章节
// ============================================

export function FulltextSearchSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">全文搜索</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"在文本中寻找针尖，高效检索海量内容"</p>

      <Paragraph {...noteProps('p1')}>
        全文搜索（Full-Text Search）是现代数据库的核心功能之一，它允许在大量非结构化文本数据中进行高效的关键词搜索。与传统的 LIKE 模糊匹配不同，全文搜索支持自然语言查询、相关性排序、模糊匹配和复杂布尔逻辑。
      </Paragraph>

      <InfoBox type="fastai" title="全文搜索 vs 传统搜索" {...noteProps('box2')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">❌ 传统 LIKE 搜索</h4>
            <ul className="text-sm space-y-1">
              <li>• 只能前缀匹配 %keyword%</li>
              <li>• 无法处理词干变化</li>
              <li>• 不支持相关性排序</li>
              <li>• 性能差，索引无效</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ 全文搜索</h4>
            <ul className="text-sm space-y-1">
              <li>• 自然语言查询支持</li>
              <li>• 词干提取和同义词</li>
              <li>• 相关性评分排序</li>
              <li>• 专用索引，性能卓越</li>
            </ul>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基础语法</h3>

      <SQLExplainer
        sql={`-- 基本全文搜索语法
SELECT title, content, author
FROM articles
WHERE content MATCH 'machine learning';

-- 等价的 CONTAINS 函数
SELECT title, content
FROM documents
WHERE CONTAINS(content, 'database systems');`}
        explanations={[
          { code: 'MATCH 语法', explanation: 'DuckDB 的全文搜索标准语法', tip: '支持复杂的查询表达式' },
          { code: 'CONTAINS 函数', explanation: '另一种搜索语法，更接近传统 SQL', tip: '功能与 MATCH 基本相同' },
          { code: '性能特点', explanation: '需要 FTS 索引才能发挥最佳性能', tip: '无索引时会进行顺序扫描' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">查询操作符详解</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔍 基本操作符</h4>
          <div className="space-y-3 text-sm">
            <div>
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs">keyword1 keyword2</code>
              <span className="ml-2 text-blue-700 dark:text-blue-400">AND 操作（默认）</span>
            </div>
            <div>
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs">keyword1 OR keyword2</code>
              <span className="ml-2 text-blue-700 dark:text-blue-400">OR 操作</span>
            </div>
            <div>
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs">keyword1 -keyword2</code>
              <span className="ml-2 text-blue-700 dark:text-blue-400">NOT 操作</span>
            </div>
            <div>
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-xs">"exact phrase"</code>
              <span className="ml-2 text-blue-700 dark:text-blue-400">短语搜索</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">⚡ 高级操作符</h4>
          <div className="space-y-3 text-sm">
            <div>
              <code className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded text-xs">keyword*</code>
              <span className="ml-2 text-green-700 dark:text-green-400">前缀匹配</span>
            </div>
            <div>
              <code className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded text-xs">"word1 word2"~5</code>
              <span className="ml-2 text-green-700 dark:text-green-400">邻近搜索（5词内）</span>
            </div>
            <div>
              <code className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded text-xs">(group1 OR group2)</code>
              <span className="ml-2 text-green-700 dark:text-green-400">分组和优先级</span>
            </div>
            <div>
              <code className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded text-xs">field:keyword</code>
              <span className="ml-2 text-green-700 dark:text-green-400">字段限定（高级）</span>
            </div>
          </div>
        </div>
      </div>

      <CodeBlock
        title="高级搜索查询示例"
        code={`-- 复杂布尔查询
SELECT title, author, publish_date
FROM articles
WHERE content MATCH '("machine learning" OR "artificial intelligence") AND python -tutorial';

-- 邻近搜索：查找包含"database"和"performance"的文章，且两个词相隔不超过3个词
SELECT title, content
FROM articles
WHERE content MATCH '"database performance"~3';

-- 混合查询：包含"SQL"但不包含"basic"的高级文章
SELECT title, level, tags
FROM tutorials
WHERE content MATCH 'SQL -basic'
  AND level IN ('intermediate', 'advanced');

-- 带权重的多字段搜索
SELECT
    title,
    MATCH_RELEVANCE(title, 'SQL') * 3 +
    MATCH_RELEVANCE(content, 'SQL') * 1 +
    MATCH_RELEVANCE(tags, 'SQL') * 2 AS relevance_score
FROM articles
WHERE title MATCH 'SQL' OR content MATCH 'SQL' OR tags MATCH 'SQL'
ORDER BY relevance_score DESC;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">相关性排序和评分</h3>

      <CodeBlock
        title="相关性评分系统"
        code={`-- 基础相关性评分
SELECT
    title,
    author,
    MATCH_RELEVANCE(content, 'machine learning') AS relevance_score,
    LENGTH(content) AS content_length
FROM articles
WHERE content MATCH 'machine learning'
ORDER BY relevance_score DESC, LENGTH(content) DESC;

-- 多字段加权评分
SELECT
    title,
    -- 标题权重3倍，内容权重1倍，标签权重2倍
    (MATCH_RELEVANCE(title, 'database') * 3 +
     MATCH_RELEVANCE(content, 'database') * 1 +
     MATCH_RELEVANCE(tags, 'database') * 2) / 6 AS weighted_score,

    -- 匹配关键词数量
    LENGTH(content) - LENGTH(REPLACE(LOWER(content), 'database', '')) AS match_count
FROM articles
WHERE title MATCH 'database' OR content MATCH 'database'
ORDER BY weighted_score DESC, match_count DESC;

-- 时间衰减评分（新文章权重更高）
SELECT
    title,
    publish_date,
    MATCH_RELEVANCE(content, 'technology') AS base_score,
    -- 时间权重：30天内的文章权重正常，超过30天的权重衰减
    CASE
        WHEN publish_date >= CURRENT_DATE - INTERVAL '30 days'
        THEN 1.0
        ELSE 0.3
    END AS recency_weight,
    MATCH_RELEVANCE(content, 'technology') *
    CASE
        WHEN publish_date >= CURRENT_DATE - INTERVAL '30 days'
        THEN 1.0
        ELSE 0.3
    END AS final_score
FROM articles
WHERE content MATCH 'technology'
ORDER BY final_score DESC;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">全文索引优化</h3>

      <SQLExplainer
        sql={`-- 创建全文搜索索引
CREATE INDEX idx_articles_content ON articles USING FTS(content);

-- 多列联合索引
CREATE INDEX idx_articles_fulltext ON articles
USING FTS(title, content, summary, tags);

-- 查看索引信息
PRAGMA table_info('articles');

-- 分析查询计划
EXPLAIN ANALYZE
SELECT title, MATCH_RELEVANCE(content, 'database') AS score
FROM articles
WHERE content MATCH 'database'
ORDER BY score DESC
LIMIT 10;`}
        explanations={[
          { code: 'USING FTS(column)', explanation: '创建全文搜索专用索引', tip: 'FTS 索引使用倒排索引结构，搜索速度极快' },
          { code: '多列索引', explanation: '可以为多个文本列创建联合索引', tip: '搜索时会在所有指定列中查找' },
          { code: 'EXPLAIN ANALYZE', explanation: '分析查询是否使用了 FTS 索引', tip: '确保搜索查询使用索引而不是全表扫描' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分词和文本处理</h3>

      <CodeBlock
        title="文本预处理和分词"
        code={`-- 创建测试数据
CREATE TABLE articles AS
SELECT *
FROM (VALUES
    (1, 'Machine Learning with Python', 'Python machine learning tutorial covers neural networks, deep learning, and AI algorithms in detail.'),
    (2, 'Database Design Principles', 'Learn database normalization, indexing strategies, and query optimization techniques.'),
    (3, 'Web Development Guide', 'Complete guide to HTML, CSS, JavaScript, React, and modern web development frameworks.')
) AS t(id, title, content);

-- 基本分词
SELECT
    id,
    title,
    UNNEST(STRING_SPLIT(LOWER(content), ' ')) AS word
FROM articles
WHERE id = 1;

-- 词频统计（去除停用词）
SELECT
    word,
    COUNT(*) AS frequency
FROM (
    SELECT UNNEST(STRING_SPLIT(LOWER(content), ' ')) AS word
    FROM articles
    WHERE content MATCH 'learning'
) AS words
WHERE word NOT IN ('the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall')
  AND LENGTH(word) > 2
GROUP BY word
ORDER BY frequency DESC
LIMIT 10;

-- 词干提取（如果支持）
-- 注意：DuckDB 可能需要扩展来支持高级词干提取
SELECT
    word,
    CASE
        WHEN word LIKE '%ing' THEN SUBSTRING(word, 1, LENGTH(word) - 3)
        WHEN word LIKE '%ed' THEN SUBSTRING(word, 1, LENGTH(word) - 2)
        WHEN word LIKE '%er' THEN SUBSTRING(word, 1, LENGTH(word) - 2)
        WHEN word LIKE '%est' THEN SUBSTRING(word, 1, LENGTH(word) - 3)
        WHEN word LIKE '%ly' THEN SUBSTRING(word, 1, LENGTH(word) - 2)
        WHEN word LIKE '%s' AND LENGTH(word) > 3 THEN SUBSTRING(word, 1, LENGTH(word) - 1)
        ELSE word
    END AS stemmed
FROM (
    SELECT UNNEST(STRING_SPLIT(LOWER(content), ' ')) AS word
    FROM articles
    WHERE id = 1
) AS words
WHERE LENGTH(word) > 3;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">全文搜索在实际业务中的应用</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📄 文档管理系统</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">搜索合同、报告、邮件等文档内容</p>
          <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded mt-2 block">
            WHERE content MATCH 'contract breach OR violation'
          </code>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛒 电商搜索</h4>
          <p className="text-sm text-green-600 dark:text-green-400">商品描述、评论、规格搜索</p>
          <code className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded mt-2 block">
            WHERE description MATCH 'wireless bluetooth'
          </code>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🎓 在线教育</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">课程内容、问答、笔记搜索</p>
          <code className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded mt-2 block">
            WHERE content MATCH 'machine learning -beginner'
          </code>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">💬 客户支持</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">工单、聊天记录、智能问答</p>
          <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded mt-2 block">
            WHERE message MATCH 'refund OR return policy'
          </code>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化和最佳实践</h3>

      <InfoBox type="tip" title="全文搜索性能优化" {...noteProps('box4')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>索引策略：</strong> 为搜索频繁的列创建 FTS 索引</li>
          <li><strong>查询优化：</strong> 使用短语搜索而不是通配符</li>
          <li><strong>结果限制：</strong> 使用 LIMIT 控制返回结果数量</li>
          <li><strong>增量更新：</strong> 对于大表考虑定期重建索引</li>
          <li><strong>缓存策略：</strong> 缓存热门搜索词的结果</li>
          <li><strong>分词优化：</strong> 预处理文本，去除停用词</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="高级搜索功能实现"
        code={`-- 智能搜索：自动补全和纠错
WITH search_suggestions AS (
    SELECT
        search_term,
        -- 简单的编辑距离计算（Levenshtein）
        LEVENSHTEIN(search_term, 'machine learning') AS distance,
        search_term AS suggestion
    FROM search_history
    WHERE LEVENSHTEIN(search_term, 'machine learning') <= 3
    ORDER BY distance
    LIMIT 5
)
SELECT * FROM search_suggestions;

-- 搜索分析和统计
CREATE TABLE search_analytics AS
SELECT
    search_query,
    COUNT(*) AS search_count,
    AVG(result_count) AS avg_results,
    AVG(search_time_ms) AS avg_response_time,
    SUM(CASE WHEN clicked_results > 0 THEN 1 ELSE 0 END) AS successful_searches
FROM search_logs
WHERE search_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY search_query
HAVING COUNT(*) >= 5
ORDER BY search_count DESC;

-- 基于用户行为的个性化搜索
SELECT
    a.title,
    a.content,
    -- 用户偏好权重
    CASE
        WHEN a.category IN (
            SELECT category FROM user_preferences WHERE user_id = 123
        ) THEN 1.5
        ELSE 1.0
    END *
    -- 相关性评分
    MATCH_RELEVANCE(a.content, 'database') AS personalized_score
FROM articles a
WHERE a.content MATCH 'database'
ORDER BY personalized_score DESC;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">全文搜索的局限性和替代方案</h3>

      <InfoBox type="warning" title="全文搜索的局限性" {...noteProps('box5')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>语言支持：</strong> 对中文、日文等表意文字支持有限</li>
          <li><strong>实时性：</strong> 索引更新可能有延迟</li>
          <li><strong>存储开销：</strong> FTS 索引占用额外存储空间</li>
          <li><strong>精确匹配：</strong> 不适合结构化数据的精确查询</li>
          <li><strong>语义理解：</strong> 无法理解语义和上下文</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="全文搜索 vs 其他搜索方案"
        code={`-- 全文搜索：自然语言查询
SELECT title, MATCH_RELEVANCE(content, 'machine learning') AS score
FROM articles
WHERE content MATCH 'machine learning OR AI OR neural networks'
ORDER BY score DESC;

-- 传统 LIKE：精确字符串匹配
SELECT title FROM articles
WHERE LOWER(content) LIKE '%machine learning%'
   OR LOWER(content) LIKE '%artificial intelligence%';

-- 正则表达式：模式匹配
SELECT title FROM articles
WHERE REGEXP_MATCHES(content, '(machine learning|artificial intelligence|neural network)');

-- 向量搜索（如果支持扩展）：语义相似性
-- 需要安装向量扩展和预计算向量
SELECT title,
       COSINE_SIMILARITY(content_vector, query_vector) AS similarity
FROM articles_with_vectors
ORDER BY similarity DESC;

-- 混合搜索：结合多种技术
SELECT title,
       MATCH_RELEVANCE(content, 'machine learning') AS text_score,
       COSINE_SIMILARITY(content_vector, query_vector) AS semantic_score,
       (text_score * 0.7 + semantic_score * 0.3) AS combined_score
FROM articles_with_search
WHERE content MATCH 'machine learning'
ORDER BY combined_score DESC;`}
        {...noteProps('code5')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box6')}>
        <div className="space-y-3">
          <p className="font-semibold">任务 1：构建文章搜索系统</p>
          <p>创建一个文章表，实现全文搜索功能，包括相关性排序和多关键词搜索。</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看参考实现</summary>
            <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`-- 创建文章表
CREATE TABLE articles (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    author VARCHAR(100),
    publish_date DATE,
    category VARCHAR(50)
);

-- 创建全文索引
CREATE INDEX idx_articles_fts ON articles USING FTS(title, content);

-- 搜索功能
SELECT
    title,
    author,
    publish_date,
    MATCH_RELEVANCE(content, 'database') AS relevance_score
FROM articles
WHERE content MATCH 'database systems'
ORDER BY relevance_score DESC
LIMIT 10;`}
            </code>
          </details>

          <p className="font-semibold">任务 2：实现搜索建议功能</p>
          <p>基于搜索历史和编辑距离，实现搜索关键词的自动补全和纠错功能。</p>

          <p className="font-semibold">任务 3：多语言全文搜索</p>
          <p>探索如何处理中文、日文等多语言文本的全文搜索，包括分词和索引策略。</p>

          <p className="font-semibold">任务 4：搜索引擎优化</p>
          <p>分析搜索性能，优化索引策略，并实现搜索结果的缓存机制。</p>
        </div>
      </InfoBox>
    </div>
  );
}

export function ApproximateComputingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">近似计算</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"大数据集的高效近似算法"</p>

      <Paragraph {...noteProps('p1')}>
        在大数据时代，精确计算往往代价高昂。DuckDB 提供了丰富的近似计算函数，能够在保证结果质量的同时大幅提升查询性能。这些函数基于先进的概率算法，能够在数亿条数据上实现实时分析。
      </Paragraph>

      <InfoBox type="fastai" title="为什么需要近似计算？" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>性能需求：</strong> 实时分析需要毫秒级响应</li>
          <li><strong>资源限制：</strong> 完整扫描大数据集耗时耗资源</li>
          <li><strong>业务容忍度：</strong> 很多场景下99%的准确性就够了</li>
          <li><strong>成本效益：</strong> 近似算法通常比精确算法快100-1000倍</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">近似计数：HyperLogLog</h3>

      <SQLExplainer
        sql={`-- 精确计数（慢）
SELECT COUNT(DISTINCT user_id) AS exact_unique_users
FROM events;

-- 近似计数（快且省内存）
SELECT APPROX_COUNT_DISTINCT(user_id) AS approx_unique_users
FROM events;

-- 对比两种方法的差异
SELECT
    COUNT(DISTINCT user_id) AS exact_count,
    APPROX_COUNT_DISTINCT(user_id) AS approx_count,
    APPROX_COUNT_DISTINCT(user_id) - COUNT(DISTINCT user_id) AS difference
FROM events;`}
        explanations={[
          { code: 'APPROX_COUNT_DISTINCT(column)', explanation: '使用 HyperLogLog 算法估算唯一值数量', tip: '内存使用仅与基数相关，不随数据量增长' },
          { code: '精确度', explanation: '误差通常在 1-2% 以内，适合大数据集', tip: '对于小数据集，精确计数更快' },
          { code: '性能优势', explanation: '内存使用量级更小，处理速度大幅提升', tip: '适合实时 UV、PV 统计' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">近似分位数计算</h3>

      <CodeBlock
        title="分位数统计"
        code={`-- 精确分位数（需要全表扫描）
SELECT
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS exact_median,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY salary) AS exact_p90,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY salary) AS exact_p95
FROM employees;

-- 近似分位数（采样算法）
SELECT
    APPROXIMATE_PERCENTILE(salary, 0.5) AS approx_median,
    APPROXIMATE_PERCENTILE(salary, 0.9) AS approx_p90,
    APPROXIMATE_PERCENTILE(salary, 0.95) AS approx_p95
FROM employees;

-- 对比精确度和性能
SELECT
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS exact_median,
    APPROXIMATE_PERCENTILE(salary, 0.5) AS approx_median,
    ABS(APPROXIMATE_PERCENTILE(salary, 0.5) -
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)) /
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) * 100 AS error_percent
FROM employees;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">采样查询：USING SAMPLE</h3>

      <CodeBlock
        title="基于采样的分析"
        code={`-- 随机采样分析（高效但有偏差）
SELECT AVG(salary), STDDEV(salary), COUNT(*)
FROM employees
USING SAMPLE 10%;  -- 使用 10% 的数据

-- 分层采样（更准确）
SELECT department, AVG(salary), COUNT(*)
FROM employees
USING SAMPLE 100 ROWS BY department;  -- 每部门采样100行

-- 系统采样（确定性采样）
SELECT AVG(sales_amount), SUM(sales_amount)
FROM sales
USING SAMPLE 10000 ROWS;  -- 采样10000行进行分析

-- 采样用于快速探索
SELECT
    product_category,
    APPROXIMATE_PERCENTILE(price, 0.5) AS median_price,
    APPROXIMATE_PERCENTILE(price, 0.9) AS p90_price
FROM products
USING SAMPLE 5 PERCENT
GROUP BY product_category;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Top-K 近似算法</h3>

      <CodeBlock
        title="近似 Top-K 查询"
        code={`-- 精确 Top-10（需要全表排序）
SELECT product_name, sales_amount
FROM products
ORDER BY sales_amount DESC
LIMIT 10;

-- 近似 Top-10（使用采样）
SELECT product_name, sales_amount
FROM products
USING SAMPLE 50 PERCENT
ORDER BY sales_amount DESC
LIMIT 10;

-- 结合近似计数的使用模式分析
WITH user_patterns AS (
    SELECT
        user_id,
        APPROX_COUNT_DISTINCT(page_url) AS unique_pages_visited,
        APPROX_COUNT_DISTINCT(session_id) AS total_sessions
    FROM user_events
    USING SAMPLE 10 PERCENT
    GROUP BY user_id
)
SELECT
    CASE
        WHEN unique_pages_visited < 5 THEN '轻度用户'
        WHEN unique_pages_visited < 20 THEN '中度用户'
        ELSE '重度用户'
    END AS user_segment,
    COUNT(*) AS user_count,
    AVG(total_sessions) AS avg_sessions
FROM user_patterns
GROUP BY user_segment;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时分析应用</h3>

      <CodeBlock
        title="实时仪表盘数据"
        code={`-- 实时 UV 统计（每分钟更新）
CREATE TABLE realtime_uv AS
SELECT
    CURRENT_TIMESTAMP AS time_window,
    APPROX_COUNT_DISTINCT(user_id) AS unique_visitors,
    COUNT(*) AS total_pageviews,
    APPROX_COUNT_DISTINCT(session_id) AS active_sessions
FROM user_events
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '1 minute';

-- 实时销售监控
CREATE TABLE sales_monitor AS
SELECT
    product_category,
    APPROXIMATE_PERCENTILE(sales_amount, 0.5) AS median_sale,
    APPROXIMATE_PERCENTILE(sales_amount, 0.95) AS p95_sale,
    APPROX_COUNT_DISTINCT(customer_id) AS unique_customers
FROM sales_transactions
WHERE transaction_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
GROUP BY product_category;

-- 性能监控：响应时间分布
SELECT
    endpoint,
    APPROXIMATE_PERCENTILE(response_time_ms, 0.5) AS median_response,
    APPROXIMATE_PERCENTILE(response_time_ms, 0.95) AS p95_response,
    APPROXIMATE_PERCENTILE(response_time_ms, 0.99) AS p99_response
FROM api_logs
WHERE log_time >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
GROUP BY endpoint;`}
        {...noteProps('code4')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">函数</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">精确度</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">性能提升</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">适用场景</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">APPROX_COUNT_DISTINCT</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">±1-2%</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">10-100x</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">UV统计、基数估算</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">APPROXIMATE_PERCENTILE</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">±0.1-1%</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">5-50x</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">分位数分析、性能监控</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">USING SAMPLE</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">取决于采样率</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">采样率倍</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">数据探索、原型开发</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">Top-K 近似</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">高（&gt;95%）</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">2-10x</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">排行榜、推荐系统</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">近似计算的最佳实践</h3>

      <InfoBox type="tip" title="选择合适的近似算法" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>明确精度要求：</strong> 业务能容忍多少误差？</li>
          <li><strong>评估数据分布：</strong> 数据是否均匀分布影响近似精度</li>
          <li><strong>考虑查询频率：</strong> 高频查询适合近似算法</li>
          <li><strong>监控误差率：</strong> 定期验证近似结果的准确性</li>
          <li><strong>渐进式应用：</strong> 先在非核心场景验证，再推广使用</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="自适应近似计算系统"
        code={`-- 根据数据量自动选择算法
CREATE FUNCTION smart_count_distinct(column_name) AS (
    CASE
        WHEN (SELECT COUNT(*) FROM table_name) < 1000000
        THEN COUNT(DISTINCT column_name)  -- 小数据集用精确算法
        ELSE APPROX_COUNT_DISTINCT(column_name)  -- 大数据集用近似算法
    END
);

-- 根据响应时间动态调整采样率
CREATE FUNCTION adaptive_sample(table_name, target_response_ms) AS (
    -- 实现采样率自动调整逻辑
    -- 如果查询太慢，自动增加采样率
    -- 如果精度不够，减少采样率
    USING SAMPLE (
        CASE
            WHEN last_response_time > target_response_ms THEN sample_rate * 1.2
            WHEN error_rate > acceptable_error THEN sample_rate * 0.8
            ELSE sample_rate
        END
    PERCENT
    )
);`}
        {...noteProps('code5')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box3')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：性能对比实验</p>
            <p>在不同大小的数据集上对比精确计算和近似计算的性能差异：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>创建包含100万行数据的测试表</li>
              <li>分别用COUNT(DISTINCT)和APPROX_COUNT_DISTINCT计算唯一值</li>
              <li>记录查询时间和内存使用</li>
              <li>分析误差率与数据量的关系</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：实时监控仪表盘</p>
            <p>构建一个实时用户行为分析仪表盘：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实时计算在线用户数（APPROX_COUNT_DISTINCT）</li>
              <li>响应时间分位数统计</li>
              <li>热门页面访问Top-10</li>
              <li>用户活跃度分布分析</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 3：A/B测试效果分析</p>
            <p>使用近似算法优化A/B测试数据分析：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实时计算各版本的转化率</li>
              <li>使用分位数分析用户行为差异</li>
              <li>快速识别显著性差异</li>
              <li>采样验证避免过度分析</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 数组与结构体章节
// ============================================

export function ArrayStructSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数组与结构体</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"复杂数据类型的处理艺术"</p>

      <Paragraph {...noteProps('p1')}>
        现代数据处理经常需要处理复杂的嵌套结构。DuckDB 支持数组（ARRAY）和结构体（STRUCT）数据类型，让你可以像处理对象一样处理关系型数据。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组（ARRAY）基础操作</h3>

      <CodeBlock
        title="创建和访问数组"
        code={`-- 创建数组字面量
SELECT [1, 2, 3, 4, 5] AS numbers;
SELECT ['apple', 'banana', 'orange'] AS fruits;

-- 数组长度
SELECT array_length([1, 2, 3]) AS len;  -- 结果: 3

-- 访问数组元素（索引从1开始）
SELECT list_extract([10, 20, 30], 1) AS first;     -- 10
SELECT list_extract([10, 20, 30], 2) AS second;    -- 20
SELECT list_extract([10, 20, 30], -1) AS last;     -- 30

-- 数组切片
SELECT list_slice([10, 20, 30, 40, 50], 2, 4) AS slice;  -- [20, 30, 40]`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组操作函数</h3>

      <CodeBlock
        title="数组变换和过滤"
        code={`-- 数组连接
SELECT [1, 2] || [3, 4] AS combined;  -- [1, 2, 3, 4]

-- 数组排序
SELECT list_sort([3, 1, 4, 1, 5]) AS sorted;  -- [1, 1, 3, 4, 5]

-- 数组去重
SELECT list_distinct([1, 2, 2, 3, 3, 3]) AS unique;  -- [1, 2, 3]

-- 数组过滤
SELECT list_filter([1, 2, 3, 4, 5], x -> x > 3) AS filtered;  -- [4, 5]

-- 数组变换
SELECT list_transform([1, 2, 3], x -> x * 2) AS doubled;  -- [2, 4, 6]`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">结构体（STRUCT）数据类型</h3>

      <CodeBlock
        title="结构体创建和访问"
        code={`-- 创建结构体
SELECT {'name': 'John', 'age': 25, 'city': 'New York'} AS person;

-- 结构体字段访问
SELECT
    person.name,
    person.age,
    person.city
FROM (
    SELECT {'name': 'John', 'age': 25, 'city': 'New York'} AS person
) t;

-- 使用点号访问
SELECT
    person->>'name' AS name,
    person->>'age' AS age,
    person->>'city' AS city
FROM (
    SELECT {'name': 'John', 'age': 25, 'city': 'New York'} AS person
) t;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">嵌套结构处理</h3>

      <CodeBlock
        title="复杂嵌套数据"
        code={`-- 包含数组的结构体
SELECT {
    'user_id': 123,
    'name': 'Alice',
    'tags': ['developer', 'python', 'sql'],
    'projects': [
        {'name': 'web-app', 'status': 'active'},
        {'name': 'api', 'status': 'completed'}
    ]
} AS user_profile;

-- 访问嵌套字段
SELECT
    user_profile->>'name' AS name,
    list_extract(user_profile->>'tags', 1) AS first_tag,
    (user_profile->>'projects')->>[1]->>'name' AS first_project
FROM user_profiles;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">UNNEST - 展开数组</h3>

      <CodeBlock
        title="数组展开为多行"
        code={`-- 基础展开
SELECT unnest([1, 2, 3, 4, 5]) AS number;
-- 结果: 5行，每行一个数字

-- 展开带索引
SELECT
    generate_series(1, array_length(tags)) AS idx,
    unnest(tags) AS tag
FROM (
    SELECT ['red', 'blue', 'green'] AS tags
) t;

-- 多数组同时展开
SELECT
    unnest(['Alice', 'Bob', 'Charlie']) AS name,
    unnest([25, 30, 35]) AS age
AS combined;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <CodeBlock
        title="电商产品数据模型"
        code={`-- 创建产品表（包含数组和结构体）
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    price DECIMAL(10,2),
    tags VARCHAR[],  -- 标签数组
    specifications JSON,  -- 规格结构体
    reviews JSON[]  -- 评论数组
);

-- 插入示例数据
INSERT INTO products VALUES (
    1,
    'MacBook Pro 16"',
    2499.00,
    ['laptop', 'apple', 'high-end'],  -- 标签
    {                               -- 规格
        'cpu': 'M2 Max',
        'ram': '32GB',
        'storage': '1TB SSD'
    },
    [                               -- 评论
        {'user': 'Alice', 'rating': 5, 'comment': 'Great laptop!'},
        {'user': 'Bob', 'rating': 4, 'comment': 'Good performance'}
    ]
);

-- 查询产品标签
SELECT
    name,
    unnest(tags) AS tag
FROM products
WHERE id = 1;

-- 查找有特定标签的产品
SELECT name, price
FROM products
WHERE list_contains(tags, 'apple');`}
        {...noteProps('code6')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">操作类型</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">数组函数</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">结构体函数</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">说明</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">创建</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">[], list_pack()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">{'{}'}, struct_pack()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">创建数组或结构体</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">访问</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">list_extract()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">struct_extract()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">提取元素或字段</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">长度</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">array_length()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">struct_type()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">获取长度或类型信息</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">变换</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">list_transform()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">struct_insert()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">变换或修改内容</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">展开</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">unnest()</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">N/A</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">将数组展开为多行</td></tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：电商产品数据建模</p>
            <p>创建一个包含标签数组和规格结构体的产品表，插入一些示例数据，然后写查询来：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>查找所有包含"电子产品"标签的产品</li>
              <li>展开每个产品的所有标签为单独的行</li>
              <li>提取所有产品的CPU规格进行统计</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：用户偏好分析</p>
            <p>设计一个用户表包含兴趣标签数组，写查询分析：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>最受欢迎的兴趣标签Top 10</li>
              <li>有多少用户对"编程"感兴趣</li>
              <li>用户的兴趣标签多样性统计</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// NULL 处理章节
// ============================================

export function NullHandlingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">NULL 处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"三值逻辑与缺失数据的艺术"</p>

      <Paragraph {...noteProps('p1')}>
        NULL 值代表缺失或未知的数据。在 SQL 中，NULL 的处理需要特别小心，因为它引入了三值逻辑（TRUE、FALSE、UNKNOWN），而不是传统的二值逻辑。这让很多操作变得反直觉。
      </Paragraph>

      <InfoBox type="warning" title="NULL 的三大特性" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>未知性：</strong> NULL 不是空字符串，也不是0，它是"未知"</li>
          <li><strong>传染性：</strong> 任何与 NULL 的运算结果都是 NULL</li>
          <li><strong>三值逻辑：</strong> 比较结果可能是 TRUE、FALSE 或 UNKNOWN</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">NULL 值检测</h3>

      <CodeBlock
        title="IS NULL vs = NULL"
        code={`-- ❌ 错误：NULL 不能用等号比较
SELECT * FROM users WHERE email = NULL;  -- 不会返回任何行

-- ✅ 正确：使用 IS NULL
SELECT * FROM users WHERE email IS NULL;

-- ✅ 正确：使用 IS NOT NULL
SELECT * FROM users WHERE email IS NOT NULL;

-- 检查多个字段
SELECT * FROM products
WHERE description IS NULL
   OR price IS NULL
   OR category IS NULL;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">NULL 处理函数</h3>

      <SQLExplainer
        sql={`SELECT
    COALESCE(description, '暂无描述') AS safe_description,
    COALESCE(price, 0) AS safe_price,
    COALESCE(discount, 0.1, 0.0) AS discount_rate
FROM products;`}
        explanations={[
          { code: 'COALESCE(description, \'暂无描述\')', explanation: '返回第一个非NULL值，如果都为NULL则返回默认值', tip: '相当于 IFNULL 或 NVL' },
          { code: 'COALESCE(price, 0)', explanation: '如果price为NULL，返回0', tip: '常用于数值计算' },
          { code: 'COALESCE(discount, 0.1, 0.0)', explanation: '依次检查多个值，返回第一个非NULL的', tip: '支持多个备选值' },
        ]}
      />

      <CodeBlock
        title="其他NULL处理函数"
        code={`-- NULLIF: 如果两个参数相等返回NULL，否则返回第一个参数
SELECT NULLIF(price, 0) AS price_no_zero FROM products;
-- 如果price=0，返回NULL；否则返回price

-- IFNULL: 简单版本的COALESCE（只接受两个参数）
SELECT IFNULL(description, 'No description') FROM products;

-- GREATEST 和 LEAST 处理NULL
SELECT GREATEST(a, b, COALESCE(c, 0)) FROM table1;  -- c为NULL时使用0
SELECT LEAST(a, b, COALESCE(c, 999)) FROM table1;   -- c为NULL时使用999`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">聚合函数与NULL</h3>

      <CodeBlock
        title="聚合函数如何处理NULL"
        code={`-- 创建测试数据
CREATE TABLE sales (
    product_id INTEGER,
    amount DECIMAL(10,2)
);

INSERT INTO sales VALUES
    (1, 100.00),
    (1, NULL),     -- 空值
    (2, 200.00),
    (2, NULL),
    (3, NULL);     -- 全部为空

-- COUNT(*) vs COUNT(column)
SELECT
    COUNT(*) AS total_rows,        -- 5（包括NULL行）
    COUNT(amount) AS non_null_count -- 2（只计算非NULL值）
FROM sales;

-- 其他聚合函数忽略NULL
SELECT
    SUM(amount) AS total_sales,     -- 300.00（忽略NULL）
    AVG(amount) AS avg_sales,       -- 150.00（只计算非NULL值的平均）
    MIN(amount) AS min_sales,       -- 100.00
    MAX(amount) AS max_sales        -- 200.00
FROM sales;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JOIN操作中的NULL</h3>

      <CodeBlock
        title="外连接中的NULL处理"
        code={`-- LEFT JOIN 会产生NULL值
SELECT
    u.user_id,
    u.name,
    COALESCE(o.total_orders, 0) AS total_orders,
    COALESCE(o.total_amount, 0) AS total_amount
FROM users u
LEFT JOIN (
    SELECT
        user_id,
        COUNT(*) AS total_orders,
        SUM(amount) AS total_amount
    FROM orders
    GROUP BY user_id
) o ON u.user_id = o.user_id;

-- 处理NULL的外键
SELECT * FROM orders
WHERE user_id IS NULL;  -- 找不到对应用户的订单

-- 使用COALESCE处理计算结果
SELECT
    product_name,
    COALESCE(AVG(rating), 0) AS avg_rating,
    COALESCE(COUNT(review_id), 0) AS review_count
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id
GROUP BY product_name;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">NULL值排序</h3>

      <CodeBlock
        title="NULL在排序中的位置"
        code={`-- 默认情况下，NULL值在排序时被认为最大
SELECT * FROM products
ORDER BY price;  -- NULL值排在最后

-- 明确指定NULL的位置
SELECT * FROM products
ORDER BY price NULLS FIRST;   -- NULL值排在前面

SELECT * FROM products
ORDER BY price NULLS LAST;    -- NULL值排在后面（默认）

-- 多列排序时NULL的处理
SELECT * FROM products
ORDER BY
    COALESCE(category, '未分类') ASC,  -- NULL分类当作'未分类'
    price NULLS LAST;                  -- NULL价格排在后面`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">NULL值的数据质量检查</h3>

      <CodeBlock
        title="数据质量分析"
        code={`-- 检查每列的NULL值比例
SELECT
    'users' AS table_name,
    COUNT(*) AS total_rows,
    COUNT(CASE WHEN email IS NULL THEN 1 END) AS null_emails,
    ROUND(100.0 * COUNT(CASE WHEN email IS NULL THEN 1 END) / COUNT(*), 2) AS null_email_pct,
    COUNT(CASE WHEN phone IS NULL THEN 1 END) AS null_phones,
    ROUND(100.0 * COUNT(CASE WHEN phone IS NULL THEN 1 END) / COUNT(*), 2) AS null_phone_pct
FROM users;

-- 识别数据完整性问题
SELECT
    column_name,
    null_count,
    total_count,
    CASE
        WHEN null_pct > 50 THEN '严重缺失'
        WHEN null_pct > 20 THEN '部分缺失'
        WHEN null_pct > 0 THEN '轻微缺失'
        ELSE '完整'
    END AS completeness_status
FROM (
    SELECT
        'email' AS column_name,
        COUNT(CASE WHEN email IS NULL THEN 1 END) AS null_count,
        COUNT(*) AS total_count,
        ROUND(100.0 * COUNT(CASE WHEN email IS NULL THEN 1 END) / COUNT(*), 2) AS null_pct
    FROM users
) quality_check;`}
        {...noteProps('code6')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">函数</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">语法</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">作用</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">示例</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">COALESCE</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">COALESCE(val1, val2, ...)</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">返回第一个非NULL值</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">COALESCE(price, 0)</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">NULLIF</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">NULLIF(val1, val2)</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">如果相等返回NULL</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">NULLIF(price, 0)</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">IFNULL</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">IFNULL(val, default)</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">NULL替换为默认值</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">IFNULL(name, 'Unknown')</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">IS NULL</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">column IS NULL</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">检查是否为NULL</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">WHERE email IS NULL</td></tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：电商数据NULL值处理</p>
            <p>为一个电商数据库设计完整的NULL值处理策略：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>产品价格为NULL时的默认处理</li>
              <li>用户地址信息缺失的处理</li>
              <li>订单状态为NULL时的业务逻辑</li>
              <li>统计报告中NULL值的展示方式</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：数据质量报告</p>
            <p>创建一个数据质量检查脚本：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>检查每张表每列的NULL值比例</li>
              <li>识别数据完整性问题</li>
              <li>生成数据质量评分</li>
              <li>提供改进建议</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 3：三值逻辑练习</p>
            <p>写查询测试三值逻辑的行为：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>NULL与NULL的比较结果</li>
              <li>NOT (NULL = NULL) 的结果</li>
              <li>NULL AND TRUE 的结果</li>
              <li>在WHERE子句中使用UNKNOWN的后果</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 地理空间函数章节
// ============================================

export function SpatialFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">地理空间函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"位置数据的查询与分析"</p>

      <Paragraph {...noteProps('p1')}>
        地理空间数据无处不在：GPS定位、地图服务、地理围栏、路径规划等。DuckDB 通过 PostGIS 兼容的函数支持丰富的地理空间操作，从简单的距离计算到复杂的几何分析。
      </Paragraph>

      <InfoBox type="info" title="安装空间扩展" {...noteProps('box1')}>
        <p>DuckDB 的地理空间功能通过扩展提供。在使用前需要安装：</p>
        <code className="block mt-2 bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
          INSTALL spatial;<br/>
          LOAD spatial;
        </code>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">几何数据类型</h3>

      <CodeBlock
        title="创建几何对象"
        code={`-- 点（Point）
SELECT ST_Point(116.4074, 39.9042) AS beijing_location;
-- WGS84坐标：东经116.4074°, 北纬39.9042°

-- 线段（LineString）
SELECT ST_LineString([
    [116.4074, 39.9042],  -- 北京
    [121.4737, 31.2304],  -- 上海
    [114.0579, 22.5431]   -- 深圳
]) AS route;

-- 多边形（Polygon）
SELECT ST_Polygon('POLYGON((0 0, 4 0, 4 4, 0 4, 0 0))') AS square;

-- 从WKT创建几何对象
SELECT ST_GeomFromText('POINT(116.4074 39.9042)') AS point_from_wkt;
SELECT ST_GeomFromText('LINESTRING(0 0, 1 1, 2 0)') AS line_from_wkt;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">距离计算</h3>

      <SQLExplainer
        sql={`-- 计算两点间的距离
SELECT
    ST_Distance(
        ST_Point(116.4074, 39.9042),  -- 北京
        ST_Point(121.4737, 31.2304)   -- 上海
    ) AS distance_meters;

-- 计算球面距离（更准确）
SELECT
    ST_DistanceSphere(
        ST_Point(116.4074, 39.9042),
        ST_Point(121.4737, 31.2304)
    ) AS distance_meters_sphere;`}
        explanations={[
          { code: 'ST_Distance(point1, point2)', explanation: '计算两几何对象间的欧几里得距离', tip: '平面坐标系适用' },
          { code: 'ST_DistanceSphere(point1, point2)', explanation: '计算球面距离，使用WGS84椭球体', tip: '地理坐标系适用，结果为米' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">空间关系判断</h3>

      <CodeBlock
        title="几何对象间的空间关系"
        code={`-- 创建测试几何对象
WITH geometries AS (
    SELECT
        ST_Point(0, 0) AS point,
        ST_Polygon('POLYGON((0 0, 2 0, 2 2, 0 2, 0 0))') AS square,
        ST_Point(1, 1) AS point_inside,
        ST_Point(3, 3) AS point_outside
)
SELECT
    -- 包含关系
    ST_Contains(square, point_inside) AS square_contains_point_inside,
    ST_Contains(square, point_outside) AS square_contains_point_outside,

    -- 相交关系
    ST_Intersects(square, point_inside) AS square_intersects_point_inside,

    -- 内部关系
    ST_Within(point_inside, square) AS point_inside_within_square,

    -- 距离关系
    ST_DWithin(square, point_outside, 2.0) AS within_2_units
FROM geometries;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">几何操作</h3>

      <CodeBlock
        title="几何对象的变换和操作"
        code={`-- 缓冲区（Buffer）
SELECT ST_Buffer(ST_Point(0, 0), 1.0) AS point_buffer;
-- 在点周围创建半径为1的圆形缓冲区

-- 凸包（Convex Hull）
SELECT ST_ConvexHull(ST_GeomFromText(
    'MULTIPOINT((0 0), (1 0), (1 1), (0 1), (0.5 0.5))'
)) AS convex_hull;

-- 几何简化（Simplification）
SELECT ST_Simplify(
    ST_GeomFromText('LINESTRING(0 0, 0.1 0.1, 0.2 0.2, 0.3 0.3)'),
    0.2  -- 容差
) AS simplified_line;

-- 几何联合（Union）
SELECT ST_Union(
    ST_Polygon('POLYGON((0 0, 2 0, 2 2, 0 2, 0 0))'),
    ST_Polygon('POLYGON((1 1, 3 1, 3 3, 1 3, 1 1))')
) AS union_result;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">坐标系转换</h3>

      <CodeBlock
        title="坐标系变换"
        code={`-- WGS84转Web墨卡托
SELECT ST_Transform(
    ST_Point(116.4074, 39.9042),  -- 北京坐标 (WGS84)
    3857  -- Web墨卡托投影坐标系
) AS web_mercator_point;

-- 坐标系转换
SELECT ST_Transform(
    ST_SetSRID(ST_Point(116.4074, 39.9042), 4326),  -- 设置源坐标系
    3857  -- 目标坐标系
) AS transformed_point;

-- 获取几何对象的坐标系
SELECT ST_SRID(ST_Point(116.4074, 39.9042)) AS srid;

-- 设置坐标系
SELECT ST_SetSRID(ST_Point(116.4074, 39.9042), 4326) AS point_with_srid;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">地理空间索引</h3>

      <CodeBlock
        title="创建空间索引"
        code={`-- 创建包含位置信息的表
CREATE TABLE locations (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    location GEOMETRY
);

-- 创建空间索引
CREATE INDEX idx_locations_geom ON locations USING RTREE (location);

-- 插入测试数据
INSERT INTO locations VALUES
    (1, '北京', ST_Point(116.4074, 39.9042)),
    (2, '上海', ST_Point(121.4737, 31.2304)),
    (3, '深圳', ST_Point(114.0579, 22.5431));

-- 使用空间索引的查询
SELECT name
FROM locations
WHERE ST_DWithin(location, ST_Point(116.4074, 39.9042), 500000);  -- 500km范围内`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用：附近地点搜索</h3>

      <CodeBlock
        title="附近地点搜索系统"
        code={`-- 创建餐馆位置表
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    cuisine VARCHAR,
    location GEOMETRY,
    rating DECIMAL(2,1)
);

-- 插入测试数据
INSERT INTO restaurants VALUES
    (1, '北京烤鸭店', '中餐', ST_Point(116.4074, 39.9042), 4.5),
    (2, '意大利餐厅', '西餐', ST_Point(116.4174, 39.9142), 4.2),
    (3, '日本料理', '日餐', ST_Point(116.4274, 39.9242), 4.8);

-- 查找用户位置附近的餐馆
WITH user_location AS (
    SELECT ST_Point(116.4074, 39.9042) AS loc
)
SELECT
    r.name,
    r.cuisine,
    r.rating,
    ST_DistanceSphere(r.location, u.loc) / 1000 AS distance_km,
    ST_DistanceSphere(r.location, u.loc) AS distance_meters
FROM restaurants r
CROSS JOIN user_location u
WHERE ST_DWithin(r.location, u.loc, 5000)  -- 5km范围内
ORDER BY distance_meters
LIMIT 10;`}
        {...noteProps('code6')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">地理围栏应用</h3>

      <CodeBlock
        title="地理围栏判断"
        code={`-- 定义商业区围栏
WITH business_district AS (
    SELECT ST_Polygon('POLYGON((
        116.3 39.8, 116.5 39.8, 116.5 40.0, 116.3 40.0, 116.3 39.8
    ))') AS boundary
),
user_locations AS (
    SELECT
        user_id,
        ST_Point(longitude, latitude) AS location
    FROM user_tracking
    WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
)
SELECT
    u.user_id,
    ST_Contains(b.boundary, u.location) AS is_in_district,
    ST_Distance(b.boundary, u.location) AS distance_to_boundary
FROM user_locations u
CROSS JOIN business_district b;`}
        {...noteProps('code7')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">函数类别</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">常用函数</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-slate-800 dark:text-slate-200">说明</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">几何构造</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Point, ST_Polygon, ST_LineString</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">创建几何对象</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">距离计算</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Distance, ST_DistanceSphere</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">计算几何对象间距离</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">空间关系</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Contains, ST_Intersects, ST_Within</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">判断几何对象间的空间关系</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">几何操作</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Buffer, ST_Union, ST_Intersection</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">几何对象的变换和组合</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">坐标转换</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Transform, ST_SetSRID</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">坐标系转换</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">属性获取</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">ST_Area, ST_Length, ST_Centroid</td><td className="border border-slate-200 dark:border-slate-700 px-4 py-2">获取几何对象的属性</td></tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：附近地点搜索</p>
            <p>构建一个餐馆搜索系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>创建餐馆表包含位置信息</li>
              <li>实现按距离排序的搜索功能</li>
              <li>添加菜系过滤和评分排序</li>
              <li>计算用户到餐馆的距离</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：地理围栏监控</p>
            <p>实现一个地理围栏系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>定义商业区的边界多边形</li>
              <li>监控用户是否进入/离开围栏</li>
              <li>统计围栏内的用户数量</li>
              <li>计算用户到边界的距离</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 3：路径规划辅助</p>
            <p>创建路径分析工具：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>计算两点间的球面距离</li>
              <li>创建路径的LineString对象</li>
              <li>计算路径的总长度</li>
              <li>判断路径是否经过特定区域</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// 其余组件的简化定义
export function SequenceGenerationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">序列生成</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"生成连续数字和自定义序列"</p>

      <Paragraph {...noteProps('p1')}>
        序列生成函数用于创建连续的数字序列、日期序列或自定义模式的序列，在数据生成、测试数据创建、时间序列分析等场景中非常有用。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">GENERATE_SERIES 函数</h3>

      <CodeBlock
        title="基本序列生成"
        code={`-- 生成数字序列
SELECT * FROM GENERATE_SERIES(1, 10);
-- 结果: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

-- 生成指定步长的序列
SELECT * FROM GENERATE_SERIES(0, 100, 10);
-- 结果: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100

-- 生成倒序序列
SELECT * FROM GENERATE_SERIES(10, 1, -1);
-- 结果: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="日期序列生成"
        code={`-- 生成日期序列
SELECT * FROM GENERATE_SERIES(
    DATE '2024-01-01',
    DATE '2024-01-07',
    INTERVAL '1 day'
);
-- 结果: 2024-01-01, 2024-01-02, ..., 2024-01-07

-- 生成月份序列
SELECT * FROM GENERATE_SERIES(
    DATE '2024-01-01',
    DATE '2024-12-01',
    INTERVAL '1 month'
);
-- 结果: 2024-01-01, 2024-02-01, ..., 2024-12-01`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">UNNEST 与序列生成</h3>

      <CodeBlock
        title="UNNEST 生成序列"
        code={`-- 使用 UNNEST 生成序列
SELECT UNNEST(GENERATE_SERIES(1, 5)) AS numbers;
-- 等价于 SELECT * FROM GENERATE_SERIES(1, 5);

-- 生成多个列的序列
SELECT
    num,
    num * 2 AS doubled,
    num * num AS squared
FROM GENERATE_SERIES(1, 10) AS t(num);`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <CodeBlock
        title="填充缺失的日期数据"
        code={`-- 为销售数据填充缺失日期
WITH all_dates AS (
    SELECT CAST(generate_series AS DATE) AS sale_date
    FROM GENERATE_SERIES('2024-01-01'::DATE, '2024-01-31'::DATE, '1 day'::INTERVAL)
),
sales_data AS (
    SELECT
        sale_date,
        COALESCE(SUM(amount), 0) AS total_sales
    FROM all_dates
    LEFT JOIN daily_sales USING (sale_date)
    GROUP BY sale_date
    ORDER BY sale_date
)
SELECT * FROM sales_data;`}
        {...noteProps('code4')}
      />

      <CodeBlock
        title="生成测试数据"
        code={`-- 生成测试用户数据
SELECT
    'user_' || id AS username,
    'User ' || id AS full_name,
    'user' || id || '@example.com' AS email,
    DATE '2020-01-01' + (id * INTERVAL '1 day') AS registration_date
FROM GENERATE_SERIES(1, 1000) AS t(id);`}
        {...noteProps('code5')}
      />

      <InfoBox type="tip" title="性能优化建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>对于大范围序列，考虑使用合适的步长避免内存溢出</li>
          <li>在生成大量数据时，使用 LIMIT 子句限制结果集</li>
          <li>日期序列生成时注意时区问题</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function ListFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">列表函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"处理数组和列表数据的高级工具"</p>

      <Paragraph {...noteProps('p1')}>
        列表函数用于处理数组类型的数据，支持聚合、变换、过滤等操作。在处理多值属性、标签系统、嵌套数据时非常有用。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组创建和操作</h3>

      <CodeBlock
        title="创建和操作数组"
        code={`-- 创建数组
SELECT [1, 2, 3, 4, 5] AS numbers;
SELECT ['apple', 'banana', 'orange'] AS fruits;

-- 数组连接
SELECT [1, 2] || [3, 4] AS combined;
-- 结果: [1, 2, 3, 4]

-- 数组元素访问
SELECT [10, 20, 30, 40][2] AS second_element;
-- 结果: 20 (数组索引从1开始)

-- 数组切片
SELECT [10, 20, 30, 40][2:4] AS slice;
-- 结果: [20, 30, 40]`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组聚合函数</h3>

      <CodeBlock
        title="LIST 函数系列"
        code={`-- LIST_AGG: 将多行聚合为数组
SELECT
    department,
    LIST_AGG(employee_name, ', ') AS employees
FROM employees
GROUP BY department;

-- LIST_EXTRACT: 提取数组元素
SELECT
    id,
    tags,
    LIST_EXTRACT(tags, 1) AS first_tag,
    LIST_EXTRACT(tags, -1) AS last_tag
FROM articles;

-- LIST_CONTAINS: 检查是否包含元素
SELECT
    product_name,
    categories,
    LIST_CONTAINS(categories, 'electronics') AS is_electronic
FROM products;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组变换函数</h3>

      <CodeBlock
        title="数组变换操作"
        code={`-- LIST_TRANSFORM: 变换数组元素
SELECT
    numbers,
    LIST_TRANSFORM(numbers, x -> x * 2) AS doubled
FROM (SELECT [1, 2, 3, 4] AS numbers) t;
-- 结果: [2, 4, 6, 8]

-- LIST_FILTER: 过滤数组元素
SELECT
    numbers,
    LIST_FILTER(numbers, x -> x > 3) AS filtered
FROM (SELECT [1, 2, 3, 4, 5, 6] AS numbers) t;
-- 结果: [4, 5, 6]

-- LIST_DISTINCT: 去重
SELECT LIST_DISTINCT([1, 2, 2, 3, 3, 3]) AS unique_numbers;
-- 结果: [1, 2, 3]`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级应用场景</h3>

      <CodeBlock
        title="标签系统处理"
        code={`-- 处理文章标签
WITH article_tags AS (
    SELECT
        article_id,
        LIST_AGG(tag_name, ',') AS tags_list,
        COUNT(*) AS tag_count
    FROM article_tags
    GROUP BY article_id
)
SELECT
    article_id,
    tags_list,
    tag_count,
    LIST_CONTAINS(STRING_SPLIT(tags_list, ','), 'technology') AS is_tech_article
FROM article_tags;`}
        {...noteProps('code4')}
      />

      <CodeBlock
        title="多值属性聚合"
        code={`-- 用户多选偏好聚合
SELECT
    user_id,
    LIST_AGG(DISTINCT preference) AS all_preferences,
    LIST_AGG(DISTINCT category) AS categories
FROM user_preferences
GROUP BY user_id;

-- 计算偏好重叠度
SELECT
    u1.user_id AS user1,
    u2.user_id AS user2,
    LIST_INTERSECT(u1.preferences, u2.preferences) AS common_prefs,
    ARRAY_LENGTH(LIST_INTERSECT(u1.preferences, u2.preferences)) AS overlap_count
FROM user_prefs u1
CROSS JOIN user_prefs u2
WHERE u1.user_id < u2.user_id;`}
        {...noteProps('code5')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        使用数组函数处理电商订单中的商品列表，计算每种商品的销售频率和关联商品推荐。
      </InfoBox>
    </div>
  );
}
export function CryptoFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">加密函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据安全与隐私保护的加密工具"</p>

      <Paragraph {...noteProps('p1')}>
        加密函数提供数据加密、哈希计算、数字签名等安全功能，用于保护敏感数据、验证数据完整性、实现安全的密码存储等场景。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">哈希函数</h3>

      <CodeBlock
        title="密码哈希存储"
        code={`-- MD5 哈希（不推荐用于密码）
SELECT MD5('password123') AS md5_hash;
-- 结果: 482c811da5d5b4bc6d497ffa98491e38

-- SHA256 哈希
SELECT SHA256('password123') AS sha256_hash;
-- 结果: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92

-- SHA512 哈希（推荐用于密码）
SELECT SHA512('password123') AS sha512_hash;
-- 结果: 3c9909afec25354d551dae21590bb26e38d53f21787d8e6799b5bb7c8ed0cec2

-- 带盐的密码哈希
SELECT SHA256(CONCAT('mysalt_', 'password123')) AS salted_hash;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据完整性验证</h3>

      <CodeBlock
        title="文件完整性检查"
        code={`-- 计算文件哈希值
SELECT
    file_name,
    file_size,
    MD5(file_content) AS md5_checksum,
    SHA256(file_content) AS sha256_checksum
FROM files;

-- 验证数据完整性
SELECT
    file_name,
    CASE
        WHEN stored_md5 = MD5(file_content) THEN '完整'
        ELSE '损坏'
    END AS integrity_check
FROM files_with_checksums;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">HMAC 认证</h3>

      <CodeBlock
        title="HMAC-SHA256 认证"
        code={`-- 生成 HMAC 签名
SELECT HMAC('Hello World', 'secret_key', 'sha256') AS signature;

-- API 请求签名验证
SELECT
    request_data,
    provided_signature,
    HMAC(request_data, 'api_secret', 'sha256') AS expected_signature,
    CASE
        WHEN provided_signature = HMAC(request_data, 'api_secret', 'sha256')
        THEN '验证通过'
        ELSE '签名无效'
    END AS verification_result
FROM api_requests;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">随机数生成</h3>

      <CodeBlock
        title="安全随机数"
        code={`-- 生成随机字节
SELECT GEN_RANDOM_BYTES(16) AS random_bytes;

-- 生成随机 UUID
SELECT GEN_RANDOM_UUID() AS random_id;

-- 生成加密安全的随机数
SELECT
    RANDOM() AS pseudo_random,  -- 伪随机数
    GEN_RANDOM_BYTES(8) AS secure_random_bytes;

-- 密码重置令牌
SELECT
    user_id,
    GEN_RANDOM_UUID()::VARCHAR AS reset_token,
    CURRENT_TIMESTAMP + INTERVAL '1 hour' AS expires_at
FROM password_reset_requests;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <CodeBlock
        title="用户认证系统"
        code={`-- 用户注册：存储密码哈希
INSERT INTO users (username, password_hash, salt)
SELECT
    'john_doe',
    SHA512(CONCAT(GEN_RANDOM_BYTES(16)::VARCHAR, '_password123')),
    GEN_RANDOM_BYTES(16)::VARCHAR;

-- 用户登录验证
SELECT
    user_id,
    CASE
        WHEN password_hash = SHA512(CONCAT(salt, 'entered_password'))
        THEN '登录成功'
        ELSE '密码错误'
    END AS login_result
FROM users
WHERE username = 'john_doe';`}
        {...noteProps('code5')}
      />

      <CodeBlock
        title="数据加密存储"
        code={`-- 使用 AES 加密敏感数据
SELECT
    id,
    AES_ENCRYPT(ssn, 'encryption_key') AS encrypted_ssn,
    AES_DECRYPT(AES_ENCRYPT(ssn, 'encryption_key'), 'encryption_key') AS decrypted_ssn
FROM sensitive_data;

-- 数据库备份加密
SELECT
    table_name,
    AES_ENCRYPT(table_data::VARCHAR, 'backup_key') AS encrypted_backup
FROM table_backups;`}
        {...noteProps('code6')}
      />

      <InfoBox type="warning" title="安全最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>使用强哈希算法：</strong>SHA256 或 SHA512，不要使用 MD5</li>
          <li><strong>加盐处理：</strong>为每个密码生成唯一盐值</li>
          <li><strong>密钥管理：</strong>妥善保管加密密钥，不要硬编码</li>
          <li><strong>定期轮换：</strong>定期更换加密密钥和哈希算法</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function ExternalSourcesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">外部数据源</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"连接外部系统，整合多源数据"</p>

      <Paragraph {...noteProps('p1')}>
        外部数据源功能允许 DuckDB 直接查询其他数据库、文件系统、云存储等外部数据源，无需先导入数据。这种方式支持联邦查询和实时数据访问。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">外部表创建</h3>

      <CodeBlock
        title="连接外部数据库"
        code={`-- 连接 PostgreSQL 数据库
CREATE TABLE external_pg AS
SELECT * FROM postgres_scan(
    'postgresql://user:password@localhost:5432/mydb',
    'public',
    'users'
);

-- 连接 MySQL 数据库
CREATE TABLE external_mysql AS
SELECT * FROM mysql_scan(
    'mysql://user:password@localhost/mydb',
    'users'
);

-- 连接 SQLite 数据库
CREATE TABLE external_sqlite AS
SELECT * FROM sqlite_scan('external.db', 'main', 'users');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">云存储集成</h3>

      <CodeBlock
        title="访问云存储文件"
        code={`-- 读取 S3 上的 Parquet 文件
SELECT * FROM read_parquet('s3://my-bucket/data/*.parquet');

-- 读取 Google Cloud Storage
SELECT * FROM read_parquet('gs://my-bucket/data/file.parquet');

-- 读取 Azure Blob Storage
SELECT * FROM read_parquet('azure://container@account.blob.core.windows.net/file.parquet');

-- 配置认证信息
SET s3_access_key_id='your-access-key';
SET s3_secret_access_key='your-secret-key';
SET s3_region='us-west-2';`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">联邦查询</h3>

      <CodeBlock
        title="跨数据库联合查询"
        code={`-- 本地数据与外部数据联合
SELECT
    local_orders.order_id,
    local_orders.customer_id,
    external_customers.customer_name,
    local_orders.order_date,
    external_inventory.stock_quantity
FROM local_orders
JOIN postgres_scan('postgresql://...', 'customers') AS external_customers
    ON local_orders.customer_id = external_customers.id
JOIN mysql_scan('mysql://...', 'inventory') AS external_inventory
    ON local_orders.product_id = external_inventory.product_id
WHERE local_orders.order_date >= '2024-01-01';`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时数据访问</h3>

      <CodeBlock
        title="直接查询外部数据源"
        code={`-- 无需创建表，直接查询
SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM postgres_scan(
    'postgresql://user:pass@host:5432/sales',
    'orders'
)
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY customer_id
ORDER BY total_amount DESC;

-- 混合本地和外部数据
SELECT
    local_summary.*,
    external_details.last_login
FROM (
    SELECT customer_id, SUM(amount) AS total_spent
    FROM local_transactions
    GROUP BY customer_id
) AS local_summary
LEFT JOIN postgres_scan('...', 'customer_details') AS external_details
    ON local_summary.customer_id = external_details.id;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化</h3>

      <CodeBlock
        title="查询下推优化"
        code={`-- 让外部数据源执行过滤和聚合
SELECT
    category,
    SUM(sales_amount) AS total_sales
FROM postgres_scan('postgresql://...', 'sales_data')
WHERE sale_date >= '2024-01-01'
    AND region = 'North America'
GROUP BY category;

-- 使用索引提示（如果外部数据库支持）
SELECT * FROM mysql_scan('mysql://...', 'large_table')
WHERE indexed_column = 'specific_value';`}
        {...noteProps('code5')}
      />

      <CodeBlock
        title="缓存策略"
        code={`-- 启用查询结果缓存
SET enable_external_cache = true;
SET external_cache_threshold = '10MB';

-- 缓存外部查询结果
CREATE TEMP TABLE cached_data AS
SELECT * FROM external_source
WHERE last_updated > CURRENT_TIMESTAMP - INTERVAL '1 hour';

-- 重用缓存数据
SELECT * FROM cached_data
UNION ALL
SELECT * FROM external_source
WHERE last_updated <= CURRENT_TIMESTAMP - INTERVAL '1 hour';`}
        {...noteProps('code6')}
      />

      <InfoBox type="tip" title="外部数据源最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>网络延迟：</strong>考虑网络延迟对查询性能的影响</li>
          <li><strong>认证安全：</strong>使用安全的认证方式，避免明文密码</li>
          <li><strong>连接池：</strong>合理配置连接池参数</li>
          <li><strong>错误处理：</strong>准备好处理外部数据源不可用的情况</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function IncrementalProcessingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">增量数据处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"高效处理持续增长的数据流"</p>

      <Paragraph {...noteProps('p1')}>
        增量处理是指只处理新增或变更的数据，而不是重新处理全部数据。这种方式大大提高了处理效率，特别适用于大数据场景和实时数据管道。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">增量处理的模式</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">📅 时间戳模式</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            使用时间戳字段识别新增和变更的数据
          </p>
          <CodeBlock
            code={`-- 基于时间戳的增量处理
SELECT * FROM events
WHERE created_at > (SELECT MAX(last_processed_at) FROM processing_log)
ORDER BY created_at;`}
            {...noteProps('code1')}
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🔢 版本号模式</h4>
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            使用版本号或序列号跟踪数据变更
          </p>
          <CodeBlock
            code={`-- 基于版本号的增量处理
SELECT * FROM products
WHERE version > (SELECT last_version FROM sync_state)
ORDER BY version;`}
            {...noteProps('code2')}
          />
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3">🏷️ 变更标志模式</h4>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
            使用标志字段标记需要处理的记录
          </p>
          <CodeBlock
            code={`-- 基于标志的增量处理
UPDATE orders SET processed = true
WHERE processed = false;

SELECT * FROM orders
WHERE processed = true;`}
            {...noteProps('code3')}
          />
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3">📋 日志表模式</h4>
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
            通过日志表跟踪所有数据变更
          </p>
          <CodeBlock
            code={`-- 基于变更日志的处理
SELECT * FROM change_log
WHERE change_id > (SELECT last_change_id FROM processing_state)
ORDER BY change_id;`}
            {...noteProps('code4')}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">增量聚合计算</h3>

      <CodeBlock
        title="增量统计计算"
        code={`-- 维护每日统计（增量更新）
INSERT INTO daily_stats (date, total_orders, total_revenue)
SELECT
    CURRENT_DATE,
    COUNT(*),
    SUM(order_amount)
FROM orders
WHERE order_date = CURRENT_DATE
ON CONFLICT (date) DO UPDATE SET
    total_orders = daily_stats.total_orders + EXCLUDED.total_orders,
    total_revenue = daily_stats.total_revenue + EXCLUDED.total_revenue;

-- 增量计算用户行为指标
WITH new_events AS (
    SELECT user_id, event_type, event_time
    FROM user_events
    WHERE event_time > (SELECT last_processed_time FROM processing_state)
),
user_metrics AS (
    SELECT
        user_id,
        COUNT(*) FILTER (WHERE event_type = 'login') AS login_count,
        COUNT(*) FILTER (WHERE event_type = 'purchase') AS purchase_count,
        MAX(event_time) AS last_activity
    FROM new_events
    GROUP BY user_id
)
UPDATE user_summary
SET
    total_logins = total_logins + user_metrics.login_count,
    total_purchases = total_purchases + user_metrics.purchase_count,
    last_activity = GREATEST(last_activity, user_metrics.last_activity)
FROM user_metrics
WHERE user_summary.user_id = user_metrics.user_id;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">水印管理</h3>

      <CodeBlock
        title="增量处理水印管理"
        code={`-- 创建水印表
CREATE TABLE processing_watermarks (
    source_table VARCHAR PRIMARY KEY,
    last_processed_id BIGINT,
    last_processed_timestamp TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 更新水印
UPDATE processing_watermarks
SET
    last_processed_id = (SELECT MAX(id) FROM source_table),
    last_processed_timestamp = CURRENT_TIMESTAMP,
    last_updated = CURRENT_TIMESTAMP
WHERE source_table = 'source_table';

-- 使用水印进行增量查询
SELECT * FROM source_table
WHERE id > (SELECT last_processed_id FROM processing_watermarks
           WHERE source_table = 'source_table');`}
        {...noteProps('code6')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">增量 JOIN 操作</h3>

      <CodeBlock
        title="增量关联查询"
        code={`-- 增量更新用户订单统计
WITH new_orders AS (
    SELECT
        customer_id,
        COUNT(*) AS new_order_count,
        SUM(amount) AS new_order_amount
    FROM orders
    WHERE created_at > (SELECT last_processed_at FROM processing_state)
    GROUP BY customer_id
)
UPDATE customer_stats cs
SET
    total_orders = cs.total_orders + COALESCE(no.new_order_count, 0),
    total_spent = cs.total_spent + COALESCE(no.new_order_amount, 0.0),
    last_order_date = GREATEST(cs.last_order_date,
        (SELECT MAX(created_at) FROM orders
         WHERE customer_id = cs.customer_id
           AND created_at > (SELECT last_processed_at FROM processing_state)))
FROM new_orders no
WHERE cs.customer_id = no.customer_id;`}
        {...noteProps('code7')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">错误处理和重试</h3>

      <CodeBlock
        title="增量处理错误处理"
        code={`-- 记录处理状态和错误
CREATE TABLE processing_log (
    batch_id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    source_table VARCHAR,
    records_processed INTEGER,
    status VARCHAR CHECK (status IN ('processing', 'completed', 'failed')),
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 带重试的增量处理
CREATE OR REPLACE PROCEDURE process_incremental_data()
LANGUAGE SQL
AS $$
    DECLARE
        batch_id UUID := GEN_RANDOM_UUID();
        retry_count INTEGER := 0;
        max_retries INTEGER := 3;
    BEGIN
        -- 记录开始处理
        INSERT INTO processing_log (batch_id, source_table, status)
        VALUES (batch_id, 'user_events', 'processing');

        -- 执行增量处理
        INSERT INTO processed_events
        SELECT * FROM user_events
        WHERE created_at > (SELECT last_processed_at FROM processing_state);

        -- 更新水印
        UPDATE processing_state SET last_processed_at = CURRENT_TIMESTAMP;

        -- 记录成功
        UPDATE processing_log
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE batch_id = batch_id;

    EXCEPTION WHEN OTHERS THEN
        -- 记录错误
        UPDATE processing_log
        SET status = 'failed', error_message = SQLERRM, completed_at = CURRENT_TIMESTAMP
        WHERE batch_id = batch_id;

        -- 可以在这里实现重试逻辑
        RAISE;
    END;
$$;`}
        {...noteProps('code8')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        设计一个增量处理系统，用于实时更新用户行为统计。考虑如何处理数据延迟、重复数据和系统故障恢复。
      </InfoBox>
    </div>
  );
}
export function StreamingProcessingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">流式数据处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"实时处理连续数据流的强大能力"</p>

      <Paragraph {...noteProps('p1')}>
        流式处理允许 DuckDB 处理实时数据流，支持窗口函数、时间序列分析、实时聚合等操作。特别适用于物联网数据、用户行为分析、实时监控等场景。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">流式查询基础</h3>

      <CodeBlock
        title="实时数据流处理"
        code={`-- 模拟实时数据流
CREATE TABLE sensor_readings (
    sensor_id INTEGER,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 实时温度监控
SELECT
    sensor_id,
    AVG(temperature) OVER (
        PARTITION BY sensor_id
        ORDER BY timestamp
        ROWS BETWEEN 10 PRECEDING AND CURRENT ROW
    ) AS rolling_avg_temp,
    MAX(temperature) OVER (
        PARTITION BY sensor_id
        ORDER BY timestamp
        RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
    ) AS max_temp_last_hour
FROM sensor_readings
ORDER BY timestamp DESC;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">时间窗口函数</h3>

      <CodeBlock
        title="滑动窗口分析"
        code={`-- 基于时间的滑动窗口
SELECT
    user_id,
    event_time,
    event_type,
    COUNT(*) OVER (
        PARTITION BY user_id
        ORDER BY event_time
        RANGE BETWEEN INTERVAL '5 minutes' PRECEDING AND CURRENT ROW
    ) AS events_last_5min,

    SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) OVER (
        PARTITION BY user_id
        ORDER BY event_time
        RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
    ) AS clicks_last_hour

FROM user_events
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY event_time DESC;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">跳跃窗口 (Tumbling Windows)</h3>

      <CodeBlock
        title="固定时间窗口聚合"
        code={`-- 每5分钟的汇总统计
SELECT
    TIME_BUCKET(INTERVAL '5 minutes', event_time) AS window_start,
    COUNT(*) AS event_count,
    COUNT(DISTINCT user_id) AS unique_users,
    AVG(session_duration) AS avg_session_duration
FROM user_sessions
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
GROUP BY TIME_BUCKET(INTERVAL '5 minutes', event_time)
ORDER BY window_start DESC;

-- 每小时的销售统计
SELECT
    DATE_TRUNC('hour', order_time) AS hour_bucket,
    SUM(order_amount) AS total_sales,
    COUNT(*) AS order_count,
    AVG(order_amount) AS avg_order_value
FROM orders
WHERE order_time >= CURRENT_DATE
GROUP BY DATE_TRUNC('hour', order_time)
ORDER BY hour_bucket DESC;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时异常检测</h3>

      <CodeBlock
        title="基于统计的异常检测"
        code={`-- 计算移动平均和标准差
WITH rolling_stats AS (
    SELECT
        sensor_id,
        timestamp,
        temperature,
        AVG(temperature) OVER (
            PARTITION BY sensor_id
            ORDER BY timestamp
            ROWS BETWEEN 20 PRECEDING AND CURRENT ROW
        ) AS rolling_avg,

        STDDEV(temperature) OVER (
            PARTITION BY sensor_id
            ORDER BY timestamp
            ROWS BETWEEN 20 PRECEDING AND CURRENT ROW
        ) AS rolling_stddev

    FROM sensor_readings
    WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
)
SELECT
    sensor_id,
    timestamp,
    temperature,
    rolling_avg,
    rolling_stddev,
    CASE
        WHEN ABS(temperature - rolling_avg) > 3 * rolling_stddev THEN '异常'
        WHEN ABS(temperature - rolling_avg) > 2 * rolling_stddev THEN '警告'
        ELSE '正常'
    END AS status,

    (temperature - rolling_avg) / NULLIF(rolling_stddev, 0) AS z_score

FROM rolling_stats
WHERE ABS(temperature - rolling_avg) > 2 * rolling_stddev
ORDER BY timestamp DESC;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">流式 JOIN 操作</h3>

      <CodeBlock
        title="实时数据关联"
        code={`-- 用户行为与用户信息的实时关联
SELECT
    e.user_id,
    u.user_name,
    u.registration_date,
    e.event_type,
    e.event_time,
    e.page_url,

    -- 计算用户活跃度
    COUNT(*) OVER (
        PARTITION BY e.user_id
        ORDER BY e.event_time
        RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
    ) AS events_last_hour,

    -- 计算会话时长
    EXTRACT(EPOCH FROM (
        e.event_time - LAG(e.event_time) OVER (
            PARTITION BY e.user_id, e.session_id
            ORDER BY e.event_time
        )
    )) AS time_since_last_event

FROM user_events e
LEFT JOIN users u ON e.user_id = u.id
WHERE e.event_time >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY e.event_time DESC;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时仪表盘数据</h3>

      <CodeBlock
        title="实时指标计算"
        code={`-- 实时业务指标
SELECT
    'total_users' AS metric,
    COUNT(DISTINCT user_id) AS value,
    CURRENT_TIMESTAMP AS calculated_at

FROM user_events
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'

UNION ALL

SELECT
    'active_sessions' AS metric,
    COUNT(DISTINCT session_id) AS value,
    CURRENT_TIMESTAMP AS calculated_at

FROM user_events
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'

UNION ALL

SELECT
    'conversion_rate' AS metric,
    ROUND(
        100.0 * COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN user_id END) /
        NULLIF(COUNT(DISTINCT user_id), 0),
        2
    ) AS value,
    CURRENT_TIMESTAMP AS calculated_at

FROM user_events
WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '24 hours'

UNION ALL

SELECT
    'avg_session_duration' AS metric,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (max_time - min_time))) / 60,
        2
    ) AS value,
    CURRENT_TIMESTAMP AS calculated_at

FROM (
    SELECT
        session_id,
        MIN(event_time) AS min_time,
        MAX(event_time) AS max_time
    FROM user_events
    WHERE event_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
    GROUP BY session_id
) session_durations;`}
        {...noteProps('code6')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">流式数据缓存策略</h3>

      <CodeBlock
        title="实时数据缓存"
        code={`-- 创建实时数据缓存表
CREATE TABLE realtime_cache (
    cache_key VARCHAR PRIMARY KEY,
    data JSON,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ttl_seconds INTEGER DEFAULT 300
);

-- 更新缓存的函数
CREATE OR REPLACE FUNCTION update_realtime_cache(cache_key_param VARCHAR, new_data JSON)
RETURNS VOID
LANGUAGE SQL
AS $$
    INSERT INTO realtime_cache (cache_key, data)
    VALUES (cache_key_param, new_data)
    ON CONFLICT (cache_key) DO UPDATE SET
        data = EXCLUDED.data,
        last_updated = CURRENT_TIMESTAMP;
$$;

-- 带过期检查的缓存查询
SELECT
    cache_key,
    data,
    CASE
        WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_updated)) > ttl_seconds
        THEN 'expired'
        ELSE 'valid'
    END AS cache_status
FROM realtime_cache
WHERE cache_key IN ('active_users', 'total_sales', 'system_health');`}
        {...noteProps('code7')}
      />

      <InfoBox type="tip" title="流式处理最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>合理设计窗口：</strong>根据业务需求选择合适的窗口大小和类型</li>
          <li><strong>性能优化：</strong>使用适当的索引和分区策略</li>
          <li><strong>内存管理：</strong>监控内存使用，避免内存溢出</li>
          <li><strong>容错处理：</strong>实现数据丢失和重复处理的处理机制</li>
          <li><strong>监控告警：</strong>设置关键指标的监控和告警机制</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function DeltaLakeSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Delta Lake 集成</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"湖仓一体架构的数据管理标准"</p>

      <Paragraph {...noteProps('p1')}>
        Delta Lake 是一个开源存储层，为大数据分析提供 ACID 事务、时间旅行、模式执行等功能。DuckDB 可以直接读取和写入 Delta Lake 表，实现与现代数据湖的完美集成。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Delta Lake 基础概念</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔄 ACID 事务</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            提供原子性、一致性、隔离性和持久性保证
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">⏰ 时间旅行</h4>
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            可以查询历史版本的数据，支持数据回滚
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3">📋 模式执行</h4>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
            自动防止数据质量问题和架构偏差
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3">🔍 统一批流</h4>
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
            支持批量和流式数据处理
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">读取 Delta Lake 表</h3>

      <CodeBlock
        title="基本 Delta Lake 读取"
        code={`-- 读取 Delta Lake 表
SELECT * FROM delta_scan('s3://my-bucket/delta-table/');

-- 指定版本号读取
SELECT * FROM delta_scan('s3://my-bucket/delta-table/', 5);

-- 读取指定时间点的数据
SELECT * FROM delta_scan(
    's3://my-bucket/delta-table/',
    TIMESTAMP '2024-01-15 10:30:00'
);

-- 读取 Delta Lake 表的文件列表
SELECT * FROM delta_file_scan('s3://my-bucket/delta-table/');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">时间旅行查询</h3>

      <CodeBlock
        title="历史数据查询"
        code={`-- 查询特定版本
SELECT
    customer_id,
    order_amount,
    order_date
FROM delta_scan('s3://data-lake/orders/', 10)  -- 版本 10
WHERE order_date >= '2024-01-01';

-- 查询历史时间点
SELECT
    product_id,
    price,
    last_updated
FROM delta_scan(
    's3://data-lake/products/',
    TIMESTAMP '2024-01-15 09:00:00'  -- 特定时间点
)
WHERE category = 'electronics';

-- 比较不同版本的数据
WITH current_data AS (
    SELECT product_id, price FROM delta_scan('s3://data-lake/products/')
),
historical_data AS (
    SELECT product_id, price FROM delta_scan('s3://data-lake/products/', 5)
)
SELECT
    c.product_id,
    c.price AS current_price,
    h.price AS historical_price,
    ROUND(((c.price - h.price) / h.price) * 100, 2) AS price_change_pct
FROM current_data c
JOIN historical_data h ON c.product_id = h.product_id;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">写入 Delta Lake 表</h3>

      <CodeBlock
        title="创建和写入 Delta Lake 表"
        code={`-- 创建新的 Delta Lake 表
CREATE TABLE delta_table AS
SELECT * FROM delta_scan('s3://my-bucket/existing-delta-table/');

-- 插入数据到 Delta Lake 表
INSERT INTO delta_scan('s3://my-bucket/delta-table/')
SELECT
    customer_id,
    order_id,
    order_amount,
    CURRENT_TIMESTAMP AS processed_at
FROM new_orders;

-- 从 Delta Lake 表复制数据
COPY (
    SELECT * FROM delta_scan('s3://source-bucket/table/')
    WHERE created_date >= '2024-01-01'
) TO delta_scan('s3://target-bucket/table/');`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Delta Lake 元数据查询</h3>

      <CodeBlock
        title="查询表历史和元数据"
        code={`-- 查看 Delta Lake 表的历史版本
SELECT * FROM delta_log('s3://my-bucket/delta-table/');

-- 查询表的模式信息
DESCRIBE delta_scan('s3://my-bucket/delta-table/');

-- 查看分区信息
SELECT
    partition_key,
    partition_value,
    file_count,
    total_size_bytes
FROM delta_partitions('s3://my-bucket/delta-table/');

-- 查询表的统计信息
SELECT
    column_name,
    data_type,
    nullable,
    min_value,
    max_value,
    null_count,
    distinct_count
FROM delta_column_stats('s3://my-bucket/delta-table/');`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级查询和分析</h3>

      <CodeBlock
        title="Delta Lake 数据质量检查"
        code={`-- 检查数据一致性
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT id) AS unique_ids,
    SUM(CASE WHEN amount < 0 THEN 1 ELSE 0 END) AS negative_amounts,
    SUM(CASE WHEN created_date > CURRENT_DATE THEN 1 ELSE 0 END) AS future_dates
FROM delta_scan('s3://data-lake/transactions/');

-- 增量数据验证
WITH current_data AS (
    SELECT * FROM delta_scan('s3://data-lake/sales/')
),
previous_version AS (
    SELECT * FROM delta_scan('s3://data-lake/sales/', 9)
)
SELECT
    '新增记录' AS check_type,
    COUNT(*) AS count
FROM current_data c
LEFT JOIN previous_version p ON c.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT
    '修改记录' AS check_type,
    COUNT(*) AS count
FROM current_data c
JOIN previous_version p ON c.id = p.id
WHERE c.updated_at > p.updated_at;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化</h3>

      <CodeBlock
        title="Delta Lake 查询优化"
        code={`-- 使用分区剪裁
SELECT
    customer_id,
    SUM(amount) AS total_amount
FROM delta_scan('s3://data-lake/orders/')
WHERE order_date >= '2024-01-01'
  AND order_date < '2024-02-01'  -- 分区剪裁
  AND customer_region = 'North America'  -- 文件剪裁
GROUP BY customer_id;

-- Z-ORDER 优化后的查询
SELECT * FROM delta_scan('s3://data-lake/events/')
WHERE
    event_type = 'purchase'
    AND user_id BETWEEN 1000 AND 2000
    AND event_time >= '2024-01-15 00:00:00'
    AND event_time < '2024-01-16 00:00:00';

-- 查询数据文件统计
SELECT
    file_path,
    record_count,
    file_size_bytes,
    modification_time
FROM delta_file_stats('s3://data-lake/table/')
ORDER BY modification_time DESC;`}
        {...noteProps('code6')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        创建一个 Delta Lake 表，模拟电商订单数据，练习时间旅行查询和数据质量检查操作。
      </InfoBox>

      <InfoBox type="tip" title="Delta Lake 集成最佳实践" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>版本控制：</strong>定期创建表快照，支持数据回滚</li>
          <li><strong>分区策略：</strong>按时间或业务维度合理分区</li>
          <li><strong>模式演进：</strong>使用 Delta Lake 的模式演进功能安全地修改表结构</li>
          <li><strong>性能监控：</strong>监控查询性能和存储成本</li>
          <li><strong>备份策略：</strong>定期备份重要的 Delta Lake 表</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function MaterializedViewsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">物化视图</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"预计算结果，提升查询性能"</p>

      <Paragraph {...noteProps('p1')}>
        物化视图（Materialized View）存储查询的结果集，可以显著提升复杂查询的性能。特别适用于需要频繁执行的聚合查询、连接查询等高开销操作。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">物化视图基础</h3>

      <CodeBlock
        title="创建物化视图"
        code={`-- 创建基本的物化视图
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
    DATE_TRUNC('month', order_date) AS month,
    product_category,
    SUM(order_amount) AS total_sales,
    COUNT(*) AS order_count,
    AVG(order_amount) AS avg_order_value
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE order_date >= '2024-01-01'
GROUP BY DATE_TRUNC('month', order_date), product_category;

-- 查询物化视图（速度很快）
SELECT * FROM monthly_sales
WHERE month = '2024-01-01'
ORDER BY total_sales DESC;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">物化视图刷新</h3>

      <CodeBlock
        title="手动刷新物化视图"
        code={`-- 完全刷新物化视图
REFRESH MATERIALIZED VIEW monthly_sales;

-- 增量刷新（如果支持）
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;

-- 检查物化视图的状态
SELECT
    schemaname,
    tablename,
    ispopulated,
    last_refresh
FROM pg_matviews
WHERE tablename = 'monthly_sales';`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级物化视图</h3>

      <CodeBlock
        title="带索引的物化视图"
        code={`-- 创建带有索引的物化视图
CREATE MATERIALIZED VIEW user_behavior_summary AS
SELECT
    user_id,
    COUNT(*) AS total_actions,
    COUNT(DISTINCT session_id) AS total_sessions,
    MAX(last_action_time) AS last_activity,
    AVG(session_duration) AS avg_session_duration
FROM user_actions
WHERE action_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id;

-- 为物化视图创建索引
CREATE INDEX idx_user_behavior_user_id ON user_behavior_summary(user_id);
CREATE INDEX idx_user_behavior_last_activity ON user_behavior_summary(last_activity);

-- 高效查询
SELECT * FROM user_behavior_summary
WHERE user_id = 12345 AND last_activity > CURRENT_DATE - INTERVAL '7 days';`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">物化视图 vs 普通视图</h3>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">特性</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">普通视图</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">物化视图</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">存储</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">不存储数据</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">存储计算结果</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">性能</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">每次查询都计算</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">预计算，直接查询</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">数据新鲜度</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">始终最新</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">需要手动刷新</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">磁盘空间</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">几乎不占用</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">根据数据大小占用</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">物化视图维护</h3>

      <CodeBlock
        title="物化视图的增量维护"
        code={`-- 创建支持增量更新的物化视图
CREATE MATERIALIZED VIEW daily_user_stats WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', created_at) AS day,
    user_id,
    COUNT(*) AS daily_actions,
    SUM(amount) AS daily_amount
FROM user_transactions
GROUP BY time_bucket('1 day', created_at), user_id
WITH NO DATA;

-- 设置自动刷新策略
SELECT add_continuous_aggregate_policy('daily_user_stats',
    start_offset => INTERVAL '30 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

-- 手动刷新特定时间范围
CALL refresh_continuous_aggregate('daily_user_stats',
    '2024-01-01 00:00:00', '2024-01-02 00:00:00');`}
        {...noteProps('code4')}
      />

      <CodeBlock
        title="物化视图的清理和重建"
        code={`-- 重命名物化视图（用于重建）
ALTER MATERIALIZED VIEW old_sales_summary RENAME TO old_sales_summary_backup;

-- 创建新的物化视图
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
    DATE_TRUNC('month', order_date) AS month,
    region,
    SUM(amount) AS total_amount,
    COUNT(*) AS order_count
FROM orders
WHERE order_date >= '2023-01-01'
GROUP BY DATE_TRUNC('month', order_date), region;

-- 删除旧的物化视图
DROP MATERIALIZED VIEW old_sales_summary_backup;

-- 检查物化视图依赖
SELECT
    dependent_ns.nspname AS dependent_schema,
    dependent_view.relname AS dependent_view,
    source_ns.nspname AS source_schema,
    source_table.relname AS source_table
FROM pg_depend
JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
JOIN pg_class AS dependent_view ON pg_rewrite.ev_class = dependent_view.oid
JOIN pg_class AS source_table ON pg_depend.refobjid = source_table.oid
JOIN pg_namespace AS dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
JOIN pg_namespace AS source_ns ON source_table.relnamespace = source_ns.oid
WHERE source_table.relname = 'sales_summary';`}
        {...noteProps('code5')}
      />

      <InfoBox type="tip" title="物化视图使用建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>适用场景：</strong>复杂聚合查询、频繁访问的统计数据</li>
          <li><strong>刷新策略：</strong>根据数据更新频率选择合适的刷新间隔</li>
          <li><strong>索引优化：</strong>为常用查询条件创建索引</li>
          <li><strong>监控维护：</strong>定期检查物化视图的大小和性能</li>
          <li><strong>依赖管理：</strong>注意物化视图对基表的依赖关系</li>
        </ul>
      </InfoBox>
    </div>
  );
}
export function DynamicViewsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">动态视图</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"基于参数的灵活数据访问"</p>

      <Paragraph {...noteProps('p1')}>
        动态视图允许根据输入参数动态生成不同的查询结果，提供更灵活的数据访问方式。特别适用于多租户应用、动态报表生成、参数化查询等场景。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">动态视图基础</h3>

      <CodeBlock
        title="创建动态视图函数"
        code={`-- 创建返回动态结果的函数
CREATE OR REPLACE FUNCTION get_user_orders_dynamic(
    user_id_param INTEGER DEFAULT NULL,
    status_filter VARCHAR DEFAULT NULL,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    order_id INTEGER,
    user_id INTEGER,
    order_date DATE,
    status VARCHAR,
    total_amount DECIMAL(10,2)
)
LANGUAGE SQL
AS $$
    SELECT
        o.id,
        o.user_id,
        o.order_date,
        o.status,
        o.total_amount
    FROM orders o
    WHERE (user_id_param IS NULL OR o.user_id = user_id_param)
      AND (status_filter IS NULL OR o.status = status_filter)
      AND o.order_date BETWEEN COALESCE(date_from, '2000-01-01') AND date_to
    ORDER BY o.order_date DESC;
$$;

-- 使用动态视图函数
SELECT * FROM get_user_orders_dynamic(123, 'completed');
SELECT * FROM get_user_orders_dynamic(NULL, NULL, '2024-01-01', '2024-01-31');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级动态查询</h3>

      <CodeBlock
        title="动态列选择和排序"
        code={`-- 动态列选择的函数
CREATE OR REPLACE FUNCTION dynamic_column_select(
    table_name VARCHAR,
    column_list VARCHAR,
    where_clause VARCHAR DEFAULT '1=1',
    order_by VARCHAR DEFAULT NULL,
    limit_count INTEGER DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    sql_query TEXT;
BEGIN
    sql_query := format(
        'SELECT %s FROM %I WHERE %s',
        column_list,
        table_name,
        where_clause
    );

    IF order_by IS NOT NULL THEN
        sql_query := sql_query || ' ORDER BY ' || order_by;
    END IF;

    IF limit_count IS NOT NULL THEN
        sql_query := sql_query || ' LIMIT ' || limit_count;
    END IF;

    RETURN sql_query;
END;
$$;

-- 生成动态SQL
SELECT dynamic_column_select(
    'products',
    'id, name, price, category',
    'category = ''electronics'' AND price > 100',
    'price DESC',
    10
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">多租户动态视图</h3>

      <CodeBlock
        title="租户隔离的动态数据访问"
        code={`-- 创建租户数据访问函数
CREATE OR REPLACE FUNCTION get_tenant_data(
    tenant_id INTEGER,
    table_name VARCHAR,
    filters JSON DEFAULT NULL
)
RETURNS TABLE (data JSON)
LANGUAGE plpgsql
AS $$
DECLARE
    sql_query TEXT;
    where_clause TEXT := 'tenant_id = ' || tenant_id;
BEGIN
    -- 构建WHERE子句
    IF filters IS NOT NULL THEN
        -- 解析JSON过滤器并添加到WHERE子句
        -- 这里可以扩展为更复杂的过滤逻辑
        where_clause := where_clause || ' AND ' ||
            json_build_object(filters->>'column', filters->>'value')::TEXT;
    END IF;

    sql_query := format(
        'SELECT row_to_json(t) FROM %I t WHERE %s',
        table_name,
        where_clause
    );

    RETURN QUERY EXECUTE sql_query;
END;
$$;

-- 多租户数据查询
SELECT * FROM get_tenant_data(1, 'orders');
SELECT * FROM get_tenant_data(2, 'products', '{"column": "category", "value": "electronics"}'::JSON);`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">动态报表生成</h3>

      <CodeBlock
        title="灵活的报表生成器"
        code={`-- 动态聚合报表函数
CREATE OR REPLACE FUNCTION generate_report(
    report_type VARCHAR,
    group_by_columns VARCHAR,
    aggregate_columns VARCHAR,
    filters VARCHAR DEFAULT '1=1',
    date_range daterange DEFAULT NULL
)
RETURNS TABLE (report_data JSON)
LANGUAGE plpgsql
AS $$
DECLARE
    sql_query TEXT;
    date_filter TEXT := '';
BEGIN
    -- 处理日期范围过滤
    IF date_range IS NOT NULL THEN
        date_filter := format(' AND created_at <@ ''%s''', date_range);
    END IF;

    -- 根据报表类型构建不同的查询
    CASE report_type
        WHEN 'sales_summary' THEN
            sql_query := format(
                'SELECT json_build_object(''group'', %s, ''metrics'', json_build_object(%s)) FROM sales WHERE %s %s GROUP BY %s',
                group_by_columns,
                aggregate_columns,
                filters,
                date_filter,
                group_by_columns
            );
        WHEN 'user_analytics' THEN
            sql_query := format(
                'SELECT json_build_object(''user_segment'', %s, ''stats'', json_build_object(%s)) FROM user_events WHERE %s %s GROUP BY %s',
                group_by_columns,
                aggregate_columns,
                filters,
                date_filter,
                group_by_columns
            );
        ELSE
            RAISE EXCEPTION 'Unknown report type: %', report_type;
    END CASE;

    RETURN QUERY EXECUTE sql_query;
END;
$$;

-- 生成销售报表
SELECT * FROM generate_report(
    'sales_summary',
    'region, product_category',
    '''total_sales'', SUM(amount), ''order_count'', COUNT(*)',
    'status = ''completed''',
    '[2024-01-01, 2024-01-31]'
);`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">动态视图的安全考虑</h3>

      <CodeBlock
        title="安全的动态查询构建"
        code={`-- 白名单验证的动态查询
CREATE OR REPLACE FUNCTION safe_dynamic_query(
    allowed_tables VARCHAR[],
    table_name VARCHAR,
    columns VARCHAR,
    where_clause VARCHAR DEFAULT '1=1'
)
RETURNS TABLE (result JSON)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sql_query TEXT;
BEGIN
    -- 验证表名是否在允许列表中
    IF NOT (table_name = ANY(allowed_tables)) THEN
        RAISE EXCEPTION 'Access denied to table: %', table_name;
    END IF;

    -- 验证列名安全性（简化示例）
    IF columns !~ '^[a-zA-Z_, ]+$' THEN
        RAISE EXCEPTION 'Invalid column specification';
    END IF;

    -- 构建安全的查询
    sql_query := format(
        'SELECT row_to_json(t) FROM (SELECT %s FROM %I WHERE %s) t',
        columns,
        table_name,
        where_clause
    );

    RETURN QUERY EXECUTE sql_query;
END;
$$;

-- 安全的动态查询使用
SELECT * FROM safe_dynamic_query(
    ARRAY['users', 'orders', 'products'],
    'users',
    'id, name, email',
    'created_at > CURRENT_DATE - INTERVAL ''30 days'''
);`}
        {...noteProps('code5')}
      />

      <InfoBox type="warning" title="动态视图安全注意事项" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>SQL注入防护：</strong>使用参数化查询，避免字符串拼接</li>
          <li><strong>权限控制：</strong>验证用户对数据的访问权限</li>
          <li><strong>资源限制：</strong>限制查询的复杂度、返回行数和执行时间</li>
          <li><strong>审计日志：</strong>记录所有动态查询的执行情况</li>
        </ul>
      </InfoBox>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        创建一个动态报表生成器，支持用户自定义的列选择、分组条件和过滤器。
      </InfoBox>
    </div>
  );
}
export function UserPermissionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">用户与权限管理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"精细化的访问控制体系"</p>

      <Paragraph {...noteProps('p1')}>
        用户权限管理是数据库安全的核心。通过角色、权限的合理分配，确保用户只能访问其职责范围内的数据和功能。
      </Paragraph>

      <CodeBlock
        title="创建用户和角色"
        code={`-- 创建角色
CREATE ROLE analyst;
CREATE ROLE developer;
CREATE ROLE admin SUPERUSER;

-- 创建用户并分配角色
CREATE USER john_doe WITH PASSWORD 'secure_password';
CREATE USER jane_smith WITH PASSWORD 'another_password';

-- 将用户分配给角色
GRANT analyst TO john_doe;
GRANT developer TO jane_smith;

-- 创建层级角色
CREATE ROLE employee;
CREATE ROLE manager INHERIT employee;
CREATE ROLE director INHERIT manager;

GRANT employee TO analyst;
GRANT manager TO developer;`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="权限管理"
        code={`-- 表级权限
GRANT SELECT ON sales_data TO analyst;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO developer;
GRANT ALL PRIVILEGES ON audit_logs TO admin;

-- 列级权限
GRANT SELECT (user_id, name, email) ON users TO analyst;
GRANT UPDATE (status, last_login) ON users TO developer;

-- 函数权限
GRANT EXECUTE ON FUNCTION calculate_revenue TO analyst;

-- 撤销权限
REVOKE SELECT ON sensitive_data FROM analyst;

-- 查看权限
SELECT * FROM information_schema.role_table_grants
WHERE grantee = 'analyst';`}
        {...noteProps('code2')}
      />

      <InfoBox type="tip" title="权限管理最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>最小权限原则：</strong>只授予必需的权限</li>
          <li><strong>角色分离：</strong>不同职责使用不同角色</li>
          <li><strong>定期审计：</strong>定期检查和清理权限</li>
          <li><strong>权限继承：</strong>合理使用角色继承简化管理</li>
        </ul>
      </InfoBox>
    </div>
  );
}

export function EncryptionMaskingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据加密与脱敏</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"保护数据隐私的安全措施"</p>

      <Paragraph {...noteProps('p1')}>
        数据加密和脱敏是保护敏感信息的关键技术。加密确保数据在存储和传输过程中的安全，脱敏则在数据使用时隐藏敏感信息。
      </Paragraph>

      <CodeBlock
        title="数据加密"
        code={`-- AES 加密存储
CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    encrypted_ssn VARCHAR(255),
    encrypted_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入加密数据
INSERT INTO user_data (encrypted_ssn, encrypted_email)
SELECT
    ENCRYPT('123-45-6789', 'my_secret_key', 'aes'),
    ENCRYPT('user@example.com', 'my_secret_key', 'aes');

-- 解密查询
SELECT
    id,
    DECRYPT(encrypted_ssn, 'my_secret_key', 'aes') AS ssn,
    DECRYPT(encrypted_email, 'my_secret_key', 'aes') AS email
FROM user_data;`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="数据脱敏函数"
        code={`-- 创建脱敏视图
CREATE VIEW masked_user_data AS
SELECT
    id,
    -- 姓名脱敏：只显示首字母
    CONCAT(LEFT(name, 1), REPEAT('*', LENGTH(name) - 1)) AS masked_name,

    -- 手机号脱敏：中间四位隐藏
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS masked_phone,

    -- 身份证号脱敏：只显示前六位和后四位
    CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4)) AS masked_id_card,

    -- 邮箱脱敏：@前只显示前三位
    REGEXP_REPLACE(email, '^(.{3})(.*)(@.*)$', '\\1***\\3') AS masked_email,

    city,
    age_group  -- 年龄分组，不显示具体年龄
FROM user_sensitive_data;

-- 查询脱敏数据
SELECT * FROM masked_user_data WHERE city = '北京';`}
        {...noteProps('code2')}
      />
    </div>
  );
}

export function AuditLogsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">审计日志</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"追踪数据变更的完整记录"</p>

      <Paragraph {...noteProps('p1')}>
        审计日志记录数据库的所有重要操作，用于安全审计、问题排查、合规要求等场景。
      </Paragraph>

      <CodeBlock
        title="审计日志表设计"
        code={`-- 创建审计日志表
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    operation VARCHAR(10),  -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    user_name VARCHAR(100),
    ip_address INET,
    session_id VARCHAR(100),
    transaction_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为审计日志创建索引
CREATE INDEX idx_audit_table_operation ON audit_log(table_name, operation);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_user ON audit_log(user_id);`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="自动审计触发器"
        code={`-- 创建审计函数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_row JSONB;
    new_row JSONB;
    operation_type VARCHAR(10);
BEGIN
    -- 获取操作类型
    IF TG_OP = 'INSERT' THEN
        operation_type := 'INSERT';
        old_row := NULL;
        new_row := row_to_json(NEW)::JSONB;
    ELSIF TG_OP = 'UPDATE' THEN
        operation_type := 'UPDATE';
        old_row := row_to_json(OLD)::JSONB;
        new_row := row_to_json(NEW)::JSONB;
    ELSIF TG_OP = 'DELETE' THEN
        operation_type := 'DELETE';
        old_row := row_to_json(OLD)::JSONB;
        new_row := NULL;
    END IF;

    -- 插入审计记录
    INSERT INTO audit_log (
        table_name, operation, old_values, new_values,
        user_id, user_name, ip_address, session_id, transaction_id
    ) VALUES (
        TG_TABLE_NAME,
        operation_type,
        old_row,
        new_row,
        current_setting('app.user_id', true)::INTEGER,
        current_setting('app.user_name', true),
        inet_client_addr(),
        current_setting('app.session_id', true),
        txid_current()::VARCHAR
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 为表创建审计触发器
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();`}
        {...noteProps('code2')}
      />
    </div>
  );
}

export function RowLevelSecuritySection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">行级安全</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"基于行的细粒度访问控制"</p>

      <Paragraph {...noteProps('p1')}>
        行级安全（Row Level Security, RLS）允许基于行的内容控制访问权限，实现更精细的数据隔离。
      </Paragraph>

      <CodeBlock
        title="启用行级安全"
        code={`-- 为表启用行级安全
ALTER TABLE employee_data ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY employee_own_data ON employee_data
    FOR ALL
    USING (user_id = current_user_id());

CREATE POLICY manager_view_department ON employee_data
    FOR SELECT
    USING (
        department_id IN (
            SELECT department_id FROM user_permissions
            WHERE user_id = current_user_id()
            AND permission_level = 'manager'
        )
    );

-- 查看策略
SELECT * FROM pg_policies WHERE tablename = 'employee_data';`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="多租户行级安全"
        code={`-- 租户隔离策略
CREATE POLICY tenant_isolation ON tenant_data
    FOR ALL
    USING (tenant_id = current_tenant_id());

-- 基于角色的访问控制
CREATE POLICY role_based_access ON sensitive_data
    FOR ALL
    USING (
        CASE
            WHEN current_user_role() = 'admin' THEN true
            WHEN current_user_role() = 'user' THEN owner_id = current_user_id()
            ELSE false
        END
    );`}
        {...noteProps('code2')}
      />
    </div>
  );
}

export function ColumnLevelSecuritySection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">列级安全</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"基于列的精确访问控制"</p>

      <Paragraph {...noteProps('p1')}>
        列级安全允许对表的特定列设置不同的访问权限，实现更精细的数据保护。
      </Paragraph>

      <CodeBlock
        title="列级权限控制"
        code={`-- 创建视图限制列访问
CREATE VIEW user_public_data AS
SELECT
    id,
    username,
    email,
    created_at
FROM users;

CREATE VIEW user_private_data AS
SELECT
    id,
    username,
    email,
    phone,
    ssn,
    salary,
    created_at
FROM users;

-- 授予不同权限
GRANT SELECT ON user_public_data TO public_users;
GRANT SELECT ON user_private_data TO privileged_users;

-- 列级GRANT
GRANT SELECT (id, name, department) ON employees TO junior_analyst;
GRANT SELECT ON employees TO senior_analyst;`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="动态列 masking"
        code={`-- 创建列级掩码函数
CREATE OR REPLACE FUNCTION mask_sensitive_data(
    sensitive_value TEXT,
    user_role VARCHAR
)
RETURNS TEXT AS $$
BEGIN
    CASE user_role
        WHEN 'admin' THEN RETURN sensitive_value;
        WHEN 'manager' THEN RETURN '***MASKED***';
        ELSE RETURN NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 使用掩码的视图
CREATE VIEW masked_employee_data AS
SELECT
    id,
    name,
    department,
    mask_sensitive_data(salary::TEXT, current_user_role()) AS salary,
    mask_sensitive_data(ssn, current_user_role()) AS ssn
FROM employees;

-- 查询时自动应用掩码
SELECT * FROM masked_employee_data;`}
        {...noteProps('code2')}
      />
    </div>
  );
}