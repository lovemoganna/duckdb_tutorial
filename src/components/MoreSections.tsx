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
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"在文本中寻找针尖"</p>

      <Paragraph {...noteProps('p1')}>
        全文搜索（Full-Text Search）允许在大量文本数据中进行高效的关键词搜索，支持模糊匹配、相关性排序和复杂查询。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本用法</h3>

      <CodeBlock
        title="全文搜索语法"
        code={`-- 基本全文搜索
SELECT * FROM articles
WHERE title MATCH 'machine learning';

-- 使用 CONTAINS 函数
SELECT * FROM documents
WHERE CONTAINS(content, 'database');

-- 多个关键词搜索
SELECT * FROM posts
WHERE title MATCH 'SQL OR database OR query';

-- 短语搜索
SELECT * FROM books
WHERE description MATCH '"machine learning"';`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级搜索特性</h3>

      <CodeBlock
        title="搜索操作符"
        code={`-- AND 操作（默认）
SELECT * FROM articles WHERE content MATCH 'SQL database';

-- OR 操作
SELECT * FROM articles WHERE content MATCH 'SQL OR database';

-- NOT 操作
SELECT * FROM articles WHERE content MATCH 'SQL -tutorial';

-- 短语搜索（连续的词）
SELECT * FROM articles WHERE content MATCH '"machine learning"';

-- 通配符搜索
SELECT * FROM articles WHERE content MATCH 'databas*';

-- 邻近搜索（词语相邻）
SELECT * FROM articles WHERE content MATCH '"SQL database"~5';`}
        {...noteProps('code2')}
      />

      <CodeBlock
        title="相关性排序"
        code={`-- 按相关性排序
SELECT title, content,
       MATCH_RELEVANCE(content, 'SQL database') AS relevance_score
FROM articles
WHERE content MATCH 'SQL database'
ORDER BY relevance_score DESC;

-- 带权重的搜索
SELECT title,
       (MATCH_RELEVANCE(title, 'SQL') * 2 +
        MATCH_RELEVANCE(content, 'SQL')) / 3 AS weighted_score
FROM articles
WHERE title MATCH 'SQL' OR content MATCH 'SQL'
ORDER BY weighted_score DESC;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">索引优化</h3>

      <CodeBlock
        title="创建全文索引"
        code={`-- 创建全文索引
CREATE INDEX idx_articles_content ON articles
USING FTS(content);

-- 为多个列创建联合全文索引
CREATE INDEX idx_articles_fulltext ON articles
USING FTS(title, content, tags);

-- 查看索引使用情况
EXPLAIN QUERY PLAN
SELECT * FROM articles
WHERE content MATCH 'database';`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分词和词干提取</h3>

      <CodeBlock
        title="文本处理函数"
        code={`-- 基本分词
SELECT UNNEST(STRING_SPLIT(content, ' ')) AS words
FROM articles
WHERE id = 1;

-- 词干提取（stemming）
SELECT word, STEM(word) AS stem
FROM (SELECT UNNEST(STRING_SPLIT(content, ' ')) AS word
      FROM articles WHERE id = 1);

-- 停用词过滤
SELECT word
FROM (SELECT UNNEST(STRING_SPLIT(content, ' ')) AS word
      FROM articles WHERE id = 1)
WHERE word NOT IN ('the', 'a', 'an', 'and', 'or', 'but', 'is', 'are');`}
        {...noteProps('code5')}
      />

      <InfoBox type="experiment" title="性能优化建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>为经常搜索的列创建 FTS 索引</li>
          <li>使用相关性评分进行结果排序</li>
          <li>考虑分词和词干提取提高搜索质量</li>
          <li>定期重建索引以保持搜索性能</li>
        </ul>
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
        近似计算在大数据处理中非常重要。通过牺牲少量准确性来换取大幅的性能提升，适用于对精确结果要求不高的场景，如实时分析、趋势预测等。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">近似聚合函数</h3>

      <SQLExplainer
        sql={`-- 近似计数（HyperLogLog算法）
SELECT APPROX_COUNT_DISTINCT(user_id) AS approx_unique_users
FROM events;

-- 近似分位数
SELECT
    APPROXIMATE_PERCENTILE(salary, 0.5) AS median_salary,
    APPROXIMATE_PERCENTILE(salary, 0.9) AS p90_salary,
    APPROXIMATE_PERCENTILE(salary, 0.95) AS p95_salary
FROM employees;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 实现一个基于采样的实时UV统计系统</p>
          <p><strong>挑战 2：</strong> 创建近似分位数计算器，比较精确与近似结果的差异</p>
          <p><strong>挑战 3：</strong> 构建一个自适应的近似计算系统，根据查询响应时间动态调整精度</p>
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
        现代数据处理经常需要处理复杂的嵌套结构。DuckDB 支持数组（ARRAY）和结构体（STRUCT）数据类型。
      </Paragraph>

      <CodeBlock
        title="数组操作"
        code={`SELECT [1, 2, 3] AS numbers;
SELECT array_length([1, 2, 3]) AS len;
SELECT list_extract([1, 2, 3], 1) AS first;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计一个完整的电商产品表，包含标签、规格等数组字段</p>
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
        NULL 值代表缺失或未知的数据。在 SQL 中，NULL 的处理需要特别小心，因为它引入了三值逻辑。
      </Paragraph>

      <CodeBlock
        title="NULL 处理函数"
        code={`SELECT COALESCE(description, '暂无描述') AS safe_description;
SELECT NULLIF(price, 0) AS price_no_zero;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计一个完整的NULL值处理策略</p>
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
        地理空间数据无处不在：GPS定位、地图服务、地理围栏、路径规划等。DuckDB 支持丰富的地理空间函数。
      </Paragraph>

      <CodeBlock
        title="距离计算"
          code={`SELECT ST_Distance(point1, point2) AS distance;`}
        />

        <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 构建一个完整的地理位置搜索系统</p>
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