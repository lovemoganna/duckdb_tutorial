// ============================================
// 架构设计章节组件
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
// 扩展插件章节
// ============================================

export function ExtensionsPluginsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">扩展与插件系统</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"让 DuckDB 无限可能的扩展机制"</p>

      <Paragraph {...noteProps('p1')}>
        DuckDB 的扩展系统是其核心竞争力之一。通过插件化的架构，你可以根据具体需求加载不同的功能模块，而不影响核心数据库的轻量化特性。从数据格式支持到高级分析算法，扩展插件让 DuckDB 成为真正的"数据瑞士军刀"。
      </Paragraph>

      <InfoBox type="fastai" title="扩展系统的三大优势" {...noteProps('advantages')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">按需加载</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">只加载需要的功能，保持轻量化</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl mb-2">🔧</div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">易于维护</h4>
            <p className="text-sm text-green-600 dark:text-green-400">独立更新，不影响核心系统</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">🌐</div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">社区驱动</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">开源社区持续贡献新功能</p>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">核心扩展管理</h3>

      <SQLExplainer
        sql={`-- 1. 查看可用的扩展
SELECT * FROM duckdb_extensions()
ORDER BY extension_name;

-- 2. 安装核心扩展
INSTALL json;      -- JSON 数据处理
INSTALL parquet;   -- Parquet 文件支持
INSTALL httpfs;    -- HTTP/HTTPS 文件系统
INSTALL sqlite;    -- SQLite 数据库集成

-- 3. 自动加载（推荐）
LOAD json;
LOAD parquet;
LOAD httpfs;

-- 4. 一次性安装多个扩展
INSTALL json, parquet, httpfs, spatial, icu;

-- 5. 查看已安装扩展的状态
SELECT
    extension_name,
    loaded,
    install_path,
    description
FROM duckdb_extensions()
WHERE installed = true
ORDER BY extension_name;`}
        explanations={[
          { code: 'INSTALL vs LOAD', explanation: 'INSTALL 下载扩展，LOAD 激活扩展到内存中', tip: '生产环境建议预先安装，避免运行时下载' },
          { code: 'duckdb_extensions()', explanation: '系统函数查看所有可用扩展的状态', tip: '包含官方和社区扩展的完整列表' },
          { code: '自动加载机制', explanation: '扩展安装后会自动注册，可直接使用对应功能', tip: '无需额外配置，开箱即用' },
        ]}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据格式扩展实战</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔷 JSON 数据处理</h4>
          <CodeBlock
            title="JSON 扩展使用示例"
            code={`-- 1. 加载 JSON 扩展
LOAD json;

-- 2. 解析 JSON 字符串
SELECT
    json_extract_string('{"name":"Alice","age":30}', '$.name') AS name,
    json_extract('{"scores":[85,92,78]}', '$.scores') AS scores;

-- 3. 处理嵌套 JSON
CREATE TABLE user_logs AS
SELECT *
FROM read_json('user_logs.json');

-- 4. JSON 到表格转换
SELECT
    id,
    json_extract_string(data, '$.user.name') AS user_name,
    json_extract_string(data, '$.event.type') AS event_type,
    json_extract(data, '$.metadata') AS metadata
FROM json_logs;`}
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">📊 Parquet 文件支持</h4>
          <CodeBlock
            title="Parquet 扩展使用示例"
            code={`-- 1. 加载 Parquet 扩展
LOAD parquet;

-- 2. 读取 Parquet 文件
SELECT *
FROM read_parquet('data/2023/sales_*.parquet')
WHERE date >= '2023-01-01';

-- 3. 写入 Parquet 文件
COPY (
    SELECT *
    FROM sales
    WHERE year = 2023
) TO 'sales_2023.parquet' (FORMAT PARQUET);

-- 4. Parquet 元数据查询
SELECT
    filename,
    file_row_number,
    total_compressed_size,
    total_uncompressed_size
FROM parquet_metadata('large_dataset.parquet');`}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级分析扩展</h3>

      <CodeBlock
        title="空间数据分析扩展"
        code={`-- 1. 安装并加载空间扩展
INSTALL spatial;
LOAD spatial;

-- 2. 创建地理数据表
CREATE TABLE cities AS
SELECT *
FROM read_csv('world_cities.csv');

-- 3. 添加几何列
ALTER TABLE cities ADD COLUMN geom GEOMETRY;

-- 4. 转换为几何对象
UPDATE cities
SET geom = ST_Point(longitude, latitude);

-- 5. 空间查询示例
SELECT
    city_name,
    country,
    ST_Distance(
        ST_Point(longitude, latitude),
        ST_Point(-74.0060, 40.7128)  -- 纽约坐标
    ) / 1000 AS distance_km
FROM cities
WHERE country = 'China'
ORDER BY distance_km
LIMIT 10;

-- 6. 地理空间聚合
SELECT
    country,
    COUNT(*) AS city_count,
    ST_Centroid(ST_Collect(geom)) AS country_center,
    ST_Area(ST_ConvexHull(ST_Collect(geom))) AS area
FROM cities
GROUP BY country
ORDER BY city_count DESC;`}
        {...noteProps('spatial-code')}
      />

      <CodeBlock
        title="统计与机器学习扩展"
        code={`-- 1. 统计扩展（内置，无需额外安装）
SELECT
    column_name,
    count,
    null_percentage,
    distinct_count,
    avg_val,
    std_dev,
    min_val,
    max_val,
    q25, q50, q75  -- 四分位数
FROM (
    SELECT
        unnest(['sales', 'profit', 'employees']) AS column_name,
        unnest([count(sales), count(profit), count(employees)]) AS count,
        unnest([
            sum(case when sales is null then 1 else 0 end)::float/count(*) * 100,
            sum(case when profit is null then 1 else 0 end)::float/count(*) * 100,
            sum(case when employees is null then 1 else 0 end)::float/count(*) * 100
        ]) AS null_percentage
    FROM company_data
) stats;

-- 2. 近似计算扩展（内置）
SELECT
    approx_count_distinct(user_id) AS unique_users,
    approx_quantile(sales, 0.5) AS median_sales,
    approx_quantile(sales, [0.25, 0.75]) AS quartiles
FROM user_transactions
WHERE transaction_date >= '2023-01-01';`}
        {...noteProps('stats-code')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">扩展开发与自定义</h3>

      <InfoBox type="tip" title="扩展开发最佳实践" {...noteProps('dev-tips')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>命名规范：</strong> 使用描述性名称，避免与现有扩展冲突</li>
          <li><strong>文档完善：</strong> 提供详细的使用说明和示例</li>
          <li><strong>向后兼容：</strong> 考虑 API 变更对现有用户的冲击</li>
          <li><strong>性能监控：</strong> 实现扩展的性能指标收集</li>
          <li><strong>错误处理：</strong> 提供清晰的错误信息和故障恢复机制</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="自定义扩展开发模板"
        code={`-- C++ 扩展开发框架
#include "duckdb.hpp"

extern "C" {
    DUCKDB_EXTENSION_API void RegisterExtension(duckdb::DatabaseInstance &db) {
        // 注册自定义函数
        auto &catalog = duckdb::Catalog::GetCatalog(db);

        // 示例：注册自定义聚合函数
        catalog.CreateFunction(db, create_custom_aggregate_function());

        // 示例：注册自定义标量函数
        catalog.CreateFunction(db, create_custom_scalar_function());
    }
}

// 编译和安装
// 1. 编译为共享库 (.so/.dylib/.dll)
// 2. 放置在 DuckDB 扩展目录
// 3. 使用 LOAD 命令加载

-- Python 扩展示例
import duckdb

# 创建自定义函数
def custom_function(x):
    return x * 2 + 1

# 注册到 DuckDB
con = duckdb.connect()
con.create_function('custom_func', custom_function, ['DOUBLE'], 'DOUBLE')

# 使用自定义函数
result = con.execute("SELECT custom_func(value) FROM my_table").fetchall()`}
        {...noteProps('extension-dev')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">扩展生态系统</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">📡 网络与通信</h4>
          <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-400">
            <li>• httpfs - HTTP 文件系统</li>
            <li>• postgres - PostgreSQL 集成</li>
            <li>• mysql - MySQL 集成</li>
            <li>• sqlite - SQLite 集成</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">🔬 科学计算</h4>
          <ul className="text-sm space-y-1 text-green-700 dark:text-green-400">
            <li>• spatial - 地理空间分析</li>
            <li>• arrow - Apache Arrow</li>
            <li>• pandas - Pandas 集成</li>
            <li>• polars - Polars 集成</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">🤖 AI 与机器学习</h4>
          <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-400">
            <li>• torch - PyTorch 集成</li>
            <li>• sklearn - Scikit-learn</li>
            <li>• tensorflow - TensorFlow</li>
            <li>• huggingface -  transformers</li>
          </ul>
        </div>
      </div>

      <InfoBox type="experiment" title="扩展系统进阶挑战" {...noteProps('challenges')}>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">挑战 1：构建完整的数据管道</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">使用 5+ 个扩展构建一个端到端的数据处理流程，包括数据摄取、转换、分析和可视化。</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">挑战 2：性能对比测试</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">对比使用扩展前后的查询性能，分析扩展对系统资源消耗的影响。</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">挑战 3：自定义扩展开发</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">开发一个简单的 DuckDB 扩展，实现自定义的字符串处理或数学函数。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 最佳实践章节
// ============================================

export function BestPracticesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">最佳实践指南</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从编写到部署，全面的SQL开发规范"</p>

      <Paragraph {...noteProps('p1')}>
        最佳实践不仅仅是编码规范，更是确保代码质量、性能和可维护性的系统性方法。通过遵循这些经过验证的实践，你可以显著提升开发效率，减少生产环境的问题，并构建更加健壮的数据应用。
      </Paragraph>

      <InfoBox type="fastai" title="最佳实践的四个维度" {...noteProps('dimensions')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">代码质量</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">清晰、可读、可维护</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">性能优化</h4>
            <p className="text-sm text-green-600 dark:text-green-400">高效执行、最优资源利用</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">安全可靠</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">数据安全、错误处理</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <div className="text-2xl mb-2">🔧</div>
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">运维友好</h4>
            <p className="text-sm text-orange-600 dark:text-orange-400">监控、可观测、易维护</p>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">命名规范与代码组织</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">📋 表和列命名规范</h4>
      <CodeBlock
            title="推荐的命名规范"
            code={`-- 表命名：snake_case，复数形式
CREATE TABLE user_profiles (
    -- 主键：table_name + _id
    user_profile_id INTEGER PRIMARY KEY,

    -- 外键：referenced_table + _id
    user_id INTEGER REFERENCES users(id),

    -- 普通列：snake_case
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),

    -- 布尔列：is_ + adjective
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,

    -- 时间戳：past_tense + _at
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,

    -- 金额：amount + 货币单位后缀（可选）
    salary_amount DECIMAL(10,2),
    bonus_amount_usd DECIMAL(10,2)
);

-- 索引命名：idx_table_column_purpose
CREATE INDEX idx_user_profiles_email_lookup
    ON user_profiles(email_address)
    WHERE is_active = true;

CREATE INDEX idx_user_profiles_created_at_desc
    ON user_profiles(created_at DESC);`}
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🔧 SQL 代码组织</h4>
          <CodeBlock
            title="结构化查询写法"
            code={`-- 1. 使用 CTE 提高可读性
WITH active_users AS (
    SELECT user_id, email, last_login_at
    FROM users
    WHERE is_active = true
    AND last_login_at > CURRENT_DATE - INTERVAL '30 days'
),
user_stats AS (
    SELECT
        COUNT(*) as total_users,
        AVG(DATEDIFF('day', created_at, CURRENT_DATE)) as avg_account_age_days
    FROM active_users
)
SELECT
    au.user_id,
    au.email,
    au.last_login_at,
    us.total_users,
    us.avg_account_age_days
FROM active_users au
CROSS JOIN user_stats us;

-- 2. 复杂查询的分步构建
-- 第1步：基础数据筛选
CREATE TEMP TABLE temp_base AS
SELECT * FROM large_table
WHERE date_column >= '2023-01-01';

-- 第2步：数据转换
CREATE TEMP TABLE temp_transformed AS
SELECT
    id,
    UPPER(name) as normalized_name,
    CASE
        WHEN age < 18 THEN 'minor'
        WHEN age BETWEEN 18 AND 65 THEN 'adult'
        ELSE 'senior'
    END as age_group
FROM temp_base;

-- 第3步：最终聚合
SELECT
    age_group,
    COUNT(*) as count,
    AVG(salary) as avg_salary
FROM temp_transformed
GROUP BY age_group
ORDER BY count DESC;`}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化最佳实践</h3>

      <CodeBlock
        title="索引策略与查询优化"
        code={`-- 1. 选择性索引：高选择性的列优先
CREATE INDEX idx_orders_customer_date
    ON orders(customer_id, order_date DESC)
WHERE order_status = 'completed';  -- 部分索引

-- 2. 复合索引的列顺序很重要
-- 错误：先等值后范围
CREATE INDEX idx_bad ON orders(order_date, customer_id);
-- 正确：先等值后范围
CREATE INDEX idx_good ON orders(customer_id, order_date);

-- 3. 避免在索引列上使用函数
-- 低效：函数在索引列上
SELECT * FROM users WHERE DATE(created_at) = CURRENT_DATE;
-- 高效：使用索引友好的写法
SELECT * FROM users WHERE created_at >= CURRENT_DATE;

-- 4. 统计信息维护
ANALYZE orders;  -- 更新表统计信息
ANALYZE;         -- 更新所有表统计信息

-- 5. 查询重写优化
-- 低效的子查询
SELECT * FROM orders o
WHERE customer_id IN (
    SELECT customer_id FROM customers
    WHERE region = 'North America'
);
-- 高效的JOIN
SELECT o.* FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.region = 'North America';`}
        {...noteProps('performance-code')}
      />

      <CodeBlock
        title="内存与资源管理"
        code={`-- 1. 设置适当的内存限制
SET memory_limit = '4GB';
SET max_memory = '8GB';

-- 2. 临时文件管理
SET temp_directory = '/tmp/duckdb_temp';
SET max_temp_directory_size = '50GB';

-- 3. 连接池配置（如果使用）
SET threads = 4;  -- 限制并发查询数

-- 4. 大查询优化
-- 使用 LIMIT 限制结果集
SELECT * FROM large_table LIMIT 1000;

-- 分页查询优化
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM large_table
) WHERE rn BETWEEN 1001 AND 2000;

-- 5. 批量操作优化
-- 批量插入
INSERT INTO target_table
SELECT * FROM source_table
WHERE created_at >= '2023-01-01'
LIMIT 10000;  -- 分批处理

-- 批量更新
UPDATE target_table
SET status = 'processed'
WHERE id IN (
    SELECT id FROM target_table
    WHERE status = 'pending'
    LIMIT 1000  -- 限制批量大小
);`}
        {...noteProps('memory-code')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据安全与完整性</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border border-red-200 dark:border-red-700">
          <h4 className="font-bold text-red-800 dark:text-red-300 mb-3">🛡️ SQL 注入防护</h4>
          <CodeBlock
            title="安全查询实践"
            code={`-- ❌ 危险：字符串拼接
-- 假设 user_input = "'; DROP TABLE users; --"
sql = "SELECT * FROM users WHERE name = '" + user_input + "'";

-- ✅ 安全：参数化查询
PREPARE user_query AS
SELECT * FROM users WHERE name = $1;

EXECUTE user_query('safe_name');

-- ✅ 安全：白名单验证
CREATE OR REPLACE FUNCTION safe_table_name(table_name TEXT)
RETURNS TEXT AS $$
BEGIN
    -- 只允许预定义的表名
    IF table_name IN ('users', 'orders', 'products') THEN
        RETURN table_name;
    ELSE
        RAISE EXCEPTION 'Invalid table name: %', table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 使用安全的表名
EXECUTE 'SELECT COUNT(*) FROM ' || safe_table_name('users');`}
          />
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3">🔒 数据验证与约束</h4>
          <CodeBlock
            title="数据完整性保障"
            code={`-- 1. 强类型约束
CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INTEGER CHECK (age >= 0 AND age <= 150),
    salary DECIMAL(10,2) CHECK (salary >= 0),
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- 2. 外键约束
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL
        REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL
        REFERENCES products(product_id) ON DELETE RESTRICT,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 3. 业务规则约束
CREATE TABLE employee_salaries (
    employee_id INTEGER PRIMARY KEY,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 30000),
    bonus DECIMAL(10,2) DEFAULT 0 CHECK (bonus >= 0),
    -- 奖金不超过薪水的50%
    CONSTRAINT bonus_limit CHECK (bonus <= salary * 0.5),
    department VARCHAR(50) NOT NULL
);

-- 4. 触发器实现复杂业务规则
CREATE TRIGGER validate_salary_change
    BEFORE UPDATE ON employee_salaries
    FOR EACH ROW
EXECUTE FUNCTION check_salary_increase();`}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">错误处理与调试</h3>

      <CodeBlock
        title="健壮的错误处理模式"
        code={`-- 1. 防御性编程：TRY_CAST 处理类型转换
CREATE TABLE processed_data AS
SELECT
    id,
    TRY_CAST(name AS VARCHAR) AS clean_name,
    TRY_CAST(age AS INTEGER) AS clean_age,
    TRY_CAST(salary AS DECIMAL(10,2)) AS clean_salary,
    -- 标记转换失败的行
    CASE
        WHEN TRY_CAST(age AS INTEGER) IS NULL AND age IS NOT NULL THEN 1
        ELSE 0
    END AS age_parse_error
FROM raw_input_data;

-- 2. 优雅的错误恢复
CREATE OR REPLACE FUNCTION safe_divide(numerator FLOAT, denominator FLOAT)
RETURNS FLOAT AS $$
BEGIN
    -- 处理除零错误
    IF denominator = 0 OR denominator IS NULL THEN
        RETURN NULL;  -- 或返回默认值 0
    END IF;
    RETURN numerator / denominator;
END;
$$ LANGUAGE plpgsql;

-- 3. 事务中的错误处理
BEGIN TRANSACTION;
    SAVEPOINT before_update;

    -- 尝试执行可能失败的操作
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;

    -- 检查业务规则
    IF (SELECT balance FROM accounts WHERE id = 1) < 0 THEN
        -- 回滚到保存点
        ROLLBACK TO SAVEPOINT before_update;
        -- 记录错误但不中断事务
        INSERT INTO error_log (message, timestamp)
        VALUES ('Insufficient funds for account 1', CURRENT_TIMESTAMP);
    END IF;

COMMIT;

-- 4. 监控和日志记录
CREATE TABLE query_performance_log (
    query_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_text TEXT NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    rows_affected INTEGER,
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 记录慢查询
CREATE OR REPLACE FUNCTION log_slow_query()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.execution_time_ms > 1000 THEN  -- 超过1秒的查询
        INSERT INTO query_performance_log
        (query_text, execution_time_ms, rows_affected)
        VALUES (NEW.query_text, NEW.execution_time_ms, NEW.rows_affected);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('error-handling-code')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">版本控制与部署</h3>

      <InfoBox type="tip" title="数据库变更管理" {...noteProps('version-control')}>
        <ul className="list-disc ml-4 space-y-2">
          <li><strong>迁移脚本：</strong> 使用版本化的 SQL 脚本管理数据库结构变更</li>
          <li><strong>回滚计划：</strong> 每个迁移都有对应的回滚脚本</li>
          <li><strong>测试环境：</strong> 在生产部署前进行充分测试</li>
          <li><strong>渐进式部署：</strong> 使用功能开关控制新功能的发布</li>
          <li><strong>监控告警：</strong> 部署后监控关键指标和错误率</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="数据库迁移脚本模板"
        code={`-- migrations/001_initial_schema.sql
BEGIN TRANSACTION;

-- 创建基础表结构
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_price ON products(price);

-- 记录迁移版本
INSERT INTO schema_versions (version, description, applied_at)
VALUES ('001', 'Initial schema creation', CURRENT_TIMESTAMP);

COMMIT;

-- migrations/002_add_user_profiles.sql
BEGIN TRANSACTION;

-- 添加用户资料表
CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数据迁移：从现有数据创建配置
INSERT INTO user_profiles (user_id)
SELECT id FROM users;

-- 记录迁移
INSERT INTO schema_versions (version, description, applied_at)
VALUES ('002', 'Add user profiles table', CURRENT_TIMESTAMP);

COMMIT;

-- rollback/002_rollback_user_profiles.sql
-- 回滚脚本：注意顺序相反
BEGIN TRANSACTION;

DROP TABLE IF EXISTS user_profiles;

DELETE FROM schema_versions WHERE version = '002';

COMMIT;`}
        {...noteProps('migration-template')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">代码审查清单</h3>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">SQL 代码审查要点</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ 必须检查</h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• 查询性能是否最优（EXPLAIN ANALYZE）</li>
              <li>• 是否有 SQL 注入风险</li>
              <li>• 约束和索引是否完整</li>
              <li>• 错误处理是否充分</li>
              <li>• 命名是否符合规范</li>
              <li>• 是否有必要的注释</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ 建议检查</h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• 是否可以使用 CTE 提高可读性</li>
              <li>• 复杂查询是否需要重构</li>
              <li>• 是否有重复的子查询</li>
              <li>• 数据类型选择是否合适</li>
              <li>• 是否需要添加数据验证</li>
              <li>• 权限控制是否合理</li>
            </ul>
          </div>
        </div>
      </div>

      <InfoBox type="experiment" title="最佳实践掌握挑战" {...noteProps('challenges')}>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">挑战 1：代码质量重构</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">找出一个写得不规范的 SQL 脚本，按照最佳实践重新编写，并解释每处改进的理由。</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">挑战 2：性能优化实战</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">分析一个慢查询的执行计划，识别性能瓶颈并实施优化，比较优化前后的性能差异。</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">挑战 3：安全加固项目</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">审查一个数据库应用的 SQL 代码，识别潜在的安全风险并提供修复方案。</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-semibold">挑战 4：运维监控体系</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">设计一个完整的数据库运维监控系统，包括性能指标、错误日志、备份恢复等。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 迁移章节
// ============================================

export function MigrationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">版本迁移与数据迁移</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"安全、高效、可逆的数据库演进策略"</p>

      <Paragraph {...noteProps('p1')}>
        数据库迁移是现代应用开发中不可避免的挑战。无论是从传统数据库迁移到 DuckDB，还是在 DuckDB 内部进行版本升级，抑或是处理大规模数据重构，都需要一套系统性的迁移方法论。本章节将详细介绍迁移的各个环节，包括规划、执行、验证和回滚策略。
      </Paragraph>

      <InfoBox type="fastai" title="迁移的三大原则" {...noteProps('principles')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">可逆性</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">任何迁移都可以安全回滚</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">可验证</h4>
            <p className="text-sm text-green-600 dark:text-green-400">迁移结果可完整验证</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">高效性</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">最小化业务中断时间</p>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">迁移规划与风险评估</h3>

      <CodeBlock
        title="迁移前置检查清单"
        code={`-- 1. 数据量评估
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. 依赖关系分析
-- 查看外键约束
SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';

-- 3. 索引和约束分析
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 4. 查询模式分析（如果可能）
-- 找出最频繁的查询模式
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 20;`}
        {...noteProps('assessment')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border border-red-200 dark:border-red-700">
          <h4 className="font-bold text-red-800 dark:text-red-300 mb-3">⚠️ 高风险迁移场景</h4>
          <ul className="text-sm space-y-2 text-red-700 dark:text-red-400">
            <li><strong>数据类型变更：</strong> VARCHAR → INTEGER 可能丢失数据</li>
            <li><strong>主键修改：</strong> 影响所有外键约束</li>
            <li><strong>大规模数据重构：</strong> 长时间锁表</li>
            <li><strong>跨系统依赖：</strong> 多个服务同时修改</li>
            <li><strong>生产环境紧急修复：</strong> 时间压力大</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">✅ 低风险迁移策略</h4>
          <ul className="text-sm space-y-2 text-green-700 dark:text-green-400">
            <li><strong>添加新列：</strong> 带默认值，无破坏性</li>
            <li><strong>创建索引：</strong> 可在线创建，不锁表</li>
            <li><strong>添加约束：</strong> 先检查数据一致性</li>
            <li><strong>小表数据迁移：</strong> 快速且可预测</li>
            <li><strong>功能开关控制：</strong> 渐进式启用</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">从其他数据库迁移到 DuckDB</h3>

      <CodeBlock
        title="PostgreSQL 到 DuckDB 迁移"
        code={`-- 1. 导出 PostgreSQL 表结构
-- 在 PostgreSQL 中执行
pg_dump --schema-only --no-owner --no-privileges -h localhost -U user dbname > schema.sql

-- 2. 数据导出为 CSV
-- PostgreSQL 导出
\\COPY (SELECT * FROM users WHERE created_at >= '2023-01-01') TO 'users_2023.csv' WITH CSV HEADER;

-- 3. DuckDB 导入和转换
-- 创建目标表结构
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP,
    profile_data JSON  -- PostgreSQL 的 JSONB 转为 DuckDB 的 JSON
);

-- 导入数据
INSERT INTO users
SELECT
    id::INTEGER,
    email::VARCHAR,
    created_at::TIMESTAMP,
    profile_data::JSON
FROM read_csv('users_2023.csv');

-- 4. 验证数据完整性
SELECT
    COUNT(*) as total_rows,
    COUNT(DISTINCT id) as unique_ids,
    MIN(created_at) as earliest_date,
    MAX(created_at) as latest_date
FROM users;

-- 5. 性能优化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 6. 数据质量检查
SELECT 'Duplicate emails' as check_type, COUNT(*) as count
FROM (SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING cnt > 1) dups
UNION ALL
SELECT 'Null emails' as check_type, COUNT(*) as count
FROM users WHERE email IS NULL OR email = ''
UNION ALL
SELECT 'Invalid dates' as check_type, COUNT(*) as count
FROM users WHERE created_at IS NULL OR created_at > CURRENT_TIMESTAMP;`}
        {...noteProps('postgres-migration')}
      />

      <CodeBlock
        title="MySQL 到 DuckDB 迁移脚本"
        code={`-- 1. MySQL 数据导出
-- mysqldump 命令行导出
mysqldump -u user -p dbname users --tab=/tmp/mysql_export --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n'

-- 2. DuckDB 导入转换
-- 处理 MySQL 特有的数据类型
CREATE TABLE users_import AS
SELECT
    CAST(NULLIF(id, '') AS INTEGER) AS id,
    CAST(NULLIF(email, '') AS VARCHAR) AS email,
    -- MySQL DATETIME 转 DuckDB TIMESTAMP
    CASE
        WHEN created_at = '0000-00-00 00:00:00' THEN NULL
        ELSE CAST(created_at AS TIMESTAMP)
    END AS created_at,
    -- MySQL TINYINT(1) 布尔值处理
    CAST(is_active AS BOOLEAN) AS is_active,
    -- 处理可能的编码问题
    REPLACE(REPLACE(name, '\r', ''), '\n', ' ') AS clean_name
FROM read_csv('/tmp/mysql_export/users.txt',
    header = true,
    nullstr = ['NULL', ''],
    ignore_errors = true  -- 跳过格式错误的行
);

-- 3. 数据清洗和标准化
UPDATE users_import
SET email = LOWER(TRIM(email))
WHERE email IS NOT NULL;

-- 移除重复数据
DELETE FROM users_import
WHERE id IN (
    SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
        FROM users_import
        WHERE email IS NOT NULL
    ) t
    WHERE rn > 1
);

-- 4. 创建最终表
CREATE TABLE users AS
SELECT DISTINCT * FROM users_import
WHERE id IS NOT NULL
  AND email IS NOT NULL
  AND email LIKE '%@%';  -- 简单的邮箱格式验证`}
        {...noteProps('mysql-migration')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">DuckDB 内部版本迁移</h3>

      <CodeBlock
        title="安全的架构演进策略"
        code={`-- 1. 创建迁移版本控制表
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),  -- 用于验证迁移文件完整性
    success BOOLEAN DEFAULT FALSE
);

-- 2. 迁移执行框架
CREATE OR REPLACE FUNCTION run_migration(migration_version INTEGER, migration_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    migration_file TEXT;
    migration_sql TEXT;
BEGIN
    -- 检查是否已执行
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = migration_version) THEN
        RAISE NOTICE 'Migration % already applied', migration_version;
        RETURN TRUE;
    END IF;

    -- 构建迁移文件路径
    migration_file := 'migrations/' || LPAD(migration_version::TEXT, 3, '0') || '_' || migration_name || '.sql';

    -- 读取迁移文件（假设有文件读取函数）
    BEGIN
        migration_sql := read_file(migration_file);

        -- 执行迁移
        EXECUTE migration_sql;

        -- 记录成功
        INSERT INTO schema_migrations (version, name, success)
        VALUES (migration_version, migration_name, TRUE);

        RAISE NOTICE 'Migration % applied successfully', migration_version;
        RETURN TRUE;

    EXCEPTION WHEN OTHERS THEN
        -- 记录失败
        INSERT INTO schema_migrations (version, name, success)
        VALUES (migration_version, migration_name, FALSE);

        RAISE EXCEPTION 'Migration % failed: %', migration_version, SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

-- 3. 带回滚的迁移示例
-- migrations/001_add_user_preferences.sql
BEGIN TRANSACTION;

-- 创建新表
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    theme VARCHAR(20) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'zh-CN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 迁移现有数据
INSERT INTO user_preferences (user_id)
SELECT id FROM users;

-- 添加索引
CREATE INDEX idx_user_preferences_theme ON user_preferences(theme);

-- 记录迁移
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES (1, 'add_user_preferences', 'abc123...', TRUE);

COMMIT;

-- rollbacks/001_rollback_user_preferences.sql
BEGIN TRANSACTION;

DROP TABLE IF EXISTS user_preferences;
DELETE FROM schema_migrations WHERE version = 1;

COMMIT;`}
        {...noteProps('duckdb-migration')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据一致性验证</h3>

      <CodeBlock
        title="迁移后数据验证工具"
        code={`-- 1. 创建数据验证框架
CREATE TABLE data_validation_results (
    validation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    check_type VARCHAR(50) NOT NULL, -- 'count', 'uniqueness', 'references', 'custom'
    check_name VARCHAR(255) NOT NULL,
    expected_value TEXT,
    actual_value TEXT,
    status VARCHAR(20) NOT NULL, -- 'pass', 'fail', 'warning'
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 通用验证函数
CREATE OR REPLACE FUNCTION validate_table_data(table_name TEXT)
RETURNS TABLE(check_name TEXT, status TEXT, message TEXT) AS $$
DECLARE
    row_count BIGINT;
    pk_duplicates BIGINT;
    fk_violations BIGINT;
BEGIN
    -- 行数检查
    EXECUTE 'SELECT COUNT(*) FROM ' || table_name INTO row_count;
    RETURN QUERY SELECT
        'row_count'::TEXT,
        CASE WHEN row_count > 0 THEN 'pass' ELSE 'fail' END,
        'Table has ' || row_count || ' rows'::TEXT;

    -- 主键唯一性检查（如果有主键）
    BEGIN
        EXECUTE 'SELECT COUNT(*) FROM (
            SELECT 1 FROM ' || table_name || ' GROUP BY id HAVING COUNT(*) > 1
        )' INTO pk_duplicates;

        RETURN QUERY SELECT
            'primary_key_uniqueness'::TEXT,
            CASE WHEN pk_duplicates = 0 THEN 'pass' ELSE 'fail' END,
            CASE WHEN pk_duplicates = 0 THEN 'No duplicate primary keys'
                 ELSE pk_duplicates || ' duplicate primary keys found' END;
    EXCEPTION WHEN OTHERS THEN
        -- 如果没有主键，跳过这个检查
        NULL;
    END;

    -- 数据类型一致性检查
    RETURN QUERY SELECT
        'data_types'::TEXT,
        'pass'::TEXT,
        'Basic data type validation completed'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. 迁移前后对比验证
CREATE OR REPLACE FUNCTION compare_table_stats(
    source_table TEXT,
    target_table TEXT
)
RETURNS TABLE(metric TEXT, source_value TEXT, target_value TEXT, status TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'row_count'::TEXT,
        (SELECT COUNT(*)::TEXT FROM source_table),
        (SELECT COUNT(*)::TEXT FROM target_table),
        CASE WHEN (SELECT COUNT(*) FROM source_table) = (SELECT COUNT(*) FROM target_table)
             THEN 'pass' ELSE 'fail' END;

    -- 可以添加更多对比指标
END;
$$ LANGUAGE plpgsql;

-- 4. 自动化验证脚本
CREATE OR REPLACE FUNCTION run_post_migration_validation()
RETURNS TABLE(table_name TEXT, checks_passed BIGINT, total_checks BIGINT, status TEXT) AS $$
DECLARE
    table_record RECORD;
    passed_count BIGINT;
    total_count BIGINT;
BEGIN
    FOR table_record IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'data_validation_%'
    LOOP
        SELECT
            COUNT(*) FILTER (WHERE status = 'pass'),
            COUNT(*)
        INTO passed_count, total_count
        FROM validate_table_data(table_record.tablename);

        RETURN QUERY SELECT
            table_record.tablename,
            passed_count,
            total_count,
            CASE WHEN passed_count = total_count THEN 'pass'
                 WHEN passed_count > total_count * 0.9 THEN 'warning'
                 ELSE 'fail' END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. 执行验证
SELECT * FROM run_post_migration_validation()
ORDER BY status DESC, table_name;`}
        {...noteProps('validation-framework')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">迁移监控与告警</h3>

      <InfoBox type="tip" title="迁移监控指标" {...noteProps('monitoring')}>
        <ul className="list-disc ml-4 space-y-2">
          <li><strong>性能指标：</strong> 查询响应时间、CPU/内存使用率</li>
          <li><strong>数据质量：</strong> NULL 值比例、数据类型一致性</li>
          <li><strong>业务指标：</strong> 关键业务流程的成功率</li>
          <li><strong>系统健康：</strong> 连接数、锁等待、死锁发生率</li>
          <li><strong>进度跟踪：</strong> 已处理数据量、预计完成时间</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="迁移监控仪表盘"
        code={`-- 1. 创建监控指标表
CREATE TABLE migration_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    migration_phase VARCHAR(50)
);

-- 2. 性能监控函数
CREATE OR REPLACE FUNCTION record_performance_metrics(phase TEXT)
RETURNS VOID AS $$
BEGIN
    -- CPU 使用率（模拟）
    INSERT INTO migration_metrics (metric_name, metric_value, metric_unit, migration_phase)
    SELECT 'cpu_usage_percent', random() * 100, '%', phase;

    -- 内存使用率
    INSERT INTO migration_metrics (metric_name, metric_value, metric_unit, migration_phase)
    SELECT 'memory_usage_mb',
           (SELECT (total_bytes / 1024 / 1024)::DECIMAL(10,2)
            FROM pragma_database_size()),
           'MB', phase;

    -- 活跃连接数
    INSERT INTO migration_metrics (metric_name, metric_value, metric_unit, migration_phase)
    SELECT 'active_connections', COUNT(*), 'count', phase
    FROM pragma_show_connections();
END;
$$ LANGUAGE plpgsql;

-- 3. 数据质量监控
CREATE OR REPLACE FUNCTION monitor_data_quality(table_name TEXT)
RETURNS TABLE(check_name TEXT, value DECIMAL(10,2), status TEXT) AS $$
BEGIN
    RETURN QUERY EXECUTE format('
        SELECT
            ''null_percentage''::TEXT,
            (SUM(CASE WHEN id IS NULL THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100,
            CASE WHEN (SUM(CASE WHEN id IS NULL THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) > 5
                 THEN ''warning'' ELSE ''ok'' END
        FROM %I
        UNION ALL
        SELECT
            ''duplicate_percentage''::TEXT,
            ((COUNT(*) - COUNT(DISTINCT id))::DECIMAL / COUNT(*)) * 100,
            CASE WHEN ((COUNT(*) - COUNT(DISTINCT id))::DECIMAL / COUNT(*)) > 1
                 THEN ''error'' ELSE ''ok'' END
        FROM %I', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- 4. 告警系统
CREATE TABLE migration_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL, -- 'error', 'warning', 'info'
    alert_message TEXT NOT NULL,
    related_table VARCHAR(100),
    threshold_value DECIMAL(10,2),
    actual_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE
);

CREATE OR REPLACE FUNCTION create_alert(
    alert_type TEXT,
    message TEXT,
    table_name TEXT DEFAULT NULL,
    threshold DECIMAL DEFAULT NULL,
    actual DECIMAL DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO migration_alerts (
        alert_type, alert_message, related_table,
        threshold_value, actual_value
    ) VALUES (alert_type, message, table_name, threshold, actual);
END;
$$ LANGUAGE plpgsql;

-- 5. 自动监控触发器
CREATE OR REPLACE FUNCTION migration_monitor_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- 检查是否有错误告警
    IF NEW.status = 'failed' THEN
        PERFORM create_alert('error', 'Migration failed: ' || NEW.error_message);
    END IF;

    -- 检查性能阈值
    IF NEW.execution_time_ms > 30000 THEN -- 30秒
        PERFORM create_alert('warning', 'Slow migration detected',
                           NEW.table_name, 30000, NEW.execution_time_ms);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用监控触发器
CREATE TRIGGER migration_monitor
    AFTER INSERT ON migration_log
    FOR EACH ROW EXECUTE FUNCTION migration_monitor_trigger();`}
        {...noteProps('monitoring-dashboard')}
      />

      <InfoBox type="experiment" title="迁移大师挑战" {...noteProps('challenges')}>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">挑战 1：跨数据库迁移工程</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">设计并实现一个从 PostgreSQL 到 DuckDB 的完整迁移方案，包括数据导出、转换、导入、验证和回滚策略。处理复杂的数据类型转换和外键关系。</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">挑战 2：零停机架构升级</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">实现一个支持零停机部署的数据库架构升级方案，使用双写模式、渐进式切换和回滚机制，确保业务连续性。</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">挑战 3：智能迁移工具开发</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">开发一个智能迁移工具，能够自动分析源数据库结构，生成迁移脚本，执行数据迁移，验证数据一致性，并生成详细的迁移报告。</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-semibold">挑战 4：大规模数据迁移优化</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">针对 TB 级大数据集的迁移，设计并实现并行处理、断点续传、压缩传输等优化策略，将迁移时间从数周降低到数小时。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 高可用章节
// ============================================

export function HighAvailabilitySection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">高可用架构设计</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"构建弹性的数据基础设施，保障业务连续性"</p>

      <Paragraph {...noteProps('p1')}>
        高可用性（High Availability）是现代数据系统的核心要求。它不仅仅意味着系统能够正常运行，更重要的是在面对各种故障场景时能够快速恢复、最小化业务中断。DuckDB 作为嵌入式数据库，其高可用策略与其他分布式数据库有所不同，但同样需要系统性的设计和实施。
      </Paragraph>

      <InfoBox type="fastai" title="高可用的三个层次" {...noteProps('layers')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">故障预防</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">主动监控、容量规划、负载均衡</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">快速恢复</h4>
            <p className="text-sm text-green-600 dark:text-green-400">自动故障转移、数据备份、灾难恢复</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">持续优化</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">性能监控、容量扩展、架构演进</p>
          </div>
        </div>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据持久化与备份策略</h3>

      <CodeBlock
        title="多层次备份架构"
        code={`-- 1. WAL 配置优化（Write-Ahead Logging）
PRAGMA wal_autocheckpoint = 1000;  -- 每1000页自动检查点
PRAGMA wal_size_limit = '1GB';     -- WAL 文件大小限制
PRAGMA synchronous = NORMAL;        -- 平衡性能和安全性

-- 2. 创建备份策略表
CREATE TABLE backup_policies (
    policy_id INTEGER PRIMARY KEY,
    policy_name VARCHAR(100) NOT NULL,
    backup_type VARCHAR(20) NOT NULL, -- 'full', 'incremental', 'differential'
    schedule_cron VARCHAR(50),        -- cron 表达式
    retention_days INTEGER DEFAULT 30,
    compression_enabled BOOLEAN DEFAULT TRUE,
    encryption_enabled BOOLEAN DEFAULT FALSE,
    cloud_storage_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 备份历史记录
CREATE TABLE backup_history (
    backup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id INTEGER REFERENCES backup_policies(policy_id),
    backup_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    checksum VARCHAR(64),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);

-- 4. 自动化备份函数
CREATE OR REPLACE FUNCTION create_database_backup(
    backup_type TEXT DEFAULT 'full',
    compression_enabled BOOLEAN DEFAULT TRUE
)
RETURNS UUID AS $$
DECLARE
    backup_id UUID := gen_random_uuid();
    backup_path TEXT;
    checksum_val TEXT;
BEGIN
    -- 生成备份文件路径
    backup_path := 'backups/' || backup_type || '_' ||
                   TO_CHAR(CURRENT_TIMESTAMP, 'YYYY_MM_DD_HH24_MI_SS') || '.duckdb';

    -- 记录备份开始
    INSERT INTO backup_history (backup_id, backup_type, status, file_path, started_at)
    VALUES (backup_id, backup_type, 'running', backup_path, CURRENT_TIMESTAMP);

    -- 执行备份（这里需要外部工具支持）
    -- VACUUM INTO backup_path;  -- DuckDB 原生命令

    -- 计算校验和
    checksum_val := (SELECT MD5(CAST(file_size_bytes AS TEXT) || backup_path));

    -- 记录备份完成
    UPDATE backup_history
    SET status = 'completed',
        completed_at = CURRENT_TIMESTAMP,
        checksum = checksum_val
    WHERE backup_id = backup_id;

    RETURN backup_id;
EXCEPTION WHEN OTHERS THEN
    -- 记录备份失败
    UPDATE backup_history
    SET status = 'failed',
        completed_at = CURRENT_TIMESTAMP,
        error_message = SQLERRM
    WHERE backup_id = backup_id;

    RAISE EXCEPTION 'Backup failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 5. 备份验证函数
CREATE OR REPLACE FUNCTION verify_backup_integrity(backup_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    backup_record RECORD;
    test_query_result INTEGER;
BEGIN
    SELECT * INTO backup_record
    FROM backup_history
    WHERE backup_id = backup_id AND status = 'completed';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Backup not found or not completed';
    END IF;

    -- 尝试连接备份文件并执行简单查询
    -- 注意：这需要外部脚本支持，因为 DuckDB 不支持同时连接多个数据库
    -- 这里只是概念验证

    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 6. 备份清理策略
CREATE OR REPLACE FUNCTION cleanup_old_backups(retention_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- 删除过期的备份记录
    DELETE FROM backup_history
    WHERE started_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * retention_days;

    -- 实际删除文件需要外部脚本支持
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 7. 备份监控和告警
CREATE OR REPLACE FUNCTION monitor_backup_health()
RETURNS TABLE(metric TEXT, status TEXT, details TEXT) AS $$
BEGIN
    -- 检查最近备份状态
    RETURN QUERY
    SELECT
        'last_backup_age'::TEXT,
        CASE
            WHEN last_backup < CURRENT_TIMESTAMP - INTERVAL '24 hours' THEN 'critical'
            WHEN last_backup < CURRENT_TIMESTAMP - INTERVAL '6 hours' THEN 'warning'
            ELSE 'healthy'
        END,
        'Last backup: ' || last_backup::TEXT
    FROM (
        SELECT MAX(completed_at) as last_backup
        FROM backup_history
        WHERE status = 'completed'
    ) stats;

    -- 检查备份成功率
    RETURN QUERY
    SELECT
        'backup_success_rate'::TEXT,
        CASE
            WHEN success_rate < 0.8 THEN 'critical'
            WHEN success_rate < 0.95 THEN 'warning'
            ELSE 'healthy'
        END,
        'Success rate: ' || ROUND(success_rate * 100, 1) || '%'
    FROM (
        SELECT
            COUNT(*) FILTER (WHERE status = 'completed')::FLOAT /
            NULLIF(COUNT(*), 0) as success_rate
        FROM backup_history
        WHERE started_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    ) stats;
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('backup-strategy')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">连接池与资源管理</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🔗 连接池配置</h4>
          <CodeBlock
            title="连接池管理"
            code={`-- 1. 连接池配置（应用层）
-- 对于支持连接池的客户端
connection_pool_config = {
    'max_connections': 20,
    'min_connections': 5,
    'max_idle_time': 300,  -- 5分钟
    'connection_timeout': 30,
    'retry_attempts': 3,
    'health_check_interval': 60
}

-- 2. DuckDB 连接优化
SET threads = 8;                    -- 并发查询线程数
SET memory_limit = '4GB';           -- 内存限制
SET max_temp_directory_size = '10GB'; -- 临时文件大小限制

-- 3. 连接状态监控
CREATE TABLE connection_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    active_connections INTEGER,
    idle_connections INTEGER,
    waiting_connections INTEGER,
    total_memory_mb DECIMAL(10,2),
    temp_space_mb DECIMAL(10,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 定期收集连接指标
CREATE OR REPLACE FUNCTION collect_connection_metrics()
RETURNS VOID AS $$
BEGIN
    INSERT INTO connection_metrics (
        active_connections,
        idle_connections,
        waiting_connections,
        total_memory_mb,
        temp_space_mb
    )
    SELECT
        (SELECT COUNT(*) FROM pragma_show_connections() WHERE status = 'active'),
        (SELECT COUNT(*) FROM pragma_show_connections() WHERE status = 'idle'),
        0, -- DuckDB 不直接支持等待队列统计
        (SELECT total_bytes / 1024 / 1024 FROM pragma_database_size()),
        (SELECT COALESCE(SUM(file_size), 0) / 1024 / 1024
         FROM (SELECT file_size FROM glob('temp_*') LIMIT 100))
    ;
END;
$$ LANGUAGE plpgsql;`}
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">⚡ 资源隔离策略</h4>
          <CodeBlock
            title="多租户资源管理"
            code={`-- 1. 租户资源配额表
CREATE TABLE tenant_quotas (
    tenant_id VARCHAR(50) PRIMARY KEY,
    max_memory_mb INTEGER DEFAULT 1024,
    max_temp_space_mb INTEGER DEFAULT 5120,
    max_connections INTEGER DEFAULT 10,
    query_timeout_seconds INTEGER DEFAULT 300,
    priority_level INTEGER DEFAULT 1, -- 1=低, 2=中, 3=高
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 动态资源分配函数
CREATE OR REPLACE FUNCTION allocate_tenant_resources(tenant_id TEXT)
RETURNS JSON AS $$
DECLARE
    tenant_config RECORD;
    current_usage RECORD;
    allocated_resources JSON;
BEGIN
    -- 获取租户配置
    SELECT * INTO tenant_config
    FROM tenant_quotas
    WHERE tenant_id = tenant_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tenant not found: %', tenant_id;
    END IF;

    -- 计算当前资源使用情况
    SELECT
        COUNT(*) as active_connections,
        SUM(memory_usage_mb) as total_memory_mb
    INTO current_usage
    FROM active_sessions
    WHERE tenant_id = tenant_id;

    -- 分配资源
    allocated_resources := json_object(
        'memory_limit_mb', LEAST(
            tenant_config.max_memory_mb - COALESCE(current_usage.total_memory_mb, 0),
            tenant_config.max_memory_mb
        ),
        'connection_limit', tenant_config.max_connections - COALESCE(current_usage.active_connections, 0),
        'query_timeout', tenant_config.query_timeout_seconds,
        'priority', tenant_config.priority_level
    );

    RETURN allocated_resources;
END;
$$ LANGUAGE plpgsql;

-- 3. 资源使用监控
CREATE TABLE resource_usage_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'memory', 'cpu', 'io', 'temp_space'
    usage_value DECIMAL(10,2),
    usage_unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 资源超限告警
CREATE OR REPLACE FUNCTION check_resource_limits()
RETURNS TABLE(tenant_id TEXT, resource_type TEXT, current_usage DECIMAL, limit_value DECIMAL, alert_level TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tenant_id,
        'memory'::TEXT as resource_type,
        COALESCE(SUM(s.memory_usage_mb), 0) as current_usage,
        t.max_memory_mb::DECIMAL as limit_value,
        CASE
            WHEN COALESCE(SUM(s.memory_usage_mb), 0) > t.max_memory_mb * 0.9 THEN 'critical'
            WHEN COALESCE(SUM(s.memory_usage_mb), 0) > t.max_memory_mb * 0.8 THEN 'warning'
            ELSE 'normal'
        END as alert_level
    FROM tenant_quotas t
    LEFT JOIN active_sessions s ON t.tenant_id = s.tenant_id
    GROUP BY t.tenant_id, t.max_memory_mb

    UNION ALL

    SELECT
        t.tenant_id,
        'connections'::TEXT,
        COUNT(s.session_id)::DECIMAL,
        t.max_connections::DECIMAL,
        CASE
            WHEN COUNT(s.session_id) > t.max_connections * 0.9 THEN 'critical'
            WHEN COUNT(s.session_id) > t.max_connections * 0.8 THEN 'warning'
            ELSE 'normal'
        END
    FROM tenant_quotas t
    LEFT JOIN active_sessions s ON t.tenant_id = s.tenant_id
    GROUP BY t.tenant_id, t.max_connections;
END;
$$ LANGUAGE plpgsql;`}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">故障检测与自动恢复</h3>

      <CodeBlock
        title="健康检查与故障转移"
        code={`-- 1. 健康检查表
CREATE TABLE health_checks (
    check_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    check_type VARCHAR(50) NOT NULL, -- 'database', 'connection', 'performance'
    status VARCHAR(20) NOT NULL,     -- 'healthy', 'degraded', 'unhealthy'
    response_time_ms INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_check_at TIMESTAMP
);

-- 2. 数据库健康检查函数
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS TABLE(check_name TEXT, status TEXT, details TEXT, score INTEGER) AS $$
DECLARE
    connection_count INTEGER;
    memory_usage_percent DECIMAL(5,2);
    slow_queries_count INTEGER;
    total_score INTEGER := 100;
BEGIN
    -- 检查连接数
    SELECT COUNT(*) INTO connection_count
    FROM pragma_show_connections();

    -- 检查内存使用
    SELECT (used_bytes * 100.0 / total_bytes)::DECIMAL(5,2) INTO memory_usage_percent
    FROM pragma_database_size();

    -- 检查慢查询（假设有查询性能监控）
    SELECT COUNT(*) INTO slow_queries_count
    FROM query_performance_log
    WHERE execution_time_ms > 5000
    AND executed_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour';

    -- 计算健康评分
    IF connection_count > 50 THEN total_score := total_score - 20; END IF;
    IF memory_usage_percent > 90 THEN total_score := total_score - 30; END IF;
    IF slow_queries_count > 10 THEN total_score := total_score - 25; END IF;

    -- 返回各项检查结果
    RETURN QUERY SELECT
        'connections'::TEXT,
        CASE WHEN connection_count < 30 THEN 'healthy' ELSE 'degraded' END,
        connection_count || ' active connections'::TEXT,
        CASE WHEN connection_count < 30 THEN 100
             WHEN connection_count < 50 THEN 70
             ELSE 40 END;

    RETURN QUERY SELECT
        'memory'::TEXT,
        CASE WHEN memory_usage_percent < 80 THEN 'healthy'
             WHEN memory_usage_percent < 95 THEN 'degraded'
             ELSE 'unhealthy' END,
        ROUND(memory_usage_percent, 1) || '% memory usage'::TEXT,
        CASE WHEN memory_usage_percent < 80 THEN 100
             WHEN memory_usage_percent < 90 THEN 80
             WHEN memory_usage_percent < 95 THEN 60
             ELSE 20 END;

    RETURN QUERY SELECT
        'performance'::TEXT,
        CASE WHEN slow_queries_count < 5 THEN 'healthy' ELSE 'degraded' END,
        slow_queries_count || ' slow queries in last hour'::TEXT,
        CASE WHEN slow_queries_count = 0 THEN 100
             WHEN slow_queries_count < 5 THEN 80
             WHEN slow_queries_count < 15 THEN 60
             ELSE 30 END;

    RETURN QUERY SELECT
        'overall'::TEXT,
        CASE WHEN total_score >= 80 THEN 'healthy'
             WHEN total_score >= 60 THEN 'degraded'
             ELSE 'unhealthy' END,
        'Overall health score: ' || total_score::TEXT,
        total_score;
END;
$$ LANGUAGE plpgsql;

-- 3. 自动故障恢复机制
CREATE TABLE recovery_actions (
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_condition TEXT NOT NULL,     -- 触发条件表达式
    action_type VARCHAR(50) NOT NULL,    -- 'restart', 'scale_up', 'failover'
    action_params JSON,                  -- 动作参数
    cooldown_minutes INTEGER DEFAULT 5, -- 冷却时间（分钟）
    last_executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 故障检测触发器
CREATE OR REPLACE FUNCTION detect_and_recover_from_failures()
RETURNS VOID AS $$
DECLARE
    health_record RECORD;
    recovery_action RECORD;
BEGIN
    -- 执行健康检查
    FOR health_record IN SELECT * FROM check_database_health() LOOP
        -- 如果发现不健康状态，触发恢复动作
        IF health_record.status IN ('degraded', 'unhealthy') THEN

            -- 查找合适的恢复动作
            SELECT * INTO recovery_action
            FROM recovery_actions
            WHERE trigger_condition LIKE '%' || health_record.check_name || '%'
              AND (last_executed_at IS NULL OR
                   last_executed_at < CURRENT_TIMESTAMP - INTERVAL '1 minute' * cooldown_minutes);

            IF FOUND THEN
                -- 执行恢复动作
                CASE recovery_action.action_type
                    WHEN 'memory_cleanup' THEN
                        -- 执行内存清理
                        PRAGMA shrink_memory;
                    WHEN 'connection_limit' THEN
                        -- 限制新连接
                        SET max_connections = (SELECT action_params->>'max_connections');
                    WHEN 'query_timeout' THEN
                        -- 调整查询超时
                        SET query_timeout = (SELECT action_params->>'timeout_seconds');
                END CASE;

                -- 记录恢复动作执行
                UPDATE recovery_actions
                SET last_executed_at = CURRENT_TIMESTAMP
                WHERE action_id = recovery_action.action_id;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. 定期健康检查调度
CREATE OR REPLACE FUNCTION schedule_health_checks()
RETURNS VOID AS $$
BEGIN
    -- 每分钟执行一次健康检查
    PERFORM check_database_health();

    -- 每5分钟执行故障检测和恢复
    IF EXTRACT(MINUTE FROM CURRENT_TIMESTAMP)::INTEGER % 5 = 0 THEN
        PERFORM detect_and_recover_from_failures();
    END IF;

    -- 记录健康检查结果
    INSERT INTO health_checks (
        service_name, check_type, status,
        response_time_ms, next_check_at
    )
    SELECT
        'database',
        check_name,
        status,
        100 + random() * 200, -- 模拟响应时间
        CURRENT_TIMESTAMP + INTERVAL '1 minute'
    FROM check_database_health();
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('health-monitoring')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">容量规划与自动扩展</h3>

      <InfoBox type="tip" title="容量规划关键指标" {...noteProps('capacity-planning')}>
        <ul className="list-disc ml-4 space-y-2">
          <li><strong>资源利用率：</strong> CPU、内存、磁盘 I/O 的使用率趋势</li>
          <li><strong>性能指标：</strong> 查询响应时间、吞吐量、并发连接数</li>
          <li><strong>数据增长：</strong> 表大小增长率、索引大小、备份大小</li>
          <li><strong>业务指标：</strong> 用户活跃度、数据处理量、业务峰值</li>
          <li><strong>成本效益：</strong> 资源成本 vs 性能收益的平衡点</li>
        </ul>
      </InfoBox>

      <CodeBlock
        title="智能容量规划系统"
        code={`-- 1. 容量规划指标收集
CREATE TABLE capacity_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL, -- 'cpu', 'memory', 'disk', 'connections'
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(20),
    collection_period_minutes INTEGER DEFAULT 5,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 趋势分析函数
CREATE OR REPLACE FUNCTION analyze_capacity_trends(
    metric_type TEXT,
    analysis_period_days INTEGER DEFAULT 30
)
RETURNS TABLE(
    trend_direction TEXT,
    growth_rate_percent DECIMAL(5,2),
    predicted_value DECIMAL(10,2),
    confidence_level DECIMAL(3,2),
    recommendation TEXT
) AS $$
DECLARE
    avg_current DECIMAL(10,2);
    avg_previous DECIMAL(10,2);
    growth_rate DECIMAL(5,2);
    linear_trend DECIMAL(10,2);
BEGIN
    -- 计算当前和之前的平均值
    SELECT AVG(metric_value) INTO avg_current
    FROM capacity_metrics
    WHERE metric_type = metric_type
      AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * (analysis_period_days / 2);

    SELECT AVG(metric_value) INTO avg_previous
    FROM capacity_metrics
    WHERE metric_type = metric_type
      AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * analysis_period_days
      AND recorded_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * (analysis_period_days / 2);

    -- 计算增长率
    IF avg_previous > 0 THEN
        growth_rate := ((avg_current - avg_previous) / avg_previous) * 100;
    ELSE
        growth_rate := 0;
    END IF;

    -- 线性趋势预测
    SELECT regr_slope(metric_value, EXTRACT(EPOCH FROM recorded_at)) INTO linear_trend
    FROM capacity_metrics
    WHERE metric_type = metric_type
      AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * analysis_period_days;

    -- 生成推荐
    RETURN QUERY SELECT
        CASE
            WHEN growth_rate > 10 THEN 'increasing'
            WHEN growth_rate < -10 THEN 'decreasing'
            ELSE 'stable'
        END::TEXT as trend_direction,
        growth_rate,
        avg_current + (linear_trend * 30 * 24 * 3600), -- 30天后的预测值
        0.85::DECIMAL(3,2) as confidence_level, -- 简化的置信度
        CASE
            WHEN growth_rate > 20 THEN '建议立即扩展资源容量'
            WHEN growth_rate > 10 THEN '建议规划资源扩展'
            WHEN growth_rate < -20 THEN '资源利用率过低，考虑优化配置'
            ELSE '资源使用稳定，无需调整'
        END as recommendation;
END;
$$ LANGUAGE plpgsql;

-- 3. 自动扩展决策引擎
CREATE TABLE scaling_decisions (
    decision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL,
    current_value DECIMAL(10,2),
    threshold_value DECIMAL(10,2),
    scaling_action VARCHAR(50), -- 'scale_up', 'scale_down', 'no_action'
    scaling_params JSON,
    decision_reason TEXT,
    executed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION evaluate_scaling_decisions()
RETURNS VOID AS $$
DECLARE
    metric_record RECORD;
    scaling_threshold DECIMAL(10,2);
    scaling_action TEXT;
    scaling_params JSON;
BEGIN
    -- 检查各项指标的扩展需求
    FOR metric_record IN
        SELECT
            metric_type,
            AVG(metric_value) as avg_value,
            MAX(metric_value) as max_value
        FROM capacity_metrics
        WHERE recorded_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
        GROUP BY metric_type
    LOOP
        -- 根据指标类型设置不同的阈值
        CASE metric_record.metric_type
            WHEN 'cpu' THEN
                scaling_threshold := 80;
                scaling_action := CASE
                    WHEN metric_record.avg_value > scaling_threshold THEN 'scale_up'
                    ELSE 'no_action'
                END;
                scaling_params := json_object('target_cpu_cores', 8);

            WHEN 'memory' THEN
                scaling_threshold := 85;
                scaling_action := CASE
                    WHEN metric_record.avg_value > scaling_threshold THEN 'scale_up'
                    ELSE 'no_action'
                END;
                scaling_params := json_object('target_memory_gb', 16);

            WHEN 'connections' THEN
                scaling_threshold := 100;
                scaling_action := CASE
                    WHEN metric_record.avg_value > scaling_threshold THEN 'scale_up'
                    ELSE 'no_action'
                END;
                scaling_params := json_object('max_connections', 200);

            ELSE
                scaling_action := 'no_action';
                scaling_params := NULL;
        END CASE;

        -- 记录扩展决策
        IF scaling_action != 'no_action' THEN
            INSERT INTO scaling_decisions (
                metric_type, current_value, threshold_value,
                scaling_action, scaling_params,
                decision_reason
            ) VALUES (
                metric_record.metric_type,
                metric_record.avg_value,
                scaling_threshold,
                scaling_action,
                scaling_params,
                'Automatic scaling based on ' || metric_record.metric_type || ' usage'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. 容量规划报告生成
CREATE OR REPLACE FUNCTION generate_capacity_report()
RETURNS TEXT AS $$
DECLARE
    report_text TEXT := '';
    metric_record RECORD;
BEGIN
    report_text := report_text || '=== 容量规划报告 ===\n\n';
    report_text := report_text || '生成时间: ' || CURRENT_TIMESTAMP || '\n\n';

    -- 资源使用概况
    report_text := report_text || '📊 资源使用概况:\n';
    FOR metric_record IN
        SELECT
            metric_type,
            ROUND(AVG(metric_value), 2) as avg_value,
            ROUND(MIN(metric_value), 2) as min_value,
            ROUND(MAX(metric_value), 2) as max_value,
            metric_unit
        FROM capacity_metrics
        WHERE recorded_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
        GROUP BY metric_type, metric_unit
    LOOP
        report_text := report_text || '  ' || metric_record.metric_type || ': ' ||
                      metric_record.avg_value || ' ' || metric_record.metric_unit ||
                      ' (范围: ' || metric_record.min_value || '-' || metric_record.max_value || ')\n';
    END LOOP;

    -- 趋势分析
    report_text := report_text || '\n📈 趋势分析:\n';
    FOR metric_record IN
        SELECT * FROM analyze_capacity_trends('cpu', 7)
        UNION ALL
        SELECT * FROM analyze_capacity_trends('memory', 7)
        UNION ALL
        SELECT * FROM analyze_capacity_trends('disk', 7)
    LOOP
        report_text := report_text || '  ' || metric_record.trend_direction ||
                      ' 增长率: ' || ROUND(metric_record.growth_rate_percent, 1) || '%\n';
        report_text := report_text || '  预测值: ' || ROUND(metric_record.predicted_value, 2) || '\n';
        report_text := report_text || '  建议: ' || metric_record.recommendation || '\n\n';
    END LOOP;

    -- 扩展建议
    report_text := report_text || '🎯 扩展建议:\n';
    FOR metric_record IN
        SELECT * FROM scaling_decisions
        WHERE executed = FALSE
        AND created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
        ORDER BY created_at DESC
        LIMIT 5
    LOOP
        report_text := report_text || '  • ' || metric_record.metric_type ||
                      ': ' || metric_record.scaling_action || '\n';
        report_text := report_text || '    原因: ' || metric_record.decision_reason || '\n\n';
    END LOOP;

    RETURN report_text;
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('capacity-planning')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">灾难恢复与业务连续性</h3>

      <CodeBlock
        title="灾难恢复计划 (DRP)"
        code={`-- 1. 灾难恢复配置表
CREATE TABLE disaster_recovery_config (
    config_id INTEGER PRIMARY KEY,
    recovery_point_objective_minutes INTEGER, -- RPO: 数据丢失容忍时间
    recovery_time_objective_minutes INTEGER,  -- RTO: 服务恢复时间
    backup_frequency_hours INTEGER DEFAULT 24,
    geo_redundancy_enabled BOOLEAN DEFAULT FALSE,
    failover_automation_enabled BOOLEAN DEFAULT TRUE,
    notification_channels JSON, -- 邮件、短信、Webhook 等
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 灾难恢复测试记录
CREATE TABLE dr_test_results (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_type VARCHAR(50) NOT NULL, -- 'full_failover', 'partial_outage', 'data_corruption'
    scenario_description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    success BOOLEAN,
    rto_actual_minutes INTEGER,
    rpo_actual_minutes INTEGER,
    issues_encountered JSON,
    lessons_learned TEXT,
    test_report_url VARCHAR(500)
);

-- 3. 自动故障转移触发器
CREATE OR REPLACE FUNCTION trigger_disaster_recovery()
RETURNS VOID AS $$
DECLARE
    dr_config RECORD;
    current_health_score INTEGER;
    failover_needed BOOLEAN := FALSE;
BEGIN
    -- 获取 DR 配置
    SELECT * INTO dr_config FROM disaster_recovery_config LIMIT 1;

    -- 评估当前系统健康状态
    SELECT score INTO current_health_score
    FROM check_database_health()
    WHERE check_name = 'overall';

    -- 判断是否需要故障转移
    IF current_health_score < 50 THEN
        failover_needed := TRUE;
    END IF;

    -- 检查关键服务可用性
    IF NOT EXISTS (
        SELECT 1 FROM health_checks
        WHERE service_name = 'primary_database'
        AND status = 'healthy'
        AND checked_at >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
    ) THEN
        failover_needed := TRUE;
    END IF;

    -- 执行故障转移
    IF failover_needed AND dr_config.failover_automation_enabled THEN
        -- 记录故障转移开始
        INSERT INTO failover_history (
            failover_type, trigger_reason, start_time, status
        ) VALUES (
            'automatic',
            'Health score: ' || current_health_score,
            CURRENT_TIMESTAMP,
            'in_progress'
        );

        -- 这里会触发外部的故障转移脚本
        -- 实际实现需要与基础设施管理工具集成

        -- 发送告警通知
        PERFORM send_dr_notification(
            'disaster_recovery_triggered',
            json_object(
                'health_score', current_health_score,
                'trigger_time', CURRENT_TIMESTAMP,
                'rto_target', dr_config.recovery_time_objective_minutes
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. 业务影响分析
CREATE TABLE business_impact_analysis (
    impact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL,
    affected_services JSON,        -- 受影响的服务列表
    user_impact_level VARCHAR(20), -- 'none', 'minor', 'major', 'critical'
    financial_impact_estimate DECIMAL(12,2),
    recovery_priority INTEGER,     -- 1=最高, 5=最低
    estimated_downtime_minutes INTEGER,
    mitigation_steps JSON,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 业务连续性监控
CREATE OR REPLACE FUNCTION monitor_business_continuity()
RETURNS TABLE(service_name TEXT, availability_percent DECIMAL(5,2), incidents_count INTEGER, mttr_minutes DECIMAL(8,2)) AS $$
BEGIN
    RETURN QUERY
    SELECT
        service_name,
        -- 计算可用性百分比（30天内）
        ROUND(
            (1 - (SUM(
                CASE WHEN status = 'down' THEN
                    EXTRACT(EPOCH FROM (end_time - start_time)) / 60 -- 分钟
                ELSE 0 END
            ) / (30 * 24 * 60))) * 100, -- 30天总分钟数
            2
        ) as availability_percent,

        -- 故障次数
        COUNT(*) FILTER (WHERE status = 'down') as incidents_count,

        -- 平均恢复时间 (MTTR)
        ROUND(AVG(
            CASE WHEN status = 'down' THEN
                EXTRACT(EPOCH FROM (end_time - start_time)) / 60
            ELSE NULL END
        ), 2) as mttr_minutes

    FROM service_uptime_log
    WHERE recorded_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
    GROUP BY service_name;
END;
$$ LANGUAGE plpgsql;

-- 6. 恢复力指标仪表盘
CREATE OR REPLACE FUNCTION generate_resiliency_dashboard()
RETURNS TEXT AS $$
DECLARE
    dashboard_text TEXT := '';
    metric_record RECORD;
BEGIN
    dashboard_text := dashboard_text || '🛡️ 高可用仪表盘 - ' || CURRENT_TIMESTAMP || '\n\n';

    -- 系统健康状态
    dashboard_text := dashboard_text || '🏥 系统健康:\n';
    FOR metric_record IN SELECT * FROM check_database_health() LOOP
        dashboard_text := dashboard_text || '  ' || metric_record.check_name ||
                         ': ' || metric_record.status || ' (' || metric_record.score || '分)\n';
    END LOOP;

    -- 业务连续性指标
    dashboard_text := dashboard_text || '\n📊 业务连续性:\n';
    FOR metric_record IN SELECT * FROM monitor_business_continuity() LOOP
        dashboard_text := dashboard_text || '  ' || metric_record.service_name || '\n';
        dashboard_text := dashboard_text || '    可用性: ' || metric_record.availability_percent || '%\n';
        dashboard_text := dashboard_text || '    故障次数: ' || metric_record.incidents_count || '\n';
        dashboard_text := dashboard_text || '    平均恢复时间: ' || metric_record.mttr_minutes || ' 分钟\n\n';
    END LOOP;

    -- 容量规划状态
    dashboard_text := dashboard_text || '📈 容量规划:\n';
    FOR metric_record IN
        SELECT * FROM analyze_capacity_trends('cpu', 7)
        UNION ALL
        SELECT * FROM analyze_capacity_trends('memory', 7)
    LOOP
        dashboard_text := dashboard_text || '  ' || metric_record.trend_direction ||
                         ' - ' || metric_record.recommendation || '\n';
    END LOOP;

    RETURN dashboard_text;
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('disaster-recovery')}
      />

      <InfoBox type="experiment" title="高可用架构大师挑战" {...noteProps('challenges')}>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">挑战 1：智能监控系统构建</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">设计并实现一个全面的数据库监控系统，包括性能指标收集、异常检测、告警通知和自动恢复机制。</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">挑战 2：多租户资源管理</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">实现一个多租户的资源隔离和管理系统，支持动态资源分配、配额管理、成本分摊和SLA保证。</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">挑战 3：灾难恢复演练系统</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">构建一个自动化灾难恢复测试系统，支持多种故障场景模拟、恢复流程验证和效果评估。</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-semibold">挑战 4：云原生高可用架构</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">设计一个基于云原生技术的 DuckDB 高可用架构，包括容器化部署、服务网格、自动扩缩容和多区域容灾。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
