// ============================================
// 实战项目章节组件
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
// 数据仓库章节
// ============================================

export function DataWarehouseSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据仓库建模</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"企业级数据分析平台的设计与实现"</p>

      <Paragraph {...noteProps('p1')}>
        数据仓库是一个面向分析的数据库，专门用于支持企业决策制定。它整合来自多个源系统的数据，提供统一的视图用于报表、分析和商业智能。数据仓库建模的核心是星型模式和雪花模式。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">星型模式 (Star Schema)</h3>

      <Paragraph {...noteProps('p2')}>
        星型模式的中心是事实表（Fact Table），周围是维度表（Dimension Table）。这种设计简化了查询，提高了性能，是数据仓库最常用的模式。
      </Paragraph>

      <CodeBlock
        title="销售数据仓库 - 星型模式"
        code={`-- 事实表：销售事实
CREATE TABLE fact_sales (
    sale_id INTEGER PRIMARY KEY,
    date_key INTEGER NOT NULL,           -- 外键 -> dim_date
    customer_key INTEGER NOT NULL,       -- 外键 -> dim_customer
    product_key INTEGER NOT NULL,        -- 外键 -> dim_product
    store_key INTEGER NOT NULL,          -- 外键 -> dim_store
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key),
    FOREIGN KEY (product_key) REFERENCES dim_product(product_key),
    FOREIGN KEY (store_key) REFERENCES dim_store(store_key)
);

-- 维度表：日期维度
CREATE TABLE dim_date (
    date_key INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(10) NOT NULL,
    month_name VARCHAR(10) NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    fiscal_year INTEGER,
    fiscal_quarter INTEGER
);

-- 维度表：客户维度
CREATE TABLE dim_customer (
    customer_key INTEGER PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(101),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50),
    age INTEGER,
    gender CHAR(1),
    income_range VARCHAR(20),
    customer_segment VARCHAR(20),
    registration_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 维度表：产品维度
CREATE TABLE dim_product (
    product_key INTEGER PRIMARY KEY,
    product_id VARCHAR(20) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    brand VARCHAR(50),
    supplier VARCHAR(50),
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_date DATE,
    discontinued_date DATE
);

-- 维度表：门店维度
CREATE TABLE dim_store (
    store_key INTEGER PRIMARY KEY,
    store_id VARCHAR(20) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    manager_name VARCHAR(100),
    store_type VARCHAR(20),  -- '旗舰店', '社区店', '在线店'
    square_feet INTEGER,
    opened_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);`}
        {...noteProps('code1')}
      />

      <InfoBox type="tip" title="星型模式的特点" {...noteProps('box1')}>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>结构清晰：</strong> 事实表存储度量值，维度表存储描述信息</li>
          <li><strong>查询简单：</strong> 多表连接时只需要连接维度表和事实表</li>
          <li><strong>性能优异：</strong> 适合 OLAP 查询，支持复杂的聚合分析</li>
          <li><strong>维护容易：</strong> 新增维度或度量时只需修改相应表</li>
        </ul>
      </InfoBox>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">雪花模式 (Snowflake Schema)</h3>

      <Paragraph {...noteProps('p3')}>
        雪花模式是对星型模式的扩展，将维度表进一步分解成子维度表，减少数据冗余，提高数据规范化程度。
      </Paragraph>

      <CodeBlock
        title="雪花模式示例"
        code={`-- 产品维度分解为子维度
CREATE TABLE dim_product (
    product_key INTEGER PRIMARY KEY,
    product_id VARCHAR(20) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category_key INTEGER NOT NULL,    -- 外键 -> dim_category
    brand_key INTEGER NOT NULL,       -- 外键 -> dim_brand
    supplier_key INTEGER NOT NULL,    -- 外键 -> dim_supplier
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- 产品类别维度
CREATE TABLE dim_category (
    category_key INTEGER PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    parent_category_key INTEGER,      -- 支持多级分类
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 品牌维度
CREATE TABLE dim_brand (
    brand_key INTEGER PRIMARY KEY,
    brand_name VARCHAR(50) NOT NULL,
    brand_description TEXT,
    country_of_origin VARCHAR(50),
    founded_year INTEGER
);

-- 供应商维度
CREATE TABLE dim_supplier (
    supplier_key INTEGER PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(200),
    payment_terms VARCHAR(50),
    credit_rating VARCHAR(10)
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据仓库查询示例</h3>

      <CodeBlock
        title="多维度销售分析"
        code={`-- 按年月和产品类别分析销售额
SELECT
    d.year,
    d.month_name,
    p.category,
    p.subcategory,
    SUM(f.total_amount) AS total_sales,
    SUM(f.quantity) AS total_quantity,
    AVG(f.unit_price) AS avg_price,
    COUNT(DISTINCT f.customer_key) AS unique_customers
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
WHERE d.year = 2024
GROUP BY d.year, d.month, d.month_name, p.category, p.subcategory
ORDER BY d.year, d.month, p.category, p.subcategory;

-- 客户购买行为分析
SELECT
    c.customer_segment,
    c.age_group,
    c.gender,
    COUNT(DISTINCT f.customer_key) AS customer_count,
    SUM(f.total_amount) AS total_spent,
    AVG(f.total_amount) AS avg_order_value,
    COUNT(f.sale_id) AS order_count,
    MAX(f.total_amount) AS max_order_value
FROM fact_sales f
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_date d ON f.date_key = d.date_key
WHERE d.year = 2024
GROUP BY c.customer_segment, c.age_group, c.gender
ORDER BY total_spent DESC;

-- 门店业绩对比
SELECT
    s.store_name,
    s.city,
    s.store_type,
    d.year,
    d.quarter,
    SUM(f.total_amount) AS quarterly_sales,
    SUM(f.quantity) AS quarterly_quantity,
    RANK() OVER (PARTITION BY d.year, d.quarter ORDER BY SUM(f.total_amount) DESC) AS sales_rank
FROM fact_sales f
JOIN dim_store s ON f.store_key = s.store_key
JOIN dim_date d ON f.date_key = d.date_key
WHERE d.year >= 2023
GROUP BY s.store_key, s.store_name, s.city, s.store_type, d.year, d.quarter
ORDER BY d.year, d.quarter, sales_rank;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ETL 流程设计</h3>

      <Paragraph {...noteProps('p4')}>
        ETL（Extract, Transform, Load）是数据仓库的核心流程。Extract 从源系统提取数据，Transform 清洗和转换数据，Load 将数据加载到数据仓库。
      </Paragraph>

      <CodeBlock
        title="ETL 示例：销售数据处理"
        code={`-- 1. 创建临时表存储原始数据
CREATE TEMP TABLE staging_sales AS
SELECT * FROM read_csv('raw_sales_data.csv');

-- 2. 数据清洗和转换
CREATE TEMP TABLE cleaned_sales AS
SELECT
    -- 数据验证和清洗
    CASE
        WHEN TRY_CAST(order_id AS INTEGER) IS NOT NULL THEN TRY_CAST(order_id AS INTEGER)
        ELSE NULL
    END AS order_id,

    TRY_CAST(order_date AS DATE) AS order_date,
    UPPER(TRIM(customer_name)) AS customer_name,
    LOWER(TRIM(customer_email)) AS customer_email,

    -- 数据标准化
    CASE
        WHEN LOWER(TRIM(product_category)) IN ('electronics', '电子产品') THEN 'Electronics'
        WHEN LOWER(TRIM(product_category)) IN ('clothing', '服装') THEN 'Clothing'
        WHEN LOWER(TRIM(product_category)) IN ('books', '图书') THEN 'Books'
        ELSE 'Other'
    END AS product_category,

    TRY_CAST(quantity AS INTEGER) AS quantity,
    TRY_CAST(unit_price AS DECIMAL(10,2)) AS unit_price,

    -- 计算派生字段
    TRY_CAST(quantity AS INTEGER) * TRY_CAST(unit_price AS DECIMAL(10,2)) AS total_amount,

    -- 数据质量标记
    CASE
        WHEN TRY_CAST(order_id AS INTEGER) IS NULL THEN 'Invalid Order ID'
        WHEN TRY_CAST(order_date AS DATE) IS NULL THEN 'Invalid Date'
        WHEN TRY_CAST(quantity AS INTEGER) IS NULL OR TRY_CAST(quantity AS INTEGER) <= 0 THEN 'Invalid Quantity'
        WHEN TRY_CAST(unit_price AS DECIMAL(10,2)) IS NULL OR TRY_CAST(unit_price AS DECIMAL(10,2)) < 0 THEN 'Invalid Price'
        ELSE 'Valid'
    END AS data_quality_status

FROM staging_sales
WHERE TRY_CAST(order_date AS DATE) IS NOT NULL  -- 只处理有有效日期的记录
  AND TRY_CAST(quantity AS INTEGER) > 0;        -- 只处理有效数量

-- 3. 维度表更新（缓慢变化维处理）
-- 客户维度 - 类型2缓慢变化维
INSERT INTO dim_customer (
    customer_id, first_name, last_name, email,
    address, city, state, zip_code, effective_date, expiry_date, is_current
)
SELECT
    customer_id,
    SPLIT_PART(customer_name, ' ', 1) AS first_name,
    SPLIT_PART(customer_name, ' ', 2) AS last_name,
    customer_email,
    customer_address,
    customer_city,
    customer_state,
    customer_zip,
    CURRENT_DATE AS effective_date,
    '9999-12-31'::DATE AS expiry_date,
    TRUE AS is_current
FROM (
    SELECT DISTINCT
        MD5(customer_name || customer_email) AS customer_id,
        customer_name,
        customer_email,
        customer_address,
        customer_city,
        customer_state,
        customer_zip
    FROM cleaned_sales
) new_customers
WHERE NOT EXISTS (
    SELECT 1 FROM dim_customer dc
    WHERE dc.customer_id = new_customers.customer_id
    AND dc.is_current = TRUE
);

-- 4. 事实表加载
INSERT INTO fact_sales (
    sale_id, date_key, customer_key, product_key, store_key,
    quantity, unit_price, total_amount
)
SELECT
    cs.order_id,
    dd.date_key,
    dc.customer_key,
    dp.product_key,
    ds.store_key,
    cs.quantity,
    cs.unit_price,
    cs.total_amount
FROM cleaned_sales cs
JOIN dim_date dd ON dd.date = cs.order_date
JOIN dim_customer dc ON dc.customer_id = MD5(cs.customer_name || cs.customer_email)
  AND dc.is_current = TRUE
JOIN dim_product dp ON dp.product_name = cs.product_name
  AND dp.is_active = TRUE
JOIN dim_store ds ON ds.store_id = cs.store_id;

-- 5. 数据质量检查
SELECT
    'Total Records' AS metric,
    COUNT(*) AS value
FROM fact_sales
WHERE order_date >= CURRENT_DATE - INTERVAL '1 day'

UNION ALL

SELECT
    'Invalid Records' AS metric,
    COUNT(*) AS value
FROM cleaned_sales
WHERE data_quality_status != 'Valid'

UNION ALL

SELECT
    'Duplicate Orders' AS metric,
    COUNT(*) - COUNT(DISTINCT order_id) AS value
FROM cleaned_sales;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据仓库最佳实践</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">🏗️ 建模原则</h4>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
            <li>• 优先选择星型模式</li>
            <li>• 事实表存储可加性度量</li>
            <li>• 维度表包含描述性属性</li>
            <li>• 使用代理键避免业务键变化</li>
            <li>• 考虑历史数据保存策略</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">⚡ 性能优化</h4>
          <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
            <li>• 事实表使用列式存储</li>
            <li>• 建立合适的索引</li>
            <li>• 分区大表按时间</li>
            <li>• 预计算常用聚合</li>
            <li>• 使用物化视图</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3">🔍 数据质量</h4>
          <ul className="space-y-2 text-purple-700 dark:text-purple-400 text-sm">
            <li>• 建立数据质量监控</li>
            <li>• 实施数据血缘追踪</li>
            <li>• 定期数据一致性检查</li>
            <li>• 维护数据字典</li>
            <li>• 记录业务规则</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-xl border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">🔄 ETL 设计</h4>
          <ul className="space-y-2 text-amber-700 dark:text-amber-400 text-sm">
            <li>• 增量数据加载</li>
            <li>• 错误处理和重试机制</li>
            <li>• 数据验证和清洗</li>
            <li>• 作业调度和监控</li>
            <li>• 回滚和恢复策略</li>
          </ul>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：设计电商数据仓库</p>
            <p>设计一个完整的电商数据仓库，包括用户、商品、订单、支付等维度和事实表。</p>
          </div>
          <div>
            <p className="font-semibold">任务 2：ETL 流程实现</p>
            <p>实现一个完整的 ETL 流程，从 CSV 文件加载数据，经过清洗转换后加载到数据仓库。</p>
          </div>
          <div>
            <p className="font-semibold">任务 3：多维度分析查询</p>
            <p>编写复杂的多维度分析查询，包括时间序列分析、用户行为分析等。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 数据分析章节
// ============================================

export function DataAnalysisSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据分析案例</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从数据中发现洞察，驱动业务决策"</p>

      <Paragraph {...noteProps('p1')}>
        数据分析是将原始数据转换为有意义的洞察和可操作见解的过程。通过统计分析、趋势识别、模式发现、相关性分析等技术，我们可以从海量数据中提取有价值的信息，支持业务决策和策略制定。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">探索性数据分析 (EDA)</h3>

      <Paragraph {...noteProps('p2')}>
        EDA 是数据分析的第一步，通过各种统计方法和可视化技术了解数据的整体情况、分布特征和潜在问题。
      </Paragraph>

      <CodeBlock
        title="数据概览和基本统计"
        code={`-- 数据集概览
SELECT
    COUNT(*) AS total_records,
    COUNT(*) - COUNT(sale_amount) AS null_sales,
    MIN(sale_date) AS date_range_start,
    MAX(sale_date) AS date_range_end,
    COUNT(DISTINCT customer_id) AS unique_customers,
    COUNT(DISTINCT product_id) AS unique_products
FROM sales_data;

-- 数值字段统计分布
SELECT
    'sale_amount' AS field_name,
    COUNT(sale_amount) AS non_null_count,
    AVG(sale_amount) AS mean,
    STDDEV(sale_amount) AS std_dev,
    MIN(sale_amount) AS min_value,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY sale_amount) AS q1,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sale_amount) AS median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sale_amount) AS q3,
    MAX(sale_amount) AS max_value
FROM sales_data
WHERE sale_amount IS NOT NULL

UNION ALL

SELECT
    'quantity' AS field_name,
    COUNT(quantity) AS non_null_count,
    AVG(quantity) AS mean,
    STDDEV(quantity) AS std_dev,
    MIN(quantity) AS min_value,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY quantity) AS q1,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY quantity) AS median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY quantity) AS q3,
    MAX(quantity) AS max_value
FROM sales_data
WHERE quantity IS NOT NULL;

-- 分类型字段分布
SELECT
    product_category,
    COUNT(*) AS record_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage,
    AVG(sale_amount) AS avg_sale_amount,
    SUM(sale_amount) AS total_sales
FROM sales_data
WHERE product_category IS NOT NULL
GROUP BY product_category
ORDER BY record_count DESC;

-- 数据质量检查
SELECT
    'Total Records' AS metric, COUNT(*) AS value FROM sales_data
UNION ALL
SELECT 'Complete Records' AS metric, COUNT(*) AS value
FROM sales_data
WHERE sale_amount IS NOT NULL
  AND quantity IS NOT NULL
  AND customer_id IS NOT NULL
  AND product_id IS NOT NULL
