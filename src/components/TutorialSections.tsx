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

// 窗口函数章节
export function WindowFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">窗口函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"不分组也能聚合，SQL 的高级魔法"</p>

      <Paragraph {...noteProps('p1')}>
        窗口函数（Window Functions）是 SQL 的高级特性，它可以在不减少行数的情况下进行计算。与 GROUP BY 不同，窗口函数保留所有原始行，同时添加聚合结果。
      </Paragraph>

      <InfoBox type="fastai" title="为什么需要窗口函数？" {...noteProps('box1')}>
        想象一下：你想显示每个概念的名称，同时显示它在同级概念中的排名。用 GROUP BY 做不到（会丢失行），用子查询太复杂。窗口函数一行搞定！
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本语法</h3>

      <CodeBlock
        title="窗口函数语法"
        code={`-- 窗口函数基本语法
SELECT 
    column1,
    window_function() OVER (
        PARTITION BY column2    -- 可选：分区（类似分组）
        ORDER BY column3        -- 可选：排序
        ROWS/RANGE ...          -- 可选：窗口范围
    ) AS result
FROM table_name;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">排名函数</h3>

      <SQLExplainer
        sql={`SELECT 
  name,
  parent_id,
  ROW_NUMBER() OVER (ORDER BY name) AS row_num,
  RANK() OVER (ORDER BY parent_id) AS rank,
  DENSE_RANK() OVER (ORDER BY parent_id) AS dense_rank
FROM concepts;`}
        explanations={[
          { code: 'ROW_NUMBER() OVER (ORDER BY name)', explanation: '为每行分配唯一序号，按 name 排序', tip: 'ROW_NUMBER 始终唯一，即使值相同' },
          { code: 'RANK() OVER (ORDER BY parent_id)', explanation: '排名函数，相同值获得相同排名，下一个排名跳过', tip: '例如：1, 2, 2, 4（跳过3）' },
          { code: 'DENSE_RANK() OVER (ORDER BY parent_id)', explanation: '密集排名，相同值相同排名，下一个不跳过', tip: '例如：1, 2, 2, 3（不跳过）' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分区窗口</h3>

      <CodeBlock
        title="PARTITION BY - 分区计算"
        code={`-- 在每个父概念内部排名
SELECT 
    name,
    parent_id,
    ROW_NUMBER() OVER (
        PARTITION BY parent_id 
        ORDER BY name
    ) AS rank_in_parent
FROM concepts
WHERE parent_id IS NOT NULL;

-- 结果示例：
-- ┌──────────┬───────────┬────────────────┐
-- │   name   │ parent_id │ rank_in_parent │
-- ├──────────┼───────────┼────────────────┤
-- │ Animal   │     2     │       1        │
-- │ Plant    │     2     │       2        │
-- │ Bird     │     3     │       1        │
-- │ Mammal   │     3     │       2        │
-- │ Cat      │     4     │       1        │
-- │ Dog      │     4     │       2        │
-- └──────────┴───────────┴────────────────┘`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">聚合窗口函数</h3>

      <CodeBlock
        title="运行总和与移动平均"
        code={`-- 计算累计计数
SELECT 
    id,
    name,
    COUNT(*) OVER (ORDER BY id) AS running_count,
    SUM(id) OVER (ORDER BY id) AS running_sum
FROM concepts;

-- 每个分区内的统计
SELECT 
    name,
    parent_id,
    COUNT(*) OVER (PARTITION BY parent_id) AS siblings_count,
    MAX(id) OVER (PARTITION BY parent_id) AS max_id_in_group
FROM concepts;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">LAG 和 LEAD - 访问相邻行</h3>

      <CodeBlock
        title="访问前后行数据"
        code={`-- LAG: 获取前一行的值
-- LEAD: 获取后一行的值
SELECT 
    id,
    name,
    LAG(name, 1) OVER (ORDER BY id) AS prev_concept,
    LEAD(name, 1) OVER (ORDER BY id) AS next_concept
FROM concepts;

-- 结果：
-- ┌────┬────────┬──────────────┬──────────────┐
-- │ id │  name  │ prev_concept │ next_concept │
-- ├────┼────────┼──────────────┼──────────────┤
-- │  1 │ Entity │     NULL     │ Living Thing │
-- │  2 │ Living │    Entity    │    Animal    │
-- │  3 │ Animal │    Living    │    Mammal    │
-- └────┴────────┴──────────────┴──────────────┘`}
        {...noteProps('code4')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        尝试写一个查询：显示每个概念的名称、它在同父概念下的排名、以及同父概念下的概念总数。
        <details className="mt-2">
          <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
          <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`SELECT 
  name,
  parent_id,
  ROW_NUMBER() OVER (
    PARTITION BY parent_id 
    ORDER BY name
  ) AS rank_in_siblings,
  COUNT(*) OVER (
    PARTITION BY parent_id
  ) AS total_siblings
FROM concepts;`}
          </code>
        </details>
      </InfoBox>
    </div>
  );
}

