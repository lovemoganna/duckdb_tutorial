import { CodeBlock } from './CodeBlock';
import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLExplainer } from './SQLExplainer';
import { SQLFlowDiagram } from './SQLFlowDiagram';
import { DataFlowAnimation } from './DataFlowAnimation';
import type { Note } from '../types';

interface SectionProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => Note[];
}

// ============================================
// 递归查询章节
// ============================================

export function RecursiveSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">递归查询</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"处理层级数据的利器"</p>

      <Paragraph {...noteProps('p1')}>
        递归查询是 SQL 中最强大的特性之一，用于处理树形结构、层级关系、路径查找等问题。DuckDB 支持标准的 WITH RECURSIVE 语法，让复杂的数据遍历变得简单。
      </Paragraph>

      <SQLFlowDiagram type="recursive" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归 CTE 语法</h3>

      <SQLExplainer
        sql={`WITH RECURSIVE recursive_cte AS (
    -- 基础情况：起始节点
    SELECT column1, column2, ...
    FROM table_name
    WHERE base_condition

    UNION ALL

    -- 递归情况：引用自身
    SELECT r.column1, t.column2, ...
    FROM table_name t
    JOIN recursive_cte r ON t.parent_id = r.id
    WHERE recursive_condition
)
SELECT * FROM recursive_cte;`}
        explanations={[
          { code: 'WITH RECURSIVE recursive_cte AS', explanation: '定义递归公共表表达式，RECURSIVE 关键字是必需的', tip: 'CTE 名称在递归查询中引用自身' },
          { code: '基础情况', explanation: '递归的起点，通常是根节点或起始条件', tip: '必须确保不会无限递归' },
          { code: 'UNION ALL', explanation: '连接基础情况和递归情况，使用 UNION ALL 避免去重', tip: 'UNION 会消除重复，影响递归结果' },
          { code: '递归情况', explanation: '引用 CTE 自身，通过 JOIN 连接父子关系', tip: '每次迭代都会增加一级深度' },
          { code: 'WHERE recursive_condition', explanation: '控制递归深度，防止无限循环', tip: '通常检查层级深度或是否达到目标' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">本体论层级查询</h3>

      <CodeBlock
        title="查询完整概念层级"
        code={`-- 从任意概念追溯到根节点
WITH RECURSIVE ancestor_path AS (
    -- 基础情况：起始节点
    SELECT id, name, parent_id, name AS path, 0 AS level
    FROM concepts
    WHERE name = 'Dog'

    UNION ALL

    -- 递归情况：向上追溯
    SELECT c.id, c.name, c.parent_id,
           c.name || ' → ' || ap.path,
           ap.level + 1
    FROM concepts c
    JOIN ancestor_path ap ON c.id = ap.parent_id
)
SELECT path AS 完整路径, level AS 层级
FROM ancestor_path
ORDER BY level DESC
LIMIT 1;

-- 结果：Entity → Living Thing → Animal → Mammal → Dog`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="查询所有子孙节点"
        code={`-- 查询某个概念的所有子孙
WITH RECURSIVE descendants AS (
    -- 基础情况：起始概念
    SELECT id, name, parent_id, 0 AS level
    FROM concepts
    WHERE name = 'Animal'

    UNION ALL

    -- 递归情况：向下查找
    SELECT c.id, c.name, c.parent_id, d.level + 1
    FROM concepts c
    JOIN descendants d ON c.parent_id = d.id
)
SELECT name, level, REPEAT('  ', level) || name AS indented_name
FROM descendants
ORDER BY level, name;

-- 结果：
-- Animal     0
--   Mammal   1
--     Cat    2
--     Dog    2`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">路径查找与图遍历</h3>

      <CodeBlock
        title="查找两个概念之间的路径"
        code={`-- 使用双向递归查找最短路径
WITH RECURSIVE
-- 从起始概念向下遍历
downward AS (
    SELECT id, name, parent_id, name AS path, 0 AS depth
    FROM concepts
    WHERE name = 'Dog'

    UNION ALL

    SELECT c.id, c.name, c.parent_id,
           c.name || ' → ' || d.path,
           d.depth + 1
    FROM concepts c
    JOIN downward d ON c.parent_id = d.id
),
-- 从目标概念向上遍历
upward AS (
    SELECT id, name, parent_id, name AS path, 0 AS depth
    FROM concepts
    WHERE name = 'Entity'

    UNION ALL

    SELECT c.id, c.name, c.parent_id,
           u.path || ' ← ' || c.name,
           u.depth + 1
    FROM concepts c
    JOIN upward u ON c.id = u.parent_id
)
-- 查找交汇点
SELECT 'Path found between Dog and Entity' AS result
WHERE EXISTS (
    SELECT 1 FROM downward d
    JOIN upward u ON d.id = u.id
);`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归深度控制</h3>

      <CodeBlock
        title="限制递归深度"
        code={`-- 防止无限递归
WITH RECURSIVE limited_depth AS (
    SELECT id, name, parent_id, 0 AS depth
    FROM concepts
    WHERE parent_id IS NULL  -- 从根开始

    UNION ALL

    SELECT c.id, c.name, c.parent_id, ld.depth + 1
    FROM concepts c
    JOIN limited_depth ld ON c.parent_id = ld.id
    WHERE ld.depth < 5  -- 限制最大深度
)
SELECT * FROM limited_depth ORDER BY depth, name;`}
        {...noteProps('code4')}
      />

      <InfoBox type="warning" title="递归查询注意事项" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>终止条件：</strong> 必须有明确的终止条件，否则会无限递归</li>
          <li><strong>性能考虑：</strong> 大数据集时注意内存使用和执行时间</li>
          <li><strong>循环检测：</strong> 在图数据中需要检测循环引用</li>
          <li><strong>UNION vs UNION ALL：</strong> 递归查询通常使用 UNION ALL</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">组织架构</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">查询员工层级、管理链、汇报关系</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">产品分类</h4>
          <p className="text-sm text-green-600 dark:text-green-400">多级产品目录、分类层级</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">知识图谱</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">概念关系、语义网络</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">依赖分析</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">代码依赖、任务依赖链</p>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 查询从"Entity"到任意叶子节点的最长路径</p>
          <p><strong>挑战 2：</strong> 找出概念层级中的所有"兄弟"关系</p>
          <p><strong>挑战 3：</strong> 计算每个概念的层级深度和子孙数量</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// PIVOT/UNPIVOT 章节
// ============================================

export function PivotSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">PIVOT/UNPIVOT</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"行列转换，数据透视的艺术"</p>

      <Paragraph {...noteProps('p1')}>
        PIVOT 和 UNPIVOT 是 SQL 中的行列转换操作。PIVOT 将行数据转换为列，适合制作交叉表和透视分析；UNPIVOT 将列数据转换为行，便于数据标准化和分析。
      </Paragraph>

      <DataFlowAnimation type="pivot" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">PIVOT - 行转列</h3>

      <SQLExplainer
        sql={`SELECT *
FROM (
    SELECT region, product_category, SUM(amount) as total
    FROM sales
    GROUP BY region, product_category
) AS source_data
PIVOT (
    SUM(total)
    FOR product_category IN ('Electronics', 'Clothing', 'Books')
) AS pivot_table;`}
        explanations={[
          { code: 'SELECT * FROM (SELECT ... GROUP BY ...)', explanation: '准备基础数据，通常需要先聚合', tip: 'PIVOT 前的数据应该是规整的' },
          { code: 'PIVOT (SUM(total)', explanation: '指定聚合函数和要聚合的列', tip: '可以是 SUM、COUNT、AVG 等聚合函数' },
          { code: 'FOR product_category IN (...)', explanation: '指定要转换为列的取值', tip: '这些值将成为新的列名' },
          { code: 'AS pivot_table', explanation: '给结果表取别名', tip: '便于后续查询引用' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">销售数据透视表</h3>

      <CodeBlock
        title="创建销售透视表"
        code={`-- 原始销售数据
CREATE TABLE sales (
    region VARCHAR,
    product_category VARCHAR,
    quarter VARCHAR,
    amount DECIMAL(10,2)
);

INSERT INTO sales VALUES
    ('East', 'Electronics', 'Q1', 1000),
    ('East', 'Clothing', 'Q1', 500),
    ('West', 'Electronics', 'Q1', 800),
    ('West', 'Clothing', 'Q1', 300);

-- PIVOT 创建透视表
SELECT *
FROM (
    SELECT region, product_category, amount
    FROM sales
    WHERE quarter = 'Q1'
) AS source_data
PIVOT (
    SUM(amount)
    FOR product_category IN ('Electronics', 'Clothing')
) AS pivot_table;

-- 结果：
-- ┌─────────┬─────────────┬──────────┐
-- │ region  │ Electronics │ Clothing │
-- ├─────────┼─────────────┼──────────┤
-- │ East    │ 1000        │ 500      │
-- │ West    │ 800         │ 300      │
-- └─────────┴─────────────┴──────────┘`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">动态 PIVOT</h3>

      <CodeBlock
        title="使用聚合函数实现动态 PIVOT"
        code={`-- 当列名不确定时，使用条件聚合
SELECT
    region,
    SUM(CASE WHEN product_category = 'Electronics' THEN amount END) AS Electronics,
    SUM(CASE WHEN product_category = 'Clothing' THEN amount END) AS Clothing,
    SUM(CASE WHEN product_category = 'Books' THEN amount END) AS Books,
    SUM(amount) AS Total
FROM sales
WHERE quarter = 'Q1'
GROUP BY region;

-- 结果同上，但更灵活`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">UNPIVOT - 列转行</h3>

      <SQLExplainer
        sql={`SELECT region, product_category, amount
FROM (
    SELECT region, Electronics, Clothing, Books
    FROM sales_pivot
) AS source_table
UNPIVOT (
    amount
    FOR product_category IN (Electronics, Clothing, Books)
) AS unpivot_table;`}
        explanations={[
          { code: 'FROM (SELECT ... FROM sales_pivot)', explanation: '指定包含要转换列的源表', tip: '通常是之前 PIVOT 的结果' },
          { code: 'UNPIVOT (amount', explanation: '指定要创建的值列名', tip: '这个列将存储所有转换后的值' },
          { code: 'FOR product_category IN (...)', explanation: '指定要转换为行的列名列表', tip: '这些列名将成为新行中的类别值' },
          { code: 'AS unpivot_table', explanation: '给 UNPIVOT 结果取别名', tip: '便于后续处理' },
        ]}
      />

      <CodeBlock
        title="UNPIVOT 列转行"
        code={`-- 假设有透视表 sales_pivot
CREATE TABLE sales_pivot (
    region VARCHAR,
    Electronics DECIMAL(10,2),
    Clothing DECIMAL(10,2),
    Books DECIMAL(10,2)
);

INSERT INTO sales_pivot VALUES
    ('East', 1000, 500, 200),
    ('West', 800, 300, 150);

-- UNPIVOT 转换为行格式
SELECT region, product_category, amount
FROM sales_pivot
UNPIVOT (
    amount
    FOR product_category IN (Electronics, Clothing, Books)
) AS unpivot_table
WHERE amount IS NOT NULL;  -- 过滤掉 NULL 值

-- 结果：
-- ┌─────────┬──────────────────┬────────┐
-- │ region  │ product_category │ amount │
-- ├─────────┼──────────────────┼────────┤
-- │ East    │ Electronics      │ 1000   │
-- │ East    │ Clothing         │ 500    │
-- │ East    │ Books            │ 200    │
-- │ West    │ Electronics      │ 800    │
-- │ West    │ Clothing         │ 300    │
-- │ West    │ Books            │ 150    │
-- └─────────┴──────────────────┴────────┘`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级应用场景</h3>

      <CodeBlock
        title="多维度透视分析"
        code={`-- 按地区和季度创建三维透视
SELECT *
FROM (
    SELECT region, quarter, product_category, SUM(amount) as total
    FROM sales
    GROUP BY region, quarter, product_category
) AS source_data
PIVOT (
    SUM(total)
    FOR product_category IN ('Electronics', 'Clothing', 'Books')
) AS pivot_table
ORDER BY region, quarter;

-- 结果包含地区、季度和产品类别的交叉分析`}
        {...noteProps('code4')}
      />

      <CodeBlock
        title="时间序列透视"
        code={`-- 将月份数据转换为列格式
SELECT
    product_category,
    [2023-01] AS Jan_2023,
    [2023-02] AS Feb_2023,
    [2023-03] AS Mar_2023,
    [2023-01] + [2023-02] + [2023-03] AS Q1_Total
FROM (
    SELECT product_category,
           '2023-' || LPAD(month::VARCHAR, 2, '0') AS month_key,
           SUM(amount) as monthly_total
    FROM sales
    WHERE year = 2023
    GROUP BY product_category, month
) AS monthly_data
PIVOT (
    SUM(monthly_total)
    FOR month_key IN ('2023-01', '2023-02', '2023-03')
) AS quarterly_pivot;`}
        {...noteProps('code5')}
      />

      <InfoBox type="tip" title="PIVOT/UNPIVOT 使用建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>PIVOT 前先聚合：</strong> 确保数据是规整的，避免重复值</li>
          <li><strong>动态列处理：</strong> 当列名不确定时，使用条件聚合代替 PIVOT</li>
          <li><strong>性能考虑：</strong> PIVOT 操作可能需要临时表空间</li>
          <li><strong>NULL 值处理：</strong> UNPIVOT 时注意过滤 NULL 值</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际业务应用</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📊 销售报表</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">按地区、产品、时间生成交叉分析表</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">📈 时间序列</h4>
          <p className="text-sm text-green-600 dark:text-green-400">将每月数据转换为季度/年度透视</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🎯 目标跟踪</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">KPI 指标按维度展示达成情况</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">📋 调查统计</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">多选题结果的交叉分析</p>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 为本体论概念创建统计透视表（按层级统计概念数量）</p>
          <p><strong>挑战 2：</strong> 设计一个动态的月份销售透视查询</p>
          <p><strong>挑战 3：</strong> 将宽表转换为标准化的长表格式</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 集合操作章节
// ============================================

export function SetOperationsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">集合操作</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"合并、交集、差集，集合论在 SQL 中的应用"</p>

      <Paragraph {...noteProps('p1')}>
        集合操作允许我们合并多个查询的结果，进行并集、交集、差集运算。这是 SQL 中处理复杂数据关系的重要工具，特别适用于数据分析和报表生成。
      </Paragraph>

      <DataFlowAnimation type="join" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">UNION - 并集</h3>

      <SQLExplainer
        sql={`-- UNION：合并两个查询的结果，自动去重
SELECT name FROM concepts WHERE parent_id = 1
UNION
SELECT name FROM concepts WHERE parent_id = 2;

-- UNION ALL：合并结果，保留重复项
SELECT name FROM concepts WHERE parent_id = 1
UNION ALL
SELECT name FROM concepts WHERE parent_id = 2;`}
        explanations={[
          { code: 'UNION', explanation: '合并两个查询的结果，自动消除重复行', tip: '适用于需要唯一结果的场景' },
          { code: 'UNION ALL', explanation: '合并结果，保留所有行（包括重复的）', tip: '性能更好，不需要去重操作' },
          { code: '列数必须匹配', explanation: '两个查询的 SELECT 列数必须相同', tip: '列的数据类型也应该兼容' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">INTERSECT - 交集</h3>

      <CodeBlock
        title="INTERSECT 找出共同元素"
        code={`-- 找出同时满足两个条件的概念
SELECT name FROM concepts
WHERE name LIKE 'A%'
INTERSECT
SELECT name FROM concepts
WHERE LENGTH(name) > 3;

-- 结果：同时以A开头且长度大于3的概念名`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">EXCEPT - 差集</h3>

      <CodeBlock
        title="EXCEPT 找出差异"
        code={`-- 找出在第一个集合中但不在第二个集合中的元素
SELECT name FROM concepts
WHERE parent_id IS NOT NULL
EXCEPT
SELECT name FROM concepts
WHERE parent_id = 1;

-- 结果：有父概念但父概念不是Entity的概念`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <CodeBlock
        title="用户行为分析"
        code={`-- 活跃用户但未购买的用户
SELECT user_id FROM user_logins WHERE login_date >= '2024-01-01'
EXCEPT
SELECT user_id FROM purchases WHERE purchase_date >= '2024-01-01';

-- 同时登录且购买的用户（高价值用户）
SELECT user_id FROM user_logins WHERE login_date >= '2024-01-01'
INTERSECT
SELECT user_id FROM purchases WHERE purchase_date >= '2024-01-01';

-- 所有活跃用户（登录或购买）
SELECT user_id FROM user_logins WHERE login_date >= '2024-01-01'
UNION
SELECT user_id FROM purchases WHERE purchase_date >= '2024-01-01';`}
        {...noteProps('code3')}
      />

      <CodeBlock
        title="数据质量检查"
        code={`-- 找出主表中存在但子表中缺失的记录
SELECT id FROM concepts
EXCEPT
SELECT concept_id FROM properties;

-- 找出同时存在于多个表中的记录
SELECT concept_id FROM properties
INTERSECT
SELECT concept_id FROM relations;`}
        {...noteProps('code4')}
      />

      <InfoBox type="tip" title="集合操作注意事项" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>列数匹配：</strong> 所有查询的 SELECT 列数必须相同</li>
          <li><strong>数据类型：</strong> 对应列的数据类型应该兼容</li>
          <li><strong>排序：</strong> 要在最后使用 ORDER BY 对整个结果排序</li>
          <li><strong>性能：</strong> UNION ALL 通常比 UNION 快</li>
          <li><strong>去重逻辑：</strong> UNION 隐含 DISTINCT，可能会影响性能</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级集合操作</h3>

      <CodeBlock
        title="复杂集合查询"
        code={`-- 多重集合操作：活跃用户但未在黑名单中
(
    SELECT user_id FROM active_users
    INTERSECT
    SELECT user_id FROM premium_users
)
EXCEPT
SELECT user_id FROM blacklist;

-- 使用集合操作进行数据去重和合并
SELECT product_id, SUM(quantity) as total_qty
FROM (
    SELECT product_id, quantity FROM sales_2023
    UNION ALL
    SELECT product_id, quantity FROM sales_2024
) AS combined_sales
GROUP BY product_id;`}
        {...noteProps('code5')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">操作</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">说明</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">示例</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">结果</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">UNION</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">并集（去重）</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2} ∪ {2,3}'}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2,3}'}</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">UNION ALL</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">并集（保留重复）</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2} ∪ {2,3}'}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2,2,3}'}</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">INTERSECT</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">交集</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2,3} ∩ {2,3,4}'}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{2,3}'}</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">EXCEPT</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">差集</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1,2,3} - {2,3,4}'}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">{'{1}'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 使用集合操作找出有属性但没有关系的概念</p>
          <p><strong>挑战 2：</strong> 合并两个不同格式的用户列表，去除重复</p>
          <p><strong>挑战 3：</strong> 找出同时存在于三个不同表中的记录</p>
        </div>
      </InfoBox>
    </div>
  );
}