UNION ALL
SELECT 'Records with Issues' AS metric, COUNT(*) AS value
FROM sales_data
WHERE sale_amount IS NULL
   OR quantity IS NULL
   OR customer_id IS NULL
   OR product_id IS NULL
   OR sale_amount < 0
   OR quantity < 0;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">趋势分析和时间序列</h3>

      <CodeBlock
        title="销售趋势分析"
        code={`-- 月度销售趋势
SELECT
    DATE_TRUNC('month', sale_date) AS month,
    COUNT(*) AS order_count,
    SUM(sale_amount) AS total_sales,
    AVG(sale_amount) AS avg_order_value,
    COUNT(DISTINCT customer_id) AS unique_customers,

    -- 环比增长
    LAG(SUM(sale_amount)) OVER (ORDER BY DATE_TRUNC('month', sale_date)) AS prev_month_sales,
    ROUND(
        (SUM(sale_amount) - LAG(SUM(sale_amount)) OVER (ORDER BY DATE_TRUNC('month', sale_date))) /
        NULLIF(LAG(SUM(sale_amount)) OVER (ORDER BY DATE_TRUNC('month', sale_date)), 0) * 100,
        2
    ) AS month_over_month_growth

FROM sales_data
WHERE sale_date >= '2023-01-01'
GROUP BY DATE_TRUNC('month', sale_date)
ORDER BY month;

-- 季节性分析
SELECT
    EXTRACT(month FROM sale_date) AS month,
    AVG(SUM(sale_amount)) OVER (PARTITION BY EXTRACT(month FROM sale_date)) AS avg_monthly_sales,
    STDDEV(SUM(sale_amount)) OVER (PARTITION BY EXTRACT(month FROM sale_date)) AS sales_volatility,

    -- 年度趋势
    AVG(SUM(sale_amount)) OVER (
        PARTITION BY EXTRACT(month FROM sale_date)
        ORDER BY EXTRACT(year FROM sale_date)
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3_years

FROM sales_data
WHERE sale_date >= '2020-01-01'
GROUP BY EXTRACT(year FROM sale_date), EXTRACT(month FROM sale_date)
ORDER BY month;

-- 产品生命周期分析
SELECT
    product_id,
    product_name,
    MIN(sale_date) AS first_sale_date,
    MAX(sale_date) AS last_sale_date,
    COUNT(*) AS total_sales,
    SUM(sale_amount) AS lifetime_value,

    -- 销售持续时间（天）
    DATE_DIFF('day', MIN(sale_date), MAX(sale_date)) AS sales_duration_days,

    -- 日均销售额
    ROUND(SUM(sale_amount) / NULLIF(DATE_DIFF('day', MIN(sale_date), MAX(sale_date)), 0), 2) AS daily_avg_sales,

    -- 销售频率
    ROUND(COUNT(*) * 1.0 / NULLIF(DATE_DIFF('day', MIN(sale_date), MAX(sale_date)), 0), 4) AS sales_per_day

FROM sales_data
GROUP BY product_id, product_name
HAVING COUNT(*) > 10  -- 只分析有足够销售记录的产品
ORDER BY lifetime_value DESC;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">客户行为分析</h3>

      <CodeBlock
        title="RFM 分析（最近购买、购买频率、购买金额）"
        code={`-- RFM 分析基础数据
WITH customer_rfm AS (
    SELECT
        customer_id,
        customer_name,

        -- Recency: 最近购买距今天数
        DATE_DIFF('day', MAX(sale_date), CURRENT_DATE) AS recency_days,

        -- Frequency: 购买频率（总订单数）
        COUNT(DISTINCT CASE WHEN sale_date >= '2024-01-01' THEN sale_id END) AS frequency_2024,

        -- Monetary: 购买金额（年度总消费）
        SUM(CASE WHEN sale_date >= '2024-01-01' THEN sale_amount ELSE 0 END) AS monetary_2024,

        -- 平均订单价值
        AVG(sale_amount) AS avg_order_value,

        -- 客户生命周期长度
        DATE_DIFF('day', MIN(sale_date), MAX(sale_date)) AS customer_lifetime_days,

        -- 购买间隔统计
        AVG(purchase_interval) AS avg_days_between_orders

    FROM (
        SELECT
            customer_id,
            customer_name,
            sale_id,
            sale_date,
            sale_amount,

            -- 计算购买间隔
            DATE_DIFF('day',
                LAG(sale_date) OVER (PARTITION BY customer_id ORDER BY sale_date),
                sale_date
            ) AS purchase_interval

        FROM sales_data
        WHERE customer_id IS NOT NULL
    ) customer_orders
    GROUP BY customer_id, customer_name
)

-- RFM 分数和客户分层
SELECT
    customer_id,
    customer_name,

    -- R 分数（最近购买：1-5分，1分最差）
    CASE
        WHEN recency_days <= 30 THEN 5
        WHEN recency_days <= 90 THEN 4
        WHEN recency_days <= 180 THEN 3
        WHEN recency_days <= 365 THEN 2
        ELSE 1
    END AS r_score,

    -- F 分数（购买频率：1-5分，1分最差）
    CASE
        WHEN frequency_2024 >= 10 THEN 5
        WHEN frequency_2024 >= 5 THEN 4
        WHEN frequency_2024 >= 2 THEN 3
        WHEN frequency_2024 >= 1 THEN 2
        ELSE 1
    END AS f_score,

    -- M 分数（购买金额：1-5分，1分最差）
    CASE
        WHEN monetary_2024 >= 10000 THEN 5
        WHEN monetary_2024 >= 5000 THEN 4
        WHEN monetary_2024 >= 1000 THEN 3
        WHEN monetary_2024 >= 100 THEN 2
        ELSE 1
    END AS m_score,

    -- RFM 综合分数
    (CASE WHEN recency_days <= 30 THEN 5 WHEN recency_days <= 90 THEN 4
          WHEN recency_days <= 180 THEN 3 WHEN recency_days <= 365 THEN 2 ELSE 1 END +
     CASE WHEN frequency_2024 >= 10 THEN 5 WHEN frequency_2024 >= 5 THEN 4
          WHEN frequency_2024 >= 2 THEN 3 WHEN frequency_2024 >= 1 THEN 2 ELSE 1 END +
     CASE WHEN monetary_2024 >= 10000 THEN 5 WHEN monetary_2024 >= 5000 THEN 4
          WHEN monetary_2024 >= 1000 THEN 3 WHEN monetary_2024 >= 100 THEN 2 ELSE 1 END) AS rfm_score,

    -- 客户价值分层
    CASE
        WHEN (CASE WHEN recency_days <= 30 THEN 5 WHEN recency_days <= 90 THEN 4
                   WHEN recency_days <= 180 THEN 3 WHEN recency_days <= 365 THEN 2 ELSE 1 END +
             CASE WHEN frequency_2024 >= 10 THEN 5 WHEN frequency_2024 >= 5 THEN 4
                  WHEN frequency_2024 >= 2 THEN 3 WHEN frequency_2024 >= 1 THEN 2 ELSE 1 END +
             CASE WHEN monetary_2024 >= 10000 THEN 5 WHEN monetary_2024 >= 5000 THEN 4
                  WHEN monetary_2024 >= 1000 THEN 3 WHEN monetary_2024 >= 100 THEN 2 ELSE 1 END) >= 13 THEN '高价值客户'
        WHEN (CASE WHEN recency_days <= 30 THEN 5 WHEN recency_days <= 90 THEN 4
                   WHEN recency_days <= 180 THEN 3 WHEN recency_days <= 365 THEN 2 ELSE 1 END +
             CASE WHEN frequency_2024 >= 10 THEN 5 WHEN frequency_2024 >= 5 THEN 4
                  WHEN frequency_2024 >= 2 THEN 3 WHEN frequency_2024 >= 1 THEN 2 ELSE 1 END +
             CASE WHEN monetary_2024 >= 10000 THEN 5 WHEN monetary_2024 >= 5000 THEN 4
                  WHEN monetary_2024 >= 1000 THEN 3 WHEN monetary_2024 >= 100 THEN 2 ELSE 1 END) >= 9 THEN '中等价值客户'
        ELSE '低价值客户'
    END AS customer_segment,

    recency_days,
    frequency_2024,
    monetary_2024,
    avg_order_value,
    customer_lifetime_days

FROM customer_rfm
ORDER BY rfm_score DESC, monetary_2024 DESC;`}
        {...noteProps('code3')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">产品和类别分析</h3>

      <CodeBlock
        title="产品表现和市场篮子分析"
        code={`-- 产品表现分析
SELECT
    p.product_id,
    p.product_name,
    p.product_category,
    p.product_brand,

    -- 销售指标
    SUM(s.quantity) AS total_quantity_sold,
    SUM(s.sale_amount) AS total_sales,
    AVG(s.sale_amount) AS avg_sale_price,
    COUNT(DISTINCT s.customer_id) AS unique_customers,

    -- 排名指标
    RANK() OVER (ORDER BY SUM(s.sale_amount) DESC) AS sales_rank,
    RANK() OVER (PARTITION BY p.product_category ORDER BY SUM(s.sale_amount) DESC) AS category_sales_rank,

    -- 时间趋势
    SUM(CASE WHEN s.sale_date >= '2024-01-01' THEN s.sale_amount ELSE 0 END) AS sales_2024,
    SUM(CASE WHEN s.sale_date >= '2023-01-01' AND s.sale_date < '2024-01-01' THEN s.sale_amount ELSE 0 END) AS sales_2023,

    -- 增长率
    ROUND(
        (SUM(CASE WHEN s.sale_date >= '2024-01-01' THEN s.sale_amount ELSE 0 END) -
         SUM(CASE WHEN s.sale_date >= '2023-01-01' AND s.sale_date < '2024-01-01' THEN s.sale_amount ELSE 0 END)) /
        NULLIF(SUM(CASE WHEN s.sale_date >= '2023-01-01' AND s.sale_date < '2024-01-01' THEN s.sale_amount ELSE 0 END), 0) * 100,
        2
    ) AS yoy_growth

FROM products p
LEFT JOIN sales_data s ON p.product_id = s.product_id
WHERE s.sale_date >= '2023-01-01'
GROUP BY p.product_id, p.product_name, p.product_category, p.product_brand
ORDER BY total_sales DESC;

-- 市场篮子分析（产品关联规则）
WITH product_pairs AS (
    SELECT
        o1.product_id AS product_a,
        o2.product_id AS product_b,
        COUNT(DISTINCT o1.sale_id) AS co_occurrence_count
    FROM sales_data o1
    JOIN sales_data o2 ON o1.sale_id = o2.sale_id
        AND o1.product_id < o2.product_id  -- 避免重复计算
    GROUP BY o1.product_id, o2.product_id
),

product_stats AS (
    SELECT
        product_id,
        product_name,
        COUNT(DISTINCT sale_id) AS order_count
    FROM sales_data
    GROUP BY product_id, product_name
)

SELECT
    p1.product_name AS product_a,
    p2.product_name AS product_b,
    pp.co_occurrence_count,

    -- 支持度：同时购买的订单比例
    ROUND(pp.co_occurrence_count * 100.0 / ps1.order_count, 2) AS support_percentage,

    -- 置信度：购买A后购买B的概率
    ROUND(pp.co_occurrence_count * 100.0 / ps1.order_count, 2) AS confidence_a_to_b,

    -- 提升度：关联强度
    ROUND(
        (pp.co_occurrence_count * 1.0 / ps1.order_count) /
        (ps2.order_count * 1.0 / (SELECT COUNT(DISTINCT sale_id) FROM sales_data)),
        2
    ) AS lift

FROM product_pairs pp
JOIN product_stats ps1 ON pp.product_a = ps1.product_id
JOIN product_stats ps2 ON pp.product_b = ps2.product_id
JOIN products p1 ON pp.product_a = p1.product_id
JOIN products p2 ON pp.product_b = p2.product_id
WHERE pp.co_occurrence_count >= 5  -- 只显示有足够共现的产品对
ORDER BY lift DESC, co_occurrence_count DESC
LIMIT 20;`}
        {...noteProps('code4')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">A/B 测试分析</h3>

      <CodeBlock
        title="实验效果评估"
        code={`-- A/B 测试结果分析
WITH ab_test_results AS (
    SELECT
        experiment_group,
        COUNT(*) AS total_users,
        COUNT(CASE WHEN conversion_event = 'purchase' THEN 1 END) AS converted_users,
        SUM(purchase_amount) AS total_revenue,
        AVG(purchase_amount) AS avg_order_value,

        -- 转化率
        ROUND(COUNT(CASE WHEN conversion_event = 'purchase' THEN 1 END) * 100.0 / COUNT(*), 2) AS conversion_rate,

        -- 平均客单价（只计算购买用户）
        ROUND(AVG(CASE WHEN conversion_event = 'purchase' THEN purchase_amount END), 2) AS avg_order_value_converted

    FROM experiment_data
    WHERE experiment_id = 'homepage_redesign_q1_2024'
    GROUP BY experiment_group
),

statistical_test AS (
    SELECT
        a.experiment_group AS group_a,
        b.experiment_group AS group_b,
        a.conversion_rate AS rate_a,
        b.conversion_rate AS rate_b,

        -- 转化率差异
        ROUND((b.conversion_rate - a.conversion_rate), 2) AS rate_difference,

        -- 统计显著性（简化的Z检验近似）
        ROUND(
            ABS(b.conversion_rate - a.conversion_rate) /
            SQRT(
                (a.conversion_rate * (100 - a.conversion_rate) / a.total_users) +
                (b.conversion_rate * (100 - b.conversion_rate) / b.total_users)
            ),
            2
        ) AS z_score,

        -- P值近似（基于Z分数）
        CASE
            WHEN ABS(b.conversion_rate - a.conversion_rate) /
                 SQRT(
                     (a.conversion_rate * (100 - a.conversion_rate) / a.total_users) +
                     (b.conversion_rate * (100 - b.conversion_rate) / b.total_users)
                 ) > 1.96 THEN '显著 (p < 0.05)'
            WHEN ABS(b.conversion_rate - a.conversion_rate) /
                 SQRT(
                     (a.conversion_rate * (100 - a.conversion_rate) / a.total_users) +
                     (b.conversion_rate * (100 - b.conversion_rate) / b.total_users)
                 ) > 1.645 THEN '边缘显著 (p < 0.10)'
            ELSE '不显著'
        END AS significance

    FROM ab_test_results a
    CROSS JOIN ab_test_results b
    WHERE a.experiment_group = 'control' AND b.experiment_group = 'treatment'
)

SELECT * FROM ab_test_results
UNION ALL
SELECT
    '统计检验结果' AS experiment_group,
    NULL AS total_users,
    NULL AS converted_users,
    NULL AS total_revenue,
    NULL AS avg_order_value,
    NULL AS conversion_rate,
    NULL AS avg_order_value_converted
UNION ALL
SELECT
    group_a || ' vs ' || group_b AS experiment_group,
    NULL AS total_users,
    NULL AS converted_users,
    NULL AS total_revenue,
    NULL AS avg_order_value,
    rate_a || '% vs ' || rate_b || '%' AS conversion_rate,
    '差异: ' || rate_difference || '%, ' || significance AS avg_order_value_converted
FROM statistical_test;`}
        {...noteProps('code5')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">预测分析基础</h3>

      <CodeBlock
        title="简单线性回归和趋势预测"
        code={`-- 销售趋势预测（简单移动平均）
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', sale_date) AS month,
        SUM(sale_amount) AS monthly_sales,
        COUNT(DISTINCT customer_id) AS unique_customers
    FROM sales_data
    WHERE sale_date >= '2023-01-01'
    GROUP BY DATE_TRUNC('month', sale_date)
    ORDER BY month
),

