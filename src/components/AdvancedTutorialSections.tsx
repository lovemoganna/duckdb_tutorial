// 高级教程组件
import { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLFlowDiagram } from './SQLFlowDiagram';

interface SectionProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
}

export function DistributedConceptsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分布式基础概念</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从单机到分布式，架构的进化"</p>

      <Paragraph {...noteProps('p1')}>
        分布式系统是将单个应用程序拆分到多个服务器上运行的架构设计。本节我们将学习如何在分布式环境中使用 DuckDB。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分布式架构的核心概念</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔄 数据分片 (Sharding)</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            将大数据集分割成更小的片段，分布在不同节点上存储。
          </p>
      <CodeBlock
            title="水平分片示例"
            code={`-- 按用户ID范围分片
-- 节点1: user_id 1-10000
-- 节点2: user_id 10001-20000
-- 节点3: user_id 20001+

SELECT * FROM users
WHERE user_id BETWEEN 1 AND 10000;`}
        {...noteProps('code1')}
      />
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🔗 数据复制 (Replication)</h4>
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            将相同数据存储在多个节点上，提高可用性和读取性能。
          </p>
      <CodeBlock
            title="主从复制架构"
            code={`-- 主节点写入
INSERT INTO orders (user_id, amount)
VALUES (12345, 99.99);

-- 从节点读取（只读）
SELECT * FROM orders_replica
WHERE user_id = 12345;`}
        {...noteProps('code2')}
      />
        </div>
    </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CAP 定理</h3>

      <Paragraph {...noteProps('p2')}>
        CAP 定理指出：分布式系统不可能同时满足以下三点：
      </Paragraph>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-bold text-purple-800 dark:text-purple-300">一致性 (Consistency)</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">所有节点看到相同的数据</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-bold text-pink-800 dark:text-pink-300">可用性 (Availability)</h4>
            <p className="text-sm text-pink-700 dark:text-pink-400">系统始终能响应请求</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🌐</div>
            <h4 className="font-bold text-indigo-800 dark:text-indigo-300">分区容忍性 (Partition tolerance)</h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">网络分区时仍能工作</p>
          </div>
        </div>
        <p className="text-center mt-4 text-slate-600 dark:text-slate-400">
          <strong>最多只能满足其中两项！</strong>
        </p>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">DuckDB 分布式查询</h3>

      <CodeBlock
        title="分布式查询示例"
        code={`-- 使用 ATTACH 连接多个数据库
ATTACH 'data/node1.db' AS node1;
ATTACH 'data/node2.db' AS node2;

-- 跨节点查询
SELECT 
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.amount) as total_amount
FROM node1.users u
LEFT JOIN node2.orders o ON u.id = o.user_id
GROUP BY u.name
ORDER BY total_amount DESC;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        思考：在设计分布式系统时，你会选择 CP 还是 AP 架构？为什么？
      </InfoBox>
    </div>
  );
}

export function BigDataConceptsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">大数据基础</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"处理海量数据的技术与策略"</p>

      <Paragraph {...noteProps('p1')}>
        大数据处理需要特殊的架构设计和技术栈。本节我们学习如何使用 DuckDB 处理大规模数据集。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">大数据的 5V 特征</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {[
          { icon: '📊', title: 'Volume (体量)', desc: '数据规模巨大，从 TB 到 PB 级' },
          { icon: '🏃', title: 'Velocity (速度)', desc: '数据产生和处理速度极快' },
          { icon: '🎭', title: 'Variety (多样性)', desc: '数据类型丰富：结构化、半结构化、非结构化' },
          { icon: '🎯', title: 'Veracity (真实性)', desc: '数据质量和准确性' },
          { icon: '💎', title: 'Value (价值)', desc: '从海量数据中提取价值' },
        ].map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <div className="text-2xl mb-2">{item.icon}</div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{item.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
        </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">DuckDB 大数据处理特性</h3>

      <CodeBlock
        title="处理大型 CSV 文件"
        code={`-- 直接查询大型 CSV 文件
SELECT
    COUNT(*) as total_rows,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM read_csv('large_dataset.csv');

-- 分组聚合分析
SELECT
    department,
    COUNT(*) as employee_count,
    ROUND(AVG(salary), 2) as avg_salary,
    SUM(salary) as total_salary
FROM read_csv('employees.csv')
GROUP BY department
ORDER BY total_salary DESC
LIMIT 10;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">内存优化技术</h3>

      <CodeBlock
        title="内存高效查询"
        code={`-- 使用 APPROXIMATE 查询处理超大数据
SELECT APPROXIMATE COUNT(DISTINCT user_id) as unique_users
FROM read_parquet('logs/*.parquet');

-- 采样分析
SELECT 
    category,
    APPROXIMATE COUNT(*) as approx_count,
    AVG(price) as avg_price
FROM read_csv('products.csv')
USING SAMPLE 10%  -- 只使用 10% 的数据
GROUP BY category;`}
        {...noteProps('code2')}
      />
    </div>
  );
}