// CSV/Excel 导入章节
export function ImportCSVSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">读取 CSV/Excel 文件</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"直接查询文件，无需先导入"</p>

      <Paragraph {...noteProps('p1')}>
        DuckDB 最强大的特性之一是可以<strong>直接查询文件</strong>，无需先导入到表中。这让数据分析变得极其简单！
      </Paragraph>

      <InfoBox type="fastai" title="DuckDB 的杀手级特性" {...noteProps('box1')}>
        传统数据库需要：创建表 → 定义列 → 导入数据 → 查询。DuckDB 只需要一行 SQL 直接查询文件！这对数据探索和快速分析来说太方便了。
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">读取 CSV 文件</h3>

      <CodeBlock
        title="直接查询 CSV"
        code={`-- 直接查询 CSV 文件
SELECT * FROM 'data/concepts.csv';

-- 使用 read_csv 函数（更多选项）
SELECT * FROM read_csv('data/concepts.csv');

-- 指定分隔符和编码
SELECT * FROM read_csv('data/concepts.csv', 
    delim = ',',
    header = true,
    encoding = 'utf-8'
);

-- 查询远程 CSV 文件
SELECT * FROM 'https://example.com/data.csv';`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CSV 导入选项</h3>

      <CodeBlock
        title="高级 CSV 选项"
        code={`-- 指定列类型
SELECT * FROM read_csv('data.csv', 
    columns = {
        'id': 'INTEGER',
        'name': 'VARCHAR',
        'created_at': 'TIMESTAMP'
    }
);

-- 处理日期格式
SELECT * FROM read_csv('data.csv',
    dateformat = '%Y-%m-%d',
    timestampformat = '%Y-%m-%d %H:%M:%S'
);

-- 跳过错误行
SELECT * FROM read_csv('data.csv',
    ignore_errors = true
);

-- 只读取前 100 行
SELECT * FROM read_csv('data.csv',
    max_line_size = 100
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">读取 Parquet 文件</h3>

      <CodeBlock
        title="Parquet 文件查询"
        code={`-- Parquet 是列式存储格式，查询更快
SELECT * FROM 'data/concepts.parquet';

-- 读取多个 Parquet 文件
SELECT * FROM 'data/*.parquet';

-- 读取分区数据
SELECT * FROM 'data/year=2024/month=01/*.parquet';

-- Parquet 元数据查询
SELECT * FROM parquet_metadata('data.parquet');
SELECT * FROM parquet_schema('data.parquet');`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">将文件导入为表</h3>

      <CodeBlock
        title="从文件创建表"
        code={`-- 从 CSV 创建表
CREATE TABLE concepts AS 
SELECT * FROM read_csv('concepts.csv');

-- 创建表并指定类型
CREATE TABLE concepts (
    id INTEGER,
    name VARCHAR,
    parent_id INTEGER
);
INSERT INTO concepts 
SELECT * FROM read_csv('concepts.csv');

-- 直接复制到表（更快）
COPY concepts FROM 'concepts.csv' (FORMAT CSV, HEADER);`}
        {...noteProps('code4')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">格式</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">函数</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">特点</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">CSV</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">read_csv()</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">通用，易读写</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">Parquet</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">read_parquet()</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">列式存储，查询快</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">JSON</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">read_json()</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">灵活，支持嵌套</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">Excel</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">需安装扩展</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">办公常用格式</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="tip" title="性能提示" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>对于大文件，优先使用 <strong>Parquet</strong> 格式，速度快很多</li>
          <li>使用通配符 <code className="bg-emerald-100 dark:bg-emerald-900 px-1 rounded">*.csv</code> 可以一次读取多个文件</li>
          <li>远程文件也可以直接查询，DuckDB 会智能缓存</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// JSON 数据处理章节
export function ImportJSONSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">JSON 数据处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"处理嵌套数据结构的利器"</p>

      <Paragraph {...noteProps('p1')}>
        JSON 是现代 API 和配置文件的标准格式。DuckDB 提供了强大的 JSON 处理能力，可以直接查询 JSON 文件，也可以在 SQL 中操作 JSON 数据。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">读取 JSON 文件</h3>

      <CodeBlock
        title="查询 JSON 文件"
        code={`-- 读取 JSON 文件
SELECT * FROM read_json('data/concepts.json');

-- 读取 JSON Lines 格式（每行一个 JSON 对象）
SELECT * FROM read_json('data/concepts.jsonl', 
    format = 'newline_delimited'
);

-- 自动推断结构
SELECT * FROM read_json_auto('data/concepts.json');

-- 读取嵌套 JSON
SELECT 
    data->>'id' AS id,
    data->>'name' AS name,
    data->'properties'->>'type' AS type
FROM read_json('nested.json');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JSON 提取操作符</h3>

      <CodeBlock
        title="JSON 路径操作"
        code={`-- 假设有一个 metadata JSON 列
-- 操作符说明:
--   column->>'key'   提取为文本
--   column->'key'    保持为 JSON

SELECT 
    name,
    json_extract_string(metadata, '$.version') AS version,
    json_extract(metadata, '$.tags') AS tags_json,
    json_extract(metadata, '$.tags[0]') AS first_tag,
    json_extract(metadata, '$.author.name') AS author
FROM concepts_with_json;

-- 检查 JSON 包含
SELECT * FROM concepts_with_json
WHERE json_extract_string(metadata, '$.status') = 'active';

-- 数组长度
SELECT 
    name,
    json_array_length(json_extract(metadata, '$.tags')) AS tag_count
FROM concepts_with_json;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">构造 JSON</h3>

      <CodeBlock
        title="创建 JSON 数据"
        code={`-- 将行转换为 JSON 对象
SELECT json_object(
    'id', id,
    'name', name,
    'parent_id', parent_id
) AS concept_json
FROM concepts;

-- 聚合为 JSON 数组
SELECT json_group_array(
    json_object('id', id, 'name', name)
) AS all_concepts
FROM concepts;

-- 构造嵌套 JSON
SELECT json_object(
    'concept', name,
    'children', (
        SELECT json_group_array(child.name)
        FROM concepts child
        WHERE child.parent_id = concepts.id
    )
) AS hierarchy
FROM concepts;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">展开 JSON 数组</h3>

      <CodeBlock
        title="UNNEST - 展开数组"
        code={`-- 假设 tags 是一个 JSON 数组列
-- 展开数组为多行
SELECT 
    name,
    unnest(json_extract(metadata, '$.tags')) AS tag
FROM concepts_with_json;

-- 等价的写法
SELECT 
    name,
    t.value AS tag
FROM concepts_with_json,
LATERAL unnest(json_extract(metadata, '$.tags')) AS t(value);`}
        {...noteProps('code4')}
      />

      <InfoBox type="tip" title="JSON 处理最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>频繁查询的 JSON 字段，考虑提取为独立列</li>
          <li>使用 json_extract_string 提取文本，json_extract 保持 JSON</li>
          <li>对于大型 JSON，只提取需要的字段以提高性能</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// 数据导出章节
export function ExportDataSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">导出数据</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"把查询结果保存为各种格式"</p>

      <Paragraph {...noteProps('p1')}>
        DuckDB 不仅能读取多种格式，也能将查询结果导出为 CSV、Parquet、JSON 等格式。这对于数据处理流水线和报告生成非常有用。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">COPY TO - 导出数据</h3>

      <CodeBlock
        title="导出到文件"
        code={`-- 导出为 CSV
COPY concepts TO 'output/concepts.csv' (FORMAT CSV, HEADER);

-- 导出为 Parquet（推荐，压缩好，查询快）
COPY concepts TO 'output/concepts.parquet' (FORMAT PARQUET);

-- 导出为 JSON
COPY concepts TO 'output/concepts.json' (FORMAT JSON);

-- 导出查询结果
COPY (
    SELECT c.name, p.name AS parent
    FROM concepts c
    LEFT JOIN concepts p ON c.parent_id = p.id
) TO 'output/hierarchy.csv' (FORMAT CSV, HEADER);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CSV 导出选项</h3>

      <CodeBlock
        title="CSV 导出配置"
        code={`-- 指定分隔符
COPY concepts TO 'output.csv' (
    FORMAT CSV,
    HEADER true,
    DELIMITER '|',           -- 使用 | 分隔
    QUOTE '"',               -- 引号字符
    ESCAPE '\\',             -- 转义字符
    NULL 'N/A'               -- NULL 值显示
);

-- 只导出特定列
COPY concepts (id, name) TO 'output.csv' (FORMAT CSV, HEADER);

-- 压缩导出
COPY concepts TO 'output.csv.gz' (FORMAT CSV, HEADER);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分区导出</h3>

      <CodeBlock
        title="按分区导出"
        code={`-- 按列值分区导出（每个 parent_id 一个文件）
COPY concepts TO 'output/' (
    FORMAT PARQUET,
    PARTITION_BY (parent_id)
);

-- 结果目录结构：
-- output/
--   parent_id=1/
--     data_0.parquet
--   parent_id=2/
--     data_0.parquet
--   parent_id=NULL/
--     data_0.parquet`}
        {...noteProps('code3')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📄 CSV</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">通用格式，Excel 可打开，人类可读</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">📦 Parquet</h4>
          <p className="text-sm text-green-600 dark:text-green-400">高压缩比，列式存储，大数据首选</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🔖 JSON</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">灵活格式，支持嵌套，API 友好</p>
        </div>
      </div>

      <InfoBox type="tip" title="导出建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>与其他工具交互</strong>：使用 CSV</li>
          <li><strong>数据存储和分析</strong>：使用 Parquet（更小更快）</li>
          <li><strong>Web API 或配置</strong>：使用 JSON</li>
          <li><strong>大文件</strong>：加 <code>.gz</code> 扩展名自动压缩</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// 索引使用章节
export function IndexingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">索引使用</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"给数据加上目录，查询飞起来"</p>

      <Paragraph {...noteProps('p1')}>
        索引就像书的目录，可以帮助数据库快速定位数据，而不需要逐行扫描整个表。合理使用索引是查询优化的关键。
      </Paragraph>

      <InfoBox type="info" title="DuckDB 的特殊之处" {...noteProps('box1')}>
        DuckDB 作为分析型数据库，对索引的需求与传统 OLTP 数据库不同。它使用<strong>列式存储</strong>和<strong>向量化执行</strong>，很多查询本身就很快。但对于点查询和 JOIN 操作，索引仍然有帮助。
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">创建索引</h3>

      <CodeBlock
        title="CREATE INDEX"
        code={`-- 在单列上创建索引
CREATE INDEX idx_name ON concepts(name);

-- 在多列上创建复合索引
CREATE INDEX idx_parent_name ON concepts(parent_id, name);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_unique_name ON concepts(name);

-- 查看表的索引
PRAGMA table_info('concepts');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">何时使用索引</h3>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">场景</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">是否建索引</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">原因</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">WHERE 等值查询</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">✓ 推荐</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">快速定位</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">JOIN 连接列</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">✓ 推荐</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">加速匹配</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">ORDER BY 排序列</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-amber-600">看情况</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">大表有帮助</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">全表扫描分析</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-red-600">✗ 不需要</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">列式存储已够快</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">频繁更新的列</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-red-600">⚠️ 谨慎</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">索引维护有开销</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">管理索引</h3>

      <CodeBlock
        title="索引管理"
        code={`-- 删除索引
DROP INDEX idx_name;

-- 安全删除（如果不存在不报错）
DROP INDEX IF EXISTS idx_name;

-- 重建索引（如果数据大量变化后）
DROP INDEX idx_name;
CREATE INDEX idx_name ON concepts(name);`}
        {...noteProps('code2')}
      />

      <InfoBox type="warning" title="索引的代价" {...noteProps('box2')}>
        索引不是免费的：
        <ul className="list-disc ml-4 mt-2">
          <li><strong>存储空间</strong>：索引需要额外存储</li>
          <li><strong>写入变慢</strong>：INSERT/UPDATE/DELETE 需要维护索引</li>
          <li><strong>维护成本</strong>：需要定期检查和优化</li>
        </ul>
        <p className="mt-2">原则：只在真正需要的列上建索引！</p>
      </InfoBox>
    </div>
  );
}

// 查询优化章节
export function QueryOptimizationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">查询优化技巧</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"写出既正确又快速的 SQL"</p>

      <Paragraph {...noteProps('p1')}>
        查询优化是一门艺术。同样的结果，不同的写法可能有数量级的性能差异。掌握这些技巧，让你的 SQL 既优雅又高效。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">EXPLAIN - 查看执行计划</h3>

      <CodeBlock
        title="分析查询执行计划"
        code={`-- 查看执行计划
EXPLAIN SELECT * FROM concepts WHERE parent_id = 3;

-- 详细执行计划
EXPLAIN ANALYZE SELECT * FROM concepts WHERE parent_id = 3;

-- 执行计划解读要点：
-- - Seq Scan: 全表扫描（可能需要优化）
-- - Index Scan: 使用索引（好）
-- - Hash Join: 哈希连接（大表效率高）
-- - Nested Loop: 嵌套循环（小表可以）`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">优化技巧 1：只选需要的列</h3>

      <CodeBlock
        title="避免 SELECT *"
        code={`-- ❌ 不好：选择所有列
SELECT * FROM concepts;

-- ✅ 好：只选需要的列
SELECT id, name FROM concepts;

-- 原因：
-- 1. 减少数据传输量
-- 2. 可能利用覆盖索引
-- 3. 代码意图更清晰`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">优化技巧 2：条件下推</h3>

      <CodeBlock
        title="尽早过滤数据"
        code={`-- ❌ 不好：先 JOIN 再过滤
SELECT c.name, p.property_value
FROM concepts c
JOIN properties p ON p.concept_id = c.id
WHERE c.parent_id = 3;  -- 过滤在 JOIN 之后

-- ✅ 好：先过滤再 JOIN（对于大表）
SELECT c.name, p.property_value
FROM (
    SELECT id, name FROM concepts WHERE parent_id = 3
) c
JOIN properties p ON p.concept_id = c.id;

-- 或者使用 CTE
WITH filtered AS (
    SELECT id, name FROM concepts WHERE parent_id = 3
)
SELECT f.name, p.property_value
FROM filtered f
JOIN properties p ON p.concept_id = f.id;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">优化技巧 3：使用合适的 JOIN</h3>

      <CodeBlock
        title="JOIN 选择"
        code={`-- 小表驱动大表（小表放左边）
SELECT /*+ HASH_JOIN(s, b) */ *
FROM small_table s
JOIN big_table b ON s.id = b.small_id;

-- EXISTS vs IN（大子查询结果时 EXISTS 更快）
-- ❌ 可能慢
SELECT * FROM concepts WHERE id IN (
    SELECT concept_id FROM properties  -- 结果集很大
);

-- ✅ 更快
SELECT * FROM concepts c WHERE EXISTS (
    SELECT 1 FROM properties p WHERE p.concept_id = c.id
);`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">优化技巧 4：避免函数导致索引失效</h3>

      <CodeBlock
        title="保持列原样"
        code={`-- ❌ 不好：对列使用函数会导致索引失效
SELECT * FROM concepts WHERE UPPER(name) = 'ENTITY';

-- ✅ 好：对值使用函数
SELECT * FROM concepts WHERE name = UPPER('entity');

-- ❌ 不好：表达式计算
SELECT * FROM concepts WHERE id + 1 = 5;

-- ✅ 好：移到右边
SELECT * FROM concepts WHERE id = 5 - 1;`}
        {...noteProps('code5')}
      />

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 my-6 border border-indigo-200 dark:border-indigo-700">
        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-3">🎯 优化检查清单</h4>
        <ul className="space-y-2 text-indigo-700 dark:text-indigo-400">
          <li className="flex items-center gap-2"><span>✓</span> 只 SELECT 需要的列</li>
          <li className="flex items-center gap-2"><span>✓</span> WHERE 条件尽早过滤</li>
          <li className="flex items-center gap-2"><span>✓</span> JOIN 列有索引</li>
          <li className="flex items-center gap-2"><span>✓</span> 避免对索引列使用函数</li>
          <li className="flex items-center gap-2"><span>✓</span> 用 EXPLAIN 验证执行计划</li>
          <li className="flex items-center gap-2"><span>✓</span> 大结果集用分页 LIMIT/OFFSET</li>
        </ul>
      </div>

      <InfoBox type="fastai" title="记住这个原则" {...noteProps('box1')}>
        <strong>"少做事比快做事更重要"</strong> - 最好的优化是根本不执行不必要的操作。减少扫描的数据量、减少返回的列数、减少中间结果，往往比技巧性优化更有效。
      </InfoBox>
    </div>
  );
}

// ============================================
// 模式匹配章节
// ============================================

export function PatternMatchingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">模式匹配</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"模糊查找的艺术，从简单到复杂"</p>

      <Paragraph {...noteProps('p1')}>
        模式匹配是数据库查询中最常用的功能之一。从简单的通配符到复杂的正则表达式，DuckDB 提供了丰富的模式匹配工具，帮助你在海量数据中找到需要的记录。
      </Paragraph>

      <SQLFlowDiagram type="filter" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">LIKE - 基本模式匹配</h3>

      <SQLExplainer
        sql={`SELECT * FROM concepts
WHERE name LIKE 'A%'
   OR name LIKE '%al%'
   OR name LIKE '____'
   OR name NOT LIKE 'A%';`}
        explanations={[
          { code: "name LIKE 'A%'", explanation: '以 A 开头的名称（% 匹配任意字符）', tip: '最常用的通配符模式' },
          { code: "name LIKE '%al%'", explanation: '包含 al 的名称（前后都可以有字符）', tip: '查找包含特定子串' },
          { code: "name LIKE '____'", explanation: '正好 4 个字符的名称（_ 匹配单个字符）', tip: '固定长度匹配' },
          { code: 'name NOT LIKE', explanation: '不匹配的记录（NOT LIKE）', tip: '排除特定模式' },
        ]}
      />

      <DataFlowAnimation type="filter" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">SIMILAR TO - SQL 标准正则</h3>

      <CodeBlock
        title="SIMILAR TO 正则表达式"
        code={`-- SIMILAR TO 使用 SQL 标准正则语法
SELECT * FROM concepts
WHERE name SIMILAR TO '(A|B)%';        -- 以 A 或 B 开头

SELECT * FROM concepts
WHERE name SIMILAR TO '%(al|am)%';     -- 包含 al 或 am

SELECT * FROM concepts
WHERE name SIMILAR TO '[A-Z][a-z]+';   -- 大写字母开头，后跟小写字母

SELECT * FROM concepts
WHERE name SIMILAR TO '[^A]*';         -- 不以 A 开头`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">GLOB - 文件名模式</h3>

      <CodeBlock
        title="GLOB 文件名风格匹配"
        code={`-- GLOB 使用 Unix shell 风格的通配符
SELECT * FROM concepts
WHERE name GLOB 'A*';           -- 以 A 开头

SELECT * FROM concepts
WHERE name GLOB '*al*';         -- 包含 al

SELECT * FROM concepts
WHERE name GLOB '?at';          -- 第二个字母是 a，第三个是 t（如 Cat, Rat）

SELECT * FROM concepts
WHERE name GLOB '[A-Z]*';       -- 以大写字母开头`}
        {...noteProps('code2')}
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">操作符</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">LIKE</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">SIMILAR TO</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">GLOB</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">%</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">任意字符</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">%</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">*</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">_</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">单个字符</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">_</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">?</td></tr>
            <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">[abc]</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">不支持</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">字符集合</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">[abc]</td></tr>
            <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">(a|b)</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">不支持</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">选择分支</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">不支持</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">正则表达式函数</h3>

      <CodeBlock
        title="regexp_matches - 匹配并提取"
        code={`-- regexp_matches 返回匹配的字符串数组
SELECT
    name,
    regexp_matches(name, '[A-Z][a-z]+') AS matches
FROM concepts;

-- 只返回匹配的记录
SELECT * FROM concepts
WHERE regexp_matches(name, '^A.*') IS NOT NULL;

-- 提取 email 地址
SELECT
    text,
    regexp_matches(text, '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}') AS emails
FROM messages;`}
        {...noteProps('code3')}
      />

      <CodeBlock
        title="regexp_replace - 替换匹配内容"
        code={`-- 替换匹配的内容
SELECT
    name,
    regexp_replace(name, '([A-Z])', '_\\1') AS snake_case
FROM concepts;

-- 清理数据：移除多余空格
SELECT
    text,
    regexp_replace(text, '\\s+', ' ') AS cleaned_text
FROM documents;

-- 格式化电话号码
SELECT
    phone,
    regexp_replace(phone, '(\\d{3})(\\d{3})(\\d{4})', '(\\1) \\2-\\3') AS formatted
FROM contacts;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分组捕获</h3>

      <CodeBlock
        title="正则表达式分组"
        code={`-- 分组捕获示例
SELECT
    name,
    regexp_matches(name, '^([A-Z][a-z]+) (.+)$') AS parts
FROM concepts
WHERE name LIKE '% %';  -- 只处理有空格的名字

-- 提取日期部分
SELECT
    log_entry,
    regexp_matches(log_entry, '(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})') AS date_parts
FROM logs;

-- 解析 URL
SELECT
    url,
    regexp_matches(url, 'https?://([^/]+)(/.*)?') AS url_parts
FROM links;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">模糊搜索技巧</h3>

      <InfoBox type="tip" title="性能优化建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>LIKE 前缀匹配</strong> 最快：LIKE 'prefix%'</li>
          <li><strong>后缀匹配</strong> 较慢：LIKE '%suffix'</li>
          <li><strong>包含匹配</strong> 最慢：LIKE '%substring%'</li>
          <li><strong>索引</strong> 只对前缀匹配有效</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="高级搜索技巧"
        code={`-- 近似匹配（编辑距离）
SELECT * FROM concepts
WHERE levenshtein(name, 'Cat') <= 1;  -- 允许1个字符的差异

-- 拼音搜索（如果有拼音字段）
SELECT * FROM concepts
WHERE pinyin LIKE 'mao%' OR name LIKE '%猫%';

-- 多字段搜索
SELECT * FROM concepts
WHERE name LIKE '%search%'
   OR description LIKE '%search%'
   OR tags LIKE '%search%';

-- 加权搜索分数
SELECT
    name,
    CASE
        WHEN name LIKE 'search%' THEN 100
        WHEN name LIKE '%search%' THEN 50
        WHEN description LIKE '%search%' THEN 25
        ELSE 0
    END AS relevance_score
FROM concepts
WHERE relevance_score > 0
ORDER BY relevance_score DESC;`}
        {...noteProps('code6')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 找出所有以元音字母开头的概念名称</p>
          <p><strong>挑战 2：</strong> 找出所有包含数字的概念（如果有的话）</p>
          <p><strong>挑战 3：</strong> 创建一个简单的拼写检查器，找出可能的拼写错误</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 高级聚合章节
// ============================================

export function AdvancedAggregationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">高级聚合</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"一次查询，多个维度的统计结果"</p>

      <Paragraph {...noteProps('p1')}>
        传统的 GROUP BY 一次只能按一个维度分组。但在实际业务中，我们经常需要同时看到按不同维度分组的结果。高级聚合函数（GROUPING SETS、ROLLUP、CUBE）可以让我们一次性获得多个分组维度的统计结果，大大简化复杂报表查询。
      </Paragraph>

      <DataFlowAnimation type="group" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">传统 GROUP BY 的局限</h3>

      <CodeBlock
        title="传统方式：多次查询"
        code={`-- 分别统计不同维度
SELECT '总计' AS category, COUNT(*) AS count FROM sales
UNION ALL
SELECT region, COUNT(*) FROM sales GROUP BY region
UNION ALL
SELECT product_category, COUNT(*) FROM sales GROUP BY product_category
UNION ALL
SELECT region || '-' || product_category, COUNT(*)
FROM sales GROUP BY region, product_category;

-- 问题：代码冗长，执行效率低，维护困难`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">GROUPING SETS - 自定义分组集合</h3>

      <SQLExplainer
        sql={`SELECT
    region,
    product_category,
    SUM(amount) AS total_amount,
    COUNT(*) AS order_count
FROM sales
GROUP BY GROUPING SETS (
    (),                    -- 总计
    (region),             -- 按地区分组
    (product_category),   -- 按产品类别分组
    (region, product_category)  -- 按地区+产品类别分组
)
ORDER BY region, product_category;`}
        explanations={[
          { code: 'GROUP BY GROUPING SETS', explanation: '指定要进行聚合的分组集合', tip: '每个括号代表一个分组维度' },
          { code: '()', explanation: '空括号表示总计（不分组）', tip: '相当于没有 GROUP BY 的聚合' },
          { code: '(region)', explanation: '只按地区分组', tip: '忽略产品类别列' },
          { code: '(region, product_category)', explanation: '同时按地区和产品类别分组', tip: '最详细的交叉分析' },
        ]}
      />

      <InfoBox type="tip" title="GROUPING SETS 优势" {...noteProps('box1')}>
        <ul className="list-disc ml-4">
          <li><strong>灵活性：</strong> 自定义需要的分组组合</li>
          <li><strong>性能：</strong> 单次查询获得多种统计</li>
          <li><strong>可维护：</strong> 代码简洁，易于理解</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ROLLUP - 层级汇总</h3>

      <SQLExplainer
        sql={`SELECT
    region,
    product_category,
    SUM(amount) AS total_amount,
    GROUPING(region) AS region_grouping,
    GROUPING(product_category) AS category_grouping
FROM sales
GROUP BY ROLLUP (region, product_category)
ORDER BY region, product_category;`}
        explanations={[
          { code: 'GROUP BY ROLLUP (region, product_category)', explanation: '生成所有可能的子集汇总', tip: '相当于 GROUPING SETS ((region, product_category), (region), ())' },
          { code: 'GROUPING(region)', explanation: '标识这一行是否按 region 分组', tip: '0=参与分组，1=汇总行' },
          { code: 'GROUPING(product_category)', explanation: '标识这一行是否按 product_category 分组', tip: '用于区分汇总级别' },
        ]}
      />

      <CodeBlock
        title="ROLLUP 生成的汇总层级"
        code={`-- ROLLUP(A, B, C) 等价于：
GROUPING SETS (
    (A, B, C),    -- 最详细级别
    (A, B),       -- 汇总 C
    (A),          -- 汇总 B 和 C
    ()            -- 总计
)

-- 示例结果：
-- ┌─────────┬──────────────────┬──────────────┬────────────────┬────────────────────┐
-- │ region  │ product_category │ total_amount │ region_grouping │ category_grouping │
-- ├─────────┼──────────────────┼──────────────┼────────────────┼────────────────────┤
-- │ East    │ Electronics      │      1000    │       0        │         0          │  -- 详细
-- │ East    │ Clothing         │       500    │       0        │         0          │  -- 详细
-- │ East    │ NULL             │      1500    │       0        │         1          │  -- 地区汇总
-- │ West    │ Electronics      │       800    │       0        │         0          │  -- 详细
-- │ West    │ NULL             │       800    │       0        │         1          │  -- 地区汇总
-- │ NULL    │ NULL             │      2300    │       1        │         1          │  -- 总计
-- └─────────┴──────────────────┴──────────────┴────────────────┴────────────────────┘`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CUBE - 全维度交叉分析</h3>

      <SQLExplainer
        sql={`SELECT
    region,
    product_category,
    quarter,
    SUM(amount) AS total_amount,
    GROUPING_ID(region, product_category, quarter) AS grouping_id
FROM sales
GROUP BY CUBE (region, product_category, quarter)
HAVING SUM(amount) > 1000
ORDER BY grouping_id, region, product_category, quarter;`}
        explanations={[
          { code: 'GROUP BY CUBE (region, product_category, quarter)', explanation: '生成所有可能的分组组合', tip: '2^3 = 8 种分组方式' },
          { code: 'GROUPING_ID(region, product_category, quarter)', explanation: '返回分组级别的位掩码标识', tip: '便于程序化处理不同汇总级别' },
          { code: 'HAVING SUM(amount) > 1000', explanation: '只显示销售额超过1000的汇总', tip: '在聚合后过滤' },
        ]}
      />

      <CodeBlock
        title="CUBE 生成的所有组合"
        code={`-- CUBE(A, B) 生成：
-- (A, B)  -- 详细交叉
-- (A)    -- A 的汇总
-- (B)    -- B 的汇总
-- ()     -- 总计

-- CUBE(A, B, C) 生成 8 种组合：
-- (A, B, C), (A, B), (A, C), (B, C)
-- (A), (B), (C), ()

-- 适合多维度 OLAP 分析`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">多维分析实战</h3>

      <CodeBlock
        title="销售数据多维分析"
        code={`-- 创建销售数据表
CREATE TABLE sales (
    region VARCHAR,
    product_category VARCHAR,
    quarter VARCHAR,
    amount DECIMAL(10,2)
);

INSERT INTO sales VALUES
    ('East', 'Electronics', 'Q1', 1000),
    ('East', 'Electronics', 'Q2', 1200),
    ('East', 'Clothing', 'Q1', 500),
    ('West', 'Electronics', 'Q1', 800),
    ('West', 'Electronics', 'Q2', 900),
    ('West', 'Clothing', 'Q1', 300);`}
        {...noteProps('code4')}
      />

      <CodeBlock
        title="完整的多维分析查询"
        code={`-- 使用 CUBE 进行全方位分析
SELECT
    COALESCE(region, '总计') AS region,
    COALESCE(product_category, '所有类别') AS category,
    COALESCE(quarter, '全年') AS quarter,
    SUM(amount) AS total_amount,
    ROUND(AVG(amount), 2) AS avg_amount,
    COUNT(*) AS order_count,
    CASE
        WHEN GROUPING_ID(region, product_category, quarter) = 0 THEN '详细'
        WHEN GROUPING_ID(region, product_category, quarter) = 1 THEN '季度汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 2 THEN '类别汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 3 THEN '地区汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 4 THEN '产品汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 5 THEN '地区+产品汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 6 THEN '类别+季度汇总'
        WHEN GROUPING_ID(region, product_category, quarter) = 7 THEN '总计'
    END AS summary_level
FROM sales
GROUP BY CUBE (region, product_category, quarter)
ORDER BY
    GROUPING_ID(region, product_category, quarter),
    region, product_category, quarter;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化建议</h3>

      <InfoBox type="tip" title="高级聚合优化" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>索引策略：</strong> 在分组列上创建复合索引</li>
          <li><strong>查询重写：</strong> 用 UNION ALL 改写复杂的 CUBE 查询</li>
          <li><strong>预计算：</strong> 考虑物化视图存储常用汇总</li>
          <li><strong>内存管理：</strong> 大数据集时注意内存使用</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="优化技巧"
        code={`-- 1. 只选择需要的汇总级别
SELECT region, SUM(amount)
FROM sales
GROUP BY GROUPING SETS ((region), ());  -- 只保留地区汇总和总计

-- 2. 使用物化视图缓存汇总结果
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
    region, product_category, quarter,
    SUM(amount) as total_amount,
    COUNT(*) as order_count
FROM sales
GROUP BY CUBE (region, product_category, quarter);

-- 3. 增量刷新物化视图（如果支持）
REFRESH MATERIALIZED VIEW sales_summary;`}
        {...noteProps('code6')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box3')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：创建员工部门数据</p>
            <p>创建包含部门、职位级别、薪资的员工表，然后用 ROLLUP 生成层级汇总。</p>
          </div>
          <div>
            <p className="font-semibold">任务 2：销售数据立方体</p>
            <p>用 CUBE 分析按地区、产品、时间的销售数据，找出最佳的汇总级别。</p>
          </div>
          <div>
            <p className="font-semibold">任务 3：性能对比</p>
            <p>比较传统 UNION ALL 方法和高级聚合的性能差异。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