moving_averages AS (
    SELECT
        month,
        monthly_sales,

        -- 3月移动平均
        AVG(monthly_sales) OVER (
            ORDER BY month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS ma_3_month,

        -- 6月移动平均
        AVG(monthly_sales) OVER (
            ORDER BY month
            ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
        ) AS ma_6_month,

        -- 销售增长率
        ROUND(
            (monthly_sales - LAG(monthly_sales) OVER (ORDER BY month)) /
            NULLIF(LAG(monthly_sales) OVER (ORDER BY month), 0) * 100,
            2
        ) AS month_over_month_growth

    FROM monthly_sales
)

SELECT
    month,
    monthly_sales,
    ma_3_month,
    ma_6_month,
    month_over_month_growth,

    -- 预测下个月销售额（基于3月移动平均的趋势）
    ROUND(
        ma_3_month * (1 + AVG(month_over_month_growth) OVER (
            ORDER BY month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) / 100),
        2
    ) AS predicted_next_month

FROM moving_averages
ORDER BY month;

-- 客户流失预测指标
SELECT
    customer_id,
    customer_name,

    -- 购买间隔分析
    AVG(purchase_interval_days) AS avg_days_between_purchases,
    MAX(purchase_interval_days) AS max_days_between_purchases,

    -- 最近购买距今天数
    DATE_DIFF('day', MAX(sale_date), CURRENT_DATE) AS days_since_last_purchase,

    -- 购买频率趋势
    CASE
        WHEN DATE_DIFF('day', MAX(sale_date), CURRENT_DATE) > AVG(purchase_interval_days) * 2 THEN '高风险'
        WHEN DATE_DIFF('day', MAX(sale_date), CURRENT_DATE) > AVG(purchase_interval_days) * 1.5 THEN '中等风险'
        ELSE '低风险'
    END AS churn_risk,

    -- 生命周期价值预测
    SUM(sale_amount) AS lifetime_value,
    COUNT(*) AS total_orders,
    AVG(sale_amount) AS avg_order_value,

    -- 预测指标
    ROUND(SUM(sale_amount) / NULLIF(DATE_DIFF('day', MIN(sale_date), MAX(sale_date)), 0) * 365, 2) AS annualized_value

FROM (
    SELECT
        customer_id,
        customer_name,
        sale_date,
        sale_amount,
        DATE_DIFF('day',
            LAG(sale_date) OVER (PARTITION BY customer_id ORDER BY sale_date),
            sale_date
        ) AS purchase_interval_days
    FROM sales_data
    WHERE customer_id IS NOT NULL
) customer_purchases
GROUP BY customer_id, customer_name
HAVING COUNT(*) >= 3  -- 只分析有足够历史数据的客户
ORDER BY days_since_last_purchase DESC;`}
        {...noteProps('code6')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">📊 数据分析流程</h4>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
            <li>• 数据收集与整合</li>
            <li>• 数据清洗和预处理</li>
            <li>• 探索性数据分析</li>
            <li>• 假设检验和建模</li>
            <li>• 结果解读和报告</li>
            <li>• 业务决策支持</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3">🛠️ 常用分析工具</h4>
          <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
            <li>• 描述性统计分析</li>
            <li>• 相关性和回归分析</li>
            <li>• 时间序列分析</li>
            <li>• 聚类和分类分析</li>
            <li>• A/B 测试和实验设计</li>
            <li>• 预测建模技术</li>
          </ul>
        </div>
      </div>

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：完整的 EDA 分析</p>
            <p>对给定的数据集进行完整的探索性数据分析，包括数据质量检查、分布分析、异常值检测等。</p>
          </div>
          <div>
            <p className="font-semibold">任务 2：客户细分分析</p>
            <p>基于 RFM 模型对客户进行细分，并分析不同客户群体的特征和价值。</p>
          </div>
          <div>
            <p className="font-semibold">任务 3：销售预测建模</p>
            <p>构建简单的趋势预测模型，预测未来几个月的销售情况。</p>
          </div>
          <div>
            <p className="font-semibold">任务 4：A/B 测试评估</p>
            <p>分析 A/B 测试的结果，评估实验效果并进行统计显著性检验。</p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// API集成项目章节
// ============================================

export function ApiIntegrationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">API数据集成</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"连接外部数据源，构建数据管道"</p>

      <Paragraph {...noteProps('p1')}>
        API集成是将外部API的数据导入DuckDB进行分析的项目。通过这个项目，你将学会如何设计完整的ETL流程，从API获取数据、数据清洗、存储到分析。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• RESTful API数据获取</li>
            <li>• 增量数据同步</li>
            <li>• 数据质量监控</li>
            <li>• 错误处理与重试</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• DuckDB作为数据仓库</li>
            <li>• HTTP客户端调用API</li>
            <li>• JSON数据处理</li>
            <li>• 定时任务调度</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">系统架构</h3>

      <CodeBlock
        title="数据流设计"
        code={`-- 数据表设计
CREATE TABLE api_sources (
    source_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    base_url VARCHAR NOT NULL,
    auth_token VARCHAR,
    rate_limit INTEGER DEFAULT 100,
    last_sync TIMESTAMP
);

CREATE TABLE api_endpoints (
    endpoint_id INTEGER PRIMARY KEY,
    source_id INTEGER REFERENCES api_sources(source_id),
    path VARCHAR NOT NULL,
    method VARCHAR DEFAULT 'GET',
    params JSON,  -- 请求参数
    response_schema JSON,  -- 响应格式
    sync_interval_minutes INTEGER DEFAULT 60
);

CREATE TABLE api_data (
    id INTEGER PRIMARY KEY,
    endpoint_id INTEGER REFERENCES api_endpoints(endpoint_id),
    raw_data JSON,
    processed_data JSON,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'success'
);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据获取模块</h3>

      <CodeBlock
        title="API调用和数据获取"
        code={`-- GitHub API 数据获取示例
CREATE TABLE github_repos AS
SELECT * FROM (
    -- 模拟API调用获取数据
    SELECT
        json_extract(response, '$.id') AS repo_id,
        json_extract(response, '$.name') AS name,
        json_extract(response, '$.full_name') AS full_name,
        json_extract(response, '$.description') AS description,
        json_extract(response, '$.language') AS language,
        json_extract(response, '$.stargazers_count') AS stars,
        json_extract(response, '$.forks_count') AS forks,
        json_extract(response, '$.created_at') AS created_at
    FROM (
        -- 这里是API调用的地方，实际项目中需要外部工具
        VALUES ('{"id": 1, "name": "duckdb", "full_name": "duckdb/duckdb", "description": "DuckDB", "language": "C++", "stargazers_count": 5000, "forks_count": 800, "created_at": "2020-01-01"}')
    ) AS api_response(response)
);

-- 数据验证和清洗
CREATE TABLE clean_repos AS
SELECT
    repo_id,
    name,
    COALESCE(description, 'No description') AS description,
    COALESCE(language, 'Unknown') AS language,
    stars,
    forks,
    CAST(created_at AS DATE) AS created_date
FROM github_repos
WHERE repo_id IS NOT NULL
  AND stars >= 0;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：设计API集成架构</p>
            <p>为一个电商系统设计完整的API数据集成方案：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>设计数据源管理表结构</li>
              <li>实现增量同步机制</li>
              <li>构建数据质量监控体系</li>
              <li>设计错误处理和重试策略</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：实现GitHub数据分析</p>
            <p>构建一个GitHub仓库数据分析系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>从GitHub API获取仓库数据</li>
              <li>分析编程语言分布</li>
              <li>找出最受欢迎的仓库</li>
              <li>生成趋势分析报告</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 时序数据项目章节
// ============================================

export function TimeSeriesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">时间序列分析</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"洞察时间维度，预测未来趋势"</p>

      <Paragraph {...noteProps('p1')}>
        时间序列数据是按时间顺序排列的数据点集合。通过时间序列分析，我们可以发现趋势、季节性模式、周期性变化，并进行预测分析。这个项目将构建一个完整的时间序列分析系统。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据模型设计</h3>

      <CodeBlock
        title="时间序列数据表设计"
        code={`-- 时间序列基础表
CREATE TABLE time_series_data (
    id INTEGER PRIMARY KEY,
    metric_name VARCHAR NOT NULL,        -- 指标名称
    timestamp TIMESTAMP NOT NULL,        -- 时间戳
    value DECIMAL(10,4),                 -- 数值
    tags JSON,                          -- 标签（维度信息）
    quality_score INTEGER DEFAULT 100    -- 数据质量分数
);

-- 带分区的时间序列表（按月分区）
CREATE TABLE sensor_readings (
    sensor_id VARCHAR NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    pressure DECIMAL(7,2),
    location VARCHAR
) PARTITION BY (DATE_TRUNC('month', timestamp));

-- 创建索引以优化查询性能
CREATE INDEX idx_sensor_time ON sensor_readings(sensor_id, timestamp);
CREATE INDEX idx_metric_time ON time_series_data(metric_name, timestamp);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">时间序列聚合分析</h3>

      <CodeBlock
        title="时间窗口聚合"
        code={`-- 按不同时间粒度聚合
SELECT
    DATE_TRUNC('hour', timestamp) AS hour_bucket,
    COUNT(*) AS readings_count,
    AVG(temperature) AS avg_temp,
    MIN(temperature) AS min_temp,
    MAX(temperature) AS max_temp,
    STDDEV(temperature) AS temp_stddev
FROM sensor_readings
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour_bucket;

-- 滑动窗口分析
SELECT
    sensor_id,
    timestamp,
    temperature,
    -- 过去1小时的移动平均
    AVG(temperature) OVER (
        PARTITION BY sensor_id
        ORDER BY timestamp
        RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
    ) AS moving_avg_1h,
    -- 过去24小时的移动平均
    AVG(temperature) OVER (
        PARTITION BY sensor_id
        ORDER BY timestamp
        RANGE BETWEEN INTERVAL '24 hours' PRECEDING AND CURRENT ROW
    ) AS moving_avg_24h
FROM sensor_readings
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
ORDER BY sensor_id, timestamp;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">趋势分析</h3>

      <CodeBlock
        title="趋势识别和预测"
        code={`-- 线性趋势分析
CREATE FUNCTION linear_trend_analysis(data_points) AS (
    -- 简单的线性回归计算
    SELECT
        COUNT(*) AS n_points,
        SUM(x) AS sum_x,
        SUM(y) AS sum_y,
        SUM(x * x) AS sum_xx,
        SUM(x * y) AS sum_xy
    FROM (
        SELECT
            ROW_NUMBER() OVER (ORDER BY timestamp) AS x,
            value AS y
        FROM data_points
    )
);

-- 季节性分析
SELECT
    metric_name,
    EXTRACT(hour FROM timestamp) AS hour_of_day,
    EXTRACT(dow FROM timestamp) AS day_of_week,
    AVG(value) AS avg_value,
    COUNT(*) AS sample_count
FROM time_series_data
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY metric_name, EXTRACT(hour FROM timestamp), EXTRACT(dow FROM timestamp)
ORDER BY metric_name, day_of_week, hour_of_day;

-- 异常检测
WITH daily_stats AS (
    SELECT
        DATE(timestamp) AS date,
        AVG(value) AS daily_avg,
        STDDEV(value) AS daily_std
    FROM time_series_data
    WHERE metric_name = 'cpu_usage'
    GROUP BY DATE(timestamp)
),
anomaly_detection AS (
    SELECT
        d.date,
        d.daily_avg,
        s.daily_avg AS overall_avg,
        s.daily_std AS overall_std,
        ABS(d.daily_avg - s.daily_avg) / s.daily_std AS z_score
    FROM daily_stats d
    CROSS JOIN (
        SELECT AVG(daily_avg) AS daily_avg, AVG(daily_std) AS daily_std
        FROM daily_stats
    ) s
)
SELECT
    date,
    daily_avg,
    z_score,
    CASE
        WHEN z_score > 3 THEN '严重异常'
        WHEN z_score > 2 THEN '轻微异常'
        ELSE '正常'
    END AS anomaly_level
FROM anomaly_detection
ORDER BY z_score DESC;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：传感器数据监控系统</p>
            <p>构建一个物联网传感器数据分析平台：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>设计传感器数据存储结构</li>
              <li>实现实时数据聚合分析</li>
              <li>构建异常检测算法</li>
              <li>生成趋势预测报告</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：业务指标趋势分析</p>
            <p>为电商网站构建核心业务指标分析：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>分析用户活跃度趋势</li>
              <li>识别销售峰值时段</li>
              <li>预测库存需求</li>
              <li>监控转化率变化</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 机器学习预处理项目章节
// ============================================

export function MlPreprocessingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">机器学习数据预处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据炼金术，将原始数据转化为ML燃料"</p>

      <Paragraph {...noteProps('p1')}>
        机器学习模型的效果很大程度上取决于数据质量和特征工程。这个项目将构建一个完整的ML数据预处理流水线，从数据清洗到特征工程的全过程。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据探索与清洗</h3>

      <CodeBlock
        title="数据质量评估"
        code={`-- 数据概览
SELECT
    COUNT(*) AS total_records,
    COUNT(CASE WHEN target_column IS NULL THEN 1 END) AS null_targets,
    COUNT(DISTINCT user_id) AS unique_users,
    MIN(created_at) AS data_start_date,
    MAX(created_at) AS data_end_date
FROM raw_training_data;

-- 缺失值分析
SELECT
    column_name,
    COUNT(*) AS total_count,
    COUNT(CASE WHEN value IS NULL THEN 1 END) AS null_count,
    ROUND(100.0 * COUNT(CASE WHEN value IS NULL THEN 1 END) / COUNT(*), 2) AS null_percentage
FROM (
    -- 将宽表转换为长表进行分析
    SELECT 'feature1' AS column_name, feature1 AS value FROM training_data
    UNION ALL
    SELECT 'feature2' AS column_name, feature2 AS value FROM training_data
    UNION ALL
    SELECT 'target' AS column_name, target AS value FROM training_data
) AS melted_data
GROUP BY column_name
ORDER BY null_percentage DESC;

-- 异常值检测
SELECT
    feature_name,
    AVG(value) AS mean_value,
    STDDEV(value) AS std_dev,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    -- 使用IQR方法检测异常值
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY value) AS q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) AS q3
FROM (
    SELECT 'age' AS feature_name, age AS value FROM users WHERE age IS NOT NULL
    UNION ALL
    SELECT 'income' AS feature_name, income AS value FROM users WHERE income IS NOT NULL
) AS feature_data
GROUP BY feature_name;`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">特征工程</h3>

      <CodeBlock
        title="特征构造与变换"
        code={`-- 用户行为特征工程
CREATE TABLE user_features AS
SELECT
    user_id,
    -- 时间特征
    EXTRACT(hour FROM first_login) AS signup_hour,
    EXTRACT(dow FROM first_login) AS signup_day,
    DATE_PART('day', CURRENT_DATE - DATE(first_login)) AS account_age_days,

    -- 行为计数特征
    COALESCE(login_count_30d, 0) AS login_count_30d,
    COALESCE(purchase_count_30d, 0) AS purchase_count_30d,
    COALESCE(page_views_30d, 0) AS page_views_30d,

    -- 比率特征
    CASE
        WHEN login_count_30d > 0 THEN purchase_count_30d::FLOAT / login_count_30d
        ELSE 0.0
    END AS conversion_rate,

    -- 金额特征
    COALESCE(avg_order_value, 0) AS avg_order_value,
    COALESCE(total_spent, 0) AS total_spent,
    COALESCE(last_purchase_days, 999) AS recency_days,

    -- 类别特征编码
    CASE
        WHEN country IN ('US', 'CA', 'UK') THEN 'north_america_europe'
        WHEN country IN ('CN', 'JP', 'KR') THEN 'asia'
        ELSE 'other'
    END AS region_group,

    -- 是否为VIP用户
    CASE WHEN total_spent > 1000 THEN 1 ELSE 0 END AS is_vip,

    -- 目标变量
    CASE WHEN churned = true THEN 1 ELSE 0 END AS target
FROM user_profiles;

-- 数值特征标准化
CREATE TABLE normalized_features AS
SELECT
    user_id,
    -- Z-score标准化
    (login_count_30d - AVG(login_count_30d) OVER ()) /
    STDDEV(login_count_30d) OVER () AS login_count_zscore,

    -- Min-Max标准化
    (total_spent - MIN(total_spent) OVER ()) /
    (MAX(total_spent) OVER () - MIN(total_spent) OVER ()) AS spent_normalized,

    -- 对数变换（处理偏态分布）
    CASE
        WHEN page_views_30d > 0 THEN LN(page_views_30d)
        ELSE 0
    END AS page_views_log,

    target
FROM user_features;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">类别特征处理</h3>

      <CodeBlock
        title="独热编码和标签编码"
        code={`-- 频率编码（Frequency Encoding）
CREATE TABLE category_encoded AS
SELECT
    user_id,
    device_type,
    -- 计算每个类别的频率
    COUNT(*) OVER (PARTITION BY device_type) /
    COUNT(*) OVER () AS device_type_freq,

    country,
    -- 目标编码（Target Encoding）
    AVG(CASE WHEN target = 1 THEN 1 ELSE 0 END) OVER (PARTITION BY country) AS country_target_rate,

    target
FROM user_features;

-- 独热编码（One-Hot Encoding）
CREATE TABLE one_hot_encoded AS
SELECT
    user_id,
    -- 设备类型独热编码
    CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END AS device_mobile,
    CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END AS device_desktop,
    CASE WHEN device_type = 'tablet' THEN 1 ELSE 0 END AS device_tablet,

    -- 地区独热编码
    CASE WHEN region_group = 'north_america_europe' THEN 1 ELSE 0 END AS region_na_eu,
    CASE WHEN region_group = 'asia' THEN 1 ELSE 0 END AS region_asia,
    CASE WHEN region_group = 'other' THEN 1 ELSE 0 END AS region_other,

    target
FROM user_features;

-- 标签编码（Label Encoding）
CREATE TABLE label_encoded AS
SELECT
    user_id,
    CASE device_type
        WHEN 'mobile' THEN 1
        WHEN 'desktop' THEN 2
        WHEN 'tablet' THEN 3
        ELSE 0
    END AS device_type_encoded,
    CASE country
        WHEN 'US' THEN 1 WHEN 'UK' THEN 2 WHEN 'CN' THEN 3
        WHEN 'JP' THEN 4 WHEN 'CA' THEN 5
        ELSE 0
    END AS country_encoded,
    target
FROM user_features;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：用户流失预测数据准备</p>
            <p>为一个电商网站的客户流失预测模型准备数据：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>分析原始数据的质量问题</li>
              <li>构造用户行为特征（RFM模型）</li>
              <li>处理类别变量编码</li>
              <li>生成最终的训练数据集</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：欺诈检测特征工程</p>
            <p>构建金融交易欺诈检测的特征工程系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>时间序列特征构造</li>
              <li>地理位置风险评估</li>
              <li>交易模式异常检测</li>
              <li>构建监督学习标签</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 实时仪表板项目章节
// ============================================

export function RealtimeDashboardSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">实时仪表盘</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据可视化的实时窗口"</p>

      <Paragraph {...noteProps('p1')}>
        实时仪表盘是现代数据分析的重要工具，能够实时展示业务指标的变化。这个项目将构建一个完整的实时数据可视化系统，从数据采集到前端展示的全流程。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据流设计</h3>

      <CodeBlock
        title="实时数据表结构"
        code={`-- 实时指标表
CREATE TABLE realtime_metrics (
    metric_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    unit VARCHAR,  -- 单位：个、元、%、ms等
    update_interval_seconds INTEGER DEFAULT 60,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 实时数据存储（使用物化视图）
CREATE MATERIALIZED VIEW current_metrics AS
SELECT
    metric_id,
    value,
    timestamp,
    quality_score,
    ROW_NUMBER() OVER (PARTITION BY metric_id ORDER BY timestamp DESC) AS rn
FROM raw_metrics
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 hour';

-- 只保留最新的数据
CREATE VIEW latest_metrics AS
SELECT
    metric_id,
    value,
    timestamp,
    quality_score
FROM current_metrics
WHERE rn = 1;

-- 历史数据表（按小时分区）
CREATE TABLE metrics_history (
    metric_id VARCHAR NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    value DECIMAL(15,4),
    quality_score INTEGER DEFAULT 100
) PARTITION BY (DATE_TRUNC('hour', timestamp));

-- 聚合视图（不同时间粒度）
CREATE VIEW metrics_hourly AS
SELECT
    metric_id,
    DATE_TRUNC('hour', timestamp) AS hour,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    COUNT(*) AS sample_count
FROM metrics_history
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY metric_id, DATE_TRUNC('hour', timestamp);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实时聚合计算</h3>

      <CodeBlock
        title="实时数据处理"
        code={`-- 实时聚合函数
CREATE FUNCTION update_realtime_aggregates() AS (
    -- 更新最近1分钟的聚合数据
    INSERT OR REPLACE INTO realtime_aggregates
    SELECT
        metric_id,
        COUNT(*) AS count_1min,
        AVG(value) AS avg_1min,
        MIN(value) AS min_1min,
        MAX(value) AS max_1min,
        STDDEV(value) AS stddev_1min,
        APPROXIMATE_PERCENTILE(value, 0.95) AS p95_1min,
        CURRENT_TIMESTAMP AS updated_at
    FROM raw_metrics
    WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '1 minute'
    GROUP BY metric_id
);

-- 滑动窗口分析
CREATE VIEW sliding_windows AS
SELECT
    metric_id,
    timestamp,
    value,
    -- 5分钟移动平均
    AVG(value) OVER (
        PARTITION BY metric_id
        ORDER BY timestamp
        RANGE BETWEEN INTERVAL '5 minutes' PRECEDING AND CURRENT ROW
    ) AS ma_5min,
    -- 1小时移动平均
    AVG(value) OVER (
        PARTITION BY metric_id
        ORDER BY timestamp
        RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
    ) AS ma_1hour,
    -- 相比1小时前的变化率
    (value - LAG(value, 1) OVER (
        PARTITION BY metric_id ORDER BY timestamp
    )) / LAG(value, 1) OVER (
        PARTITION BY metric_id ORDER BY timestamp
    ) * 100 AS pct_change_1hour
FROM raw_metrics
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY metric_id, timestamp;`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">异常检测与告警</h3>

      <CodeBlock
        title="实时监控和告警"
        code={`-- 动态阈值计算
CREATE VIEW dynamic_thresholds AS
SELECT
    metric_id,
    AVG(value) AS baseline_avg,
    STDDEV(value) AS baseline_std,
    APPROXIMATE_PERCENTILE(value, 0.95) AS baseline_p95,
    APPROXIMATE_PERCENTILE(value, 0.99) AS baseline_p99
FROM metrics_history
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY metric_id;

-- 实时异常检测
CREATE VIEW anomaly_detection AS
SELECT
    m.metric_id,
    m.timestamp,
    m.value,
    t.baseline_avg,
    t.baseline_std,
    -- Z-score异常检测
    CASE
        WHEN t.baseline_std > 0 THEN
            ABS(m.value - t.baseline_avg) / t.baseline_std
        ELSE 0
    END AS z_score,
    -- 百分位数异常检测
    CASE
        WHEN m.value > t.baseline_p99 THEN 'P99异常'
        WHEN m.value > t.baseline_p95 THEN 'P95异常'
        WHEN ABS(m.value - t.baseline_avg) > 3 * t.baseline_std THEN 'Z-Score异常'
        ELSE '正常'
    END AS anomaly_status
FROM latest_metrics m
JOIN dynamic_thresholds t ON m.metric_id = t.metric_id;

-- 告警规则表
CREATE TABLE alert_rules (
    rule_id INTEGER PRIMARY KEY,
    metric_id VARCHAR NOT NULL,
    rule_name VARCHAR NOT NULL,
    condition_type VARCHAR, -- 'threshold', 'percentage_change', 'anomaly'
    threshold_value DECIMAL,
    comparison_operator VARCHAR, -- '>', '<', '>=', '<='
    alert_message VARCHAR,
    enabled BOOLEAN DEFAULT TRUE
);

-- 触发告警
CREATE VIEW active_alerts AS
SELECT
    r.rule_id,
    r.metric_id,
    r.rule_name,
    m.value AS current_value,
    r.threshold_value,
    r.alert_message,
    CURRENT_TIMESTAMP AS alert_time
FROM alert_rules r
JOIN latest_metrics m ON r.metric_id = m.metric_id
WHERE r.enabled = TRUE
  AND (
      (r.condition_type = 'threshold' AND
       CASE r.comparison_operator
           WHEN '>' THEN m.value > r.threshold_value
           WHEN '<' THEN m.value < r.threshold_value
           WHEN '>=' THEN m.value >= r.threshold_value
           WHEN '<=' THEN m.value <= r.threshold_value
       END)
      OR
      (r.condition_type = 'anomaly' AND
       (SELECT anomaly_status FROM anomaly_detection
        WHERE metric_id = r.metric_id) != '正常')
  );`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：电商实时监控面板</p>
            <p>构建电商网站的实时业务指标监控系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实时订单数量和金额统计</li>
              <li>用户在线状态监控</li>
              <li>商品库存预警系统</li>
              <li>转化率实时跟踪</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：服务器性能监控</p>
            <p>实现服务器集群的实时性能监控：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>CPU、内存、磁盘使用率监控</li>
              <li>响应时间和错误率统计</li>
              <li>自动扩缩容触发器</li>
              <li>性能异常自动告警</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 日志分析项目章节
// ============================================

export function LogAnalysisSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">日志分析系统</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从海量日志中挖掘系统洞察"</p>

      <Paragraph {...noteProps('p1')}>
        日志分析是现代系统运维和监控的核心。通过分析应用程序、服务和基础设施产生的日志，我们可以发现性能问题、异常行为、安全威胁，并为系统优化提供数据支持。这个项目将构建一个完整的日志收集、存储、分析和可视化系统。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• 多源日志收集和聚合</li>
            <li>• 实时日志解析和结构化</li>
            <li>• 全文搜索和过滤</li>
            <li>• 异常检测和告警</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• DuckDB作为日志仓库</li>
            <li>• 正则表达式日志解析</li>
            <li>• 时间序列分析</li>
            <li>• 全文索引和搜索</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">系统架构</h3>

      <CodeBlock
        title="日志数据模型设计"
        code={`-- 日志源配置表
CREATE TABLE log_sources (
    source_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,  -- 'file', 'syslog', 'api', 'database'
    path VARCHAR,           -- 文件路径或连接字符串
    format VARCHAR,         -- 'json', 'text', 'csv', 'xml'
    pattern VARCHAR,        -- 日志格式正则表达式
    timezone VARCHAR DEFAULT 'UTC',
    active BOOLEAN DEFAULT TRUE
);

-- 原始日志存储表
CREATE TABLE raw_logs (
    log_id INTEGER PRIMARY KEY,
    source_id INTEGER REFERENCES log_sources(source_id),
    raw_content TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_offset BIGINT,     -- 文件读取偏移量
    line_number INTEGER     -- 文件行号
);

-- 解析后的结构化日志
CREATE TABLE parsed_logs (
    log_id INTEGER PRIMARY KEY,
    source_id INTEGER REFERENCES log_sources(source_id),
    timestamp TIMESTAMP,
    level VARCHAR,           -- ERROR, WARN, INFO, DEBUG
    logger VARCHAR,          -- 日志记录器名称
    message TEXT,            -- 日志消息
    thread VARCHAR,          -- 线程信息
    exception TEXT,          -- 异常堆栈
    metadata JSON,           -- 额外字段
    parsed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日志标签和分类
CREATE TABLE log_tags (
    tag_id INTEGER PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    color VARCHAR,           -- 标签颜色
    description VARCHAR
);

CREATE TABLE log_entry_tags (
    log_id INTEGER REFERENCES parsed_logs(log_id),
    tag_id INTEGER REFERENCES log_tags(tag_id),
    confidence DECIMAL(3,2),  -- 标签置信度
    PRIMARY KEY (log_id, tag_id)
);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">日志解析和处理</h3>

      <CodeBlock
        title="日志解析和结构化"
        code={`-- 正则表达式日志解析
CREATE FUNCTION parse_log_line(log_content TEXT, pattern TEXT) AS (
    -- 使用正则表达式提取日志字段
    SELECT
        CASE
            WHEN regexp_match(log_content, pattern) IS NOT NULL THEN
                json_extract(
                    regexp_match(log_content, pattern)[1],
                    '$.timestamp'
                )
            ELSE NULL
        END AS timestamp,
        CASE
            WHEN regexp_match(log_content, pattern) IS NOT NULL THEN
                regexp_match(log_content, pattern)[2]
            ELSE NULL
        END AS level,
        CASE
            WHEN regexp_match(log_content, pattern) IS NOT NULL THEN
                regexp_match(log_content, pattern)[3]
            ELSE NULL
        END AS logger,
        CASE
            WHEN regexp_match(log_content, pattern) IS NOT NULL THEN
                regexp_match(log_content, pattern)[4]
            ELSE NULL
        END AS message
);

-- 批量解析日志
INSERT INTO parsed_logs (source_id, timestamp, level, logger, message)
SELECT
    r.source_id,
    parse_log_line(r.raw_content, s.pattern)->>'timestamp' AS timestamp,
    parse_log_line(r.raw_content, s.pattern)->>'level' AS level,
    parse_log_line(r.raw_content, s.pattern)->>'logger' AS logger,
    parse_log_line(r.raw_content, s.pattern)->>'message' AS message
FROM raw_logs r
JOIN log_sources s ON r.source_id = s.source_id
WHERE r.log_id > (SELECT COALESCE(MAX(log_id), 0) FROM parsed_logs);

-- 异常日志检测
CREATE TABLE error_patterns (
    pattern_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    regex_pattern VARCHAR NOT NULL,
    severity VARCHAR DEFAULT 'ERROR',  -- ERROR, WARN, INFO
    description VARCHAR
);

-- 识别异常日志
CREATE VIEW error_logs AS
SELECT
    p.*,
    ep.name AS error_type,
    ep.severity
FROM parsed_logs p
JOIN error_patterns ep ON regexp_match(p.message, ep.regex_pattern) IS NOT NULL
WHERE p.level IN ('ERROR', 'FATAL', 'CRITICAL');`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">日志分析和洞察</h3>

      <CodeBlock
        title="日志统计分析"
        code={`-- 错误趋势分析
CREATE VIEW error_trends AS
SELECT
    DATE(timestamp) AS date,
    level,
    COUNT(*) AS error_count,
    COUNT(DISTINCT logger) AS affected_components,
    -- 错误率计算
    ROUND(
        COUNT(*) * 100.0 /
        (SELECT COUNT(*) FROM parsed_logs
         WHERE DATE(timestamp) = DATE(p.timestamp)),
        2
    ) AS error_rate_percent
FROM parsed_logs p
WHERE level IN ('ERROR', 'FATAL', 'CRITICAL')
  AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp), level
ORDER BY date, level;

-- 性能监控日志分析
CREATE VIEW performance_metrics AS
SELECT
    DATE(timestamp) AS date,
    logger,
    -- 响应时间统计
    AVG(CASE
        WHEN message LIKE '%response_time=%'
        THEN CAST(regexp_extract(message, 'response_time=([0-9.]+)') AS DECIMAL)
        ELSE NULL
    END) AS avg_response_time,
    -- 内存使用统计
    AVG(CASE
        WHEN message LIKE '%memory_usage=%'
        THEN CAST(regexp_extract(message, 'memory_usage=([0-9.]+)') AS DECIMAL)
        ELSE NULL
    END) AS avg_memory_usage,
    COUNT(*) AS log_entries
FROM parsed_logs
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
  AND logger LIKE '%performance%'
GROUP BY DATE(timestamp), logger;

-- 用户行为分析
CREATE VIEW user_activity_logs AS
SELECT
    DATE(timestamp) AS date,
    -- 从日志中提取用户ID
    regexp_extract(message, 'user_id=([0-9a-f-]+)') AS user_id,
    -- 提取操作类型
    CASE
        WHEN message LIKE '%login%' THEN 'login'
        WHEN message LIKE '%logout%' THEN 'logout'
        WHEN message LIKE '%purchase%' THEN 'purchase'
        WHEN message LIKE '%search%' THEN 'search'
        ELSE 'other'
    END AS action_type,
    COUNT(*) AS action_count
FROM parsed_logs
WHERE message LIKE '%user_id=%'
  AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp),
         regexp_extract(message, 'user_id=([0-9a-f-]+)'),
         CASE
             WHEN message LIKE '%login%' THEN 'login'
             WHEN message LIKE '%logout%' THEN 'logout'
             WHEN message LIKE '%purchase%' THEN 'purchase'
             WHEN message LIKE '%search%' THEN 'search'
             ELSE 'other'
         END;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：Web服务器日志分析</p>
            <p>构建一个Web服务器访问日志分析系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>解析Apache/Nginx访问日志格式</li>
              <li>分析访问量趋势和热门页面</li>
              <li>检测异常访问模式和潜在攻击</li>
              <li>生成网站流量报告</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：应用错误监控系统</p>
            <p>为分布式应用构建错误日志监控：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>聚合多服务错误日志</li>
              <li>实现错误分类和优先级排序</li>
              <li>设置错误告警阈值</li>
              <li>生成错误趋势分析报告</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
export function RecommendationSystemSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">推荐系统</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"个性化内容发现引擎"</p>

      <Paragraph {...noteProps('p1')}>
        推荐系统是现代电商、内容平台和社交应用的核心功能。通过分析用户行为和偏好，推荐系统能够向用户展示他们可能感兴趣的内容或产品。这个项目将构建一个完整的推荐系统，包括多种推荐算法、实时推荐和效果评估。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• 协同过滤推荐算法</li>
            <li>• 内容基于推荐</li>
            <li>• 实时推荐更新</li>
            <li>• A/B测试框架</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• DuckDB用于用户行为存储</li>
            <li>• 矩阵分解和相似度计算</li>
            <li>• 实时特征工程</li>
            <li>• 推荐效果评估指标</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据模型设计</h3>

      <CodeBlock
        title="推荐系统数据架构"
        code={`-- 用户表
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    preferences JSON  -- 用户偏好设置
);

-- 商品/内容表
CREATE TABLE items (
    item_id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR,
    tags JSON,  -- 标签数组
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON  -- 额外属性
);

-- 用户行为记录
CREATE TABLE user_interactions (
    interaction_id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    item_id INTEGER REFERENCES items(item_id),
    interaction_type VARCHAR NOT NULL,  -- 'view', 'like', 'purchase', 'cart', 'share'
    rating DECIMAL(3,1),  -- 显式评分 (1-5)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR,  -- 用户会话ID
    context JSON  -- 交互上下文信息
);

-- 用户-商品评分矩阵（物化视图）
CREATE MATERIALIZED VIEW user_item_ratings AS
SELECT
    user_id,
    item_id,
    -- 计算综合评分
    CASE
        WHEN MAX(rating) IS NOT NULL THEN MAX(rating)  -- 显式评分优先
        ELSE
            -- 隐式评分计算
            CASE
                WHEN COUNT(*) FILTER (WHERE interaction_type = 'purchase') > 0 THEN 5.0
                WHEN COUNT(*) FILTER (WHERE interaction_type = 'like') > 0 THEN 4.0
                WHEN COUNT(*) FILTER (WHERE interaction_type = 'cart') > 0 THEN 3.0
                WHEN COUNT(*) FILTER (WHERE interaction_type = 'view') > 2 THEN 2.0
                WHEN COUNT(*) FILTER (WHERE interaction_type = 'view') > 0 THEN 1.0
                ELSE 0.0
            END
    END AS rating,
    COUNT(*) AS interaction_count,
    MAX(timestamp) AS last_interaction
FROM user_interactions
GROUP BY user_id, item_id;

-- 商品相似度矩阵
CREATE TABLE item_similarity (
    item_id_1 INTEGER REFERENCES items(item_id),
    item_id_2 INTEGER REFERENCES items(item_id),
    similarity_score DECIMAL(5,4),  -- 相似度分数 (0-1)
    similarity_type VARCHAR,  -- 'content', 'collaborative', 'hybrid'
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (item_id_1, item_id_2, similarity_type)
);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">协同过滤算法</h3>

      <CodeBlock
        title="基于用户的协同过滤"
        code={`-- 计算用户相似度
CREATE FUNCTION calculate_user_similarity(target_user_id INTEGER) AS (
    -- 获取目标用户的评分向量
    WITH target_ratings AS (
        SELECT item_id, rating
        FROM user_item_ratings
        WHERE user_id = target_user_id
    ),
    -- 计算与其他用户的相似度（皮尔逊相关系数）
    user_similarities AS (
        SELECT
            uir.user_id,
            -- 皮尔逊相关系数计算
            CASE
                WHEN COUNT(*) > 5 THEN  -- 至少5个共同评分项目
                    (SUM((uir.rating - user_avg.avg_rating) * (tr.rating - user_avg.avg_rating)) /
                     (SQRT(SUM(POWER(uir.rating - user_avg.avg_rating, 2))) *
                      SQRT(SUM(POWER(tr.rating - user_avg.avg_rating, 2)))))
                ELSE 0
            END AS pearson_similarity
        FROM user_item_ratings uir
        JOIN target_ratings tr ON uir.item_id = tr.item_id
        CROSS JOIN (
            SELECT AVG(rating) AS avg_rating
            FROM user_item_ratings
            WHERE user_id = uir.user_id
        ) user_avg
        WHERE uir.user_id != target_user_id
        GROUP BY uir.user_id
        ORDER BY pearson_similarity DESC
        LIMIT 50  -- 取最相似的50个用户
    )
    SELECT * FROM user_similarities
);

-- 生成基于用户的推荐
CREATE FUNCTION user_based_recommendations(target_user_id INTEGER, top_k INTEGER DEFAULT 10) AS (
    WITH similar_users AS (
        SELECT * FROM calculate_user_similarity(target_user_id)
        WHERE pearson_similarity > 0.3  -- 相似度阈值
    ),
    -- 获取相似用户喜欢的商品
    candidate_items AS (
        SELECT
            uir.item_id,
            SUM(su.pearson_similarity * uir.rating) / SUM(su.pearson_similarity) AS weighted_rating,
            COUNT(*) AS user_count
        FROM similar_users su
        JOIN user_item_ratings uir ON su.user_id = uir.user_id
        WHERE uir.item_id NOT IN (
            SELECT item_id FROM user_item_ratings
            WHERE user_id = target_user_id
        )
        GROUP BY uir.item_id
        ORDER BY weighted_rating DESC, user_count DESC
        LIMIT top_k
    )
    SELECT
        ci.item_id,
        i.title,
        ci.weighted_rating AS predicted_rating,
        ci.user_count
    FROM candidate_items ci
    JOIN items i ON ci.item_id = i.item_id
);

-- 基于物品的协同过滤
CREATE FUNCTION item_based_recommendations(target_user_id INTEGER, top_k INTEGER DEFAULT 10) AS (
    -- 获取用户最近喜欢的商品
    WITH user_liked_items AS (
        SELECT item_id, rating
        FROM user_item_ratings
        WHERE user_id = target_user_id
          AND rating >= 4.0  -- 只考虑高评分商品
        ORDER BY rating DESC, last_interaction DESC
        LIMIT 10
    ),
    -- 找到相似商品
    similar_items AS (
        SELECT
            isi.item_id_2 AS similar_item_id,
            SUM(uli.rating * isi.similarity_score) / SUM(uli.rating) AS weighted_similarity
        FROM user_liked_items uli
        JOIN item_similarity isi ON uli.item_id = isi.item_id_1
        WHERE isi.similarity_type = 'collaborative'
          AND isi.similarity_score > 0.6  -- 高相似度阈值
          AND isi.item_id_2 NOT IN (SELECT item_id FROM user_liked_items)
        GROUP BY isi.item_id_2
        ORDER BY weighted_similarity DESC
        LIMIT top_k
    )
    SELECT
        si.similar_item_id AS item_id,
        i.title,
        si.weighted_similarity AS similarity_score
    FROM similar_items si
    JOIN items i ON si.similar_item_id = i.item_id
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">内容基于推荐和混合方法</h3>

      <CodeBlock
        title="内容特征工程和推荐"
        code={`-- 内容相似度计算
CREATE FUNCTION calculate_content_similarity() AS (
    -- 基于标签的Jaccard相似度
    INSERT INTO item_similarity (item_id_1, item_id_2, similarity_score, similarity_type)
    SELECT
        i1.item_id AS item_id_1,
        i2.item_id AS item_id_2,
        -- Jaccard相似度
        CASE
            WHEN (array_length(i1_tags) + array_length(i2_tags)) > 0 THEN
                CAST(array_intersection(i1_tags, i2_tags) AS DECIMAL) /
                CAST(array_union(i1_tags, i2_tags) AS DECIMAL)
            ELSE 0
        END AS similarity_score,
        'content' AS similarity_type
    FROM (
        SELECT item_id, json_extract(tags, '$') AS tags_array,
               array_length(json_extract(tags, '$')) AS tag_count
        FROM items
        WHERE tags IS NOT NULL
    ) i1
    CROSS JOIN (
        SELECT item_id, json_extract(tags, '$') AS tags_array,
               array_length(json_extract(tags, '$')) AS tag_count
        FROM items
        WHERE tags IS NOT NULL
    ) i2
    WHERE i1.item_id < i2.item_id  -- 避免重复计算
      AND array_intersection(i1.tags_array, i2.tags_array) > 0;  -- 至少有一个共同标签
);

-- 混合推荐算法
CREATE FUNCTION hybrid_recommendations(target_user_id INTEGER, top_k INTEGER DEFAULT 10) AS (
    WITH collaborative_scores AS (
        SELECT item_id, predicted_rating AS cf_score, 1 AS cf_weight
        FROM user_based_recommendations(target_user_id, 50)
    ),
    content_scores AS (
        -- 基于用户历史行为的內容推荐
        SELECT
            isi.item_id_2 AS item_id,
            AVG(uir.rating * isi.similarity_score) AS cb_score,
            0.7 AS cb_weight  -- 内容推荐权重略低
        FROM user_item_ratings uir
        JOIN item_similarity isi ON uir.item_id = isi.item_id_1
        WHERE uir.user_id = target_user_id
          AND isi.similarity_type = 'content'
          AND isi.similarity_score > 0.3
        GROUP BY isi.item_id_2
    ),
    -- 合并两种推荐分数
    combined_scores AS (
        SELECT
            COALESCE(cf.item_id, cb.item_id) AS item_id,
            COALESCE(cf.cf_score, 0) * COALESCE(cf.cf_weight, 0) +
            COALESCE(cb.cb_score, 0) * COALESCE(cb.cb_weight, 0) AS final_score,
            CASE WHEN cf.item_id IS NOT NULL THEN 1 ELSE 0 END AS has_cf,
            CASE WHEN cb.item_id IS NOT NULL THEN 1 ELSE 0 END AS has_cb
        FROM collaborative_scores cf
        FULL OUTER JOIN content_scores cb ON cf.item_id = cb.item_id
    )
    SELECT
        cs.item_id,
        i.title,
        i.category,
        cs.final_score,
        cs.has_cf,
        cs.has_cb
    FROM combined_scores cs
    JOIN items i ON cs.item_id = i.item_id
    WHERE cs.item_id NOT IN (
        SELECT item_id FROM user_item_ratings
        WHERE user_id = target_user_id
    )
    ORDER BY cs.final_score DESC
    LIMIT top_k
);

-- 推荐效果评估
CREATE TABLE recommendation_metrics (
    experiment_id INTEGER PRIMARY KEY,
    algorithm VARCHAR NOT NULL,  -- 'user_cf', 'item_cf', 'content', 'hybrid'
    user_id INTEGER,
    recommended_items JSON,  -- 推荐的商品列表
    clicked_items JSON,      -- 用户点击的商品
    purchased_items JSON,    -- 用户购买的商品
    precision_at_k DECIMAL(4,3),  -- Precision@K
    recall_at_k DECIMAL(4,3),     -- Recall@K
    ndcg_score DECIMAL(4,3),      -- NDCG分数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 计算推荐指标
CREATE FUNCTION calculate_recommendation_metrics(
    recommended_items JSON,
    relevant_items JSON,
    k INTEGER DEFAULT 10
) AS (
    SELECT
        -- Precision@K
        CASE
            WHEN json_array_length(recommended_items) >= k THEN
                CAST(json_array_length(json_intersection(
                    json_extract(recommended_items, '$[0:' || k || ']'),
                    relevant_items
                )) AS DECIMAL) / k
            ELSE 0
        END AS precision_at_k,
        -- Recall@K
        CASE
            WHEN json_array_length(relevant_items) > 0 THEN
                CAST(json_array_length(json_intersection(
                    json_extract(recommended_items, '$[0:' || k || ']'),
                    relevant_items
                )) AS DECIMAL) / json_array_length(relevant_items)
            ELSE 0
        END AS recall_at_k
);`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：电商商品推荐系统</p>
            <p>为电商平台构建商品推荐功能：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实现基于用户的协同过滤算法</li>
              <li>构建商品内容相似度矩阵</li>
              <li>设计A/B测试框架评估推荐效果</li>
              <li>实现实时推荐更新机制</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：视频内容推荐平台</p>
            <p>构建个性化视频推荐系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>分析用户观看行为模式</li>
              <li>实现内容标签和元数据处理</li>
              <li>构建混合推荐算法</li>
              <li>设计推荐多样性和新颖性</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
export function GraphAnalysisSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">图分析与网络科学</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"连接数据的力量，发现隐藏的关系"</p>

      <Paragraph {...noteProps('p1')}>
        图分析是处理复杂关系数据的强大工具。通过将数据建模为节点和边的图结构，我们可以发现隐藏的连接模式、社区结构和关键节点。这个项目将构建一个完整的图分析系统，包括图数据库设计、图算法实现和实际应用案例。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• 图数据建模和存储</li>
            <li>• 图遍历和路径分析</li>
            <li>• 社区检测算法</li>
            <li>• 中心性分析</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• 图数据库设计</li>
            <li>• 图算法实现</li>
            <li>• 网络度量计算</li>
            <li>• 可视化分析</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">图数据模型设计</h3>

      <CodeBlock
        title="图数据库架构"
        code={`-- 节点表（实体）
CREATE TABLE nodes (
    node_id INTEGER PRIMARY KEY,
    node_type VARCHAR NOT NULL,  -- 'user', 'product', 'company', 'topic'
    label VARCHAR NOT NULL,      -- 显示名称
    properties JSON,             -- 节点属性
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 边表（关系）
CREATE TABLE edges (
    edge_id INTEGER PRIMARY KEY,
    source_id INTEGER REFERENCES nodes(node_id),
    target_id INTEGER REFERENCES nodes(node_id),
    edge_type VARCHAR NOT NULL,  -- 'follows', 'likes', 'purchases', 'belongs_to'
    weight DECIMAL(5,2) DEFAULT 1.0,  -- 关系强度
    properties JSON,             -- 边属性
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    directed BOOLEAN DEFAULT TRUE  -- 是否有向边
);

-- 图模式定义
CREATE TABLE graph_schemas (
    schema_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    node_types JSON,  -- 允许的节点类型
    edge_types JSON,  -- 允许的边类型
    constraints JSON, -- 图约束规则
    version INTEGER DEFAULT 1
);

-- 索引优化
CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
CREATE INDEX idx_edges_type ON edges(edge_type);
CREATE INDEX idx_nodes_type ON nodes(node_type);

-- 社交网络示例数据
INSERT INTO nodes (node_type, label, properties) VALUES
('user', 'Alice', '{"age": 25, "location": "New York"}'),
('user', 'Bob', '{"age": 30, "location": "San Francisco"}'),
('user', 'Charlie', '{"age": 28, "location": "Boston"}'),
('company', 'TechCorp', '{"industry": "technology", "employees": 500}'),
('product', 'SmartPhone X', '{"category": "electronics", "price": 999}');

INSERT INTO edges (source_id, target_id, edge_type, properties) VALUES
(1, 2, 'follows', '{"since": "2023-01-15"}'),    -- Alice follows Bob
(2, 3, 'follows', '{"since": "2023-02-20"}'),    -- Bob follows Charlie
(1, 3, 'friend', '{"strength": 0.8}'),          -- Alice and Charlie are friends
(2, 5, 'purchases', '{"date": "2023-03-10", "quantity": 1}'), -- Bob purchased SmartPhone X
(3, 4, 'works_at', '{"position": "engineer", "since": "2022-06-01"}'); -- Charlie works at TechCorp`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">图遍历算法</h3>

      <CodeBlock
        title="图搜索和路径分析"
        code={`-- 广度优先搜索 (BFS)
CREATE FUNCTION bfs_shortest_path(start_node INTEGER, end_node INTEGER) AS (
    WITH RECURSIVE bfs AS (
        -- 起始节点
        SELECT
            source_id AS current_node,
            target_id AS next_node,
            0 AS depth,
            ARRAY[source_id] AS path,
            ARRAY[source_id || '->' || target_id] AS edge_path
        FROM edges
        WHERE source_id = start_node

        UNION ALL

        -- 递归扩展路径
        SELECT
            b.next_node AS current_node,
            e.target_id AS next_node,
            b.depth + 1 AS depth,
            b.path || e.target_id AS path,
            b.edge_path || (e.source_id || '->' || e.target_id) AS edge_path
        FROM bfs b
        JOIN edges e ON b.next_node = e.source_id
        WHERE b.next_node != end_node
          AND e.target_id NOT IN (SELECT unnest(b.path))  -- 避免环路
          AND b.depth < 10  -- 限制搜索深度
    )
    SELECT
        path,
        edge_path,
        depth
    FROM bfs
    WHERE next_node = end_node
    ORDER BY depth
    LIMIT 1  -- 返回最短路径
);

-- 深度优先搜索 (DFS)
CREATE FUNCTION dfs_paths(start_node INTEGER, max_depth INTEGER DEFAULT 5) AS (
    WITH RECURSIVE dfs AS (
        SELECT
            start_node AS current_node,
            0 AS depth,
            ARRAY[start_node] AS path,
            ARRAY[]::INTEGER[] AS visited
        UNION ALL
        SELECT
            e.target_id AS current_node,
            d.depth + 1 AS depth,
            d.path || e.target_id AS path,
            d.visited || e.source_id AS visited
        FROM dfs d
        JOIN edges e ON d.current_node = e.source_id
        WHERE d.depth < max_depth
          AND e.target_id NOT IN (SELECT unnest(d.visited))
    )
    SELECT DISTINCT
        path,
        depth
    FROM dfs
    WHERE depth > 0
    ORDER BY depth, path
);

-- PageRank算法实现
CREATE FUNCTION calculate_pagerank(iterations INTEGER DEFAULT 10, damping_factor DECIMAL DEFAULT 0.85) AS (
    -- 初始化PageRank值
    CREATE TEMP TABLE pagerank_temp AS
    SELECT
        node_id,
        1.0 / (SELECT COUNT(*) FROM nodes) AS pagerank,
        0 AS iteration
    FROM nodes;

    -- 迭代计算PageRank
    FOR i IN 1..iterations LOOP
        INSERT INTO pagerank_temp
        SELECT
            n.node_id,
            (1 - damping_factor) / (SELECT COUNT(*) FROM nodes) +
            damping_factor * COALESCE(SUM(pr.pagerank / out_degree.out_count), 0),
            i AS iteration
        FROM nodes n
        LEFT JOIN (
            SELECT source_id, COUNT(*) AS out_count
            FROM edges
            GROUP BY source_id
        ) out_degree ON n.node_id = out_degree.source_id
        LEFT JOIN pagerank_temp pr ON pr.node_id IN (
            SELECT target_id FROM edges WHERE source_id = n.node_id
        ) AND pr.iteration = i - 1
        GROUP BY n.node_id;
    END LOOP;

    -- 返回最终结果
    SELECT
        node_id,
        pagerank,
        iteration
    FROM pagerank_temp
    WHERE iteration = iterations
    ORDER BY pagerank DESC;
);

-- 最短路径查询（使用Dijkstra算法思想）
CREATE FUNCTION dijkstra_shortest_path(start_node INTEGER, end_node INTEGER) AS (
    WITH RECURSIVE dijkstra AS (
        SELECT
            start_node AS node_id,
            0 AS distance,
            ARRAY[start_node] AS path,
            ARRAY[]::INTEGER[] AS visited
        UNION ALL
        SELECT
            e.target_id AS node_id,
            d.distance + (1.0 / e.weight) AS distance,  -- 权重倒数作为距离
            d.path || e.target_id AS path,
            d.visited || e.source_id AS visited
        FROM dijkstra d
        JOIN edges e ON d.node_id = e.source_id
        WHERE e.target_id NOT IN (SELECT unnest(d.visited))
          AND d.node_id != end_node
    )
    SELECT
        path,
        distance
    FROM dijkstra
    WHERE node_id = end_node
    ORDER BY distance
    LIMIT 1;
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">网络分析和社区检测</h3>

      <CodeBlock
        title="图论度量和社区发现"
        code={`-- 网络基本度量计算
CREATE VIEW network_metrics AS
SELECT
    'nodes_count' AS metric,
    COUNT(*)::VARCHAR AS value
FROM nodes
UNION ALL
SELECT
    'edges_count' AS metric,
    COUNT(*)::VARCHAR AS value
FROM edges
UNION ALL
SELECT
    'average_degree' AS metric,
    ROUND(AVG(degree), 2)::VARCHAR AS value
FROM (
    SELECT COUNT(*) AS degree
    FROM edges
    GROUP BY source_id
) degrees;

-- 节点中心性计算
CREATE VIEW node_centrality AS
SELECT
    n.node_id,
    n.label,
    n.node_type,
    -- 度中心性 (Degree Centrality)
    COALESCE(deg.degree, 0) AS degree_centrality,
    -- 介数中心性 (Betweenness Centrality) - 简化版
    COALESCE(bc.betweenness, 0) AS betweenness_centrality,
    -- 接近中心性 (Closeness Centrality) - 简化版
    CASE
        WHEN COALESCE(close.total_distance, 0) > 0 THEN
            1.0 / COALESCE(close.avg_distance, 1)
        ELSE 0
    END AS closeness_centrality
FROM nodes n
LEFT JOIN (
    SELECT source_id AS node_id, COUNT(*) AS degree
    FROM edges
    GROUP BY source_id
) deg ON n.node_id = deg.node_id
LEFT JOIN (
    -- 简化的介数中心性：计算节点在最短路径中的出现次数
    SELECT
        node_id,
        COUNT(*) AS betweenness
    FROM (
        SELECT DISTINCT unnest(path[2:-2]) AS node_id  -- 中间节点
        FROM (
            SELECT bfs_shortest_path(n1.node_id, n2.node_id) AS path
            FROM nodes n1, nodes n2
            WHERE n1.node_id < n2.node_id
        ) paths
        WHERE path IS NOT NULL
    ) intermediate_nodes
    GROUP BY node_id
) bc ON n.node_id = bc.node_id
LEFT JOIN (
    -- 简化的接近中心性：到其他节点的平均距离
    SELECT
        start_node,
        AVG(distance) AS avg_distance,
        SUM(distance) AS total_distance
    FROM (
        SELECT
            n1.node_id AS start_node,
            dijkstra_shortest_path(n1.node_id, n2.node_id) AS distance
        FROM nodes n1, nodes n2
        WHERE n1.node_id != n2.node_id
    ) distances
    GROUP BY start_node
) close ON n.node_id = close.start_node
ORDER BY degree_centrality DESC;

-- 社区检测算法 (简化版标签传播)
CREATE FUNCTION label_propagation_communities(max_iterations INTEGER DEFAULT 10) AS (
    -- 初始化：每个节点属于自己的社区
    CREATE TEMP TABLE communities AS
    SELECT
        node_id,
        node_id AS community_id,
        0 AS iteration
    FROM nodes;

    -- 迭代更新社区标签
    FOR i IN 1..max_iterations LOOP
        INSERT INTO communities
        SELECT
            n.node_id,
            -- 选择邻居中最常见的社区标签
            FIRST_VALUE(c2.community_id) OVER (
                ORDER BY COUNT(*) DESC, c2.community_id
            ) AS new_community,
            i AS iteration
        FROM nodes n
        JOIN communities c ON n.node_id = c.node_id AND c.iteration = i - 1
        LEFT JOIN edges e ON n.node_id = e.source_id
        LEFT JOIN communities c2 ON e.target_id = c2.node_id AND c2.iteration = i - 1
        GROUP BY n.node_id;
    END LOOP;

    -- 返回最终社区结果
    SELECT
        community_id,
        ARRAY_AGG(node_id) AS members,
        COUNT(*) AS size
    FROM communities
    WHERE iteration = max_iterations
    GROUP BY community_id
    ORDER BY size DESC;
);

-- 三角形计数 (Triangle Counting) - 识别紧密连接的节点组
CREATE VIEW triangles AS
SELECT
    e1.source_id AS node_a,
    e1.target_id AS node_b,
    e2.target_id AS node_c
FROM edges e1
JOIN edges e2 ON e1.target_id = e2.source_id
JOIN edges e3 ON e2.target_id = e3.source_id AND e3.target_id = e1.source_id
WHERE e1.source_id < e1.target_id  -- 避免重复计数
  AND e1.target_id < e2.target_id;

-- 聚类系数计算 (Clustering Coefficient)
CREATE VIEW clustering_coefficient AS
SELECT
    n.node_id,
    n.label,
    -- 局部聚类系数
    CASE
        WHEN deg.degree >= 2 THEN
            (2.0 * COUNT(*)) / (deg.degree * (deg.degree - 1))
        ELSE 0
    END AS local_clustering_coeff
FROM nodes n
JOIN (
    SELECT source_id AS node_id, COUNT(*) AS degree
    FROM edges
    GROUP BY source_id
) deg ON n.node_id = deg.node_id
LEFT JOIN triangles t ON n.node_id IN (t.node_a, t.node_b, t.node_c)
GROUP BY n.node_id, n.label, deg.degree
ORDER BY local_clustering_coeff DESC;`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：社交网络分析系统</p>
            <p>构建社交网络关系分析平台：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>设计用户关系图数据模型</li>
              <li>实现好友推荐算法</li>
              <li>分析网络中的影响力节点</li>
              <li>检测社区结构和兴趣群组</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：知识图谱构建</p>
            <p>构建领域知识图谱分析系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实体识别和关系抽取</li>
              <li>构建多层级知识图谱</li>
              <li>实现图查询和推理</li>
              <li>设计知识发现算法</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
export function DataLineageSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据血缘分析</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"追踪数据的起源，理解数据的流向"</p>

      <Paragraph {...noteProps('p1')}>
        数据血缘分析是现代数据治理的核心，它帮助我们理解数据从源头到消费的全生命周期。通过追踪数据依赖关系，我们可以进行影响分析、数据质量监控和合规审计。这个项目将构建一个完整的数据血缘追踪系统。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• 数据依赖关系建模</li>
            <li>• 血缘追踪和可视化</li>
            <li>• 影响分析和传播</li>
            <li>• 数据治理和审计</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• 图数据库设计</li>
            <li>• 元数据管理</li>
            <li>• 依赖解析算法</li>
            <li>• 血缘图可视化</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据血缘模型设计</h3>

      <CodeBlock
        title="数据资产和血缘关系建模"
        code={`-- 数据资产元数据表
CREATE TABLE data_assets (
    asset_id INTEGER PRIMARY KEY,
    asset_type VARCHAR NOT NULL,  -- 'table', 'column', 'view', 'file', 'api'
    name VARCHAR NOT NULL,
    schema_name VARCHAR,
    database_name VARCHAR,
    description VARCHAR,
    owner VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags JSON,  -- 标签和分类信息
    properties JSON  -- 扩展属性
);

-- 数据血缘关系表
CREATE TABLE data_lineage (
    lineage_id INTEGER PRIMARY KEY,
    upstream_asset_id INTEGER REFERENCES data_assets(asset_id),
    downstream_asset_id INTEGER REFERENCES data_assets(asset_id),
    transformation_type VARCHAR,  -- 'ETL', 'query', 'copy', 'join', 'aggregate'
    transformation_logic TEXT,   -- 转换逻辑描述
    execution_context JSON,      -- 执行环境信息
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence_score DECIMAL(3,2) DEFAULT 1.0  -- 血缘关系的置信度
);

-- 数据转换过程记录
CREATE TABLE data_transformations (
    transformation_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,  -- 'sql', 'python', 'spark', 'airflow'
    source_code TEXT,       -- 转换代码
    input_assets JSON,      -- 输入数据资产列表
    output_assets JSON,     -- 输出数据资产列表
    execution_engine VARCHAR, -- 执行引擎
    schedule_info JSON,     -- 调度信息
    owner VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_executed TIMESTAMP,
    execution_count INTEGER DEFAULT 0
);

-- 血缘追踪事件表
CREATE TABLE lineage_events (
    event_id INTEGER PRIMARY KEY,
    asset_id INTEGER REFERENCES data_assets(asset_id),
    event_type VARCHAR NOT NULL,  -- 'created', 'modified', 'deleted', 'accessed'
    event_details JSON,          -- 事件详细信息
    user_id VARCHAR,             -- 操作用户
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR        -- 来源系统
);

-- 示例数据插入
INSERT INTO data_assets (asset_type, name, schema_name, database_name, description) VALUES
('table', 'raw_orders', 'staging', 'ecommerce_db', '原始订单数据'),
('table', 'dim_customers', 'dw', 'ecommerce_dw', '客户维度表'),
('table', 'fact_sales', 'dw', 'ecommerce_dw', '销售事实表'),
('column', 'customer_id', 'dw', 'ecommerce_dw', '客户ID列'),
('view', 'customer_summary', 'reporting', 'ecommerce_db', '客户汇总视图');

-- 建立血缘关系
INSERT INTO data_lineage (upstream_asset_id, downstream_asset_id, transformation_type, transformation_logic) VALUES
(1, 3, 'ETL', 'INSERT INTO fact_sales SELECT * FROM raw_orders WHERE status = ''completed'''),
(2, 3, 'join', 'fact_sales.customer_id = dim_customers.customer_id'),
(3, 5, 'aggregate', 'CREATE VIEW customer_summary AS SELECT customer_id, SUM(amount) FROM fact_sales GROUP BY customer_id');`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">血缘追踪算法</h3>

      <CodeBlock
        title="上游和下游血缘追踪"
        code={`-- 递归查询上游血缘（数据来源追踪）
CREATE FUNCTION get_upstream_lineage(target_asset_id INTEGER, max_depth INTEGER DEFAULT 10) AS (
    WITH RECURSIVE upstream AS (
        -- 起始节点
        SELECT
            target_asset_id AS asset_id,
            0 AS depth,
            ARRAY[target_asset_id] AS path,
            ARRAY[]::VARCHAR[] AS transformations
        UNION ALL
        -- 递归向上查找
        SELECT
            dl.upstream_asset_id AS asset_id,
            u.depth + 1 AS depth,
            u.path || dl.upstream_asset_id AS path,
            u.transformations || dl.transformation_type AS transformations
        FROM upstream u
        JOIN data_lineage dl ON u.asset_id = dl.downstream_asset_id
        WHERE u.depth < max_depth
          AND dl.upstream_asset_id NOT IN (SELECT unnest(u.path))  -- 避免循环
    )
    SELECT
        ua.asset_id,
        da.name,
        da.asset_type,
        ua.depth,
        ua.path,
        ua.transformations,
        da.description
    FROM upstream ua
    JOIN data_assets da ON ua.asset_id = da.asset_id
    WHERE ua.depth > 0  -- 排除起始节点本身
    ORDER BY ua.depth, ua.asset_id;
);

-- 递归查询下游血缘（数据影响追踪）
CREATE FUNCTION get_downstream_lineage(target_asset_id INTEGER, max_depth INTEGER DEFAULT 10) AS (
    WITH RECURSIVE downstream AS (
        SELECT
            target_asset_id AS asset_id,
            0 AS depth,
            ARRAY[target_asset_id] AS path,
            ARRAY[]::VARCHAR[] AS transformations
        UNION ALL
        SELECT
            dl.downstream_asset_id AS asset_id,
            d.depth + 1 AS depth,
            d.path || dl.downstream_asset_id AS path,
            d.transformations || dl.transformation_type AS transformations
        FROM downstream d
        JOIN data_lineage dl ON d.asset_id = dl.upstream_asset_id
        WHERE d.depth < max_depth
          AND dl.downstream_asset_id NOT IN (SELECT unnest(d.path))  -- 避免循环
    )
    SELECT
        da.asset_id,
        da.name,
        da.asset_type,
        ds.depth,
        ds.path,
        ds.transformations,
        da.description
    FROM downstream ds
    JOIN data_assets da ON ds.asset_id = da.asset_id
    WHERE ds.depth > 0
    ORDER BY ds.depth, da.asset_id;
);

-- 完整血缘图查询
CREATE FUNCTION get_complete_lineage_graph(root_asset_id INTEGER, max_depth INTEGER DEFAULT 5) AS (
    WITH lineage_graph AS (
        -- 获取上游血缘
        SELECT
            asset_id,
            depth,
            path,
            transformations,
            'upstream' AS direction
        FROM get_upstream_lineage(root_asset_id, max_depth)
        UNION ALL
        -- 获取下游血缘
        SELECT
            asset_id,
            depth,
            path,
            transformations,
            'downstream' AS direction
        FROM get_downstream_lineage(root_asset_id, max_depth)
        UNION ALL
        -- 包含根节点
        SELECT
            root_asset_id AS asset_id,
            0 AS depth,
            ARRAY[root_asset_id] AS path,
            ARRAY[]::VARCHAR[] AS transformations,
            'root' AS direction
    )
    SELECT
        lg.*,
        da.name,
        da.asset_type,
        da.schema_name,
        da.database_name,
        da.owner,
        da.tags
    FROM lineage_graph lg
    JOIN data_assets da ON lg.asset_id = da.asset_id
    ORDER BY lg.direction, lg.depth, lg.asset_id;
);

-- 影响分析：当某个数据资产发生变化时，找出所有受影响的下游资产
CREATE FUNCTION analyze_impact(changed_asset_id INTEGER) AS (
    SELECT
        da.asset_id,
        da.name,
        da.asset_type,
        dl.transformation_type,
        dl.transformation_logic,
        ds.depth,
        CASE
            WHEN ds.depth = 1 THEN '直接影响'
            WHEN ds.depth = 2 THEN '间接影响'
            ELSE '远端影响'
        END AS impact_level,
        COUNT(*) OVER (PARTITION BY ds.depth) AS assets_at_level
    FROM get_downstream_lineage(changed_asset_id, 10) ds
    JOIN data_assets da ON ds.asset_id = da.asset_id
    LEFT JOIN data_lineage dl ON ds.asset_id = dl.downstream_asset_id
        AND (SELECT unnest(ds.path[ds.depth])) = dl.upstream_asset_id
    ORDER BY ds.depth, da.asset_type, da.name;
);

-- 数据质量传播分析
CREATE TABLE data_quality_rules (
    rule_id INTEGER PRIMARY KEY,
    asset_id INTEGER REFERENCES data_assets(asset_id),
    rule_type VARCHAR NOT NULL,  -- 'completeness', 'accuracy', 'consistency', 'timeliness'
    rule_expression VARCHAR,     -- 规则表达式
    threshold DECIMAL(5,2),      -- 质量阈值
    severity VARCHAR DEFAULT 'warning'  -- 'warning', 'error', 'critical'
);

-- 计算数据质量分数传播
CREATE FUNCTION propagate_data_quality(changed_asset_id INTEGER, quality_score_change DECIMAL) AS (
    WITH quality_propagation AS (
        SELECT
            asset_id,
            depth,
            -- 质量分数随依赖深度衰减
            quality_score_change * POWER(0.8, depth) AS propagated_score_change,
            CASE
                WHEN depth = 0 THEN '源头变更'
                WHEN depth = 1 THEN '一级影响'
                WHEN depth = 2 THEN '二级影响'
                ELSE '多级影响'
            END AS propagation_level
        FROM get_downstream_lineage(changed_asset_id, 5)
    )
    SELECT
        qp.*,
        da.name,
        da.asset_type,
        -- 计算新的质量分数
        GREATEST(0, LEAST(100,
            COALESCE(dq.current_score, 50) + qp.propagated_score_change
        )) AS new_quality_score
    FROM quality_propagation qp
    JOIN data_assets da ON qp.asset_id = da.asset_id
    LEFT JOIN (
        SELECT asset_id, AVG(quality_score) AS current_score
        FROM data_quality_metrics
        WHERE measured_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY asset_id
    ) dq ON qp.asset_id = dq.asset_id
    ORDER BY qp.depth, qp.propagated_score_change DESC;
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据治理和合规</h3>

      <CodeBlock
        title="血缘审计和合规检查"
        code={`-- 数据访问审计日志
CREATE TABLE data_access_audit (
    audit_id INTEGER PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    asset_id INTEGER REFERENCES data_assets(asset_id),
    access_type VARCHAR NOT NULL,  -- 'read', 'write', 'delete', 'modify'
    query_text TEXT,              -- 实际执行的查询
    row_count_affected INTEGER,
    access_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_info JSON,            -- 会话信息
    compliance_flags JSON         -- 合规检查标记
);

-- 数据敏感度分类
CREATE TABLE data_sensitivity_levels (
    level_id INTEGER PRIMARY KEY,
    level_name VARCHAR NOT NULL,  -- 'public', 'internal', 'confidential', 'restricted'
    description VARCHAR,
    access_requirements JSON,     -- 访问要求
    retention_policy JSON,        -- 保留策略
    encryption_required BOOLEAN DEFAULT FALSE
);

-- 资产敏感度标记
ALTER TABLE data_assets ADD COLUMN sensitivity_level_id INTEGER REFERENCES data_sensitivity_levels(level_id);

-- 合规检查规则
CREATE TABLE compliance_rules (
    rule_id INTEGER PRIMARY KEY,
    rule_name VARCHAR NOT NULL,
    rule_type VARCHAR NOT NULL,  -- 'retention', 'access', 'usage', 'lineage'
    rule_expression VARCHAR,     -- 规则逻辑表达式
    severity VARCHAR DEFAULT 'warning',
    remediation_actions JSON,    -- 补救措施
    active BOOLEAN DEFAULT TRUE
);

-- 合规检查执行函数
CREATE FUNCTION check_compliance(asset_id INTEGER) AS (
    SELECT
        cr.rule_id,
        cr.rule_name,
        cr.rule_type,
        cr.severity,
        CASE
            WHEN cr.rule_type = 'retention' THEN
                check_retention_compliance(asset_id, cr.rule_expression)
            WHEN cr.rule_type = 'access' THEN
                check_access_compliance(asset_id, cr.rule_expression)
            WHEN cr.rule_type = 'lineage' THEN
                check_lineage_compliance(asset_id, cr.rule_expression)
            ELSE FALSE
        END AS compliant,
        cr.remediation_actions
    FROM compliance_rules cr
    WHERE cr.active = TRUE
);

-- 数据保留策略检查
CREATE FUNCTION check_retention_compliance(asset_id INTEGER, retention_rule JSON) AS (
    SELECT
        CASE
            WHEN da.created_at < CURRENT_DATE - INTERVAL '1 year' THEN FALSE
            WHEN da.sensitivity_level_id = (
                SELECT level_id FROM data_sensitivity_levels
                WHERE level_name = 'restricted'
            ) AND da.created_at < CURRENT_DATE - INTERVAL '7 years' THEN FALSE
            ELSE TRUE
        END AS compliant
    FROM data_assets da
    WHERE da.asset_id = asset_id;
);

-- 数据血缘完整性检查
CREATE FUNCTION check_lineage_integrity() AS (
    WITH broken_lineages AS (
        -- 查找引用不存在资产的血缘关系
        SELECT
            dl.lineage_id,
            dl.upstream_asset_id,
            dl.downstream_asset_id,
            'missing_upstream' AS issue_type
        FROM data_lineage dl
        LEFT JOIN data_assets da ON dl.upstream_asset_id = da.asset_id
        WHERE da.asset_id IS NULL
        UNION ALL
        SELECT
            dl.lineage_id,
            dl.upstream_asset_id,
            dl.downstream_asset_id,
            'missing_downstream' AS issue_type
        FROM data_lineage dl
        LEFT JOIN data_assets da ON dl.downstream_asset_id = da.asset_id
        WHERE da.asset_id IS NULL
    )
    SELECT
        bl.*,
        CASE
            WHEN bl.issue_type = 'missing_upstream' THEN
                (SELECT name FROM data_assets WHERE asset_id = bl.downstream_asset_id)
            ELSE (SELECT name FROM data_assets WHERE asset_id = bl.upstream_asset_id)
        END AS affected_asset_name
    FROM broken_lineages bl
    ORDER BY bl.lineage_id;
);

-- 数据治理仪表盘视图
CREATE VIEW data_governance_dashboard AS
SELECT
    'total_assets' AS metric,
    COUNT(*)::VARCHAR AS value,
    'Total number of tracked data assets' AS description
FROM data_assets
UNION ALL
SELECT
    'broken_lineages' AS metric,
    COUNT(*)::VARCHAR AS value,
    'Number of broken lineage relationships' AS description
FROM check_lineage_integrity()
UNION ALL
SELECT
    'compliance_violations' AS metric,
    COUNT(*)::VARCHAR AS value,
    'Number of active compliance violations' AS description
FROM (
    SELECT check_compliance(asset_id) AS compliance_result
    FROM data_assets
) cr
WHERE (compliance_result->>'compliant')::BOOLEAN = FALSE
UNION ALL
SELECT
    'high_sensitivity_assets' AS metric,
    COUNT(*)::VARCHAR AS value,
    'Assets with high sensitivity levels' AS description
FROM data_assets da
JOIN data_sensitivity_levels dsl ON da.sensitivity_level_id = dsl.level_id
WHERE dsl.level_name IN ('confidential', 'restricted');`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：企业数据血缘追踪系统</p>
            <p>为企业数据仓库构建血缘分析平台：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>设计数据资产元数据模型</li>
              <li>实现SQL查询血缘解析</li>
              <li>构建血缘关系可视化</li>
              <li>实现影响分析和传播</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：数据合规治理平台</p>
            <p>构建数据合规和治理监控系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>实现数据敏感度分类</li>
              <li>构建合规规则引擎</li>
              <li>实现访问审计和监控</li>
              <li>生成合规报告和告警</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
export function DataQualitySection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据质量管理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"保障数据可信，驱动业务价值"</p>

      <Paragraph {...noteProps('p1')}>
        数据质量是数据分析和商业智能的基础。高质量的数据能够确保分析结果的准确性和可靠性。这个项目将构建一个完整的数据质量管理系统，包括质量评估、监控告警、数据清洗和质量改进流程。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">项目目标</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 核心功能</h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• 数据质量评估和评分</li>
            <li>• 自动化质量检查规则</li>
            <li>• 实时质量监控和告警</li>
            <li>• 数据清洗和修复</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🛠️ 技术栈</h4>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• 质量规则引擎</li>
            <li>• 统计分析方法</li>
            <li>• 异常检测算法</li>
            <li>• 可视化监控面板</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">质量评估框架</h3>

      <CodeBlock
        title="数据质量维度和评估模型"
        code={`-- 数据质量维度定义
CREATE TABLE quality_dimensions (
    dimension_id INTEGER PRIMARY KEY,
    dimension_name VARCHAR NOT NULL,  -- 'accuracy', 'completeness', 'consistency', 'timeliness', 'validity', 'uniqueness'
    description VARCHAR,
    weight DECIMAL(3,2) DEFAULT 1.0,  -- 在总体质量分数中的权重
    active BOOLEAN DEFAULT TRUE
);

-- 质量检查规则表
CREATE TABLE quality_rules (
    rule_id INTEGER PRIMARY KEY,
    rule_name VARCHAR NOT NULL,
    dimension_id INTEGER REFERENCES quality_dimensions(dimension_id),
    rule_type VARCHAR NOT NULL,  -- 'sql', 'statistical', 'pattern', 'reference'
    rule_expression TEXT,        -- 规则逻辑
    severity VARCHAR DEFAULT 'warning',  -- 'info', 'warning', 'error', 'critical'
    threshold DECIMAL(5,2),      -- 规则阈值
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 质量评估结果表
CREATE TABLE quality_assessments (
    assessment_id INTEGER PRIMARY KEY,
    table_name VARCHAR NOT NULL,
    column_name VARCHAR,
    rule_id INTEGER REFERENCES quality_rules(rule_id),
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_count INTEGER,        -- 检查的记录数
    failed_count INTEGER,        -- 失败的记录数
    quality_score DECIMAL(5,2),  -- 质量分数 (0-100)
    details JSON,                -- 详细结果
    execution_time_seconds DECIMAL(5,2)
);

-- 数据质量仪表盘
CREATE VIEW quality_dashboard AS
SELECT
    qa.table_name,
    qa.column_name,
    qd.dimension_name,
    qr.rule_name,
    qa.quality_score,
    qa.failed_count,
    qa.record_count,
    CASE
        WHEN qa.quality_score >= 95 THEN '优秀'
        WHEN qa.quality_score >= 85 THEN '良好'
        WHEN qa.quality_score >= 70 THEN '一般'
        WHEN qa.quality_score >= 50 THEN '较差'
        ELSE '严重问题'
    END AS quality_level,
    qa.assessed_at
FROM quality_assessments qa
JOIN quality_rules qr ON qa.rule_id = qr.rule_id
JOIN quality_dimensions qd ON qr.dimension_id = qd.dimension_id
WHERE qa.assessed_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY qa.assessed_at DESC, qa.quality_score ASC;

-- 初始化质量维度
INSERT INTO quality_dimensions (dimension_name, description, weight) VALUES
('completeness', '完整性：数据是否完整，没有缺失值', 0.25),
('accuracy', '准确性：数据是否正确反映了真实世界', 0.30),
('consistency', '一致性：数据在不同系统和时间点是否一致', 0.20),
('timeliness', '及时性：数据是否及时可用', 0.15),
('validity', '有效性：数据是否符合业务规则和格式要求', 0.10);`}
        {...noteProps('code1')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">质量检查规则引擎</h3>

      <CodeBlock
        title="自动化质量检查和验证"
        code={`-- 完整性检查规则
CREATE FUNCTION check_completeness(table_name VARCHAR, column_name VARCHAR) AS (
    SELECT
        COUNT(*) AS total_records,
        COUNT(CASE WHEN column_value IS NULL THEN 1 END) AS null_count,
        ROUND(
            100.0 * (1 - COUNT(CASE WHEN column_value IS NULL THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0)), 2
        ) AS completeness_score
    FROM (
        SELECT
            CASE WHEN column_name = 'customer_id' THEN customer_id
                 WHEN column_name = 'order_date' THEN order_date::VARCHAR
                 WHEN column_name = 'amount' THEN amount::VARCHAR
                 ELSE NULL END AS column_value
        FROM orders  -- 动态表名，这里需要使用动态SQL
        WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
    ) t;
);

-- 准确性检查：范围验证
CREATE FUNCTION check_range_accuracy(table_name VARCHAR, column_name VARCHAR,
                                   min_value DECIMAL, max_value DECIMAL) AS (
    SELECT
        COUNT(*) AS total_records,
        COUNT(CASE WHEN column_value < min_value OR column_value > max_value THEN 1 END) AS outlier_count,
        ROUND(
            100.0 * (1 - COUNT(CASE WHEN column_value < min_value OR column_value > max_value THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0)), 2
        ) AS accuracy_score,
        AVG(column_value) AS avg_value,
        STDDEV(column_value) AS std_dev
    FROM (
        SELECT
            CASE WHEN column_name = 'amount' THEN amount
                 WHEN column_name = 'quantity' THEN quantity::DECIMAL
                 ELSE 0 END AS column_value
        FROM sales_transactions
        WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 days'
          AND column_value IS NOT NULL
    ) t;
);

-- 一致性检查：跨表引用完整性
CREATE FUNCTION check_referential_integrity(parent_table VARCHAR, parent_key VARCHAR,
                                          child_table VARCHAR, child_key VARCHAR) AS (
    SELECT
        (SELECT COUNT(*) FROM child_sales) AS child_records,
        (SELECT COUNT(*) FROM child_sales cs
         JOIN parent_customers pc ON cs.customer_id = pc.customer_id) AS valid_records,
        ROUND(
            100.0 * (SELECT COUNT(*) FROM child_sales cs
                     JOIN parent_customers pc ON cs.customer_id = pc.customer_id)::DECIMAL /
            NULLIF((SELECT COUNT(*) FROM child_sales), 0), 2
        ) AS consistency_score,
        (SELECT COUNT(*) FROM child_sales
         WHERE customer_id NOT IN (SELECT customer_id FROM parent_customers)) AS orphan_records
    FROM (
        SELECT 1 as dummy  -- 为了语法正确性
    ) t;
);

-- 有效性检查：格式验证
CREATE FUNCTION check_format_validity(table_name VARCHAR, column_name VARCHAR, pattern VARCHAR) AS (
    SELECT
        COUNT(*) AS total_records,
        COUNT(CASE WHEN column_value ~ pattern THEN 1 END) AS valid_count,
        ROUND(
            100.0 * COUNT(CASE WHEN column_value ~ pattern THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0), 2
        ) AS validity_score,
        -- 找出最常见的无效格式
        (SELECT column_value
         FROM (
             SELECT column_value, COUNT(*) as cnt
             FROM (
                 SELECT
                     CASE WHEN column_name = 'email' THEN email
                          WHEN column_name = 'phone' THEN phone
                          ELSE '' END AS column_value
                 FROM customers
                 WHERE column_value IS NOT NULL
                   AND NOT (column_value ~ pattern)
             ) invalid_values
             GROUP BY column_value
             ORDER BY cnt DESC
             LIMIT 1
         ) t) AS most_common_invalid
    FROM (
        SELECT
            CASE WHEN column_name = 'email' THEN email
                 WHEN column_name = 'phone' THEN phone
                 ELSE '' END AS column_value
        FROM customers
        WHERE column_value IS NOT NULL
    ) t;
);

-- 唯一性检查
CREATE FUNCTION check_uniqueness(table_name VARCHAR, column_name VARCHAR) AS (
    SELECT
        COUNT(*) AS total_records,
        COUNT(DISTINCT column_value) AS unique_values,
        ROUND(
            100.0 * COUNT(DISTINCT column_value)::DECIMAL /
            NULLIF(COUNT(*), 0), 2
        ) AS uniqueness_score,
        -- 计算重复值比例
        1 - (COUNT(DISTINCT column_value)::DECIMAL /
             NULLIF(COUNT(*), 0)) AS duplication_rate,
        -- 最常见的重复值
        (SELECT column_value
         FROM (
             SELECT column_value, COUNT(*) as frequency
             FROM (
                 SELECT
                     CASE WHEN column_name = 'customer_id' THEN customer_id::VARCHAR
                          WHEN column_name = 'email' THEN email
                          ELSE '' END AS column_value
                 FROM customers
                 WHERE column_value IS NOT NULL
             ) values
             GROUP BY column_value
             HAVING COUNT(*) > 1
             ORDER BY COUNT(*) DESC
             LIMIT 1
         ) t) AS most_duplicated_value
    FROM (
        SELECT
            CASE WHEN column_name = 'customer_id' THEN customer_id::VARCHAR
                 WHEN column_name = 'email' THEN email
                 ELSE '' END AS column_value
        FROM customers
        WHERE column_value IS NOT NULL
    ) t;
);

-- 综合质量评分计算
CREATE FUNCTION calculate_overall_quality_score(table_name VARCHAR) AS (
    SELECT
        table_name,
        COUNT(*) AS rules_executed,
        ROUND(AVG(quality_score), 2) AS avg_quality_score,
        ROUND(STDDEV(quality_score), 2) AS quality_stddev,
        MIN(quality_score) AS min_quality_score,
        MAX(quality_score) AS max_quality_score,
        -- 加权平均质量分数
        ROUND(
            SUM(quality_score * qd.weight) / NULLIF(SUM(qd.weight), 0), 2
        ) AS weighted_quality_score
    FROM quality_assessments qa
    JOIN quality_rules qr ON qa.rule_id = qr.rule_id
    JOIN quality_dimensions qd ON qr.dimension_id = qd.dimension_id
    WHERE qa.table_name = table_name
      AND qa.assessed_at >= CURRENT_DATE - INTERVAL '1 day'
    GROUP BY table_name;
);`}
        {...noteProps('code2')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">质量监控和告警</h3>

      <CodeBlock
        title="实时质量监控和异常检测"
        code={`-- 质量监控配置
CREATE TABLE quality_monitors (
    monitor_id INTEGER PRIMARY KEY,
    table_name VARCHAR NOT NULL,
    column_name VARCHAR,
    rule_id INTEGER REFERENCES quality_rules(rule_id),
    check_frequency_minutes INTEGER DEFAULT 60,  -- 检查频率
    alert_threshold DECIMAL(5,2),  -- 告警阈值
    alert_enabled BOOLEAN DEFAULT TRUE,
    last_checked TIMESTAMP,
    consecutive_failures INTEGER DEFAULT 0
);

-- 质量告警记录
CREATE TABLE quality_alerts (
    alert_id INTEGER PRIMARY KEY,
    monitor_id INTEGER REFERENCES quality_monitors(monitor_id),
    alert_type VARCHAR NOT NULL,  -- 'threshold', 'trend', 'anomaly'
    severity VARCHAR NOT NULL,
    message TEXT,
    quality_score DECIMAL(5,2),
    threshold DECIMAL(5,2),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT
);

-- 趋势分析：质量分数变化检测
CREATE FUNCTION detect_quality_trends(table_name VARCHAR, days_back INTEGER DEFAULT 7) AS (
    WITH daily_quality AS (
        SELECT
            DATE(assessed_at) AS date,
            AVG(quality_score) AS avg_score,
            STDDEV(quality_score) AS score_stddev,
            COUNT(*) AS checks_count
        FROM quality_assessments
        WHERE table_name = table_name
          AND assessed_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        GROUP BY DATE(assessed_at)
        ORDER BY date
    ),
    trend_analysis AS (
        SELECT
            date,
            avg_score,
            score_stddev,
            checks_count,
            -- 计算移动平均
            AVG(avg_score) OVER (ORDER BY date ROWS 2 PRECEDING) AS moving_avg_3d,
            -- 计算趋势斜率（简化版）
            avg_score - LAG(avg_score, 1) OVER (ORDER BY date) AS daily_change,
            -- 检测异常点
            CASE
                WHEN ABS(avg_score - AVG(avg_score) OVER (ORDER BY date ROWS 6 PRECEDING)) >
                     2 * STDDEV(avg_score) OVER (ORDER BY date ROWS 6 PRECEDING)
                THEN 'anomaly'
                ELSE 'normal'
            END AS anomaly_flag
        FROM daily_quality
    )
    SELECT
        ta.*,
        CASE
            WHEN ta.daily_change < -5 THEN 'deteriorating'
            WHEN ta.daily_change > 5 THEN 'improving'
            ELSE 'stable'
        END AS trend_direction,
        CASE
            WHEN ta.anomaly_flag = 'anomaly' THEN
                CASE
                    WHEN ta.avg_score < 70 THEN 'critical'
                    WHEN ta.avg_score < 85 THEN 'warning'
                    ELSE 'info'
                END
            ELSE NULL
        END AS alert_level
    FROM trend_analysis ta
    ORDER BY ta.date DESC;
);

-- 自动化质量检查执行器
CREATE FUNCTION execute_quality_checks() AS (
    -- 遍历所有活跃的质量规则
    FOR rule_record IN (
        SELECT
            qr.rule_id,
            qr.rule_name,
            qd.dimension_name,
            qr.rule_expression,
            qr.threshold,
            qr.severity
        FROM quality_rules qr
        JOIN quality_dimensions qd ON qr.dimension_id = qd.dimension_id
        WHERE qr.active = TRUE
    ) LOOP
        -- 执行具体的质量检查（这里需要动态SQL）
        -- 插入检查结果到quality_assessments表

        -- 检查是否需要触发告警
        INSERT INTO quality_alerts (monitor_id, alert_type, severity, message, quality_score, threshold)
        SELECT
            qm.monitor_id,
            'threshold',
            qr.severity,
            '质量分数低于阈值: ' || qa.quality_score || ' < ' || qm.alert_threshold,
            qa.quality_score,
            qm.alert_threshold
        FROM quality_assessments qa
        JOIN quality_monitors qm ON qa.table_name = qm.table_name
            AND (qa.column_name = qm.column_name OR qm.column_name IS NULL)
        JOIN quality_rules qr ON qa.rule_id = qr.rule_id
        WHERE qa.quality_score < qm.alert_threshold
          AND qm.alert_enabled = TRUE
          AND qa.assessed_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour';  -- 避免重复告警
    END LOOP;
);

-- 数据质量报告生成
CREATE FUNCTION generate_quality_report(date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
                                      date_to DATE DEFAULT CURRENT_DATE) AS (
    SELECT
        JSON_BUILD_OBJECT(
            'report_period', JSON_BUILD_OBJECT('from', date_from, 'to', date_to),
            'summary', JSON_BUILD_OBJECT(
                'total_checks', (SELECT COUNT(*) FROM quality_assessments
                                WHERE DATE(assessed_at) BETWEEN date_from AND date_to),
                'average_quality_score', (SELECT ROUND(AVG(quality_score), 2)
                                         FROM quality_assessments
                                         WHERE DATE(assessed_at) BETWEEN date_from AND date_to),
                'tables_monitored', (SELECT COUNT(DISTINCT table_name)
                                    FROM quality_assessments
                                    WHERE DATE(assessed_at) BETWEEN date_from AND date_to),
                'critical_issues', (SELECT COUNT(*) FROM quality_alerts
                                   WHERE DATE(detected_at) BETWEEN date_from AND date_to
                                   AND severity = 'critical')
            ),
            'dimension_breakdown', (
                SELECT JSON_OBJECT_AGG(
                    qd.dimension_name,
                    JSON_BUILD_OBJECT(
                        'average_score', ROUND(AVG(qa.quality_score), 2),
                        'check_count', COUNT(*),
                        'failed_checks', COUNT(CASE WHEN qa.quality_score < 80 THEN 1 END)
                    )
                )
                FROM quality_assessments qa
                JOIN quality_rules qr ON qa.rule_id = qr.rule_id
                JOIN quality_dimensions qd ON qr.dimension_id = qd.dimension_id
                WHERE DATE(qa.assessed_at) BETWEEN date_from AND date_to
                GROUP BY qd.dimension_name
            ),
            'top_issues', (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'table_name', table_name,
                        'column_name', column_name,
                        'rule_name', rule_name,
                        'quality_score', quality_score,
                        'severity', severity
                    )
                )
                FROM (
                    SELECT
                        qa.table_name,
                        qa.column_name,
                        qr.rule_name,
                        qa.quality_score,
                        qr.severity,
                        ROW_NUMBER() OVER (ORDER BY qa.quality_score ASC) AS rn
                    FROM quality_assessments qa
                    JOIN quality_rules qr ON qa.rule_id = qr.rule_id
                    WHERE DATE(qa.assessed_at) BETWEEN date_from AND date_to
                      AND qa.quality_score < 70
                    ORDER BY qa.quality_score ASC
                    LIMIT 10
                ) top_issues
                WHERE rn <= 10
            )
        ) AS report_json;
);`}
        {...noteProps('code3')}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
        <div className="space-y-3">
          <div>
            <p className="font-semibold">任务 1：企业数据质量监控平台</p>
            <p>构建完整的数据质量管理系统：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>设计多维度质量评估框架</li>
              <li>实现自动化质量检查规则</li>
              <li>构建质量趋势分析和异常检测</li>
              <li>开发质量报告生成和可视化</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">任务 2：数据清洗和修复系统</p>
            <p>实现智能数据清洗和修复功能：</p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>识别和分类数据质量问题</li>
              <li>实现自动数据清洗规则</li>
              <li>构建数据修复建议引擎</li>
              <li>设计修复效果验证机制</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