export function MLConceptsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">ML 与数据库集成</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"用 SQL 驱动机器学习工作流"</p>

      <Paragraph {...noteProps('p1')}>
        现代机器学习工作流中，数据准备和特征工程往往比模型训练更耗时。本节学习如何使用 SQL 优化 ML 数据管道。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">特征工程与 SQL</h3>

      <CodeBlock
        title="特征工程示例"
        code={`-- 数据预处理和特征工程
CREATE TABLE ml_features AS
SELECT 
    user_id,
    -- 时间特征
    EXTRACT(hour FROM signup_date) as signup_hour,
    EXTRACT(dow FROM signup_date) as signup_day_of_week,

    -- 行为特征
    COUNT(orders.id) as total_orders,
    SUM(order_amount) as total_spent,
    AVG(order_amount) as avg_order_value,
    MAX(order_amount) as max_order_value,

    -- 统计特征
    STDDEV(order_amount) as order_stddev,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_amount) as median_order,

    -- 类别特征编码
    CASE
        WHEN country IN ('US', 'CA') THEN 'north_america'
        WHEN country IN ('UK', 'DE', 'FR') THEN 'europe'
        ELSE 'other'
    END as region_group,

    -- 目标变量
    CASE WHEN churn_date IS NOT NULL THEN 1 ELSE 0 END as churned

FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE signup_date >= '2023-01-01'
GROUP BY user_id, signup_date, country, churn_date;`}
        {...noteProps('code1')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        思考：特征工程中，哪些SQL函数对机器学习最有用？为什么？
      </InfoBox>
    </div>
  );
}

// ============================================
// 事务处理章节
// ============================================

export function TransactionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">事务处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据一致性的守护者"</p>

      <Paragraph {...noteProps('p1')}>
        事务（Transaction）是数据库操作的基本单位，它确保一系列操作要么全部成功，要么全部失败，维护数据的一致性。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ACID 属性</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🔒 原子性 (Atomicity)</h4>
          <p className="text-sm text-green-700 dark:text-green-400">
            事务中的所有操作要么全部完成，要么全部不完成。
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔄 一致性 (Consistency)</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            事务执行前后，数据库从一个一致状态转换到另一个一致状态。
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3">🚫 隔离性 (Isolation)</h4>
          <p className="text-sm text-purple-700 dark:text-purple-400">
            并发执行的事务互不干扰，每个事务都感觉自己在独占数据库。
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3">💾 持久性 (Durability)</h4>
          <p className="text-sm text-orange-700 dark:text-orange-400">
            一旦事务提交，其结果就是永久性的，即使系统崩溃也不会丢失。
          </p>
        </div>
      </div>

      <CodeBlock
        title="事务的基本用法"
        code={`-- 开始事务
BEGIN TRANSACTION;

-- 执行一系列操作
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- 提交事务
COMMIT;

-- 或者回滚事务
-- ROLLBACK;`}
        {...noteProps('code1')}
      />

      <InfoBox type="warning" title="事务使用注意事项" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>长时间运行的事务会阻塞其他操作</li>
          <li>事务失败时要及时回滚，释放资源</li>
          <li>在合适的时候使用合适的事务隔离级别</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// ============================================
