import { CodeBlock } from './CodeBlock';
import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLExplainer } from './SQLExplainer';
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
// 数学与统计函数章节
// ============================================

export function MathStatsFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数学与统计函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据分析的基础工具"</p>

      <Paragraph {...noteProps('p1')}>
        数学和统计函数是数据分析的核心。DuckDB 提供了丰富的数值计算、统计分析函数，帮助我们从原始数据中提取有价值的洞察。
      </Paragraph>

      <DataFlowAnimation type="group" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本数学函数</h3>

      <CodeBlock
        title="算术运算与取整"
        code={`SELECT
    ABS(-5.7) AS abs_value,        -- 绝对值: 5.7
    ROUND(3.14159, 2) AS rounded,  -- 四舍五入: 3.14
    CEIL(3.1) AS ceiling,          -- 向上取整: 4
    FLOOR(3.9) AS flooring,         -- 向下取整: 3
    TRUNC(3.14159, 2) AS truncated,-- 截断: 3.14
    MOD(17, 5) AS modulo,          -- 取模: 2
    POWER(2, 3) AS power,          -- 幂运算: 8
    SQRT(16) AS square_root        -- 平方根: 4
FROM concepts LIMIT 1;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">三角函数与对数</h3>

      <CodeBlock
        title="高级数学函数"
        code={`SELECT
    SIN(RADIANS(30)) AS sine_30,     -- 正弦(30度): 0.5
    COS(RADIANS(60)) AS cos_60,      -- 余弦(60度): 0.5
    TAN(RADIANS(45)) AS tan_45,      -- 正切(45度): 1
    ASIN(0.5) * 180 / PI() AS arcsin_degrees,  -- 反正弦转角度

    LN(10) AS natural_log,           -- 自然对数: 2.302585
    LOG10(100) AS log_base_10,       -- 常用对数: 2
    LOG(2, 8) AS log_base_2_of_8,    -- 对数运算: 3

    EXP(1) AS euler_number,          -- e: 2.718281
    PI() AS pi_constant              -- π: 3.141592
FROM concepts LIMIT 1;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">统计函数</h3>

      <SQLExplainer
        sql={`SELECT
    COUNT(*) AS total_count,
    COUNT(DISTINCT parent_id) AS unique_parents,
    SUM(LENGTH(name)) AS total_name_length,
    AVG(LENGTH(name)) AS avg_name_length,
    MIN(LENGTH(name)) AS min_name_length,
    MAX(LENGTH(name)) AS max_name_length,
    STDDEV(LENGTH(name)) AS std_dev_length,
    VARIANCE(LENGTH(name)) AS variance_length
FROM concepts;`}
        explanations={[
          { code: 'COUNT(*)', explanation: '计算总行数', tip: '包括 NULL 值' },
          { code: 'COUNT(DISTINCT column)', explanation: '计算唯一值的数量', tip: '自动去重' },
          { code: 'SUM(), AVG(), MIN(), MAX()', explanation: '求和、平均值、最小值、最大值', tip: '基本的聚合统计' },
          { code: 'STDDEV(), VARIANCE()', explanation: '标准差和方差', tip: '衡量数据分散程度' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">窗口统计函数</h3>

      <CodeBlock
        title="移动平均与累计统计"
        code={`-- 为概念按ID排序，计算移动统计
SELECT
    id, name,
    LENGTH(name) AS name_length,

    -- 移动平均（当前行及前2行）
    AVG(LENGTH(name)) OVER (
        ORDER BY id
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3,

    -- 累计和
    SUM(LENGTH(name)) OVER (
        ORDER BY id
        ROWS UNBOUNDED PRECEDING
    ) AS cumulative_sum,

    -- 百分位数
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY LENGTH(name)) OVER () AS median_length,

    -- 排名
    ROW_NUMBER() OVER (ORDER BY LENGTH(name) DESC) AS length_rank

FROM concepts
ORDER BY id;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">概率分布函数</h3>

      <CodeBlock
        title="正态分布与统计检验"
        code={`-- 正态分布累积概率
SELECT
    NORMAL_CDF(0, 0, 1) AS standard_normal_at_0,  -- 标准正态在0的累积概率

    -- 计算Z分数
    (LENGTH(name) - AVG(LENGTH(name)) OVER ()) /
    NULLIF(STDDEV(LENGTH(name)) OVER (), 0) AS z_score,

    -- 百分位数
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY LENGTH(name)) OVER () AS q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY LENGTH(name)) OVER () AS q3,

    -- 四分位距
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY LENGTH(name)) OVER () -
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY LENGTH(name)) OVER () AS iqr

FROM concepts;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">随机函数</h3>

      <CodeBlock
        title="随机数生成与采样"
        code={`-- 随机函数
SELECT
    RANDOM() AS random_float,        -- 0-1之间的随机浮点数
    RANDOM(42) AS seeded_random,     -- 带种子的随机数（可重现）

    -- 随机选择
    CASE WHEN RANDOM() < 0.5 THEN 'Heads' ELSE 'Tails' END AS coin_flip,

    -- 随机排序
    ROW_NUMBER() OVER (ORDER BY RANDOM()) AS random_order

FROM concepts
ORDER BY RANDOM()  -- 随机顺序显示
LIMIT 5;

-- 采样函数
SELECT * FROM concepts
USING SAMPLE 10%                    -- 随机采样10%
-- USING SAMPLE 100 ROWS           -- 固定数量采样
-- USING SAMPLE SYSTEM(10%)        -- 系统采样（更快但不完全随机）
ORDER BY id;`}
        {...noteProps('code5')}
      />

      <InfoBox type="tip" title="数学函数使用建议" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>数据类型：</strong> 确保输入是数值类型，必要时使用 CAST 转换</li>
          <li><strong>NULL 处理：</strong> 统计函数会自动忽略 NULL 值，但数学函数可能返回 NULL</li>
          <li><strong>精度问题：</strong> 浮点数运算可能有精度误差，重要计算考虑使用 DECIMAL</li>
          <li><strong>性能考虑：</strong> 复杂的数学运算在大数据集上可能较慢</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📊 数据质量分析</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">计算数据分布、异常值检测、统计摘要</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">📈 时间序列分析</h4>
          <p className="text-sm text-green-600 dark:text-green-400">移动平均、趋势分析、季节性检测</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">🎯 A/B测试分析</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">显著性检验、置信区间计算</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">🔢 数值数据处理</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">标准化、归一化、离散化</p>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 计算概念名称长度的统计分布（平均值、标准差、四分位数）</p>
          <p><strong>挑战 2：</strong> 找出长度异常的概念（超出2倍标准差）</p>
          <p><strong>挑战 3：</strong> 创建一个随机采样函数，返回指定比例的数据</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 类型转换函数章节
// ============================================

export function TypeConversionSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">类型转换函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据类型的桥梁，连接不同格式"</p>

      <Paragraph {...noteProps('p1')}>
        类型转换是数据处理的基础。不同数据源、不同格式的数据需要统一处理，DuckDB 提供了丰富的类型转换函数，确保数据在不同操作间正确流动。
      </Paragraph>

      <DataFlowAnimation type="transform" />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CAST 与 CONVERT</h3>

      <SQLExplainer
        sql={`-- CAST 标准语法
SELECT
    CAST('123' AS INTEGER) AS str_to_int,
    CAST(123.45 AS INTEGER) AS float_to_int,
    CAST(123 AS VARCHAR) AS int_to_str,
    CAST('true' AS BOOLEAN) AS str_to_bool,
    CAST('2024-01-01' AS DATE) AS str_to_date
FROM concepts LIMIT 1;

-- 简写语法
SELECT
    '123'::INTEGER AS str_to_int,
    123.45::INTEGER AS float_to_int,
    123::VARCHAR AS int_to_str
FROM concepts LIMIT 1;`}
        explanations={[
          { code: 'CAST(value AS type)', explanation: '标准 SQL 类型转换语法', tip: '最通用和兼容的写法' },
          { code: 'value::type', explanation: 'PostgreSQL 风格的简写语法', tip: 'DuckDB 也支持这种简洁写法' },
          { code: '类型兼容性', explanation: '不是所有类型都能相互转换', tip: '转换失败会抛出错误或返回 NULL' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">字符串转数值</h3>

      <CodeBlock
        title="安全类型转换"
        code={`-- TRY_CAST 安全转换（转换失败返回 NULL）
SELECT
    TRY_CAST('123' AS INTEGER) AS safe_int,      -- 123
    TRY_CAST('abc' AS INTEGER) AS invalid_int,   -- NULL
    TRY_CAST('123.45' AS DECIMAL) AS str_decimal, -- 123.45
    TRY_CAST(NULL AS INTEGER) AS null_cast       -- NULL
FROM concepts LIMIT 1;

-- 带默认值的转换
SELECT
    COALESCE(TRY_CAST(price_str AS DECIMAL), 0.0) AS safe_price,
    COALESCE(TRY_CAST(date_str AS DATE), CURRENT_DATE) AS safe_date
FROM raw_data;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数值格式化</h3>

      <CodeBlock
        title="数值显示格式控制"
        code={`SELECT
    123.456789::VARCHAR AS default_format,        -- '123.456789'

    -- 科学计数法
    FORMAT('%.2e', 123.456789) AS scientific,      -- '1.23e+02'

    -- 固定小数位
    FORMAT('%.2f', 123.456789) AS fixed_2,         -- '123.46'
    FORMAT('%.0f', 123.456789) AS fixed_0,         -- '123'

    -- 千分位分隔符
    FORMAT('%,.0f', 1234567.89) AS comma_sep,      -- '1,234,568'

    -- 百分比
    FORMAT('%.1f%%', 0.1234 * 100) AS percentage,  -- '12.3%'

    -- 货币格式
    '$' || FORMAT('%,.2f', 1234.56) AS currency    -- '$1,234.56'
FROM concepts LIMIT 1;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">日期时间转换</h3>

      <CodeBlock
        title="日期时间格式转换"
        code={`-- 字符串转日期时间
SELECT
    '2024-01-01'::DATE AS iso_date,
    '2024-01-01 14:30:00'::TIMESTAMP AS iso_timestamp,
    '01/15/2024'::DATE AS us_date,      -- MM/DD/YYYY
    '15-Jan-2024'::DATE AS text_date
FROM concepts LIMIT 1;

-- 日期时间转字符串
SELECT
    CURRENT_DATE::VARCHAR AS date_str,
    CURRENT_TIMESTAMP::VARCHAR AS timestamp_str,

    -- 自定义格式
    STRFTIME(CURRENT_DATE, '%Y年%m月%d日') AS chinese_date,
    STRFTIME(CURRENT_TIMESTAMP, '%Y-%m-%d %H:%M:%S') AS formatted_time
FROM concepts LIMIT 1;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JSON 数据转换</h3>

      <CodeBlock
        title="JSON 解析与生成"
        code={`-- 创建测试数据
CREATE TABLE json_examples AS
SELECT '{"name": "Alice", "age": 30, "active": true}' AS user_json
UNION ALL
SELECT '{"name": "Bob", "age": 25, "scores": [85, 92, 78]}' AS user_json;

-- JSON 解析
SELECT
    user_json,
    user_json->'$.name' AS extracted_name,
    user_json->'$.age' AS extracted_age,
    user_json->'$.active' AS extracted_active,

    -- 数组访问
    user_json->'$.scores[0]' AS first_score,
    JSON_EXTRACT(user_json, '$.name') AS json_extract_name,

    -- 类型转换
    (user_json->'$.age')::INTEGER AS age_as_int,
    (user_json->'$.active')::BOOLEAN AS active_as_bool

FROM json_examples;

-- JSON 生成
SELECT
    JSON_OBJECT('name', 'Charlie', 'age', 35) AS person_json,
    JSON_ARRAY(1, 2, 3, 'four') AS number_array,
    JSON_QUOTE('Hello "World"') AS quoted_string
FROM concepts LIMIT 1;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数组与结构体转换</h3>

      <CodeBlock
        title="复杂数据类型转换"
        code={`-- 数组操作
SELECT
    ARRAY[1, 2, 3] AS int_array,
    ['a', 'b', 'c'] AS str_array,

    -- 数组转字符串
    ARRAY_TO_STRING([1, 2, 3], ', ') AS array_to_str,

    -- 字符串转数组
    STRING_TO_ARRAY('a,b,c', ',') AS str_to_array,

    -- 数组包含检查
    CONTAINS([1, 2, 3], 2) AS contains_check
FROM concepts LIMIT 1;

-- 结构体（Map）操作
SELECT
    MAP(['name', 'age'], ['Alice', '30']) AS person_map,

    -- 结构体访问
    MAP(['name', 'age'], ['Alice', '30'])->'name' AS map_name,

    -- 结构体转 JSON
    TO_JSON(MAP(['name', 'age'], ['Alice', '30'])) AS map_to_json
FROM concepts LIMIT 1;`}
        {...noteProps('code5')}
      />

      <InfoBox type="tip" title="类型转换最佳实践" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>安全转换：</strong> 使用 TRY_CAST 避免转换失败导致的错误</li>
          <li><strong>性能考虑：</strong> 类型转换有性能开销，尽量在数据加载时进行</li>
          <li><strong>格式标准化：</strong> 建立统一的数据格式规范</li>
          <li><strong>错误处理：</strong> 对于不可预期的转换，使用 COALESCE 提供默认值</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📊 ETL 过程</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">数据抽取、转换、加载过程中的格式统一</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🔄 API 数据集成</h4>
          <p className="text-sm text-green-600 dark:text-green-400">处理不同 API 返回的数据格式</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">📱 用户输入处理</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">表单数据验证和类型转换</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">📈 报表生成</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">数值格式化、日期显示格式控制</p>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 创建一个通用的字符串转数值的安全转换函数</p>
          <p><strong>挑战 2：</strong> 实现日期字符串的智能解析（支持多种格式）</p>
          <p><strong>挑战 3：</strong> 构建一个数据类型检测和自动转换的工具函数</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 正则表达式函数章节
// ============================================

export function RegexFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">正则表达式函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"模式匹配的高级工具，文本处理的瑞士军刀"</p>

      <Paragraph {...noteProps('p1')}>
        正则表达式是处理复杂文本模式的强大工具。DuckDB 支持完整的正则表达式语法，包括匹配、替换、分组捕获等高级功能，是数据清洗和文本分析的必备利器。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">regexp_matches - 匹配检测</h3>

      <SQLExplainer
        sql={`-- 基本匹配
SELECT
    name,
    REGEXP_MATCHES(name, '^A') AS starts_with_a,
    REGEXP_MATCHES(name, 'al$') AS ends_with_al,
    REGEXP_MATCHES(name, '[aeiou]') AS has_vowel
FROM concepts;

-- 返回匹配的子串数组
SELECT
    name,
    REGEXP_MATCHES(name, '[aeiou]+') AS vowels,
    REGEXP_MATCHES(name, '\\d+') AS numbers
FROM concepts;`}
        explanations={[
          { code: 'REGEXP_MATCHES(text, pattern)', explanation: '检查文本是否匹配正则表达式', tip: '返回匹配的子串数组或 NULL' },
          { code: '^A', explanation: '以 A 开头的模式', tip: '^ 表示字符串开始' },
          { code: 'al$', explanation: '以 al 结尾的模式', tip: '$ 表示字符串结束' },
          { code: '[aeiou]', explanation: '包含任意元音字母', tip: '字符集合匹配' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">regexp_replace - 文本替换</h3>

      <CodeBlock
        title="正则表达式替换"
        code={`-- 基本替换
SELECT
    name,
    REGEXP_REPLACE(name, '([aeiou])', UPPER('\\1')) AS vowel_upper,
    REGEXP_REPLACE(name, '\\s+', '_') AS space_to_underscore
FROM concepts;

-- 分组替换
SELECT
    'John Doe' AS original,
    REGEXP_REPLACE('John Doe', '(\\w+)\\s+(\\w+)', '\\2, \\1') AS swapped;

-- 清理数据
SELECT
    messy_text,
    REGEXP_REPLACE(messy_text, '\\s+', ' ') AS single_spaces,
    REGEXP_REPLACE(messy_text, '[^a-zA-Z0-9\\s]', '') AS clean_text
FROM raw_data;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分组捕获</h3>

      <CodeBlock
        title="提取分组内容"
        code={`-- 提取日期部分
SELECT
    log_entry,
    REGEXP_MATCHES(log_entry, '(\\d{4})-(\\d{2})-(\\d{2})') AS date_parts,
    REGEXP_EXTRACT(log_entry, '(\\d{4})-(\\d{2})-(\\d{2})', 1) AS year,
    REGEXP_EXTRACT(log_entry, '(\\d{4})-(\\d{2})-(\\d{2})', 2) AS month,
    REGEXP_EXTRACT(log_entry, '(\\d{4})-(\\d{2})-(\\d{2})', 3) AS day
FROM logs;

-- 解析 URL
SELECT
    url,
    REGEXP_MATCHES(url, 'https?://([^:/]+)(?::(\\d+))?(/.*)?') AS url_parts,
    REGEXP_EXTRACT(url, 'https?://([^:/]+)', 1) AS domain,
    REGEXP_EXTRACT(url, 'https?://[^/]+(/.*)?', 1) AS path
FROM web_logs;

-- 提取邮箱
SELECT
    text,
    REGEXP_MATCHES(text, '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})') AS emails,
    REGEXP_EXTRACT(text, '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)', 1) AS username,
    REGEXP_EXTRACT(text, '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)', 2) AS domain
FROM messages;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级模式匹配</h3>

      <CodeBlock
        title="复杂正则表达式"
        code={`-- 贪婪 vs 非贪婪匹配
SELECT
    '<div>content</div><div>more</div>' AS html,
    REGEXP_MATCHES(html, '<div>.*</div>') AS greedy_match,
    REGEXP_MATCHES(html, '<div>.*?</div>') AS lazy_match;

-- 后向断言（如果支持）
SELECT
    text,
    REGEXP_MATCHES(text, '\\b\\w+(?=\\s+is\\s+\\w+\\b)') AS words_before_is
FROM sentences;

-- 复杂数据提取
SELECT
    config_text,
    -- 提取键值对
    REGEXP_MATCHES(config_text, '(\\w+)=([^;\\n]+)') AS key_value_pairs,
    -- 提取 IP 地址
    REGEXP_MATCHES(config_text, '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b') AS ips,
    -- 提取版本号
    REGEXP_MATCHES(config_text, '\\b\\d+\\.\\d+(?:\\.\\d+)*\\b') AS versions
FROM config_files;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化与技巧</h3>

      <InfoBox type="tip" title="正则表达式优化" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>锚定匹配：</strong> 使用 ^ 和 $ 避免全字符串扫描</li>
          <li><strong>预编译：</strong> 复杂正则表达式可以预编译提高性能</li>
          <li><strong>贪婪控制：</strong> 根据需要选择贪婪或非贪婪匹配</li>
          <li><strong>转义处理：</strong> 注意特殊字符的转义</li>
          <li><strong>测试验证：</strong> 在小数据集上测试正则表达式正确性</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="性能对比与优化"
        code={`-- 低效：没有锚定的匹配
SELECT * FROM logs WHERE REGEXP_MATCHES(message, 'ERROR');

-- 优化：使用行首锚定
SELECT * FROM logs WHERE REGEXP_MATCHES(message, '^ERROR');

-- 进一步优化：结合索引
CREATE INDEX idx_logs_message ON logs(message);
SELECT * FROM logs WHERE message LIKE 'ERROR%';

-- 复杂数据提取的优化写法
SELECT
    id,
    CASE WHEN REGEXP_MATCHES(data, 'pattern1') THEN 'type1'
         WHEN REGEXP_MATCHES(data, 'pattern2') THEN 'type2'
         ELSE 'unknown' END AS data_type
FROM raw_data;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🔍 日志分析</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">提取错误信息、IP地址、时间戳、用户ID</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🧹 数据清洗</h4>
          <p className="text-sm text-green-600 dark:text-green-400">移除特殊字符、标准化格式、提取关键信息</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">📧 邮件处理</h4>
          <p className="text-sm text-purple-600 dark:text-purple-400">邮箱验证、域名提取、内容过滤</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">🔗 URL 解析</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">域名提取、路径分析、参数解析</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">常用正则表达式模式</h3>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">用途</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">正则表达式</th>
              <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">示例</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">邮箱</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{'{2,'}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">user@example.com</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">IP地址</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">192.168.1.1</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">日期</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">\\d{4}-\\d{2}-\\d{2}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">2024-01-15</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">电话</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}</td>
              <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">(555) 123-4567</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 从日志文件中提取所有错误信息和时间戳</p>
          <p><strong>挑战 2：</strong> 创建一个邮箱验证和域名提取的工具函数</p>
          <p><strong>挑战 3：</strong> 实现一个通用的数据清理函数，使用正则表达式处理常见的数据质量问题</p>
        </div>
      </InfoBox>
    </div>
  );
}
