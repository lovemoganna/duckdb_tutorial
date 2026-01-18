import { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

interface ProjectWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

// 项目模板
const projectTemplates = [
  {
    id: 'data-analysis',
    name: '数据分析项目',
    description: '完整的 DuckDB 数据分析项目模板',
    icon: '📊',
    files: {
      'main.py': `# 数据分析项目主文件
import duckdb
import pandas as pd
import matplotlib.pyplot as plt

def main():
    # 连接数据库
    conn = duckdb.connect(':memory:')

    # 创建示例数据
    conn.execute('''
        CREATE TABLE sales (
            id INTEGER PRIMARY KEY,
            product_name VARCHAR,
            category VARCHAR,
            price DECIMAL(10,2),
            quantity INTEGER,
            sale_date DATE
        )
    ''')

    # 插入示例数据
    conn.execute('''
        INSERT INTO sales VALUES
        (1, 'iPhone 15', '电子产品', 5999.00, 10, '2024-01-01'),
        (2, 'MacBook Pro', '电子产品', 12999.00, 5, '2024-01-02'),
        (3, 'Nike 运动鞋', '服饰', 899.00, 20, '2024-01-03')
    ''')

    # 执行分析查询
    result = conn.execute('''
        SELECT
            category,
            COUNT(*) as total_orders,
            SUM(price * quantity) as total_revenue,
            AVG(price) as avg_price
        FROM sales
        GROUP BY category
        ORDER BY total_revenue DESC
    ''')

    print("销售数据分析结果：")
    print(result.df())

    # 可视化
    df = result.df()
    plt.figure(figsize=(10, 6))
    plt.bar(df['category'], df['total_revenue'])
    plt.title('各品类销售额')
    plt.xlabel('品类')
    plt.ylabel('销售额')
    plt.show()

if __name__ == '__main__':
    main()
`,
      'requirements.txt': `duckdb==0.9.2
pandas>=2.0.0
matplotlib>=3.7.0
numpy>=1.24.0`,
      'README.md': `# 数据分析项目

这是一个使用 DuckDB 进行数据分析的项目示例。

## 功能特性

- 使用 DuckDB 进行高效数据查询
- Pandas 数据处理
- Matplotlib 数据可视化
- 完整的销售数据分析流程

## 运行项目

1. 安装依赖：
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. 运行主程序：
   \`\`\`bash
   python main.py
   \`\`\`

## 项目结构

- \`main.py\` - 主程序文件
- \`requirements.txt\` - 项目依赖
- \`README.md\` - 项目说明
`
    }
  },
  {
    id: 'etl-pipeline',
    name: 'ETL 数据管道',
    description: '数据提取、转换、加载的完整流程',
    icon: '🔄',
    files: {
      'etl_pipeline.py': `# ETL 数据管道示例
import duckdb
import pandas as pd
from pathlib import Path

class ETLPipeline:
    def __init__(self, db_path=':memory:'):
        self.conn = duckdb.connect(db_path)

    def extract(self, source_path):
        """数据提取阶段"""
        print("🔍 开始数据提取...")

        # 读取多种格式的数据
        if source_path.endswith('.csv'):
            df = pd.read_csv(source_path)
        elif source_path.endswith('.json'):
            df = pd.read_json(source_path)
        else:
            raise ValueError("不支持的文件格式")

        print(f"✅ 成功读取 {len(df)} 行数据")
        return df

    def transform(self, df):
        """数据转换阶段"""
        print("🔄 开始数据转换...")

        # 数据清洗
        df = df.dropna()  # 删除空值
        df = df.drop_duplicates()  # 删除重复值

        # 数据标准化
        if 'price' in df.columns:
            df['price'] = pd.to_numeric(df['price'], errors='coerce')
            df = df[df['price'] > 0]  # 只保留正数价格

        # 数据增强
        df['processed_at'] = pd.Timestamp.now()
        df['data_quality_score'] = 1.0  # 数据质量评分

        print(f"✅ 数据转换完成，剩余 {len(df)} 行")
        return df

    def load(self, df, table_name='processed_data'):
        """数据加载阶段"""
        print("💾 开始数据加载...")

        # 创建表并加载数据
        self.conn.execute(f"CREATE TABLE IF NOT EXISTS {table_name} AS SELECT * FROM df")

        # 创建索引以提高查询性能
        self.conn.execute(f"CREATE INDEX IF NOT EXISTS idx_processed_at ON {table_name}(processed_at)")

        print(f"✅ 数据已加载到表 {table_name}")
        return table_name

    def validate(self, table_name):
        """数据验证"""
        print("🔍 开始数据验证...")

        # 基本统计
        result = self.conn.execute(f'''
            SELECT
                COUNT(*) as total_rows,
                COUNT(DISTINCT *) as unique_rows,
                AVG(data_quality_score) as avg_quality
            FROM {table_name}
        ''')

        stats = result.fetchone()
        print(f"""
📊 数据验证结果：
   - 总行数: {stats[0]}
   - 唯一行数: {stats[1]}
   - 平均质量评分: {stats[2]:.2f}
        """)

        return stats

def main():
    # 创建 ETL 管道
    etl = ETLPipeline()

    try:
        # 模拟数据提取（实际项目中替换为真实数据源）
        sample_data = pd.DataFrame({
            'product_id': range(1, 101),
            'product_name': [f'产品{i}' for i in range(1, 101)],
            'category': ['A', 'B', 'C'] * 33 + ['A'],
            'price': [100 + i * 10 for i in range(100)],
            'sales': [10 + i for i in range(100)]
        })

        # 执行 ETL 流程
        transformed_data = etl.transform(sample_data)
        table_name = etl.load(transformed_data)
        etl.validate(table_name)

        # 执行分析查询
        analysis_result = etl.conn.execute('''
            SELECT
                category,
                COUNT(*) as product_count,
                AVG(price) as avg_price,
                SUM(sales) as total_sales
            FROM processed_data
            GROUP BY category
            ORDER BY total_sales DESC
        ''')

        print("\\n📈 销售分析结果：")
        print(analysis_result.df())

    except Exception as e:
        print(f"❌ ETL 流程出错: {e}")
    finally:
        etl.conn.close()

if __name__ == '__main__':
    main()
`,
      'config.yaml': `# ETL 管道配置文件
database:
  path: 'data/warehouse.db'
  backup_interval: '24h'

sources:
  - name: 'sales_data'
    type: 'csv'
    path: 'data/input/sales.csv'
    delimiter: ','
    encoding: 'utf-8'

  - name: 'customer_data'
    type: 'json'
    path: 'data/input/customers.json'

transforms:
  - name: 'data_cleaning'
    rules:
      - remove_nulls: true
      - remove_duplicates: true
      - standardize_formats: true

  - name: 'data_enrichment'
    rules:
      - add_timestamps: true
      - calculate_metrics: true
      - validate_references: true

destinations:
  - name: 'data_warehouse'
    type: 'duckdb'
    table: 'processed_data'

monitoring:
  enable_metrics: true
  log_level: 'INFO'
  alert_on_errors: true
`,
      'test_etl.py': `# ETL 管道测试
import pytest
import pandas as pd
from etl_pipeline import ETLPipeline

class TestETLPipeline:
    def setup_method(self):
        self.etl = ETLPipeline(':memory:')

    def teardown_method(self):
        self.etl.conn.close()

    def test_extract_csv(self):
        # 创建测试 CSV 数据
        test_df = pd.DataFrame({
            'id': [1, 2, 3],
            'name': ['Alice', 'Bob', 'Charlie'],
            'value': [100, 200, 300]
        })

        # 测试提取逻辑
        result_df = self.etl.transform(test_df)
        assert len(result_df) == 3
        assert 'processed_at' in result_df.columns
        assert 'data_quality_score' in result_df.columns

    def test_transform_data_cleaning(self):
        # 测试数据清洗
        dirty_df = pd.DataFrame({
            'id': [1, 2, 2, 3, None],
            'name': ['Alice', 'Bob', 'Bob', 'Charlie', 'David'],
            'value': [100, 200, 200, 300, 400]
        })

        clean_df = self.etl.transform(dirty_df)

        # 检查去重和空值处理
        assert len(clean_df) < len(dirty_df)  # 去重后行数减少

    def test_load_and_query(self):
        # 测试数据加载和查询
        test_df = pd.DataFrame({
            'id': [1, 2, 3],
            'category': ['A', 'B', 'A'],
            'value': [10, 20, 30]
        })

        table_name = self.etl.load(test_df, 'test_table')

        # 验证数据加载成功
        result = self.etl.conn.execute(f'SELECT COUNT(*) FROM {table_name}')
        count = result.fetchone()[0]
        assert count == 3

    def test_data_validation(self):
        # 测试数据验证
        test_df = pd.DataFrame({
            'id': range(1, 6),
            'quality_score': [0.9, 0.8, 1.0, 0.7, 0.95]
        })

        table_name = self.etl.load(test_df)

        stats = self.etl.validate(table_name)

        assert stats[0] == 5  # 总行数
        assert stats[2] > 0   # 平均质量评分

if __name__ == '__main__':
    pytest.main([__file__])
`
    }
  },
  {
    id: 'real-time-dashboard',
    name: '实时仪表盘',
    description: '使用 Streamlit 构建实时数据仪表盘',
    icon: '📺',
    files: {
      'dashboard.py': `# 实时数据仪表盘
import streamlit as st
import duckdb
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time

# 页面配置
st.set_page_config(
    page_title="DuckDB 实时仪表盘",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 初始化数据库连接
@st.cache_resource
def init_db():
    conn = duckdb.connect(':memory:')

    # 创建示例数据表
    conn.execute('''
        CREATE TABLE sales_data (
            id INTEGER PRIMARY KEY,
            product_name VARCHAR,
            category VARCHAR,
            price DECIMAL(10,2),
            quantity INTEGER,
            customer_id INTEGER,
            sale_timestamp TIMESTAMP,
            region VARCHAR
        )
    ''')

    conn.execute('''
        CREATE TABLE customers (
            customer_id INTEGER PRIMARY KEY,
            customer_name VARCHAR,
            customer_type VARCHAR,
            registration_date DATE,
            total_spent DECIMAL(10,2)
        )
    ''')

    # 插入示例数据
    conn.execute('''
        INSERT INTO customers VALUES
        (1, '张三', 'VIP', '2023-01-01', 15000.00),
        (2, '李四', '普通', '2023-02-01', 8000.00),
        (3, '王五', 'VIP', '2023-01-15', 22000.00)
    ''')

    return conn

def generate_sample_sales(conn, hours=1):
    """生成示例销售数据"""
    regions = ['北京', '上海', '广州', '深圳', '杭州']
    products = ['iPhone 15', 'MacBook Pro', 'iPad Air', 'AirPods', 'Apple Watch']
    categories = ['电子产品', '电脑', '平板', '耳机', '智能穿戴']

    # 生成最近几小时的销售数据
    start_time = datetime.now() - timedelta(hours=hours)

    sales_data = []
    for i in range(100):
        sale_time = start_time + timedelta(minutes=i*6)  # 每6分钟一条记录
        sales_data.append({
            'product_name': products[i % len(products)],
            'category': categories[i % len(categories)],
            'price': 1000 + (i % 10) * 500,
            'quantity': 1 + (i % 5),
            'customer_id': 1 + (i % 3),
            'sale_timestamp': sale_time,
            'region': regions[i % len(regions)]
        })

    df = pd.DataFrame(sales_data)
    conn.execute("INSERT INTO sales_data SELECT * FROM df")

def main():
    st.title("📊 DuckDB 实时数据仪表盘")

    # 初始化数据库
    conn = init_db()

    # 侧边栏控制面板
    with st.sidebar:
        st.header("🎛️ 控制面板")

        # 数据刷新控制
        if st.button("🔄 刷新数据"):
            st.rerun()

        # 时间范围选择
        time_range = st.selectbox(
            "时间范围",
            ["最近1小时", "最近6小时", "最近24小时", "最近7天"],
            index=0
        )

        # 自动刷新开关
        auto_refresh = st.checkbox("自动刷新", value=True)

        if auto_refresh:
            refresh_interval = st.slider("刷新间隔(秒)", 5, 60, 10)
            if 'last_refresh' not in st.session_state:
                st.session_state.last_refresh = time.time()

            if time.time() - st.session_state.last_refresh > refresh_interval:
                st.rerun()
                st.session_state.last_refresh = time.time()

        # 区域筛选
        regions = conn.execute("SELECT DISTINCT region FROM sales_data ORDER BY region").fetchall()
        selected_regions = st.multiselect(
            "选择区域",
            [r[0] for r in regions],
            default=[r[0] for r in regions]
        )

    # 生成示例数据
    generate_sample_sales(conn)

    # 构建过滤条件
    region_filter = f"region IN ({','.join([f\"'{r}'\" for r in selected_regions])})" if selected_regions else "1=1"

    # 主仪表盘内容
    col1, col2, col3, col4 = st.columns(4)

    # 核心指标
    with col1:
        total_sales = conn.execute(f'''
            SELECT SUM(price * quantity) as total
            FROM sales_data
            WHERE {region_filter}
        ''').fetchone()[0] or 0

        st.metric("💰 总销售额", f"¥{total_sales:,.0f}")

    with col2:
        total_orders = conn.execute(f'''
            SELECT COUNT(*) as count
            FROM sales_data
            WHERE {region_filter}
        ''').fetchone()[0] or 0

        st.metric("📦 总订单数", f"{total_orders:,}")

    with col3:
        avg_order_value = conn.execute(f'''
            SELECT AVG(price * quantity) as avg_value
            FROM sales_data
            WHERE {region_filter}
        ''').fetchone()[0] or 0

        st.metric("💵 平均订单价值", f"¥{avg_order_value:,.0f}")

    with col4:
        unique_customers = conn.execute(f'''
            SELECT COUNT(DISTINCT customer_id) as customers
            FROM sales_data
            WHERE {region_filter}
        ''').fetchone()[0] or 0

        st.metric("👥 活跃客户数", f"{unique_customers:,}")

    # 图表区域
    st.header("📈 数据可视化")

    col1, col2 = st.columns(2)

    with col1:
        # 销售额趋势图
        sales_trend = conn.execute(f'''
            SELECT
                strftime(sale_timestamp, '%H:%M') as hour,
                SUM(price * quantity) as sales
            FROM sales_data
            WHERE {region_filter}
            GROUP BY hour
            ORDER BY hour
        ''').df()

        fig_trend = px.line(
            sales_trend,
            x='hour',
            y='sales',
            title='销售额趋势',
            labels={'hour': '时间', 'sales': '销售额'}
        )
        st.plotly_chart(fig_trend, use_container_width=True)

    with col2:
        # 产品类别分布
        category_data = conn.execute(f'''
            SELECT
                category,
                SUM(price * quantity) as sales
            FROM sales_data
            WHERE {region_filter}
            GROUP BY category
            ORDER BY sales DESC
        ''').df()

        fig_category = px.pie(
            category_data,
            names='category',
            values='sales',
            title='产品类别销售分布'
        )
        st.plotly_chart(fig_category, use_container_width=True)

    # 区域销售对比
    st.subheader("🗺️ 区域销售对比")
    region_sales = conn.execute(f'''
        SELECT
            region,
            SUM(price * quantity) as sales,
            COUNT(*) as orders
        FROM sales_data
        WHERE {region_filter}
        GROUP BY region
        ORDER BY sales DESC
    ''').df()

    fig_region = go.Figure(data=[
        go.Bar(name='销售额', x=region_sales['region'], y=region_sales['sales']),
        go.Bar(name='订单数', x=region_sales['region'], y=region_sales['orders'])
    ])

    fig_region.update_layout(
        title='各区域销售业绩',
        xaxis_title='区域',
        yaxis_title='数值',
        barmode='group'
    )

    st.plotly_chart(fig_region, use_container_width=True)

    # 详细数据表格
    st.header("📋 详细数据")
    recent_sales = conn.execute(f'''
        SELECT
            sale_timestamp,
            product_name,
            category,
            region,
            price * quantity as total_amount,
            quantity,
            customer_id
        FROM sales_data
        WHERE {region_filter}
        ORDER BY sale_timestamp DESC
        LIMIT 50
    ''').df()

    st.dataframe(recent_sales, use_container_width=True)

    # SQL 查询界面
    st.header("🔍 SQL 查询")
    with st.expander("点击展开 SQL 编辑器"):
        query = st.text_area(
            "输入 SQL 查询",
            value=f"SELECT * FROM sales_data WHERE {region_filter} LIMIT 10",
            height=100
        )

        if st.button("执行查询"):
            try:
                result = conn.execute(query).df()
                st.success(f"查询成功，返回 {len(result)} 行数据")
                st.dataframe(result, use_container_width=True)
            except Exception as e:
                st.error(f"查询错误: {e}")

if __name__ == '__main__':
    main()
`,
      'requirements.txt': `streamlit>=1.28.0
duckdb>=0.9.0
pandas>=2.0.0
plotly>=5.15.0
numpy>=1.24.0`,
      'run_dashboard.bat': `@echo off
echo Starting DuckDB Real-time Dashboard...
streamlit run dashboard.py --server.port 8501 --server.address 0.0.0.0
pause
`
    }
  }
];

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

export function ProjectWorkspace({ isOpen, onClose }: ProjectWorkspaceProps) {
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createProjectFromTemplate = (templateId: string) => {
    const template = projectTemplates.find(t => t.id === templateId);
    if (!template) return;

    setCurrentTemplate(templateId);
    setProjectFiles(template.files);
    setActiveFile(Object.keys(template.files)[0]);

    // 构建文件树
    const tree: FileNode[] = Object.keys(template.files).map(filename => ({
      name: filename,
      type: 'file' as const,
      content: template.files[filename]
    }));

    setFileTree(tree);
    setConsoleOutput([]);
  };

  const updateFileContent = (filename: string, content: string) => {
    setProjectFiles(prev => ({ ...prev, [filename]: content }));
  };

  const runCode = async () => {
    if (!activeFile || !projectFiles[activeFile]) return;

    setIsRunning(true);
    setConsoleOutput(prev => [...prev, `> 正在运行 ${activeFile}...`]);

    try {
      // 模拟代码执行（在实际项目中，这里会调用真实的运行时）
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (activeFile.endsWith('.py')) {
        // 模拟 Python 代码执行
        const output = [
          'Python 代码执行完成',
          '====================',
          '导入模块成功',
          '数据库连接建立',
          '数据处理完成',
          '查询执行成功',
          '程序运行结束'
        ];
        setConsoleOutput(prev => [...prev, ...output.map(line => `  ${line}`)]);
      } else if (activeFile.endsWith('.sql')) {
        // 模拟 SQL 执行
        const output = [
          'SQL 查询执行完成',
          '==================',
          '连接数据库成功',
          '查询语法正确',
          '返回 150 行数据',
          '执行时间: 45ms'
        ];
        setConsoleOutput(prev => [...prev, ...output.map(line => `  ${line}`)]);
      } else {
        setConsoleOutput(prev => [...prev, '文件类型不支持直接运行']);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, `错误: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const generateReport = () => {
    const report = {
      projectName: currentTemplate ? projectTemplates.find(t => t.id === currentTemplate)?.name : '自定义项目',
      totalFiles: Object.keys(projectFiles).length,
      totalLines: Object.values(projectFiles).reduce((sum, content) => sum + content.split('\n').length, 0),
      fileTypes: Object.keys(projectFiles).reduce((acc, filename) => {
        const ext = filename.split('.').pop() || 'unknown';
        acc[ext] = (acc[ext] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      generatedAt: new Date().toISOString()
    };

    const reportContent = `# 项目报告

## 项目信息
- 项目名称: ${report.projectName}
- 生成时间: ${new Date(report.generatedAt).toLocaleString()}

## 文件统计
- 总文件数: ${report.totalFiles}
- 总代码行数: ${report.totalLines}
- 文件类型分布: ${Object.entries(report.fileTypes).map(([ext, count]) => `${ext}: ${count}`).join(', ')}

## 文件清单
${Object.keys(projectFiles).map(filename => `- ${filename}`).join('\n')}
`;

    const reportFilename = 'project_report.md';
    setProjectFiles(prev => ({ ...prev, [reportFilename]: reportContent }));
    setActiveFile(reportFilename);

    // 更新文件树
    setFileTree(prev => [...prev, { name: reportFilename, type: 'file', content: reportContent }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-7xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <h2 className="text-lg font-bold text-white">项目工作区</h2>
              <p className="text-xs text-white/80">创建和管理你的 DuckDB 项目</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentTemplate && (
              <button
                onClick={generateReport}
                className="px-3 py-1.5 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                📊 生成报告
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* 侧边栏 */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            {/* 项目模板 */}
            {!currentTemplate ? (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">选择项目模板</h3>
                <div className="space-y-3">
                  {projectTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => createProjectFromTemplate(template.id)}
                      className="w-full p-4 text-left bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all card-hover"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-slate-200">{template.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* 文件树 */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">项目文件</h3>
                  <div className="space-y-1">
                    {fileTree.map((node, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFile(node.name)}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2',
                          activeFile === node.name
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        )}
                      >
                        <span className="text-blue-500">📄</span>
                        <span className="truncate">{node.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 控制面板 */}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">控制面板</h3>
                  <div className="space-y-3">
                    <button
                      onClick={runCode}
                      disabled={!activeFile || isRunning}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-primary flex items-center justify-center gap-2"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          运行中...
                        </>
                      ) : (
                        <>
                          <span>▶️</span>
                          运行代码
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setCurrentTemplate(null)}
                      className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      🔄 新建项目
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 主编辑区域 */}
          <div className="flex-1 flex flex-col">
            {currentTemplate && activeFile ? (
              <>
                {/* 文件标签 */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">📄</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{activeFile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>{projectFiles[activeFile]?.split('\n').length || 0} 行</span>
                    <span>{projectFiles[activeFile]?.length || 0} 字符</span>
                  </div>
                </div>

                {/* 代码编辑器 */}
                <div className="flex-1 p-4">
                  <textarea
                    ref={textareaRef}
                    value={projectFiles[activeFile] || ''}
                    onChange={(e) => updateFileContent(activeFile, e.target.value)}
                    className="w-full h-full font-mono text-sm bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none p-4"
                    spellCheck={false}
                    placeholder="在这里编写你的代码..."
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <span className="text-6xl mb-4 block">💻</span>
                  <h3 className="text-xl font-semibold mb-2">欢迎使用项目工作区</h3>
                  <p className="text-sm">选择一个项目模板开始你的 DuckDB 项目开发</p>
                </div>
              </div>
            )}
          </div>

          {/* 控制台输出 */}
          {consoleOutput.length > 0 && (
            <div className="w-80 border-l border-slate-200 dark:border-slate-700 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">控制台输出</h3>
              </div>
              <div className="flex-1 p-4 bg-slate-900 text-slate-100 font-mono text-sm overflow-y-auto">
                {consoleOutput.map((line, index) => (
                  <div key={index} className="mb-1">{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