// 字符串函数章节
// ============================================

export function StringFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">字符串函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"文本处理的强大工具"</p>

      <Paragraph {...noteProps('p1')}>
        字符串函数用于处理文本数据，是 SQL 中最常用的函数类型之一。
      </Paragraph>

      <CodeBlock
        title="常用字符串函数"
        code={`SELECT
    -- 大小写转换
    UPPER('hello world') AS upper_case,      -- 'HELLO WORLD'
    LOWER('HELLO WORLD') AS lower_case,      -- 'hello world'

    -- 字符串连接
    CONCAT('Hello', ' ', 'World') AS greeting,  -- 'Hello World'

    -- 子串提取
    SUBSTRING('Hello World', 7, 5) AS substr,   -- 'World'

    -- 字符串长度
    LENGTH('Hello') AS str_length,             -- 5

    -- 字符串替换
    REPLACE('Hello World', 'World', 'SQL') AS replaced,  -- 'Hello SQL'

    -- 去除空格
    TRIM('  Hello  ') AS trimmed,              -- 'Hello'
    LTRIM('  Hello') AS ltrimmed,              -- 'Hello'
    RTRIM('Hello  ') AS rtrimmed               -- 'Hello'
FROM dual;`}
        {...noteProps('code1')}
      />

      <InfoBox type="tip" title="字符串函数最佳实践" {...noteProps('box2')}>
        <ul className="list-disc ml-4 space-y-1">
          <li>使用 UPPER/LOWER 进行大小写不敏感的比较</li>
          <li>TRIM 函数可以去除意外的空白字符</li>
          <li>CONCAT 函数在连接多个字符串时很有用</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// ============================================
// 日期时间函数章节
// ============================================

export function DateTimeFunctionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">日期时间函数</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"时间的艺术与科学"</p>

      <Paragraph {...noteProps('p1')}>
        日期时间函数用于处理时间相关的数据，是时间序列分析和业务 intelligence 的基础。
      </Paragraph>

      <CodeBlock
        title="日期时间函数示例"
        code={`SELECT
    -- 当前时间
    CURRENT_DATE AS today,                    -- 2024-01-01
    CURRENT_TIME AS now_time,                 -- 12:34:56
    CURRENT_TIMESTAMP AS now_full,            -- 2024-01-01 12:34:56

    -- 日期提取
    EXTRACT(YEAR FROM CURRENT_DATE) AS year,      -- 2024
    EXTRACT(MONTH FROM CURRENT_DATE) AS month,    -- 1
    EXTRACT(DAY FROM CURRENT_DATE) AS day,        -- 1
    EXTRACT(DOW FROM CURRENT_DATE) AS day_of_week,-- 0-6 (周日=0)

    -- 日期运算
    CURRENT_DATE + INTERVAL '1 day' AS tomorrow,          -- 明天
    CURRENT_DATE + INTERVAL '1 month' AS next_month,      -- 下个月
    CURRENT_DATE - INTERVAL '1 year' AS last_year,        -- 去年

    -- 日期格式化
    STRFTIME(CURRENT_DATE, '%Y-%m-%d') AS formatted_date, -- '2024-01-01'
    STRFTIME(CURRENT_TIMESTAMP, '%Y/%m/%d %H:%M:%S') AS full_format

FROM dual;`}
        {...noteProps('code1')}
      />

      <InfoBox type="experiment" title="时间计算练习" {...noteProps('box1')}>
        计算用户注册30天后的日期，并判断是否为周末。
      </InfoBox>
    </div>
  );
}

// ============================================
// 条件表达式章节
// ============================================

export function ConditionalExpressionsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">条件表达式</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SQL 中的逻辑判断"</p>

      <Paragraph {...noteProps('p1')}>
        条件表达式允许在查询中进行逻辑判断，根据不同条件返回不同的值。
      </Paragraph>

      <CodeBlock
        title="CASE 表达式"
        code={`-- 简单 CASE
SELECT
    product_name,
    price,
    CASE
        WHEN price < 100 THEN '便宜'
        WHEN price < 500 THEN '中等'
        ELSE '昂贵'
    END AS price_category
FROM products;

-- 带表达式的 CASE
SELECT
    customer_id,
    total_orders,
    CASE total_orders
        WHEN 0 THEN '新客户'
        WHEN 1 THEN '回头客'
        WHEN 2 THEN '忠实客户'
        ELSE 'VIP客户'
    END AS customer_type
FROM customers;

-- 在聚合中使用 CASE
SELECT
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
    COUNT(*) AS total_orders
FROM orders;`}
        {...noteProps('code1')}
      />

      <CodeBlock
        title="COALESCE 和 NULLIF 函数"
        code={`-- COALESCE: 返回第一个非NULL值
SELECT
    customer_id,
    COALESCE(phone, email, '无联系方式') AS contact_info
FROM customers;

-- NULLIF: 如果两个参数相等返回NULL，否则返回第一个参数
SELECT
    salary,
    NULLIF(salary, 0) AS valid_salary  -- 如果salary为0，返回NULL
FROM employees;

-- 组合使用：提供默认值
SELECT
    department,
    COALESCE(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department;`}
        {...noteProps('code2')}
      />
    </div>
  );
}

// ============================================
// 数据类型章节
// ============================================

export function DataTypesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据类型详解</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"选择正确的数据类型，事半功倍"</p>

      <Paragraph {...noteProps('p1')}>
        正确选择数据类型不仅影响存储效率，还关系到查询性能和数据完整性。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数值类型</h3>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">类型</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">存储大小</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">范围</th>
              <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">TINYINT</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">1字节</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">-128 到 127</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">小整数，如状态码</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">INTEGER</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">4字节</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">-2^31 到 2^31-1</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">标准整数</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">BIGINT</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">8字节</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">-2^63 到 2^63-1</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">大整数，如ID</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-mono">DECIMAL</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">变长</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">精确小数</td>
              <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">货币金额</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">字符串类型</h3>

      <CodeBlock
        title="字符串类型选择"
        code={`-- VARCHAR(n): 变长字符串，最大n个字符
CREATE TABLE users (
    username VARCHAR(50) NOT NULL,    -- 用户名，最多50字符
    email VARCHAR(255) NOT NULL,      -- 邮箱，最多255字符
    bio VARCHAR(1000)                 -- 个人简介，可为空
);

-- 实际存储空间根据内容长度变化
-- 适合长度变化大的字符串`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">日期时间类型</h3>

      <CodeBlock
        title="日期时间类型"
        code={`-- DATE: 日期（年-月-日）
CREATE TABLE events (
    event_date DATE,                  -- 2024-01-01
    title VARCHAR(200)
);

-- TIME: 时间（时:分:秒）
CREATE TABLE schedules (
    start_time TIME,                  -- 09:30:00
    duration INTERVAL                 -- 2 hours
);

-- TIMESTAMP: 完整时间戳
CREATE TABLE logs (
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT
);

-- INTERVAL: 时间间隔
SELECT
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1 day' AS tomorrow,
    CURRENT_TIMESTAMP + INTERVAL '2 hours' AS later;`}
        {...noteProps('code2')}
      />

      <InfoBox type="tip" title="数据类型选择原则" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>够用即可：</strong>不要过度追求大范围，选择满足业务需求的类型</li>
          <li><strong>考虑性能：</strong>更小的数据类型通常有更好的性能</li>
          <li><strong>保持一致：</strong>相同含义的数据在不同表中使用相同类型</li>
          <li><strong>预留空间：</strong>为未来增长预留一些空间</li>
        </ul>
      </InfoBox>
    </div>
  );
}