import { useState, useCallback, useEffect } from 'react';
import { cn } from './utils/cn';
import { useNotes } from './hooks/useNotes';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { useSearch } from './hooks/useSearch';
import { CodeBlock } from './components/CodeBlock';
import { InfoBox } from './components/InfoBox';
import { Paragraph } from './components/Paragraph';
import { SQLFlowDiagram } from './components/SQLFlowDiagram';
import { SQLExplainer } from './components/SQLExplainer';
import { DataFlowAnimation } from './components/DataFlowAnimation';
import { NotesPanel } from './components/NotesPanel';
import { ReadingProgress } from './components/ReadingProgress';
import { SearchModal } from './components/SearchModal';
import { SettingsPanel } from './components/SettingsPanel';
import { BackToTop } from './components/BackToTop';
import { TableOfContents } from './components/TableOfContents';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { QuickReference } from './components/QuickReference';
import { Flashcards } from './components/Flashcards';
import { LearningPath } from './components/LearningPath';
import { Achievements } from './components/Achievements';
import { Glossary } from './components/Glossary';
import { SQLPlayground } from './components/SQLPlayground';
import { OntologyGraph } from './components/OntologyGraph';
import { SQLCompare } from './components/SQLCompare';
import { Quiz } from './components/Quiz';
// 新增的核心UI组件
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingState, SkeletonLoader } from './components/LoadingState';
import { EmptyState, NoSearchResults, NoNotes, NoBookmarks } from './components/EmptyState';
import { QuickActions } from './components/QuickActions';
import { EnhancedCodeBlock } from './components/CodeCopy';
import {
  Button,
  Card,
  Input,
  Badge,
  Typography
} from './components/DesignSystem';
import { FAQPage } from './components/FAQPage';
import {
  WindowFunctionsSection,
  ImportCSVSection,
  ImportJSONSection,
  ExportDataSection,
  IndexingSection,
  QueryOptimizationSection,
  PatternMatchingSection,
  AdvancedAggregationSection
} from './components/TutorialSections';
import {
  RecursiveSection,
  PivotSection,
  SetOperationsSection
} from './components/AdvancedQuerySections';
import {
  MathStatsFunctionsSection,
  TypeConversionSection,
  RegexFunctionsSection
} from './components/FunctionSections';
import {
  AdvancedAnalyticsSection,
  LateralJoinSection,
  QualifySection,
  SamplingSection,
  FulltextSearchSection,
  ApproximateComputingSection,
  ArrayStructSection,
  NullHandlingSection,
  SpatialFunctionsSection,
  SequenceGenerationSection,
  ListFunctionsSection,
  CryptoFunctionsSection,
  ExternalSourcesSection,
  IncrementalProcessingSection,
  StreamingProcessingSection,
  DeltaLakeSection,
  MaterializedViewsSection,
  DynamicViewsSection,
  UserPermissionsSection,
  EncryptionMaskingSection,
  AuditLogsSection,
  RowLevelSecuritySection,
  ColumnLevelSecuritySection
} from './components/MoreSections';
import {
  TransactionBasicsSection,
  AcidPropertiesSection,
  IsolationLevelsSection,
  ConcurrencyProblemsSection,
  SavepointsNestedSection,
  TransactionPatternsSection,
  RealWorldExamplesSection,
  PerformanceTuningSection
} from './components/TransactionSections';
import {
  StringFunctionsSection,
  DateTimeFunctionsSection,
  ConditionalExpressionsSection,
  DataTypesSection
} from './components/AdvancedTutorialSections';
import { LearningDashboard } from './components/LearningDashboard';
import { LearningAssistant } from './components/LearningAssistant';
import { CodeReview } from './components/CodeReview';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import {
  QueryPlansSection,
  MemoryCachingSection,
  ParallelProcessingSection,
  StatisticsInfoSection,
  PartitioningSection,
  VectorizationSection
} from './components/PerformanceSections';
import {
  ExtensionsPluginsSection,
  BestPracticesSection,
  MigrationSection,
  HighAvailabilitySection
} from './components/ArchitectureSections';
import {
  DataWarehouseSection,
  DataAnalysisSection,
  ApiIntegrationSection,
  TimeSeriesSection,
  MlPreprocessingSection,
  RealtimeDashboardSection,
  LogAnalysisSection,
  RecommendationSystemSection,
  GraphAnalysisSection,
  DataLineageSection,
  DataQualitySection
} from './components/ProjectSections';
import {
  DistributedConceptsSection,
  BigDataConceptsSection,
  MLConceptsSection
} from './components/AdvancedTutorialSections';
import { modules, getSectionTitle, getNextSection, getPrevSection, allSections } from './data/sections';

// ============================================
// 教程内容组件 - Fast.ai 风格
// ============================================

interface ContentProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
  fontSize: 'small' | 'medium' | 'large';
}

function TutorialContent({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock, fontSize }: ContentProps) {
  const noteProps = (blockId: string) => ({
    sectionId,
    blockId,
    notes: getNotesForBlock(sectionId, blockId),
    onAddNote: (content: string) => addNote(sectionId, blockId, content),
    onUpdateNote: updateNote,
    onDeleteNote: deleteNote,
  });

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  const content = (() => {
    switch (sectionId) {
      case 'why-duckdb':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">为什么学 DuckDB？</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"先知道为什么，才能学得更快"</p>

            <Paragraph {...noteProps('p1')}>
              想象一下：你有一个 5GB 的 CSV 文件，想快速统计里面的数据。用 Excel？打不开。用 Python pandas？内存爆了。用 MySQL？还得先建库、建表、导数据…… 太麻烦！
            </Paragraph>

            <Paragraph {...noteProps('p2')}>
              <strong>DuckDB 就是为解决这个问题而生的。</strong>它是一个嵌入式分析数据库，一行命令就能查询 CSV、Parquet、JSON 文件，而且速度飞快！
            </Paragraph>

            <InfoBox type="fastai" title="Fast.ai 学习法" {...noteProps('box1')}>
              Jeremy Howard 的核心理念："先跑通整个流程，再深入细节"。所以我们不会先讲一堆理论，而是直接动手！下一节我们就开始写 SQL。
            </InfoBox>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">DuckDB vs 其他工具</h3>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">特性</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">DuckDB 🦆</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">SQLite</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">MySQL/PostgreSQL</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">安装配置</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">零配置 ✓</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">零配置 ✓</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-amber-600">需要服务器</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">分析性能</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">极快 🚀</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-amber-600">一般</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">快</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2">直接查询文件</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-green-600">CSV/Parquet/JSON ✓</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-red-600">✗</td>
                    <td className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-red-600">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">本教程的学习目标</h3>

            <Paragraph {...noteProps('p3')}>
              我们将使用<strong>本体论（Ontology）</strong>作为示例场景——这是一个关于"概念"和"关系"的知识体系。比如："狗"是一种"哺乳动物"，"哺乳动物"是一种"动物"。通过构建这个知识库，你会掌握 SQL 的核心操作。
            </Paragraph>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 my-6 border border-amber-200 dark:border-amber-700">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">📚 你将学会：</h4>
              <ul className="space-y-2 text-amber-700 dark:text-amber-400">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 创建数据库和表结构</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 完整的 CRUD 操作（增删改查）</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> JOIN、子查询、CTE 等进阶技巧</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 视图的创建和管理</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 高级聚合与模式匹配</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 性能优化与安全</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 12个实战项目</li>
              </ul>
            </div>

            <InfoBox type="experiment" title="准备好了吗？" {...noteProps('box2')}>
              点击右下角的"下一节"按钮，我们开始 5 分钟快速上手！
            </InfoBox>
          </div>
        );

      case '5min-start':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">5分钟快速上手</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"先跑起来，再回头理解"</p>
            
            <Paragraph {...noteProps('p1')}>
              不废话，直接开始！我们用 3 个步骤完成一个完整的"本体论知识库"：建表 → 插数据 → 查询。
            </Paragraph>

            <InfoBox type="tip" title="在线试用" {...noteProps('box1')}>
              你可以在 <a href="https://shell.duckdb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">shell.duckdb.org</a> 直接运行这些代码，无需安装任何东西！
            </InfoBox>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Step 1: 创建表</h3>
            
            <CodeBlock
              title="创建概念表"
              code={`-- 创建存储"概念"的表
CREATE TABLE concepts (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    parent_id INTEGER
);

-- 创建存储"关系类型"的表  
CREATE TABLE relations (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Step 2: 插入数据</h3>

            <CodeBlock
              title="插入本体论数据"
              code={`-- 插入概念层级
INSERT INTO concepts VALUES 
    (1, 'Entity', '万物之源', NULL),
    (2, 'Living Thing', '有生命的', 1),
    (3, 'Animal', '动物界', 2),
    (4, 'Mammal', '哺乳动物', 3),
    (5, 'Dog', '人类好朋友', 4),
    (6, 'Cat', '神秘的生物', 4);

-- 插入关系类型
INSERT INTO relations VALUES 
    (1, 'is-a'),
    (2, 'has-part');`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Step 3: 查询数据</h3>

            <CodeBlock
              title="查询概念层级"
              code={`-- 查询所有哺乳动物（parent_id = 4 表示父概念是 Mammal）
SELECT name, description 
FROM concepts 
WHERE parent_id = 4;

-- 结果：
-- ┌──────┬────────────────┐
-- │ name │  description   │
-- ├──────┼────────────────┤
-- │ Dog  │ 人类好朋友      │
-- │ Cat  │ 神秘的生物      │
-- └──────┴────────────────┘`}
              {...noteProps('code3')}
            />

            <CodeBlock
              title="查询概念及其父概念"
              code={`-- 使用 JOIN 查询每个概念的父概念名称
SELECT 
    c.name AS concept,
    p.name AS parent
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id;

-- 结果：
-- ┌──────────────┬──────────────┐
-- │   concept    │    parent    │
-- ├──────────────┼──────────────┤
-- │ Entity       │ NULL         │
-- │ Living Thing │ Entity       │
-- │ Animal       │ Living Thing │
-- │ Mammal       │ Animal       │
-- │ Dog          │ Mammal       │
-- │ Cat          │ Mammal       │
-- └──────────────┴──────────────┘`}
              {...noteProps('code4')}
            />

            <InfoBox type="fastai" title="🎉 恭喜！你已经完成了第一个 DuckDB 程序" {...noteProps('box2')}>
              看到了吗？SQL 并不难！你刚才做了：
              <ul className="mt-2 ml-4 list-disc">
                <li><strong>CREATE TABLE</strong> - 创建表结构</li>
                <li><strong>INSERT INTO</strong> - 插入数据</li>
                <li><strong>SELECT ... FROM ... WHERE</strong> - 查询数据</li>
                <li><strong>JOIN</strong> - 连接多个表</li>
              </ul>
              <p className="mt-2">接下来，我们会深入每个知识点。但记住：你已经会用 DuckDB 了！</p>
            </InfoBox>
          </div>
        );

      case 'create-table':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">CREATE - 创建表</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"地基打好，房子才稳"</p>

            <Paragraph {...noteProps('p1')}>
              创建表是一切的起点。一个好的表结构设计，能让后续的开发事半功倍。我们来详细看看 CREATE TABLE 的各种用法。
            </Paragraph>

            <SQLFlowDiagram type="create" />

            <SQLExplainer
              sql={`CREATE TABLE concepts (
  id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR,
  parent_id INTEGER REFERENCES concepts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              explanations={[
                { code: 'CREATE TABLE concepts', explanation: '创建一个名为 concepts 的新表' },
                { code: 'id INTEGER PRIMARY KEY', explanation: '定义 id 列，类型为整数，作为主键（唯一标识每一行）', tip: '主键自动创建唯一索引' },
                { code: 'name VARCHAR NOT NULL', explanation: '定义 name 列，可变长字符串类型，NOT NULL 表示必填' },
                { code: 'description VARCHAR', explanation: '定义可选的描述列，允许为空' },
                { code: 'parent_id INTEGER REFERENCES concepts(id)', explanation: '自引用外键，指向同一表的 id，用于构建层级结构' },
                { code: 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', explanation: '创建时间列，默认值为当前时间戳' },
              ]}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本语法</h3>

            <CodeBlock
              title="CREATE TABLE 语法"
              code={`CREATE TABLE 表名 (
    列名1 数据类型 [约束],
    列名2 数据类型 [约束],
    ...
    [表级约束]
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">完整的本体论数据模型</h3>

            <Paragraph {...noteProps('p2')}>
              让我们创建一个更完整的本体论数据库，包含概念、关系、关系实例和属性四张表：
            </Paragraph>

            <CodeBlock
              title="1. concepts 表 - 存储概念"
              code={`CREATE TABLE concepts (
    id INTEGER PRIMARY KEY,           -- 主键：唯一标识
    name VARCHAR NOT NULL,            -- 必填：概念名称
    description VARCHAR,              -- 可选：概念描述
    parent_id INTEGER,                -- 父概念ID（自引用）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束：确保 parent_id 引用有效的概念
    FOREIGN KEY (parent_id) REFERENCES concepts(id)
);

-- 添加注释（方便维护）
COMMENT ON TABLE concepts IS '本体论概念表';
COMMENT ON COLUMN concepts.parent_id IS '父概念，形成层级结构';`}
              {...noteProps('code2')}
            />

            <CodeBlock
              title="2. relations 表 - 存储关系类型"
              code={`CREATE TABLE relations (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,     -- 唯一：关系名称不重复
    description VARCHAR,
    is_symmetric BOOLEAN DEFAULT FALSE,   -- 是否对称（如 A=B 则 B=A）
    is_transitive BOOLEAN DEFAULT FALSE   -- 是否传递（如 A>B, B>C 则 A>C）
);`}
              {...noteProps('code3')}
            />

            <CodeBlock
              title="3. concept_relations 表 - 存储关系实例"
              code={`CREATE TABLE concept_relations (
    id INTEGER PRIMARY KEY,
    source_concept_id INTEGER NOT NULL,
    relation_id INTEGER NOT NULL,
    target_concept_id INTEGER NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 1.00,  -- 置信度 0.00-1.00
    
    FOREIGN KEY (source_concept_id) REFERENCES concepts(id),
    FOREIGN KEY (relation_id) REFERENCES relations(id),
    FOREIGN KEY (target_concept_id) REFERENCES concepts(id)
);

-- 创建索引提高查询性能
CREATE INDEX idx_source ON concept_relations(source_concept_id);
CREATE INDEX idx_target ON concept_relations(target_concept_id);`}
              {...noteProps('code4')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">常用数据类型</h3>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">类型</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">说明</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">示例</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">INTEGER</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">整数</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">42, -17</td></tr>
                  <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">VARCHAR</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">可变长字符串</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">'hello'</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">BOOLEAN</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">布尔值</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">TRUE, FALSE</td></tr>
                  <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">TIMESTAMP</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">时间戳</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">2024-01-01 12:00:00</td></tr>
                </tbody>
              </table>
            </div>

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              打开 <a href="https://shell.duckdb.org/" target="_blank" className="text-purple-600 dark:text-purple-400 underline">DuckDB 在线环境</a>，创建这四张表，然后用 <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">SHOW TABLES;</code> 查看结果！
            </InfoBox>
          </div>
        );

      case 'alter-table':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">ALTER - 修改表</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"需求总在变，表结构也要跟着变"</p>

            <Paragraph {...noteProps('p1')}>
              表创建好了，但需求变了怎么办？用 ALTER TABLE 可以添加列、删除列、重命名等。这比删除重建要优雅得多！
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">添加列</h3>

            <CodeBlock
              title="ADD COLUMN"
              code={`-- 添加单个列
ALTER TABLE concepts ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- 添加多个列
ALTER TABLE concepts 
ADD COLUMN updated_at TIMESTAMP,
ADD COLUMN version INTEGER DEFAULT 1;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">删除列</h3>

            <CodeBlock
              title="DROP COLUMN"
              code={`-- 删除列
ALTER TABLE concepts DROP COLUMN version;

-- 删除时如果列不存在，加 IF EXISTS 避免报错
ALTER TABLE concepts DROP COLUMN IF EXISTS temp_column;`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">重命名</h3>

            <CodeBlock
              title="RENAME"
              code={`-- 重命名表
ALTER TABLE concepts RENAME TO ontology_concepts;

-- 重命名列
ALTER TABLE concepts RENAME COLUMN description TO desc;`}
              {...noteProps('code3')}
            />

            <InfoBox type="warning" title="注意事项" {...noteProps('box1')}>
              <ul className="list-disc ml-4 space-y-1">
                <li>添加有 NOT NULL 约束的列时，必须指定 DEFAULT 值</li>
                <li>删除被外键引用的列会失败</li>
                <li>修改类型时确保数据兼容</li>
              </ul>
            </InfoBox>
          </div>
        );

      case 'drop-table':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">DROP - 删除表</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"有始有终，也要知道如何结束"</p>

            <InfoBox type="warning" title="⚠️ 危险操作" {...noteProps('box1')}>
              DROP TABLE 是<strong>不可逆的</strong>！执行前请三思，并确保有备份。
            </InfoBox>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基本用法</h3>

            <CodeBlock
              title="DROP TABLE"
              code={`-- 删除表（如果表不存在会报错）
DROP TABLE concepts_backup;

-- 安全删除（表不存在也不报错）
DROP TABLE IF EXISTS concepts_backup;

-- 级联删除（连同依赖的对象一起删除）
DROP TABLE concepts CASCADE;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">清空表 vs 删除表</h3>

            <CodeBlock
              title="TRUNCATE vs DROP"
              code={`-- TRUNCATE：清空数据，保留表结构
TRUNCATE TABLE properties;

-- DROP：删除表结构和所有数据
DROP TABLE properties;

-- DELETE：逐行删除（可以回滚，但慢）
DELETE FROM properties;`}
              {...noteProps('code2')}
            />

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">操作</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">保留结构</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">可回滚</th>
                    <th className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-slate-800 dark:text-slate-200">速度</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">DROP</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">❌</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">❌</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">最快</td></tr>
                  <tr className="bg-slate-50 dark:bg-slate-800"><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">TRUNCATE</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">✅</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">❌</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">快</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-600 px-4 py-2 font-mono">DELETE</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">✅</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">✅</td><td className="border border-slate-200 dark:border-slate-600 px-4 py-2">慢</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'insert':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">INSERT - 插入数据</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"空有结构没有数据，就像有房子没有家具"</p>

            <SQLFlowDiagram type="insert" />

            <SQLExplainer
              sql={`INSERT INTO concepts 
  (id, name, description, parent_id) 
VALUES 
  (1, 'Entity', '万物之源', NULL),
  (2, 'Animal', '动物界', 1);`}
              explanations={[
                { code: 'INSERT INTO concepts', explanation: '指定要插入数据的目标表名', tip: '表必须已存在，否则会报错' },
                { code: '(id, name, description, parent_id)', explanation: '明确指定要插入的列名，这是推荐做法，比隐式更清晰安全' },
                { code: 'VALUES', explanation: '标记后面是要插入的数据值' },
                { code: "(1, 'Entity', '万物之源', NULL)", explanation: '第一行数据：根概念 Entity，parent_id 为 NULL 表示没有父节点' },
                { code: "(2, 'Animal', '动物界', 1)", explanation: '第二行数据：Animal 概念，parent_id=1 表示父节点是 Entity' },
              ]}
            />

            <DataFlowAnimation type="insert" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-4">单行插入</h3>

            <CodeBlock
              title="INSERT INTO ... VALUES"
              code={`-- 插入所有列（值的顺序要和列定义一致）
INSERT INTO concepts VALUES (1, 'Entity', '万物之源', NULL, CURRENT_TIMESTAMP);

-- 插入指定列（推荐，更清晰）
INSERT INTO concepts (id, name, description, parent_id) 
VALUES (2, 'Living Thing', '有生命的实体', 1);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">批量插入</h3>

            <CodeBlock
              title="批量 INSERT"
              code={`-- 一次插入多行（效率更高）
INSERT INTO concepts (id, name, description, parent_id) VALUES
    (3, 'Animal', '动物界', 2),
    (4, 'Mammal', '哺乳动物', 3),
    (5, 'Bird', '鸟纲', 3),
    (6, 'Dog', '犬科', 4),
    (7, 'Cat', '猫科', 4),
    (8, 'Eagle', '鹰', 5);`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">从查询插入</h3>

            <CodeBlock
              title="INSERT INTO ... SELECT"
              code={`-- 从查询结果插入
INSERT INTO concepts_backup
SELECT * FROM concepts WHERE parent_id IS NOT NULL;

-- 带转换的插入
INSERT INTO properties (id, concept_id, property_name, property_value)
SELECT 
    ROW_NUMBER() OVER (),  -- 自动生成 ID
    id,
    'category',
    CASE WHEN parent_id IS NULL THEN 'root' ELSE 'child' END
FROM concepts;`}
              {...noteProps('code3')}
            />

            <InfoBox type="tip" title="性能提示" {...noteProps('box1')}>
              批量插入比逐行插入快很多！如果要插入大量数据，尽量使用一条 INSERT 语句插入多行。
            </InfoBox>
          </div>
        );

      case 'select':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">SELECT - 查询数据</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SQL 的灵魂，80% 的时间在写 SELECT"</p>

            <Paragraph {...noteProps('p1')}>
              SELECT 是 SQL 中最常用、也是最强大的语句。从简单的全表查询到复杂的多表分析，都要用到它。让我们从基础开始，一步步深入。
            </Paragraph>

            <SQLFlowDiagram type="select" />

            <SQLExplainer
              sql={`SELECT c.name, p.name AS parent
FROM concepts c
LEFT JOIN concepts p 
  ON c.parent_id = p.id
WHERE c.parent_id IS NOT NULL
ORDER BY c.name
LIMIT 5;`}
              explanations={[
                { code: 'SELECT c.name, p.name AS parent', explanation: '选择要返回的列：子概念名称和父概念名称（别名为 parent）', tip: '只选择需要的列可以提高性能' },
                { code: 'FROM concepts c', explanation: '指定主表为 concepts，并给它起别名 c，方便后续引用' },
                { code: 'LEFT JOIN concepts p ON c.parent_id = p.id', explanation: '左连接同一张表（自连接），通过 parent_id 关联父概念。LEFT JOIN 保证即使没有父概念也会返回' },
                { code: 'WHERE c.parent_id IS NOT NULL', explanation: '过滤掉根节点（parent_id 为 NULL 的记录）' },
                { code: 'ORDER BY c.name', explanation: '按概念名称字母顺序排序结果' },
                { code: 'LIMIT 5', explanation: '只返回前 5 条记录，用于分页或限制结果集大小' },
              ]}
            />

            <DataFlowAnimation type="filter" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基础查询</h3>

            <CodeBlock
              title="SELECT 基础"
              code={`-- 查询所有列
SELECT * FROM concepts;

-- 查询指定列
SELECT name, description FROM concepts;

-- 使用别名
SELECT 
    name AS 概念名称,
    description AS 描述
FROM concepts;

-- 去重
SELECT DISTINCT parent_id FROM concepts;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">WHERE 条件过滤</h3>

            <CodeBlock
              title="WHERE 子句"
              code={`-- 等值条件
SELECT * FROM concepts WHERE name = 'Animal';

-- 比较运算
SELECT * FROM concepts WHERE id > 3;

-- NULL 判断（注意：不能用 = NULL）
SELECT * FROM concepts WHERE parent_id IS NULL;
SELECT * FROM concepts WHERE parent_id IS NOT NULL;

-- 模糊匹配
SELECT * FROM concepts WHERE name LIKE '%al%';    -- 包含 'al'

-- 范围查询
SELECT * FROM concepts WHERE id BETWEEN 2 AND 5;
SELECT * FROM concepts WHERE id IN (1, 3, 5);

-- 组合条件
SELECT * FROM concepts 
WHERE parent_id = 3 AND name LIKE '%al%';`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">排序和分页</h3>

            <CodeBlock
              title="ORDER BY 和 LIMIT"
              code={`-- 排序
SELECT * FROM concepts ORDER BY name ASC;    -- 升序
SELECT * FROM concepts ORDER BY id DESC;     -- 降序

-- 多列排序
SELECT * FROM concepts ORDER BY parent_id, name;

-- 分页
SELECT * FROM concepts ORDER BY id LIMIT 5;           -- 前 5 条
SELECT * FROM concepts ORDER BY id LIMIT 5 OFFSET 5;  -- 第 6-10 条`}
              {...noteProps('code3')}
            />

            <InfoBox type="experiment" title="试一试" {...noteProps('box1')}>
              查询所有哺乳动物的子概念，按名称排序，只取前 2 条。
              <details className="mt-2">
                <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
                <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm">
                  SELECT * FROM concepts WHERE parent_id = 4 ORDER BY name LIMIT 2;
                </code>
              </details>
            </InfoBox>
          </div>
        );

      case 'update':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">UPDATE - 更新数据</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据不是一成不变的，世界在变化"</p>

            <SQLFlowDiagram type="update" />

            <SQLExplainer
              sql={`UPDATE concepts 
SET 
  description = '所有动物的总称',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'Animal';`}
              explanations={[
                { code: 'UPDATE concepts', explanation: '指定要更新的目标表', tip: '更新前务必先用 SELECT 验证 WHERE 条件！' },
                { code: 'SET', explanation: '标记后面是要更新的列和新值' },
                { code: "description = '所有动物的总称'", explanation: '将 description 列的值更新为新的描述文本' },
                { code: 'updated_at = CURRENT_TIMESTAMP', explanation: '同时更新 updated_at 列为当前时间戳，用于追踪修改时间' },
                { code: "WHERE name = 'Animal'", explanation: '只更新 name 为 Animal 的记录。如果省略 WHERE，会更新所有行！' },
              ]}
            />

            <InfoBox type="warning" title="先 SELECT 再 UPDATE" {...noteProps('box1')}>
              在执行 UPDATE 前，<strong>一定要先用 SELECT 验证 WHERE 条件</strong>，确保只会影响目标数据！
            </InfoBox>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基础更新</h3>

            <CodeBlock
              title="UPDATE ... SET ... WHERE"
              code={`-- 更新单列
UPDATE concepts 
SET description = '所有动物的总称' 
WHERE name = 'Animal';

-- 更新多列
UPDATE concepts 
SET 
    name = 'Domestic Dog',
    description = '家养的犬类'
WHERE id = 6;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">使用表达式</h3>

            <CodeBlock
              title="表达式更新"
              code={`-- 字符串拼接
UPDATE concepts 
SET description = description || ' (已更新)'
WHERE id = 1;

-- CASE 表达式
UPDATE concepts
SET description = CASE 
    WHEN parent_id IS NULL THEN '根概念'
    WHEN parent_id = 1 THEN '一级概念'
    ELSE '子概念'
END;`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">事务保护</h3>

            <CodeBlock
              title="使用事务"
              code={`-- 开启事务
BEGIN TRANSACTION;

-- 执行更新
UPDATE concepts SET name = 'Test' WHERE id = 1;

-- 检查结果
SELECT * FROM concepts WHERE id = 1;

-- 确认没问题就提交，否则回滚
COMMIT;       -- 确认提交
-- ROLLBACK;  -- 或者取消更改`}
              {...noteProps('code3')}
            />
          </div>
        );

      case 'delete':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">DELETE - 删除数据</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"删除容易，恢复难"</p>

            <SQLFlowDiagram type="delete" />

            <SQLExplainer
              sql={`-- 安全删除流程
-- 1. 先查询确认
SELECT * FROM concepts WHERE id = 8;

-- 2. 确认无误后删除
DELETE FROM concepts WHERE id = 8;`}
              explanations={[
                { code: '-- 1. 先查询确认', explanation: '删除前的黄金法则：先用 SELECT 查看将要删除的数据', tip: '永远不要跳过这一步！' },
                { code: 'SELECT * FROM concepts WHERE id = 8', explanation: '用完全相同的 WHERE 条件查询，确认这就是你要删除的记录' },
                { code: '-- 2. 确认无误后删除', explanation: '只有确认查询结果正确后，才执行删除操作' },
                { code: 'DELETE FROM concepts', explanation: '指定要删除数据的目标表' },
                { code: 'WHERE id = 8', explanation: '与 SELECT 使用完全相同的条件，确保只删除目标记录' },
              ]}
            />

            <InfoBox type="warning" title="🚨 删除前必看" {...noteProps('box1')}>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>永远先 SELECT</strong> 验证 WHERE 条件</li>
                <li>考虑使用<strong>软删除</strong>代替硬删除</li>
                <li>重要数据先<strong>备份</strong></li>
              </ul>
            </InfoBox>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">基础删除</h3>

            <CodeBlock
              title="DELETE FROM"
              code={`-- 删除指定记录
DELETE FROM concepts WHERE id = 8;

-- 删除多条记录
DELETE FROM concepts WHERE id IN (7, 8);

-- 删除所有符合条件的记录
DELETE FROM properties WHERE concept_id NOT IN (SELECT id FROM concepts);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">软删除模式（推荐）</h3>

            <CodeBlock
              title="软删除"
              code={`-- 1. 添加软删除字段
ALTER TABLE concepts ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE concepts ADD COLUMN deleted_at TIMESTAMP;

-- 2. 软删除（标记为已删除，而非真正删除）
UPDATE concepts 
SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
WHERE id = 8;

-- 3. 查询时排除已删除记录
SELECT * FROM concepts WHERE is_deleted = FALSE;

-- 4. 需要时可以恢复
UPDATE concepts 
SET is_deleted = FALSE, deleted_at = NULL
WHERE id = 8;`}
              {...noteProps('code2')}
            />

            <InfoBox type="tip" title="为什么推荐软删除？" {...noteProps('box2')}>
              <ul className="list-disc ml-4">
                <li>数据可恢复，避免误删损失</li>
                <li>保留历史记录，便于审计</li>
                <li>关联数据不会断裂</li>
              </ul>
            </InfoBox>
          </div>
        );

      case 'join':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">JOIN - 连接查询</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据分散在多个表？JOIN 帮你合在一起"</p>

            <Paragraph {...noteProps('p1')}>
              本体论的精髓在于"关系"。概念之间通过关系连接，形成知识网络。要查询这些关系，就需要 JOIN。JOIN 是 SQL 中最重要也是最复杂的操作之一，理解 JOIN 是掌握 SQL 的关键。
            </Paragraph>

            <SQLFlowDiagram type="join" />

            <DataFlowAnimation type="join" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JOIN 类型详解</h3>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">INNER JOIN</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">只返回两表都匹配的行</p>
                <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">A ∩ B</code>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">LEFT JOIN</h4>
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">返回左表所有行 + 右表匹配行</p>
                <code className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">A ∪ (A ∩ B)</code>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">RIGHT JOIN</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">返回右表所有行 + 左表匹配行</p>
                <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">B ∪ (A ∩ B)</code>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">FULL JOIN</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">返回两表所有行</p>
                <code className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded">A ∪ B</code>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JOIN 语法详解</h3>

            <SQLExplainer
              sql={`-- 标准 JOIN 语法
SELECT columns
FROM table1 t1
JOIN table2 t2 ON t1.column = t2.column;

-- 或者使用 WHERE（旧语法，不推荐）
SELECT columns
FROM table1 t1, table2 t2
WHERE t1.column = t2.column;`}
              explanations={[
                { code: 'FROM table1 t1', explanation: '主表，可以使用别名', tip: '别名让查询更清晰' },
                { code: 'JOIN table2 t2', explanation: '要连接的表，也可以使用别名', tip: '别名避免列名冲突' },
                { code: 'ON condition', explanation: '连接条件，指定如何匹配两表', tip: '通常是外键关系' },
                { code: 'WHERE vs ON', explanation: 'ON 用于连接条件，WHERE 用于过滤结果', tip: 'LEFT JOIN 中条件放在 ON 或 WHERE 行为不同' },
              ]}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实战：查询概念层级</h3>

            <CodeBlock
              title="自连接 - 查询父子关系"
              code={`-- 查询每个概念及其父概念名称
SELECT 
    c.name AS 概念,
    c.description AS 描述,
    p.name AS 父概念,
    c.id AS 概念ID,
    c.parent_id AS 父概念ID
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id
ORDER BY c.id;

-- 结果示例：
-- ┌──────────────┬────────────────┬──────────────┬──────────┬────────────┐
-- │     概念     │      描述       │    父概念    │ 概念ID   │ 父概念ID  │
-- ├──────────────┼────────────────┼──────────────┼──────────┼────────────┤
-- │ Entity       │ 万物之源        │ NULL         │ 1        │ NULL       │
-- │ Living Thing │ 有生命的实体    │ Entity       │ 2        │ 1          │
-- │ Animal       │ 动物界          │ Living Thing │ 3        │ 2          │
-- │ Dog          │ 犬科            │ Mammal       │ 4        │ 3          │
-- └──────────────┴────────────────┴──────────────┴──────────┴────────────┘`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">不同 JOIN 类型的对比</h3>

            <CodeBlock
              title="JOIN 类型对比示例"
              code={`-- 示例数据
-- users 表: user_id, name
-- orders 表: order_id, user_id, amount

-- INNER JOIN：只返回有订单的用户
SELECT u.name, COUNT(o.order_id) AS order_count
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;

-- LEFT JOIN：返回所有用户，无论是否有订单
SELECT u.name, COUNT(o.order_id) AS order_count
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;

-- RIGHT JOIN：返回所有订单，无论用户是否存在
SELECT u.name, o.order_id, o.amount
FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;

-- FULL JOIN：返回所有用户和所有订单
SELECT u.name, o.order_id, o.amount
FROM users u
FULL JOIN orders o ON u.user_id = o.user_id;`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">多表连接</h3>

            <CodeBlock
              title="三表及以上连接"
              code={`-- 用户、订单、产品信息关联查询
SELECT
    u.name AS 用户名,
    o.order_date AS 下单时间,
    p.name AS 产品名,
    oi.quantity AS 数量,
    oi.unit_price AS 单价,
    (oi.quantity * oi.unit_price) AS 小计
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC, u.name;

-- 统计每个用户的购买偏好
SELECT
    u.name AS 用户名,
    c.category_name AS 偏好类别,
    COUNT(*) AS 购买次数,
    SUM(oi.quantity * oi.unit_price) AS 总消费
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN categories c ON p.category_id = c.category_id
GROUP BY u.user_id, u.name, c.category_id, c.category_name
ORDER BY u.name, 购买次数 DESC;`}
              {...noteProps('code3')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JOIN 性能优化</h3>

            <InfoBox type="tip" title="JOIN 优化最佳实践" {...noteProps('box3')}>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>选择正确的 JOIN 类型：</strong> INNER JOIN 通常最快，FULL JOIN 最慢</li>
                <li><strong>索引连接列：</strong> 在连接条件列上建立索引</li>
                <li><strong>小表驱动大表：</strong> 将小表放在 JOIN 的左侧</li>
                <li><strong>避免笛卡尔积：</strong> 确保连接条件不缺失</li>
                <li><strong>使用 EXPLAIN：</strong> 分析查询执行计划</li>
              </ul>
            </InfoBox>

            <CodeBlock
              title="JOIN 查询分析"
              code={`-- 查看查询执行计划
EXPLAIN
SELECT u.name, COUNT(o.order_id)
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;

-- 添加索引优化
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_users_user_id ON users(user_id);

-- 对比索引前后的性能
.timer on
SELECT u.name, COUNT(o.order_id)
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;`}
              {...noteProps('code4')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <p className="font-semibold">任务 1：概念关系查询</p>
                <p>写一个查询显示所有概念的完整层级关系，包括父概念、子概念数量等信息。</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
                <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`SELECT
    c.name AS 概念,
    p.name AS 父概念,
    COUNT(child.id) AS 子概念数,
    MAX(child.id) AS 最新子概念ID
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id
LEFT JOIN concepts child ON child.parent_id = c.id
GROUP BY c.id, c.name, p.name
ORDER BY c.id;`}
                </code>
              </details>

                <p className="font-semibold">任务 2：不同 JOIN 类型的效果</p>
                <p>创建测试数据，展示 INNER JOIN、LEFT JOIN、RIGHT JOIN、FULL JOIN 的不同结果。</p>

                <p className="font-semibold">任务 3：多表关联分析</p>
                <p>设计一个包含用户、订单、产品、类别的复杂查询，分析用户购买行为。</p>
              </div>
            </InfoBox>
          </div>
        );

      case 'subquery':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">子查询与 CTE</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"查询中嵌套查询，威力翻倍"</p>

            <Paragraph {...noteProps('intro')}>
              子查询和公共表表达式（CTE）是 SQL 中最强大的特性之一。它们允许在一个查询中嵌套另一个查询，极大地扩展了 SQL 的表达能力和复杂查询处理能力。
            </Paragraph>

            <SQLFlowDiagram type="cte" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">子查询类型</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">标量子查询</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">返回单个值的子查询</p>
                <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">SELECT (SELECT MAX(id) FROM table)</code>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">列子查询</h4>
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">返回单列多行的子查询</p>
                <code className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">WHERE id IN (SELECT ...)</code>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">表子查询</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">返回多列多行的子查询</p>
                <code className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded">FROM (SELECT ...) AS sub</code>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">相关子查询</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">引用外层查询的子查询</p>
                <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">WHERE EXISTS (SELECT ...)</code>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">标量子查询</h3>

            <SQLExplainer
              sql={`-- 查询销售额高于平均水平的产品
SELECT product_name, sales_amount
FROM products
WHERE sales_amount > (SELECT AVG(sales_amount) FROM products);

-- 查询每个部门薪资最高的员工
SELECT department, employee_name, salary
FROM employees e1
WHERE salary = (
    SELECT MAX(salary)
    FROM employees e2
    WHERE e2.department = e1.department
);`}
              explanations={[
                { code: 'SELECT AVG(sales_amount) FROM products', explanation: '标量子查询返回单个值（平均销售额）', tip: '标量子查询必须确保只返回一行一列' },
                { code: 'WHERE sales_amount > (子查询)', explanation: '将标量子查询结果作为比较条件', tip: '标量子查询常用于比较操作' },
                { code: '相关子查询', explanation: '内层查询引用外层查询的列（如 e1.department）', tip: '相关子查询对每行外层记录都执行一次' },
              ]}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">EXISTS vs IN 性能对比</h3>

            <CodeBlock
              title="EXISTS 通常比 IN 更高效"
              code={`-- IN 子查询：先执行子查询，再进行匹配
SELECT * FROM orders o
WHERE o.customer_id IN (
    SELECT customer_id FROM customers
    WHERE region = 'East'
);

-- EXISTS：对每行检查是否存在，子查询可提前停止
SELECT * FROM orders o
WHERE EXISTS (
    SELECT 1 FROM customers c
    WHERE c.customer_id = o.customer_id
    AND c.region = 'East'
);

-- 对于大数据集，EXISTS 通常更快
-- 因为 EXISTS 可以在找到第一个匹配时就停止`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CTE（公共表表达式）</h3>

            <Paragraph {...noteProps('p1')}>
              CTE 用 <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">WITH</code> 语法定义临时结果集，让复杂查询更清晰、可复用。CTE 只在当前查询中有效。
            </Paragraph>

            <SQLExplainer
              sql={`WITH sales_summary AS (
    SELECT
        product_id,
        SUM(quantity) AS total_quantity,
        SUM(amount) AS total_amount,
        AVG(amount) AS avg_amount
    FROM sales
    WHERE sale_date >= '2024-01-01'
    GROUP BY product_id
),
product_info AS (
    SELECT
        product_id,
        product_name,
        category,
        unit_price
    FROM products
)
SELECT 
    p.product_name,
    p.category,
    s.total_quantity,
    s.total_amount,
    s.avg_amount,
    p.unit_price
FROM sales_summary s
JOIN product_info p ON s.product_id = p.product_id
ORDER BY s.total_amount DESC;`}
              explanations={[
                { code: 'WITH cte_name AS (SELECT ...)', explanation: '定义 CTE，指定名称和查询', tip: 'CTE 可以引用其他 CTE（按顺序）' },
                { code: '多个 CTE 用逗号分隔', explanation: '可以在同一个 WITH 子句中定义多个 CTE', tip: 'CTE 按定义顺序执行' },
                { code: 'CTE 在主查询后使用', explanation: 'CTE 定义后就可以像普通表一样在主查询中使用', tip: 'CTE 提高了查询的可读性和重用性' },
              ]}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归 CTE（重点！）</h3>

            <Paragraph {...noteProps('p2')}>
              递归 CTE 可以处理层级数据和树状结构，是处理本体论、组织架构、产品分类等层级关系的利器。
            </Paragraph>

            <CodeBlock
              title="递归查询完整层级路径"
              code={`-- 查询完整层级路径：从叶子节点到根节点
WITH RECURSIVE full_path AS (
    -- 基础情况：叶子节点（没有子概念的概念）
    SELECT
        id,
        name,
        parent_id,
        name AS path,
        0 AS level,
        id AS root_id
    FROM concepts
    WHERE id NOT IN (SELECT DISTINCT parent_id FROM concepts WHERE parent_id IS NOT NULL)
    
    UNION ALL
    
    -- 递归情况：向上追溯父概念
    SELECT
        c.id,
        c.name,
        c.parent_id,
        c.name || ' → ' || fp.path,
        fp.level + 1,
        fp.root_id
    FROM concepts c
    JOIN full_path fp ON c.id = fp.parent_id
)
SELECT
    root_id,
    path AS 完整层级路径,
    level AS 层级深度
FROM full_path
WHERE level = (SELECT MAX(level) FROM full_path fp2 WHERE fp2.root_id = full_path.root_id)
ORDER BY root_id;

-- 结果示例：
-- ┌─────────┬─────────────────────────────────────┬──────────┐
-- │ root_id │         完整层级路径                 │ 层级深度 │
-- ├─────────┼─────────────────────────────────────┼──────────┤
-- │ 1       │ Entity → Living Thing → Animal       │ 2        │
-- │ 2       │ Living Thing → Animal → Mammal       │ 2        │
-- └─────────┴─────────────────────────────────────┴──────────┘`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归 CTE 应用场景</h3>

            <CodeBlock
              title="组织架构树形查询"
              code={`-- 递归查询员工下属关系
WITH RECURSIVE employee_hierarchy AS (
    -- 起始员工（CEO）
    SELECT
        employee_id,
        manager_id,
        employee_name,
        0 AS level,
        employee_name AS hierarchy_path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 递归查找下属
    SELECT
        e.employee_id,
        e.manager_id,
        e.employee_name,
        eh.level + 1,
        eh.hierarchy_path || ' → ' || e.employee_name
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT
    hierarchy_path,
    level,
    employee_name
FROM employee_hierarchy
ORDER BY hierarchy_path;

-- 计算每个层级的员工数量
SELECT
    level,
    COUNT(*) AS employee_count,
    AVG(level) OVER () AS avg_level
FROM employee_hierarchy
GROUP BY level
ORDER BY level;`}
              {...noteProps('code3')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">子查询性能优化</h3>

            <InfoBox type="tip" title="子查询优化原则" {...noteProps('box1')}>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>EXISTS vs IN：</strong> 对于大数据集，EXISTS 通常更快</li>
                <li><strong>相关 vs 不相关：</strong> 不相关子查询只执行一次，更高效</li>
                <li><strong>标量子查询：</strong> 确保只返回单值，否则会报错</li>
                <li><strong>CTE 替代：</strong> 对于复杂子查询，考虑使用 CTE 提高可读性</li>
                <li><strong>物化 CTE：</strong> 在需要多次使用同一子查询结果时考虑物化</li>
              </ul>
            </InfoBox>

            <CodeBlock
              title="子查询重写为 JOIN"
              code={`-- 低效的子查询写法
SELECT product_name
FROM products p
WHERE p.category_id IN (
    SELECT category_id
    FROM categories
    WHERE category_name LIKE 'Electronics%'
);

-- 重写为 JOIN（通常更高效）
SELECT DISTINCT p.product_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE c.category_name LIKE 'Electronics%';

-- 对于 EXISTS，JOIN 重写可能更复杂但更高效
SELECT p.product_name
FROM products p
WHERE EXISTS (
    SELECT 1 FROM sales s
    WHERE s.product_id = p.product_id
    AND s.sale_date >= '2024-01-01'
);

-- 重写为 JOIN
SELECT DISTINCT p.product_name
FROM products p
JOIN sales s ON p.product_id = s.product_id
WHERE s.sale_date >= '2024-01-01';`}
              {...noteProps('code4')}
            />

            <InfoBox type="fastai" title="递归 CTE 的威力" {...noteProps('box2')}>
              递归 CTE 是处理层级数据的终极武器！从简单的家谱树到复杂的多级分类目录，从组织架构到产品 BOM（物料清单），递归 CTE 都能优雅处理。掌握递归 CTE，你的 SQL 查询能力将达到新高度。
            </InfoBox>

            <InfoBox type="experiment" title="动手练习" {...noteProps('box3')}>
              <div className="space-y-3">
                <p className="font-semibold">任务 1：复杂子查询练习</p>
                <p>写一个查询找出销售额超过部门平均水平的产品，使用相关子查询。</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
                  <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`SELECT p.product_name, p.sales_amount, c.category_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.sales_amount > (
    SELECT AVG(p2.sales_amount)
    FROM products p2
    WHERE p2.category_id = p.category_id
);`}
                  </code>
                </details>

                <p className="font-semibold">任务 2：递归 CTE 构建概念树</p>
                <p>使用递归 CTE 查询所有从根节点"Entity"开始的完整概念层级树。</p>

                <p className="font-semibold">任务 3：性能对比</p>
                <p>比较子查询、JOIN 和 CTE 三种写法的性能差异，分析在什么情况下哪种方法更优。</p>
              </div>
            </InfoBox>
          </div>
        );

      case 'aggregate':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">聚合与分组</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从个体到群体，看见全貌"</p>

            <DataFlowAnimation type="group" />

            <SQLExplainer
              sql={`SELECT 
  p.name AS 父概念,
  COUNT(c.id) AS 子概念数
FROM concepts c
JOIN concepts p ON c.parent_id = p.id
GROUP BY p.name
HAVING COUNT(c.id) > 1
ORDER BY 子概念数 DESC;`}
              explanations={[
                { code: 'SELECT p.name AS 父概念, COUNT(c.id) AS 子概念数', explanation: '选择父概念名称和子概念计数' },
                { code: 'FROM concepts c', explanation: '从 concepts 表开始，别名为 c（代表子概念）' },
                { code: 'JOIN concepts p ON c.parent_id = p.id', explanation: '自连接获取父概念信息' },
                { code: 'GROUP BY p.name', explanation: '按父概念名称分组，相同父概念的子概念会被归为一组', tip: 'SELECT 中非聚合列必须出现在 GROUP BY 中' },
                { code: 'HAVING COUNT(c.id) > 1', explanation: '过滤分组结果，只保留子概念数大于1的组', tip: 'HAVING 用于过滤分组后的结果，WHERE 用于过滤分组前的行' },
                { code: 'ORDER BY 子概念数 DESC', explanation: '按子概念数量降序排列' },
              ]}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">聚合函数</h3>

            <CodeBlock
              title="常用聚合函数"
              code={`-- COUNT：计数
SELECT COUNT(*) AS 概念总数 FROM concepts;

-- COUNT(DISTINCT)：去重计数
SELECT COUNT(DISTINCT parent_id) AS 父概念数 FROM concepts;

-- SUM、AVG、MAX、MIN
SELECT 
    COUNT(*) AS 总数,
    MAX(id) AS 最大ID,
    MIN(id) AS 最小ID
FROM concepts;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">GROUP BY 分组</h3>

            <CodeBlock
              title="分组统计"
              code={`-- 按父概念分组，统计子概念数量
SELECT 
    parent_id,
    COUNT(*) AS 子概念数
FROM concepts
WHERE parent_id IS NOT NULL
GROUP BY parent_id;

-- 加上父概念名称
SELECT 
    p.name AS 父概念,
    COUNT(c.id) AS 子概念数
FROM concepts c
JOIN concepts p ON c.parent_id = p.id
GROUP BY p.name
ORDER BY 子概念数 DESC;`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">HAVING 过滤分组</h3>

            <CodeBlock
              title="HAVING 子句"
              code={`-- 找出拥有超过 1 个子概念的父概念
SELECT 
    p.name AS 父概念,
    COUNT(c.id) AS 子概念数
FROM concepts c
JOIN concepts p ON c.parent_id = p.id
GROUP BY p.name
HAVING COUNT(c.id) > 1;

-- WHERE vs HAVING：
-- WHERE 在分组前过滤行
-- HAVING 在分组后过滤组`}
              {...noteProps('code3')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">高级聚合技巧</h3>

            <CodeBlock
              title="多维度聚合分析"
              code={`-- 多维度销售分析
SELECT
    region,
    product_category,
    EXTRACT(year FROM sale_date) AS year,
    COUNT(*) AS order_count,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_value,
    MIN(amount) AS min_order,
    MAX(amount) AS max_order,
    STDDEV(amount) AS sales_volatility
FROM sales
GROUP BY region, product_category, EXTRACT(year FROM sale_date)
ORDER BY region, product_category, year;

-- 分组统计中的条件聚合
SELECT
    customer_id,
    customer_name,
    COUNT(*) AS total_orders,
    SUM(CASE WHEN order_status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
    AVG(CASE WHEN order_status = 'completed' THEN amount END) AS avg_completed_order,
    SUM(amount) AS total_amount
FROM orders
GROUP BY customer_id, customer_name
HAVING COUNT(*) > 5;  -- 只显示有5个以上订单的客户`}
              {...noteProps('code4')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ROLLUP 和 CUBE</h3>

            <CodeBlock
              title="高级分组操作"
              code={`-- ROLLUP：生成小计和总计
SELECT
    region,
    product_category,
    SUM(sales_amount) AS total_sales
FROM sales
GROUP BY ROLLUP (region, product_category)
ORDER BY region, product_category;

-- 结果包含：
-- 1. 详细数据：按地区+产品类别分组
-- 2. 小计：按地区分组（产品类别为NULL）
-- 3. 总计：所有数据汇总（地区和产品类别都为NULL）

-- CUBE：生成所有可能的分组组合
SELECT
    region,
    product_category,
    quarter,
    SUM(sales_amount) AS total_sales
FROM sales
GROUP BY CUBE (region, product_category, quarter);

-- GROUPING 函数标识汇总级别
SELECT
    COALESCE(region, '总计') AS region,
    COALESCE(product_category, '所有类别') AS category,
    SUM(sales_amount) AS total_sales,
    GROUPING(region) AS region_grouping,
    GROUPING(product_category) AS category_grouping
FROM sales
GROUP BY ROLLUP (region, product_category);`}
              {...noteProps('code5')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">聚合函数性能优化</h3>

            <InfoBox type="tip" title="聚合查询优化" {...noteProps('box1')}>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>索引利用：</strong> 在分组列上建立索引</li>
                <li><strong>预聚合：</strong> 考虑物化视图存储常用聚合结果</li>
                <li><strong>分区表：</strong> 对大表按时间或范围分区</li>
                <li><strong>并行处理：</strong> 大数据集可利用多核并行聚合</li>
                <li><strong>增量更新：</strong> 只重新计算变化的数据</li>
              </ul>
            </InfoBox>

            <CodeBlock
              title="聚合查询优化示例"
              code={`-- 优化前：全表扫描
SELECT region, SUM(amount) FROM sales GROUP BY region;

-- 优化后：使用索引
CREATE INDEX idx_sales_region ON sales(region);
SELECT region, SUM(amount) FROM sales GROUP BY region;

-- 对于大数据集，考虑预计算
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT
    DATE_TRUNC('day', sale_date) AS sale_day,
    region,
    product_category,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM sales
GROUP BY DATE_TRUNC('day', sale_date), region, product_category;

-- 查询预计算结果
SELECT * FROM daily_sales_summary
WHERE sale_day >= '2024-01-01'
ORDER BY total_amount DESC;`}
              {...noteProps('code6')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
              <div className="space-y-3">
                <p className="font-semibold">任务 1：复杂聚合分析</p>
                <p>创建一个查询分析每个客户的购买行为，包括总消费、平均订单金额、购买频次等指标。</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
                  <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`SELECT
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.amount) AS total_spent,
    AVG(o.amount) AS avg_order_value,
    MIN(o.amount) AS min_order,
    MAX(o.amount) AS max_order,
    STDDEV(o.amount) AS order_volatility,
    COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) AS active_months
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) > 0;`}
                  </code>
                </details>

                <p className="font-semibold">任务 2：使用 ROLLUP 生成报表</p>
                <p>使用 ROLLUP 创建一个包含小计和总计的销售报表，按地区和产品类别分组。</p>

                <p className="font-semibold">任务 3：性能优化实践</p>
                <p>对比有索引和无索引情况下聚合查询的性能差异，分析执行计划。</p>
              </div>
            </InfoBox>
          </div>
        );

      case 'view-basics':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">视图基础</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"复杂查询只写一次，到处可用"</p>

            <Paragraph {...noteProps('p1')}>
              视图（View）是保存的查询语句，像一个"虚拟表"。每次访问视图时，数据库会自动执行其定义的查询。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">创建视图</h3>

            <CodeBlock
              title="CREATE VIEW"
              code={`-- 创建概念层级视图
CREATE VIEW concept_hierarchy AS
SELECT 
    c.id,
    c.name AS 概念,
    c.description AS 描述,
    p.name AS 父概念
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id;

-- 使用视图（就像普通表一样）
SELECT * FROM concept_hierarchy;
SELECT * FROM concept_hierarchy WHERE 父概念 = 'Mammal';`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">视图的优点</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">✅ 简化复杂查询</h4>
                <p className="text-sm text-green-600 dark:text-green-400">把复杂 JOIN 封装成简单名称</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">✅ 代码复用</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">一处定义，多处使用</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">✅ 安全控制</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">只暴露需要的列，隐藏敏感数据</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">✅ 逻辑抽象</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">表结构改变时只需改视图</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">管理视图</h3>

            <CodeBlock
              title="视图管理"
              code={`-- 查看所有视图
SELECT * FROM duckdb_views();

-- 修改视图
CREATE OR REPLACE VIEW concept_hierarchy AS
SELECT id, name, description FROM concepts;

-- 删除视图
DROP VIEW IF EXISTS concept_hierarchy;`}
              {...noteProps('code2')}
            />
          </div>
        );

      case 'view-advanced':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">高级视图</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"视图不仅仅是封装，更是设计哲学"</p>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">聚合视图</h3>

            <CodeBlock
              title="统计视图"
              code={`-- 概念统计视图
CREATE VIEW concept_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(DISTINCT child.id) AS child_count,
    COUNT(DISTINCT p.id) AS property_count
FROM concepts c
LEFT JOIN concepts child ON child.parent_id = c.id
LEFT JOIN properties p ON p.concept_id = c.id
GROUP BY c.id, c.name;

-- 使用
SELECT * FROM concept_stats WHERE child_count > 0;`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归视图</h3>

            <CodeBlock
              title="层级路径视图"
              code={`-- 显示完整层级路径的视图
CREATE VIEW concept_paths AS
WITH RECURSIVE paths AS (
    SELECT id, name, parent_id, name AS full_path, 0 AS depth
    FROM concepts WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id, 
           p.full_path || ' → ' || c.name, 
           p.depth + 1
    FROM concepts c
    JOIN paths p ON c.parent_id = p.id
)
SELECT id, name, full_path, depth FROM paths;

-- 使用
SELECT * FROM concept_paths ORDER BY full_path;`}
              {...noteProps('code2')}
            />

            <InfoBox type="tip" title="视图最佳实践" {...noteProps('box1')}>
              <ul className="list-disc ml-4 space-y-1">
                <li>视图名称要清晰表达用途</li>
                <li>复杂业务逻辑适合用视图封装</li>
                <li>性能敏感场景考虑创建物理表</li>
                <li>添加注释说明视图用途</li>
              </ul>
            </InfoBox>
          </div>
        );

      case 'window-functions':
        return (
          <WindowFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'import-csv':
        return (
          <ImportCSVSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'import-json':
        return (
          <ImportJSONSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'export-data':
        return (
          <ExportDataSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'indexing':
        return (
          <IndexingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'query-optimization':
        return (
          <QueryOptimizationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      // 事务处理模块 - 独立章节
      case 'transaction-basics':
        return (
          <TransactionBasicsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'acid-properties':
        return (
          <AcidPropertiesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'isolation-levels':
        return (
          <IsolationLevelsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'concurrency-problems':
        return (
          <ConcurrencyProblemsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'savepoints-nested':
        return (
          <SavepointsNestedSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'transaction-patterns':
        return (
          <TransactionPatternsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'real-world-examples':
        return (
          <RealWorldExamplesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'performance-tuning':
        return (
          <PerformanceTuningSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'string-functions':
        return (
          <StringFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'datetime-functions':
        return (
          <DateTimeFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'conditional':
        return (
          <ConditionalExpressionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-types':
        return (
          <DataTypesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'pattern-matching':
        return (
          <PatternMatchingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'advanced-aggregation':
        return (
          <AdvancedAggregationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'recursive':
        return (
          <RecursiveSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'pivot':
        return (
          <PivotSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'set-operations':
        return (
          <SetOperationsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'math-stats-functions':
        return (
          <MathStatsFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'type-conversion':
        return (
          <TypeConversionSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'regex-functions':
        return (
          <RegexFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'array-struct':
        return (
          <ArrayStructSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'null-handling':
        return (
          <NullHandlingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'spatial-functions':
        return (
          <SpatialFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'sequence-generation':
        return (
          <SequenceGenerationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'list-functions':
        return (
          <ListFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'crypto-functions':
        return (
          <CryptoFunctionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'external-sources':
        return (
          <ExternalSourcesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'incremental-processing':
        return (
          <IncrementalProcessingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'streaming-processing':
        return (
          <StreamingProcessingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'delta-lake':
        return (
          <DeltaLakeSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'materialized-views':
        return (
          <MaterializedViewsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'dynamic-views':
        return (
          <DynamicViewsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'user-permissions':
        return (
          <UserPermissionsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'encryption-masking':
        return (
          <EncryptionMaskingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'audit-logs':
        return (
          <AuditLogsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'row-level-security':
        return (
          <RowLevelSecuritySection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'column-level-security':
        return (
          <ColumnLevelSecuritySection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'query-plans':
        return (
          <QueryPlansSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'memory-caching':
        return (
          <MemoryCachingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'parallel':
        return (
          <ParallelProcessingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'statistics':
        return (
          <StatisticsInfoSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'partitioning':
        return (
          <PartitioningSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'vectorization':
        return (
          <VectorizationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'extensions-plugins':
        return (
          <ExtensionsPluginsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'best-practices':
        return (
          <BestPracticesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'migration':
        return (
          <MigrationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'high-availability':
        return (
          <HighAvailabilitySection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-warehouse':
        return (
          <DataWarehouseSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-analysis':
        return (
          <DataAnalysisSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'api-integration':
        return (
          <ApiIntegrationSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'time-series':
        return (
          <TimeSeriesSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'ml-preprocessing':
        return (
          <MlPreprocessingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'realtime-dashboard':
        return (
          <RealtimeDashboardSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'log-analysis':
        return (
          <LogAnalysisSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'recommendation-system':
        return (
          <RecommendationSystemSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'graph-analysis':
        return (
          <GraphAnalysisSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-lineage':
        return (
          <DataLineageSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-quality':
        return (
          <DataQualitySection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'advanced-analytics':
        return (
          <AdvancedAnalyticsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'lateral-join':
        return (
          <LateralJoinSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'qualify':
        return (
          <QualifySection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'sampling':
        return (
          <SamplingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'fulltext-search':
        return (
          <FulltextSearchSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'approximate-computing':
        return (
          <ApproximateComputingSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'final-project':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🏆 综合练习</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"学以致用，知行合一"</p>

            <Paragraph {...noteProps('p1')}>
              恭喜你完成了所有章节的学习！现在，让我们通过一个综合练习来巩固所学知识。
            </Paragraph>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 my-6 border border-indigo-200 dark:border-indigo-700">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4">🎯 任务：构建一个完整的知识库系统</h3>

              <div className="space-y-4 text-indigo-700 dark:text-indigo-400">
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">任务 1：创建表结构</h4>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>创建 concepts 表（支持层级）</li>
                    <li>创建 relations 表（关系类型）</li>
                    <li>创建 concept_relations 表（关系实例）</li>
                  </ul>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">任务 2：填充数据</h4>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>创建一个至少 3 层的概念层级</li>
                    <li>定义至少 3 种关系类型</li>
                  </ul>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">任务 3：查询与视图</h4>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>写一个递归查询显示完整层级</li>
                    <li>创建一个统计视图</li>
                  </ul>
                </div>
              </div>
            </div>

            <CodeBlock
              title="参考实现"
              code={`-- ========================================
-- 完整实现代码
-- ========================================

-- 1. 创建表
CREATE TABLE concepts (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id INTEGER REFERENCES concepts(id)
);

CREATE TABLE relations (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
);

-- 2. 填充数据
INSERT INTO concepts VALUES
    (1, 'Entity', NULL),
    (2, 'Living', 1),
    (3, 'Animal', 2),
    (4, 'Mammal', 3),
    (5, 'Dog', 4);

INSERT INTO relations VALUES
    (1, 'is-a'),
    (2, 'has-part');

-- 3. 递归查询
WITH RECURSIVE h AS (
    SELECT id, name, name AS path, 0 AS level
    FROM concepts WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, h.path || ' > ' || c.name, h.level + 1
    FROM concepts c JOIN h ON c.parent_id = h.id
)
SELECT * FROM h ORDER BY path;`}
              {...noteProps('code1')}
            />

            <InfoBox type="fastai" title="🎓 学习完成！" {...noteProps('box1')}>
              <p className="mb-2">你已经掌握了 DuckDB 的核心操作：</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>✅ 创建、修改、删除表</li>
                <li>✅ 完整的 CRUD 操作</li>
                <li>✅ JOIN、子查询、递归 CTE</li>
                <li>✅ 视图的创建与管理</li>
                <li>✅ 高级聚合与模式匹配</li>
              </ul>
              <p className="mt-3">继续探索：<a href="https://duckdb.org/docs/" target="_blank" className="text-pink-600 dark:text-pink-400 underline">DuckDB 官方文档</a></p>
            </InfoBox>

            <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-300 dark:border-amber-700 text-center">
              <span className="text-4xl">🦆</span>
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-2">Happy Quacking!</h3>
              <p className="text-amber-700 dark:text-amber-400 mt-1">愿 DuckDB 助你在数据分析的道路上越走越远</p>
            </div>
          </div>
        );

      case 'distributed-concepts':
        return (
          <DistributedConceptsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'duckdb-clusters':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">DuckDB 集群部署</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"扩展单机性能，构建分布式数据处理"</p>

            <Paragraph {...noteProps('p1')}>
              虽然 DuckDB 主要是单机数据库，但可以通过多种方式实现分布式部署。本节介绍如何将 DuckDB 扩展到多机集群环境，实现大规模数据处理。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">集群架构设计</h3>

            <CodeBlock
              title="DuckDB 分布式架构"
              code={`-- 分布式查询协调器
CREATE TABLE cluster_nodes (
    node_id VARCHAR PRIMARY KEY,
    host VARCHAR NOT NULL,
    port INTEGER NOT NULL,
    status VARCHAR DEFAULT 'active',
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    memory_gb DECIMAL(5,2),
    cpu_cores INTEGER
);

-- 分片策略定义
CREATE TABLE data_shards (
    shard_id INTEGER PRIMARY KEY,
    table_name VARCHAR NOT NULL,
    shard_key VARCHAR NOT NULL,
    shard_range_start VARCHAR,
    shard_range_end VARCHAR,
    node_id VARCHAR REFERENCES cluster_nodes(node_id),
    status VARCHAR DEFAULT 'active'
);

-- 分布式查询执行计划
CREATE TABLE query_plans (
    plan_id INTEGER PRIMARY KEY,
    query_text TEXT NOT NULL,
    execution_strategy VARCHAR, -- 'scatter-gather', 'broadcast', 'repartition'
    target_nodes JSON,  -- 涉及的节点列表
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 示例：用户表分片配置
INSERT INTO data_shards (table_name, shard_key, shard_range_start, shard_range_end, node_id) VALUES
('users', 'user_id', '000000', '333333', 'node1'),
('users', 'user_id', '333334', '666666', 'node2'),
('users', 'user_id', '666667', '999999', 'node3');`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据分区策略</h3>

            <CodeBlock
              title="水平分区和垂直分区"
              code={`-- 水平分区（按范围分区）
CREATE TABLE orders_partitioned (
    order_id INTEGER,
    user_id INTEGER,
    order_date DATE,
    total_amount DECIMAL(10,2)
) PARTITION BY (
    CASE
        WHEN order_date < '2023-01-01' THEN 'historical'
        WHEN order_date < '2024-01-01' THEN '2023'
        ELSE 'current'
    END
);

-- 垂直分区（按列分组）
CREATE TABLE user_profiles AS
SELECT user_id, username, email, registration_date
FROM users;

CREATE TABLE user_activity AS
SELECT user_id, last_login, login_count, session_duration
FROM users;

-- 复合分区策略
CREATE TABLE sales_data (
    sale_id INTEGER,
    region VARCHAR,
    product_category VARCHAR,
    sale_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY (
    region || '_' || EXTRACT(year FROM sale_date)::VARCHAR
);

-- 分区查询优化
SELECT region, SUM(amount) as total_sales
FROM sales_data
WHERE region = 'North America'
  AND sale_date >= '2024-01-01'
GROUP BY region;
/* 优化器会自动只扫描相关分区 */`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">负载均衡和故障转移</h3>

            <CodeBlock
              title="集群管理和监控"
              code={`-- 负载均衡器配置
CREATE TABLE load_balancer (
    balancer_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    strategy VARCHAR, -- 'round-robin', 'least-connections', 'weighted'
    nodes JSON,      -- 可用节点列表
    health_check_interval_seconds INTEGER DEFAULT 30
);

-- 节点健康监控
CREATE TABLE node_health (
    node_id VARCHAR,
    check_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    response_time_ms INTEGER,
    status VARCHAR, -- 'healthy', 'warning', 'critical'
    PRIMARY KEY (node_id, check_time)
);

-- 自动故障转移逻辑
CREATE FUNCTION handle_node_failure(failed_node_id VARCHAR) AS (
    -- 1. 标记节点为故障
    UPDATE cluster_nodes
    SET status = 'failed', last_heartbeat = CURRENT_TIMESTAMP
    WHERE node_id = failed_node_id;

    -- 2. 重新分配该节点的分片到其他健康节点
    UPDATE data_shards
    SET node_id = (
        SELECT node_id FROM cluster_nodes
        WHERE status = 'active'
          AND node_id != failed_node_id
        ORDER BY (
            SELECT COUNT(*) FROM data_shards ds
            WHERE ds.node_id = cluster_nodes.node_id
        ) ASC
        LIMIT 1
    )
    WHERE node_id = failed_node_id;

    -- 3. 记录故障事件
    INSERT INTO cluster_events (event_type, node_id, description)
    VALUES ('node_failure', failed_node_id, 'Automatic failover initiated');
);

-- 集群性能监控
CREATE VIEW cluster_performance AS
SELECT
    cn.node_id,
    cn.host,
    cn.status,
    nh.cpu_usage,
    nh.memory_usage,
    nh.response_time_ms,
    COUNT(ds.shard_id) as shard_count,
    AVG(nh.response_time_ms) OVER (
        PARTITION BY cn.status
        ORDER BY nh.check_time DESC
        ROWS 5 PRECEDING
    ) as avg_response_time_5min
FROM cluster_nodes cn
LEFT JOIN node_health nh ON cn.node_id = nh.node_id
LEFT JOIN data_shards ds ON cn.node_id = ds.node_id
WHERE nh.check_time >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
GROUP BY cn.node_id, cn.host, cn.status, nh.cpu_usage, nh.memory_usage, nh.response_time_ms, nh.check_time;`}
              {...noteProps('code3')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：设计三节点集群</p>
                  <p>为一个电商系统设计三节点的 DuckDB 集群：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计数据分区策略</li>
                    <li>配置负载均衡规则</li>
                    <li>实现故障转移机制</li>
                    <li>设置监控和告警</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'data-partitioning':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据分区策略</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"优化查询性能，提升数据管理效率"</p>

            <Paragraph {...noteProps('p1')}>
              数据分区是将大表分割成更小的、更易管理的部分。通过合理分区，可以显著提升查询性能、简化数据维护，并优化存储利用率。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分区类型和策略</h3>

            <CodeBlock
              title="不同分区策略的实现"
              code={`-- 范围分区（Range Partitioning）
CREATE TABLE sales_range (
    sale_id INTEGER,
    sale_date DATE,
    customer_id INTEGER,
    amount DECIMAL(10,2)
) PARTITION BY (
    CASE
        WHEN sale_date < '2023-01-01' THEN '2022'
        WHEN sale_date < '2024-01-01' THEN '2023'
        WHEN sale_date < '2025-01-01' THEN '2024'
        ELSE 'future'
    END
);

-- 列表分区（List Partitioning）
CREATE TABLE products_list (
    product_id INTEGER,
    name VARCHAR,
    category VARCHAR,
    price DECIMAL(10,2)
) PARTITION BY category;

-- 哈希分区（Hash Partitioning）
CREATE TABLE users_hash (
    user_id INTEGER,
    username VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP
) PARTITION BY (user_id % 4);  -- 4个分区

-- 复合分区（Composite Partitioning）
CREATE TABLE orders_composite (
    order_id INTEGER,
    region VARCHAR,
    order_date DATE,
    customer_id INTEGER,
    total DECIMAL(10,2)
) PARTITION BY (region || '_' || EXTRACT(year FROM order_date)::VARCHAR);

-- 分区维护操作
-- 添加新分区
ALTER TABLE sales_range ADD PARTITION '2025' FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- 删除旧分区
ALTER TABLE sales_range DROP PARTITION '2020';

-- 合并分区
ALTER TABLE sales_range MERGE PARTITIONS '2022', '2023' INTO '2022_2023';

-- 分割分区
ALTER TABLE sales_range SPLIT PARTITION '2024' AT ('2024-07-01') INTO '2024_h1', '2024_h2';`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">分区查询优化</h3>

            <CodeBlock
              title="分区裁剪和查询优化"
              code={`-- 分区裁剪优化
EXPLAIN SELECT * FROM sales_range
WHERE sale_date BETWEEN '2024-01-01' AND '2024-12-31';
/*
优化器会自动识别只需要扫描 '2024' 分区
*/

-- 跨分区聚合查询
SELECT
    partition_name,
    COUNT(*) as record_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    MIN(sale_date) as earliest_sale,
    MAX(sale_date) as latest_sale
FROM (
    SELECT *, '2023' as partition_name FROM sales_range_2023
    UNION ALL
    SELECT *, '2024' as partition_name FROM sales_range_2024
) partitioned_sales
GROUP BY partition_name;

-- 分区统计信息
CREATE VIEW partition_stats AS
SELECT
    table_name,
    partition_name,
    record_count,
    size_bytes,
    last_modified,
    compression_ratio
FROM system_partitions
WHERE table_name LIKE '%_partitioned';

-- 动态分区创建
CREATE FUNCTION create_monthly_partition(table_name VARCHAR, year_month VARCHAR) AS (
    EXECUTE 'CREATE TABLE ' || table_name || '_' || year_month || ' PARTITION OF ' || table_name ||
            ' FOR VALUES FROM (''' || year_month || '-01'') TO (''' ||
            (DATE(year_month || '-01') + INTERVAL '1 month')::VARCHAR || ''')';
);

-- 自动分区管理
CREATE FUNCTION manage_partitions() AS (
    -- 删除6个月前的分区
    FOR old_partition IN (
        SELECT partition_name FROM partition_stats
        WHERE last_modified < CURRENT_DATE - INTERVAL '6 months'
    ) LOOP
        EXECUTE 'DROP TABLE ' || old_partition;
    END LOOP;

    -- 创建未来3个月的分区
    FOR i IN 0..2 LOOP
        DECLARE next_month = (CURRENT_DATE + INTERVAL (i || ' months'))::DATE;
        DECLARE year_month = EXTRACT(year FROM next_month)::VARCHAR || '-' ||
                           LPAD(EXTRACT(month FROM next_month)::VARCHAR, 2, '0');

        IF NOT EXISTS (SELECT 1 FROM partition_stats WHERE partition_name LIKE '%' || year_month) THEN
            PERFORM create_monthly_partition('sales_range', year_month);
        END IF;
    END LOOP;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：时间序列数据分区</p>
                  <p>为物联网传感器数据设计分区策略：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>按时间范围分区</li>
                    <li>实现自动分区创建</li>
                    <li>优化历史数据查询</li>
                    <li>设置数据保留策略</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'distributed-queries':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分布式查询</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"跨节点数据处理，统一查询接口"</p>

            <Paragraph {...noteProps('p1')}>
              分布式查询允许在多个节点上并行执行查询操作，实现大规模数据分析。本节介绍分布式查询的原理、优化策略和实现方法。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">查询分布策略</h3>

            <CodeBlock
              title="分布式查询执行模式"
              code={`-- Scatter-Gather 模式
-- 将查询分散到多个节点，然后收集结果
CREATE FUNCTION scatter_gather_query(query_text TEXT) AS (
    -- 1. 解析查询，确定涉及的分片
    DECLARE involved_shards = (
        SELECT ARRAY_AGG(DISTINCT node_id)
        FROM data_shards
        WHERE table_name IN (
            SELECT table_name FROM parse_query_tables(query_text)
        )
    );

    -- 2. 在每个相关节点上执行查询
    CREATE TEMP TABLE partial_results AS
    SELECT node_id, execute_remote_query(node_id, query_text) as result
    FROM unnest(involved_shards) as node_id;

    -- 3. 合并结果
    SELECT merge_results(ARRAY_AGG(result))
    FROM partial_results;
);

-- Broadcast 模式
-- 将小表广播到所有节点
CREATE FUNCTION broadcast_join(small_table_query TEXT, large_table_query TEXT) AS (
    -- 获取小表数据
    DECLARE small_table_data = execute_query(small_table_query);

    -- 将小表数据发送到所有相关节点
    PERFORM broadcast_to_nodes(small_table_data, relevant_nodes);

    -- 在每个节点上执行JOIN
    SELECT node_id, execute_join_on_node(node_id, large_table_query, 'broadcasted_small_table')
    FROM relevant_nodes;
);

-- Repartition 模式
-- 重新分区数据以进行JOIN
CREATE FUNCTION repartition_join(left_query TEXT, right_query TEXT, join_key VARCHAR) AS (
    -- 1. 确定重分区策略
    DECLARE repartition_key = join_key;
    DECLARE num_partitions = (SELECT COUNT(*) FROM cluster_nodes WHERE status = 'active');

    -- 2. 在源节点上重分区数据
    PERFORM repartition_data_on_nodes(left_query, repartition_key, num_partitions);
    PERFORM repartition_data_on_nodes(right_query, repartition_key, num_partitions);

    -- 3. 在目标节点上执行JOIN
    SELECT node_id, execute_local_join(node_id, 'repartitioned_left', 'repartitioned_right', join_key)
    FROM cluster_nodes
    WHERE status = 'active';
);

-- 分布式聚合
CREATE FUNCTION distributed_aggregation(query_text TEXT, group_by_cols TEXT[]) AS (
    -- 1. 在每个节点上执行局部聚合
    CREATE TEMP TABLE local_aggregates AS
    SELECT node_id, execute_partial_aggregation(node_id, query_text, group_by_cols) as partial_result
    FROM cluster_nodes
    WHERE status = 'active';

    -- 2. 合并局部聚合结果
    SELECT merge_aggregates(ARRAY_AGG(partial_result))
    FROM local_aggregates;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">查询优化和执行计划</h3>

            <CodeBlock
              title="分布式查询优化"
              code={`-- 查询执行计划分析
CREATE TABLE query_execution_plans (
    plan_id INTEGER PRIMARY KEY,
    query_text TEXT NOT NULL,
    execution_strategy VARCHAR,
    estimated_cost DECIMAL(10,2),
    estimated_rows BIGINT,
    involved_nodes JSON,
    data_transfer_mb DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成本估算函数
CREATE FUNCTION estimate_query_cost(query_text TEXT) AS (
    SELECT
        SUM(node_cost) as total_cost,
        SUM(data_transfer) as total_transfer,
        COUNT(DISTINCT node_id) as node_count
    FROM (
        -- 分析查询涉及的表和节点
        SELECT
            ds.node_id,
            CASE
                WHEN t.row_count > 1000000 THEN 100  -- 大表高成本
                WHEN t.row_count > 100000 THEN 10    -- 中表中等成本
                ELSE 1                                -- 小表低成本
            END as node_cost,
            CASE
                WHEN ds.node_id != current_node() THEN t.size_mb * 0.1  -- 跨节点传输成本
                ELSE 0
            END as data_transfer
        FROM data_shards ds
        JOIN table_stats t ON ds.table_name = t.table_name
        WHERE ds.table_name IN (SELECT table_name FROM parse_query_tables(query_text))
    ) cost_analysis;
);

-- 查询路由决策
CREATE FUNCTION choose_execution_strategy(query_text TEXT) AS (
    DECLARE cost_scatter_gather = estimate_scatter_gather_cost(query_text);
    DECLARE cost_broadcast = estimate_broadcast_cost(query_text);
    DECLARE cost_repartition = estimate_repartition_cost(query_text);

    SELECT
        CASE
            WHEN cost_scatter_gather <= cost_broadcast AND cost_scatter_gather <= cost_repartition THEN 'scatter-gather'
            WHEN cost_broadcast <= cost_repartition THEN 'broadcast'
            ELSE 'repartition'
        END as optimal_strategy,
        LEAST(cost_scatter_gather, cost_broadcast, cost_repartition) as min_cost;
);

-- 智能查询路由
CREATE FUNCTION route_distributed_query(query_text TEXT) AS (
    DECLARE strategy = choose_execution_strategy(query_text);

    INSERT INTO query_execution_plans (query_text, execution_strategy, estimated_cost)
    SELECT query_text, strategy.optimal_strategy, strategy.min_cost;

    -- 根据策略执行查询
    CASE strategy.optimal_strategy
        WHEN 'scatter-gather' THEN PERFORM scatter_gather_query(query_text);
        WHEN 'broadcast' THEN PERFORM broadcast_join_query(query_text);
        WHEN 'repartition' THEN PERFORM repartition_join_query(query_text);
    END CASE;
);

-- 查询结果缓存
CREATE TABLE query_cache (
    query_hash VARCHAR PRIMARY KEY,
    query_text TEXT NOT NULL,
    result_data JSON,
    execution_time_seconds DECIMAL(5,2),
    result_size_bytes BIGINT,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 1
);

-- 缓存命中检查
CREATE FUNCTION get_cached_result(query_text TEXT) AS (
    DECLARE query_hash = md5(query_text);

    SELECT result_data, execution_time_seconds
    FROM query_cache
    WHERE query_hash = query_hash
      AND last_accessed > CURRENT_TIMESTAMP - INTERVAL '1 hour'  -- 1小时内有效
    LIMIT 1;
);

-- 缓存更新策略
CREATE FUNCTION update_query_cache(query_text TEXT, result_data JSON, execution_time DECIMAL) AS (
    DECLARE query_hash = md5(query_text);

    INSERT INTO query_cache (query_hash, query_text, result_data, execution_time_seconds)
    VALUES (query_hash, query_text, result_data, execution_time)
    ON CONFLICT (query_hash) DO UPDATE SET
        result_data = EXCLUDED.result_data,
        execution_time_seconds = EXCLUDED.execution_time_seconds,
        last_accessed = CURRENT_TIMESTAMP,
        access_count = query_cache.access_count + 1;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：分布式JOIN查询</p>
                  <p>实现跨节点的用户订单分析查询：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>分析查询执行计划</li>
                    <li>选择最优分布策略</li>
                    <li>优化数据传输</li>
                    <li>实现结果合并</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'load-balancing':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">负载均衡</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"均衡资源利用，优化系统性能"</p>

            <Paragraph {...noteProps('p1')}>
              负载均衡确保集群中各个节点的工作负载均匀分布，避免单点过载，提高整体系统性能和可用性。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">负载均衡算法</h3>

            <CodeBlock
              title="不同的负载均衡策略"
              code={`-- 轮询调度（Round Robin）
CREATE FUNCTION round_robin_scheduler(request_data JSON) AS (
    DECLARE next_node = (
        SELECT node_id FROM cluster_nodes
        WHERE status = 'active'
        ORDER BY last_scheduled ASC
        LIMIT 1
    );

    -- 更新调度时间
    UPDATE cluster_nodes
    SET last_scheduled = CURRENT_TIMESTAMP
    WHERE node_id = next_node;

    -- 路由请求到选定节点
    PERFORM route_request_to_node(next_node, request_data);
);

-- 加权轮询（Weighted Round Robin）
CREATE FUNCTION weighted_round_robin_scheduler(request_data JSON) AS (
    DECLARE node_weights = (
        SELECT node_id, cpu_cores * 10 as weight  -- CPU核心数作为权重
        FROM cluster_nodes
        WHERE status = 'active'
    );

    -- 基于权重的轮询选择
    DECLARE selected_node = (
        SELECT node_id
        FROM node_weights
        ORDER BY (weight - current_weight) DESC
        LIMIT 1
    );

    PERFORM route_request_to_node(selected_node, request_data);
);

-- 最少连接数调度（Least Connections）
CREATE FUNCTION least_connections_scheduler(request_data JSON) AS (
    DECLARE selected_node = (
        SELECT node_id
        FROM cluster_nodes c
        LEFT JOIN (
            SELECT node_id, COUNT(*) as active_connections
            FROM active_sessions
            GROUP BY node_id
        ) s ON c.node_id = s.node_id
        WHERE c.status = 'active'
        ORDER BY COALESCE(s.active_connections, 0) ASC
        LIMIT 1
    );

    PERFORM route_request_to_node(selected_node, request_data);
);

-- 基于负载的最少连接调度
CREATE FUNCTION load_aware_scheduler(request_data JSON) AS (
    DECLARE selected_node = (
        SELECT
            c.node_id,
            (COALESCE(s.active_connections, 0) * 1.0 / c.cpu_cores) as load_factor
        FROM cluster_nodes c
        LEFT JOIN (
            SELECT node_id, COUNT(*) as active_connections
            FROM active_sessions
            GROUP BY node_id
        ) s ON c.node_id = s.node_id
        WHERE c.status = 'active'
        ORDER BY load_factor ASC
        LIMIT 1
    ).node_id;

    PERFORM route_request_to_node(selected_node, request_data);
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">负载监控和动态调整</h3>

            <CodeBlock
              title="实时负载监控和自动扩缩容"
              code={`-- 节点负载指标收集
CREATE TABLE node_metrics (
    node_id VARCHAR,
    metric_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_usage DECIMAL(5,2),     -- CPU使用率
    memory_usage DECIMAL(5,2),  -- 内存使用率
    disk_io_rate DECIMAL(10,2), -- 磁盘I/O速率
    network_io_rate DECIMAL(10,2), -- 网络I/O速率
    active_connections INTEGER, -- 活跃连接数
    query_queue_length INTEGER, -- 查询队列长度
    PRIMARY KEY (node_id, metric_time)
);

-- 负载阈值配置
CREATE TABLE load_thresholds (
    metric_name VARCHAR PRIMARY KEY,
    warning_threshold DECIMAL(5,2),
    critical_threshold DECIMAL(5,2),
    scale_up_threshold DECIMAL(5,2),
    scale_down_threshold DECIMAL(5,2)
);

INSERT INTO load_thresholds VALUES
('cpu_usage', 70.0, 85.0, 80.0, 30.0),
('memory_usage', 75.0, 90.0, 85.0, 40.0),
('query_queue_length', 50, 100, 80, 10);

-- 自动扩缩容决策
CREATE FUNCTION evaluate_auto_scaling() AS (
    -- 计算集群平均负载
    DECLARE avg_load = (
        SELECT AVG(
            (cpu_usage + memory_usage) / 2 +
            (query_queue_length / 100.0) * 50  -- 队列长度影响因子
        ) as composite_load
        FROM node_metrics
        WHERE metric_time >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
    );

    -- 扩容决策
    IF avg_load > (SELECT scale_up_threshold FROM load_thresholds WHERE metric_name = 'cpu_usage') THEN
        PERFORM trigger_scale_up();
    END IF;

    -- 缩容决策
    IF avg_load < (SELECT scale_down_threshold FROM load_thresholds WHERE metric_name = 'cpu_usage') THEN
        -- 确保至少保留2个节点
        IF (SELECT COUNT(*) FROM cluster_nodes WHERE status = 'active') > 2 THEN
            PERFORM trigger_scale_down();
        END IF;
    END IF;
);

-- 负载均衡重新分配
CREATE FUNCTION rebalance_load() AS (
    -- 识别过载节点
    DECLARE overloaded_nodes = (
        SELECT ARRAY_AGG(node_id)
        FROM (
            SELECT node_id, AVG(cpu_usage) as avg_cpu
            FROM node_metrics
            WHERE metric_time >= CURRENT_TIMESTAMP - INTERVAL '10 minutes'
            GROUP BY node_id
            HAVING AVG(cpu_usage) > 80
            ORDER BY avg_cpu DESC
        )
    );

    -- 识别低负载节点
    DECLARE underloaded_nodes = (
        SELECT ARRAY_AGG(node_id)
        FROM (
            SELECT node_id, AVG(cpu_usage) as avg_cpu
            FROM node_metrics
            WHERE metric_time >= CURRENT_TIMESTAMP - INTERVAL '10 minutes'
            GROUP BY node_id
            HAVING AVG(cpu_usage) < 40
            ORDER BY avg_cpu ASC
        )
    );

    -- 重新分配分片
    IF overloaded_nodes IS NOT NULL AND underloaded_nodes IS NOT NULL THEN
        PERFORM redistribute_shards(overloaded_nodes, underloaded_nodes);
    END IF;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：智能负载均衡器</p>
                  <p>实现一个自适应的负载均衡系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现多种调度算法</li>
                    <li>设置负载监控指标</li>
                    <li>实现自动扩缩容</li>
                    <li>测试故障场景下的负载均衡</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'fault-tolerance':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">容错机制</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"确保系统高可用，优雅处理故障"</p>

            <Paragraph {...noteProps('p1')}>
              容错机制确保系统在部分组件故障时仍能正常运行。本节介绍分布式系统中的故障检测、恢复和数据冗余策略。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">故障检测和恢复</h3>

            <CodeBlock
              title="心跳检测和故障转移"
              code={`-- 节点健康状态监控
CREATE TABLE node_health_status (
    node_id VARCHAR PRIMARY KEY,
    status VARCHAR DEFAULT 'unknown', -- 'healthy', 'suspect', 'failed'
    last_heartbeat TIMESTAMP,
    consecutive_failures INTEGER DEFAULT 0,
    last_failure_time TIMESTAMP,
    recovery_attempts INTEGER DEFAULT 0
);

-- 心跳检测函数
CREATE FUNCTION check_node_heartbeat() AS (
    -- 更新所有活跃节点的最后心跳时间
    UPDATE node_health_status
    SET last_heartbeat = CURRENT_TIMESTAMP,
        status = 'healthy',
        consecutive_failures = 0
    WHERE node_id IN (
        SELECT node_id FROM cluster_nodes
        WHERE status = 'active'
    );

    -- 标记超时的节点为可疑
    UPDATE node_health_status
    SET status = 'suspect',
        consecutive_failures = consecutive_failures + 1,
        last_failure_time = CURRENT_TIMESTAMP
    WHERE last_heartbeat < CURRENT_TIMESTAMP - INTERVAL '30 seconds'
      AND status = 'healthy';

    -- 标记连续失败的节点为故障
    UPDATE node_health_status
    SET status = 'failed'
    WHERE consecutive_failures >= 3
      AND status = 'suspect';
);

-- 自动故障转移
CREATE FUNCTION initiate_failover(failed_node_id VARCHAR) AS (
    -- 1. 隔离故障节点
    UPDATE cluster_nodes SET status = 'failed' WHERE node_id = failed_node_id;

    -- 2. 识别故障节点的责任
    DECLARE affected_shards = (
        SELECT ARRAY_AGG(shard_id) FROM data_shards WHERE node_id = failed_node_id
    );

    -- 3. 选举新的主节点（如果适用）
    IF failed_node_id = (SELECT master_node FROM cluster_config) THEN
        PERFORM elect_new_master();
    END IF;

    -- 4. 重新分配受影响的分片
    PERFORM redistribute_failed_shards(affected_shards);

    -- 5. 更新集群配置
    UPDATE cluster_config SET version = version + 1, last_updated = CURRENT_TIMESTAMP;

    -- 6. 记录故障事件
    INSERT INTO cluster_events (event_type, description, affected_nodes)
    VALUES ('failover', 'Automatic failover initiated for node ' || failed_node_id, ARRAY[failed_node_id]);
);

-- 选举新主节点
CREATE FUNCTION elect_new_master() AS (
    DECLARE new_master = (
        SELECT node_id FROM cluster_nodes
        WHERE status = 'active'
          AND node_id != (SELECT master_node FROM cluster_config)
        ORDER BY (
            -- 基于节点性能和网络位置的选举算法
            cpu_cores * 0.4 + memory_gb * 0.3 +
            (CASE WHEN location = 'primary_dc' THEN 0.3 ELSE 0 END)
        ) DESC
        LIMIT 1
    );

    UPDATE cluster_config SET master_node = new_master;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据冗余和备份</h3>

            <CodeBlock
              title="数据复制和备份策略"
              code={`-- 数据复制配置
CREATE TABLE replication_config (
    source_node VARCHAR,
    target_node VARCHAR,
    replication_type VARCHAR, -- 'sync', 'async', 'semi-sync'
    tables_to_replicate TEXT[], -- 要复制的表列表
    last_sync_timestamp TIMESTAMP,
    replication_lag_seconds INTEGER,
    status VARCHAR DEFAULT 'active',
    PRIMARY KEY (source_node, target_node)
);

-- 异步复制实现
CREATE FUNCTION setup_async_replication(source_node VARCHAR, target_node VARCHAR) AS (
    -- 1. 创建复制槽
    PERFORM execute_on_node(source_node,
        'SELECT pg_create_logical_replication_slot(''replication_slot_' || target_node || ''', ''pgoutput'')'
    );

    -- 2. 启动复制进程
    PERFORM execute_on_node(target_node,
        'CREATE SUBSCRIPTION sub_' || source_node || ' CONNECTION ''' ||
        get_connection_string(source_node) || ''' PUBLICATION pub_' || source_node ||
        ' WITH (copy_data = false, enabled = true)'
    );

    -- 3. 更新配置
    INSERT INTO replication_config (source_node, target_node, replication_type)
    VALUES (source_node, target_node, 'async');
);

-- 数据校验和完整性检查
CREATE FUNCTION verify_data_integrity(table_name VARCHAR) AS (
    -- 计算源表和副本表的校验和
    DECLARE source_checksum = execute_on_node('master',
        'SELECT md5(string_agg(md5(row_to_json(t)::text), '''')) FROM ' || table_name || ' t'
    );

    DECLARE replica_checksums = (
        SELECT array_agg(execute_on_node(node_id,
            'SELECT md5(string_agg(md5(row_to_json(t)::text), '''')) FROM ' || table_name || ' t'
        ))
        FROM replication_config
        WHERE source_node = 'master' AND status = 'active'
    );

    -- 检查一致性
    SELECT
        CASE WHEN source_checksum = ALL(replica_checksums) THEN 'consistent' ELSE 'inconsistent' END as status,
        source_checksum,
        replica_checksums;
);

-- 自动修复数据不一致
CREATE FUNCTION repair_data_inconsistency(table_name VARCHAR, inconsistent_node VARCHAR) AS (
    -- 1. 暂停不一致节点的写入
    PERFORM execute_on_node(inconsistent_node, 'SET default_transaction_read_only = true');

    -- 2. 从主节点重新同步数据
    PERFORM execute_on_node(inconsistent_node,
        'TRUNCATE TABLE ' || table_name || ';' ||
        'INSERT INTO ' || table_name || ' SELECT * FROM dblink(''' ||
        get_connection_string('master') || ''', ''SELECT * FROM ' || table_name || ''') AS t'
    );

    -- 3. 恢复写入权限
    PERFORM execute_on_node(inconsistent_node, 'SET default_transaction_read_only = false');

    -- 4. 记录修复事件
    INSERT INTO cluster_events (event_type, description)
    VALUES ('data_repair', 'Repaired data inconsistency for table ' || table_name || ' on node ' || inconsistent_node);
);

-- 备份策略配置
CREATE TABLE backup_schedules (
    schedule_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    backup_type VARCHAR, -- 'full', 'incremental', 'differential'
    frequency VARCHAR,   -- 'daily', 'weekly', 'monthly'
    retention_days INTEGER,
    target_location VARCHAR,
    compression_enabled BOOLEAN DEFAULT TRUE,
    encryption_enabled BOOLEAN DEFAULT TRUE,
    last_backup TIMESTAMP,
    next_backup TIMESTAMP
);

-- 执行备份
CREATE FUNCTION execute_backup(schedule_id INTEGER) AS (
    DECLARE schedule = (SELECT * FROM backup_schedules WHERE schedule_id = schedule_id);

    -- 创建备份
    DECLARE backup_path = schedule.target_location || '/' || schedule.name || '_' ||
                         CURRENT_DATE || '.backup';

    -- 执行pg_dump或其他备份工具
    DECLARE backup_command = 'pg_dump -h ' || get_master_host() || ' -U ' || get_backup_user() ||
                           ' -d ' || get_database_name() || ' -f ' || backup_path;

    PERFORM execute_system_command(backup_command);

    -- 更新备份记录
    UPDATE backup_schedules
    SET last_backup = CURRENT_TIMESTAMP,
        next_backup = calculate_next_backup(CURRENT_TIMESTAMP, schedule.frequency)
    WHERE schedule_id = schedule_id;

    -- 清理过期备份
    PERFORM cleanup_old_backups(schedule.target_location, schedule.retention_days);
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：容错集群设计</p>
                  <p>为分布式数据库设计完整的容错机制：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现心跳检测和故障发现</li>
                    <li>设计自动故障转移流程</li>
                    <li>配置数据复制策略</li>
                    <li>设置监控和告警系统</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'distributed-transactions':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分布式事务</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"保证数据一致性，跨越多个节点"</p>

            <Paragraph {...noteProps('p1')}>
              分布式事务确保跨多个节点的操作要么全部成功，要么全部失败，维护数据的一致性。本节介绍分布式事务的原理和实现。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">两阶段提交协议</h3>

            <CodeBlock
              title="2PC 协议实现"
              code={`-- 事务协调器状态
CREATE TABLE transaction_coordinator (
    transaction_id VARCHAR PRIMARY KEY,
    status VARCHAR, -- 'preparing', 'prepared', 'committing', 'committed', 'aborting', 'aborted'
    participants JSON, -- 参与节点列表
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prepared_at TIMESTAMP,
    committed_at TIMESTAMP,
    aborted_at TIMESTAMP
);

-- 参与者状态
CREATE TABLE transaction_participants (
    transaction_id VARCHAR,
    participant_node VARCHAR,
    status VARCHAR, -- 'prepared', 'committed', 'aborted'
    prepared_at TIMESTAMP,
    vote VARCHAR, -- 'yes', 'no'
    PRIMARY KEY (transaction_id, participant_node)
);

-- 两阶段提交 - 第一阶段：准备
CREATE FUNCTION prepare_phase(transaction_id VARCHAR, operations JSON) AS (
    -- 1. 记录事务开始
    INSERT INTO transaction_coordinator (transaction_id, status, participants)
    SELECT transaction_id, 'preparing', json_extract_keys(operations);

    -- 2. 向所有参与者发送准备请求
    DECLARE participant_votes = '{}';

    FOR participant IN (SELECT json_extract_keys(operations) as node_id) LOOP
        -- 在参与者节点上执行准备操作
        DECLARE vote = execute_on_node(participant.node_id,
            'SELECT prepare_transaction(''' || transaction_id || ''', ''' || operations->participant.node_id || ''')'
        );

        -- 记录投票结果
        participant_votes = json_set(participant_votes, participant.node_id, vote);
    END LOOP;

    -- 3. 检查是否所有参与者都同意
    DECLARE all_yes = TRUE;
    FOR vote IN (SELECT json_extract_values(participant_votes)) LOOP
        IF vote != 'yes' THEN
            all_yes = FALSE;
        END IF;
    END LOOP;

    -- 4. 更新协调器状态
    IF all_yes THEN
        UPDATE transaction_coordinator
        SET status = 'prepared', prepared_at = CURRENT_TIMESTAMP
        WHERE transaction_id = transaction_id;
    ELSE
        UPDATE transaction_coordinator
        SET status = 'aborting', aborted_at = CURRENT_TIMESTAMP
        WHERE transaction_id = transaction_id;
    END IF;

    RETURN all_yes;
);

-- 两阶段提交 - 第二阶段：提交
CREATE FUNCTION commit_phase(transaction_id VARCHAR) AS (
    DECLARE coordinator_status = (SELECT status FROM transaction_coordinator WHERE transaction_id = transaction_id);

    IF coordinator_status = 'prepared' THEN
        -- 发送提交命令给所有参与者
        FOR participant IN (SELECT json_extract_keys(participants) FROM transaction_coordinator WHERE transaction_id = transaction_id) LOOP
            PERFORM execute_on_node(participant.node_id,
                'SELECT commit_transaction(''' || transaction_id || ''')'
            );
        END LOOP;

        UPDATE transaction_coordinator
        SET status = 'committed', committed_at = CURRENT_TIMESTAMP
        WHERE transaction_id = transaction_id;

    ELSIF coordinator_status = 'aborting' THEN
        -- 发送回滚命令给所有参与者
        FOR participant IN (SELECT json_extract_keys(participants) FROM transaction_coordinator WHERE transaction_id = transaction_id) LOOP
            PERFORM execute_on_node(participant.node_id,
                'SELECT rollback_transaction(''' || transaction_id || ''')'
            );
        END LOOP;

        UPDATE transaction_coordinator
        SET status = 'aborted', aborted_at = CURRENT_TIMESTAMP
        WHERE transaction_id = transaction_id;
    END IF;
);

-- 分布式事务执行
CREATE FUNCTION execute_distributed_transaction(operations JSON) AS (
    DECLARE transaction_id = 'tx_' || gen_random_uuid();

    -- 第一阶段：准备
    DECLARE prepared = prepare_phase(transaction_id, operations);

    -- 第二阶段：提交或回滚
    PERFORM commit_phase(transaction_id);

    RETURN transaction_id;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">Saga 模式和补偿事务</h3>

            <CodeBlock
              title="Saga 模式实现"
              code={`-- Saga 事务定义
CREATE TABLE saga_transactions (
    saga_id VARCHAR PRIMARY KEY,
    status VARCHAR, -- 'running', 'completed', 'compensating', 'failed'
    steps JSON,     -- 事务步骤定义
    current_step INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP
);

-- Saga 步骤执行记录
CREATE TABLE saga_step_executions (
    saga_id VARCHAR,
    step_id INTEGER,
    step_name VARCHAR,
    status VARCHAR, -- 'pending', 'executing', 'completed', 'compensating', 'failed'
    executed_at TIMESTAMP,
    compensated_at TIMESTAMP,
    error_message TEXT,
    PRIMARY KEY (saga_id, step_id)
);

-- Saga 执行引擎
CREATE FUNCTION execute_saga_step(saga_id VARCHAR, step_definition JSON) AS (
    DECLARE step_result;

    BEGIN
        -- 记录步骤开始执行
        INSERT INTO saga_step_executions (saga_id, step_id, step_name, status)
        VALUES (saga_id, step_definition->'step_id', step_definition->'name', 'executing');

        -- 执行正向操作
        step_result = execute_step_operation(step_definition->'operation');

        -- 记录成功执行
        UPDATE saga_step_executions
        SET status = 'completed', executed_at = CURRENT_TIMESTAMP
        WHERE saga_id = saga_id AND step_id = step_definition->'step_id';

        RETURN step_result;

    EXCEPTION WHEN OTHERS THEN
        -- 记录执行失败
        UPDATE saga_step_executions
        SET status = 'failed', executed_at = CURRENT_TIMESTAMP,
            error_message = SQLERRM
        WHERE saga_id = saga_id AND step_id = step_definition->'step_id';

        -- 触发补偿流程
        PERFORM trigger_saga_compensation(saga_id);

        RAISE;
    END;
);

-- Saga 补偿机制
CREATE FUNCTION trigger_saga_compensation(saga_id VARCHAR) AS (
    UPDATE saga_transactions SET status = 'compensating' WHERE saga_id = saga_id;

    -- 逆序执行补偿操作
    FOR compensation_step IN (
        SELECT * FROM saga_step_executions
        WHERE saga_id = saga_id AND status = 'completed'
        ORDER BY step_id DESC
    ) LOOP
        BEGIN
            -- 执行补偿操作
            PERFORM execute_compensation_operation(compensation_step.step_name);

            -- 记录补偿成功
            UPDATE saga_step_executions
            SET status = 'compensating', compensated_at = CURRENT_TIMESTAMP
            WHERE saga_id = saga_id AND step_id = compensation_step.step_id;

        EXCEPTION WHEN OTHERS THEN
            -- 补偿失败，记录错误但继续
            UPDATE saga_step_executions
            SET status = 'failed', error_message = SQLERRM
            WHERE saga_id = saga_id AND step_id = compensation_step.step_id;
        END;
    END LOOP;

    -- 更新 Saga 状态
    UPDATE saga_transactions
    SET status = 'failed', failed_at = CURRENT_TIMESTAMP
    WHERE saga_id = saga_id;
);

-- TCC (Try-Confirm-Cancel) 模式
CREATE TABLE tcc_participants (
    transaction_id VARCHAR,
    participant_id VARCHAR,
    resource_type VARCHAR,
    try_operation JSON,
    confirm_operation JSON,
    cancel_operation JSON,
    status VARCHAR, -- 'trying', 'prepared', 'confirmed', 'cancelled'
    PRIMARY KEY (transaction_id, participant_id)
);

-- TCC 执行流程
CREATE FUNCTION execute_tcc_transaction(transaction_id VARCHAR, operations JSON) AS (
    BEGIN
        -- Try 阶段
        FOR operation IN (SELECT json_array_elements(operations)) LOOP
            INSERT INTO tcc_participants (transaction_id, participant_id, resource_type,
                                        try_operation, confirm_operation, cancel_operation)
            VALUES (transaction_id, operation->'participant_id', operation->'resource_type',
                   operation->'try', operation->'confirm', operation->'cancel');

            -- 执行 Try 操作
            PERFORM execute_try_operation(operation->'participant_id', operation->'try');
        END LOOP;

        -- Confirm 阶段（所有 Try 成功后）
        FOR participant IN (SELECT * FROM tcc_participants WHERE transaction_id = transaction_id) LOOP
            PERFORM execute_confirm_operation(participant.participant_id, participant.confirm_operation);
            UPDATE tcc_participants SET status = 'confirmed'
            WHERE transaction_id = transaction_id AND participant_id = participant.participant_id;
        END LOOP;

        RETURN 'committed';

    EXCEPTION WHEN OTHERS THEN
        -- Cancel 阶段（失败时）
        FOR participant IN (SELECT * FROM tcc_participants WHERE transaction_id = transaction_id) LOOP
            BEGIN
                PERFORM execute_cancel_operation(participant.participant_id, participant.cancel_operation);
                UPDATE tcc_participants SET status = 'cancelled'
                WHERE transaction_id = transaction_id AND participant_id = participant.participant_id;
            EXCEPTION WHEN OTHERS THEN
                -- 记录取消失败，但继续处理其他参与者
                NULL;
            END;
        END LOOP;

        RETURN 'aborted';
    END;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：分布式银行转账</p>
                  <p>实现跨银行账户的分布式转账事务：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>使用2PC协议保证一致性</li>
                    <li>实现Saga模式处理复杂业务</li>
                    <li>设计TCC模式优化性能</li>
                    <li>测试各种故障场景</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'performance-monitoring':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">性能监控</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"实时监控系统健康，提前发现问题"</p>

            <Paragraph {...noteProps('p1')}>
              性能监控是分布式系统运维的核心，帮助及时发现性能瓶颈、资源不足和潜在故障。本节介绍全面的监控指标和告警系统。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">监控指标收集</h3>

            <CodeBlock
              title="系统和应用性能指标"
              code={`-- 系统级性能指标
CREATE TABLE system_metrics (
    node_id VARCHAR,
    metric_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_user DECIMAL(5,2),        -- 用户CPU使用率
    cpu_system DECIMAL(5,2),      -- 系统CPU使用率
    cpu_idle DECIMAL(5,2),        -- CPU空闲率
    memory_total BIGINT,          -- 总内存
    memory_used BIGINT,           -- 已用内存
    memory_free BIGINT,           -- 可用内存
    disk_total BIGINT,            -- 磁盘总量
    disk_used BIGINT,             -- 磁盘使用量
    network_rx_bytes BIGINT,      -- 网络接收字节
    network_tx_bytes BIGINT,      -- 网络发送字节
    load_average_1m DECIMAL(5,2), -- 1分钟负载平均值
    load_average_5m DECIMAL(5,2), -- 5分钟负载平均值
    load_average_15m DECIMAL(5,2) -- 15分钟负载平均值
);

-- 数据库性能指标
CREATE TABLE database_metrics (
    node_id VARCHAR,
    metric_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active_connections INTEGER,     -- 活跃连接数
    total_connections INTEGER,      -- 总连接数
    queries_per_second DECIMAL(8,2), -- 每秒查询数
    transactions_per_second DECIMAL(8,2), -- 每秒事务数
    cache_hit_ratio DECIMAL(5,2),   -- 缓存命中率
    lock_waits INTEGER,             -- 锁等待数
    deadlock_count INTEGER,         -- 死锁计数
    temp_files_size BIGINT,         -- 临时文件大小
    wal_size BIGINT,                -- WAL日志大小
    replication_lag_seconds INTEGER  -- 复制延迟
);

-- 查询性能指标
CREATE TABLE query_performance (
    query_id VARCHAR PRIMARY KEY,
    query_text TEXT,
    execution_count BIGINT DEFAULT 0,
    total_execution_time DECIMAL(10,3), -- 总执行时间(毫秒)
    avg_execution_time DECIMAL(8,3),    -- 平均执行时间(毫秒)
    max_execution_time DECIMAL(8,3),    -- 最大执行时间(毫秒)
    min_execution_time DECIMAL(8,3),    -- 最小执行时间(毫秒)
    last_executed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收集查询性能统计
CREATE FUNCTION collect_query_stats() AS (
    INSERT INTO query_performance (
        query_id, query_text, execution_count, total_execution_time,
        avg_execution_time, max_execution_time, min_execution_time, last_executed
    )
    SELECT
        md5(query) as query_id,
        query,
        calls as execution_count,
        total_time as total_execution_time,
        mean_time as avg_execution_time,
        max_time as max_execution_time,
        min_time as min_execution_time,
        CURRENT_TIMESTAMP as last_executed
    FROM pg_stat_statements
    WHERE calls > 10  -- 只收集执行次数较多的查询
    ON CONFLICT (query_id) DO UPDATE SET
        execution_count = EXCLUDED.execution_count,
        total_execution_time = EXCLUDED.total_execution_time,
        avg_execution_time = EXCLUDED.avg_execution_time,
        max_execution_time = EXCLUDED.max_execution_time,
        min_execution_time = EXCLUDED.min_execution_time,
        last_executed = EXCLUDED.last_executed;
);

-- 应用级性能指标
CREATE TABLE application_metrics (
    service_name VARCHAR,
    metric_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_count BIGINT,           -- 请求总数
    error_count BIGINT,             -- 错误数
    response_time_p50 DECIMAL(8,3), -- 响应时间中位数
    response_time_p95 DECIMAL(8,3), -- 响应时间95分位数
    response_time_p99 DECIMAL(8,3), -- 响应时间99分位数
    throughput_per_second DECIMAL(8,2), -- 每秒吞吐量
    active_users INTEGER,           -- 活跃用户数
    memory_heap_used BIGINT,        -- 堆内存使用
    memory_heap_total BIGINT,       -- 堆内存总量
    gc_count BIGINT,                -- GC次数
    gc_time DECIMAL(8,3)            -- GC时间
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">告警系统和自动化响应</h3>

            <CodeBlock
              title="智能监控和告警"
              code={`-- 告警规则配置
CREATE TABLE alert_rules (
    rule_id INTEGER PRIMARY KEY,
    rule_name VARCHAR NOT NULL,
    metric_type VARCHAR,        -- 'system', 'database', 'application', 'query'
    metric_name VARCHAR,        -- 具体的指标名称
    condition_operator VARCHAR, -- '>', '<', '>=', '<=', '=', '!='
    threshold_value DECIMAL(15,4),
    severity VARCHAR,           -- 'info', 'warning', 'error', 'critical'
    evaluation_window_minutes INTEGER DEFAULT 5, -- 评估窗口
    cooldown_minutes INTEGER DEFAULT 60,        -- 冷却时间
    enabled BOOLEAN DEFAULT TRUE,
    description TEXT
);

-- 告警实例记录
CREATE TABLE alert_instances (
    alert_id INTEGER PRIMARY KEY,
    rule_id INTEGER REFERENCES alert_rules(rule_id),
    node_id VARCHAR,
    metric_value DECIMAL(15,4),
    threshold_value DECIMAL(15,4),
    severity VARCHAR,
    status VARCHAR DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    acknowledged_by VARCHAR,
    resolution_notes TEXT
);

-- 告警评估函数
CREATE FUNCTION evaluate_alerts() AS (
    FOR rule IN (SELECT * FROM alert_rules WHERE enabled = TRUE) LOOP
        -- 计算评估窗口内的指标统计
        DECLARE metric_stats = (
            SELECT
                AVG(metric_value) as avg_value,
                MAX(metric_value) as max_value,
                MIN(metric_value) as min_value,
                COUNT(*) as sample_count
            FROM (
                -- 根据指标类型查询相应的表
                SELECT CASE
                    WHEN rule.metric_type = 'system' THEN
                        (SELECT cpu_user FROM system_metrics
                         WHERE node_id = rule.node_id
                           AND metric_time >= CURRENT_TIMESTAMP - INTERVAL '1 minute' * rule.evaluation_window_minutes)
                    WHEN rule.metric_type = 'database' THEN
                        (SELECT active_connections FROM database_metrics
                         WHERE node_id = rule.node_id
                           AND metric_time >= CURRENT_TIMESTAMP - INTERVAL '1 minute' * rule.evaluation_window_minutes)
                    -- 添加其他指标类型的查询
                END as metric_value
            ) metrics
        );

        -- 检查是否触发告警
        DECLARE should_alert = FALSE;
        CASE rule.condition_operator
            WHEN '>' THEN SELECT metric_stats.avg_value > rule.threshold_value INTO should_alert;
            WHEN '<' THEN SELECT metric_stats.avg_value < rule.threshold_value INTO should_alert;
            WHEN '>=' THEN SELECT metric_stats.avg_value >= rule.threshold_value INTO should_alert;
            WHEN '<=' THEN SELECT metric_stats.avg_value <= rule.threshold_value INTO should_alert;
            WHEN '=' THEN SELECT metric_stats.avg_value = rule.threshold_value INTO should_alert;
            WHEN '!=' THEN SELECT metric_stats.avg_value != rule.threshold_value INTO should_alert;
        END CASE;

        -- 检查冷却时间
        DECLARE last_alert_time = (
            SELECT MAX(triggered_at) FROM alert_instances
            WHERE rule_id = rule.rule_id
              AND node_id = rule.node_id
        );

        IF should_alert AND (last_alert_time IS NULL OR
            last_alert_time < CURRENT_TIMESTAMP - INTERVAL '1 minute' * rule.cooldown_minutes) THEN

            -- 创建告警实例
            INSERT INTO alert_instances (rule_id, node_id, metric_value, threshold_value, severity)
            VALUES (rule.rule_id, rule.node_id, metric_stats.avg_value, rule.threshold_value, rule.severity);

            -- 触发告警通知
            PERFORM send_alert_notification(rule.rule_name, rule.severity, metric_stats.avg_value, rule.threshold_value);
        END IF;
    END LOOP;
);

-- 自动修复动作
CREATE TABLE auto_remediation_actions (
    action_id INTEGER PRIMARY KEY,
    alert_rule_id INTEGER REFERENCES alert_rules(rule_id),
    action_type VARCHAR,        -- 'scale_up', 'restart_service', 'cleanup_cache', 'kill_query'
    action_params JSON,         -- 动作参数
    max_execution_count INTEGER DEFAULT 3, -- 最大执行次数
    cooldown_hours INTEGER DEFAULT 1,      -- 冷却时间（小时）
    enabled BOOLEAN DEFAULT TRUE
);

-- 执行自动修复
CREATE FUNCTION execute_auto_remediation(alert_id INTEGER) AS (
    DECLARE alert = (SELECT * FROM alert_instances WHERE alert_id = alert_id);
    DECLARE actions = (SELECT * FROM auto_remediation_actions WHERE alert_rule_id = alert.rule_id AND enabled = TRUE);

    FOR action IN actions LOOP
        -- 检查是否超过最大执行次数
        DECLARE execution_count = (
            SELECT COUNT(*) FROM remediation_executions
            WHERE action_id = action.action_id
              AND executed_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour' * action.cooldown_hours
        );

        IF execution_count < action.max_execution_count THEN
            -- 执行修复动作
            CASE action.action_type
                WHEN 'scale_up' THEN PERFORM trigger_auto_scale_up(action.action_params);
                WHEN 'restart_service' THEN PERFORM restart_service(action.action_params);
                WHEN 'cleanup_cache' THEN PERFORM cleanup_system_cache();
                WHEN 'kill_query' THEN PERFORM kill_long_running_queries(action.action_params);
            END CASE;

            -- 记录执行结果
            INSERT INTO remediation_executions (alert_id, action_id, status, executed_at)
            VALUES (alert_id, action.action_id, 'executed', CURRENT_TIMESTAMP);
        END IF;
    END LOOP;
);

-- 性能基线和异常检测
CREATE TABLE performance_baselines (
    metric_name VARCHAR,
    baseline_period VARCHAR,    -- 'hourly', 'daily', 'weekly'
    baseline_hour INTEGER,      -- 0-23 for hourly, 0-6 for weekly
    baseline_day INTEGER,       -- 0-6 for weekly
    avg_value DECIMAL(15,4),
    std_dev DECIMAL(15,4),
    min_value DECIMAL(15,4),
    max_value DECIMAL(15,4),
    sample_count INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (metric_name, baseline_period, baseline_hour)
);

-- 计算性能基线
CREATE FUNCTION calculate_performance_baselines() AS (
    -- 按小时计算基线
    INSERT INTO performance_baselines (metric_name, baseline_period, baseline_hour, avg_value, std_dev, min_value, max_value, sample_count)
    SELECT
        'cpu_usage' as metric_name,
        'hourly' as baseline_period,
        EXTRACT(hour FROM metric_time) as baseline_hour,
        AVG(cpu_user) as avg_value,
        STDDEV(cpu_user) as std_dev,
        MIN(cpu_user) as min_value,
        MAX(cpu_user) as max_value,
        COUNT(*) as sample_count
    FROM system_metrics
    WHERE metric_time >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY EXTRACT(hour FROM metric_time)
    ON CONFLICT (metric_name, baseline_period, baseline_hour) DO UPDATE SET
        avg_value = EXCLUDED.avg_value,
        std_dev = EXCLUDED.std_dev,
        min_value = EXCLUDED.min_value,
        max_value = EXCLUDED.max_value,
        sample_count = EXCLUDED.sample_count,
        last_updated = CURRENT_TIMESTAMP;
);

-- 异常检测
CREATE FUNCTION detect_performance_anomalies() AS (
    SELECT
        sm.node_id,
        sm.metric_time,
        sm.cpu_user,
        pb.avg_value as baseline_avg,
        pb.std_dev as baseline_std,
        CASE
            WHEN ABS(sm.cpu_user - pb.avg_value) > 3 * pb.std_dev THEN 'critical_anomaly'
            WHEN ABS(sm.cpu_user - pb.avg_value) > 2 * pb.std_dev THEN 'warning_anomaly'
            ELSE 'normal'
        END as anomaly_level,
        (sm.cpu_user - pb.avg_value) / NULLIF(pb.std_dev, 0) as z_score
    FROM system_metrics sm
    JOIN performance_baselines pb ON
        pb.metric_name = 'cpu_usage' AND
        pb.baseline_period = 'hourly' AND
        pb.baseline_hour = EXTRACT(hour FROM sm.metric_time)
    WHERE sm.metric_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
      AND ABS(sm.cpu_user - pb.avg_value) > 2 * pb.std_dev;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：全栈监控系统</p>
                  <p>构建分布式系统的完整监控解决方案：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现多层级性能指标收集</li>
                    <li>设计智能告警规则引擎</li>
                    <li>构建自动修复和扩缩容</li>
                    <li>实现性能基线和异常检测</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'bigdata-concepts':
        return (
          <BigDataConceptsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'data-lakes':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据湖架构</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"统一存储，灵活分析"</p>

            <Paragraph {...noteProps('p1')}>
              数据湖是一个存储大量原始数据的中央存储库，可以以其原始格式存储结构化、半结构化和非结构化数据。本节介绍数据湖的设计原则和实现方法。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据湖架构设计</h3>

            <CodeBlock
              title="数据湖层次架构"
              code={`-- 数据湖目录管理
CREATE TABLE data_lake_catalog (
    dataset_id VARCHAR PRIMARY KEY,
    dataset_name VARCHAR NOT NULL,
    data_source VARCHAR,           -- 来源系统
    data_format VARCHAR,           -- 'parquet', 'json', 'csv', 'avro', 'orc'
    storage_location VARCHAR,      -- S3路径或本地路径
    partition_scheme JSON,         -- 分区策略
    schema_definition JSON,        -- 数据模式
    data_quality_score DECIMAL(3,2), -- 数据质量评分
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags JSON,                     -- 元数据标签
    lifecycle_policy JSON          -- 生命周期策略
);

-- 数据血缘追踪
CREATE TABLE data_lineage_lake (
    lineage_id INTEGER PRIMARY KEY,
    source_dataset VARCHAR REFERENCES data_lake_catalog(dataset_id),
    target_dataset VARCHAR REFERENCES data_lake_catalog(dataset_id),
    transformation_type VARCHAR,   -- 'ingest', 'transform', 'aggregate', 'join'
    transformation_logic TEXT,     -- 转换逻辑
    execution_engine VARCHAR,      -- 'spark', 'presto', 'duckdb', 'flink'
    execution_params JSON,         -- 执行参数
    data_volume_bytes BIGINT,      -- 处理数据量
    execution_time_seconds DECIMAL(8,2),
    status VARCHAR DEFAULT 'success',
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数据湖访问模式
CREATE TABLE access_patterns (
    pattern_id INTEGER PRIMARY KEY,
    dataset_id VARCHAR REFERENCES data_lake_catalog(dataset_id),
    access_type VARCHAR,           -- 'batch', 'interactive', 'streaming', 'ml'
    query_template TEXT,           -- 查询模板
    frequency_score DECIMAL(5,2), -- 访问频率评分
    performance_requirements JSON, -- 性能要求
    sla_requirements JSON,         -- SLA要求
    last_accessed TIMESTAMP,
    access_count BIGINT DEFAULT 0
);

-- 数据湖分层设计
CREATE TABLE data_layers (
    layer_name VARCHAR PRIMARY KEY,
    layer_type VARCHAR,            -- 'raw', 'cleaned', 'curated', 'aggregated', 'ml_ready'
    storage_class VARCHAR,         -- 'hot', 'warm', 'cold', 'archive'
    retention_policy JSON,         -- 保留策略
    access_pattern VARCHAR,        -- 'frequent', 'occasional', 'rare'
    compression_algorithm VARCHAR, -- 'snappy', 'gzip', 'lz4', 'zstd'
    encryption_enabled BOOLEAN DEFAULT TRUE,
    immutable BOOLEAN DEFAULT FALSE -- 是否不可变
);

-- 数据集分层映射
CREATE TABLE dataset_layers (
    dataset_id VARCHAR REFERENCES data_lake_catalog(dataset_id),
    layer_name VARCHAR REFERENCES data_layers(layer_name),
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP,        -- NULL表示当前有效
    migration_reason VARCHAR,      -- 迁移原因
    migrated_by VARCHAR,
    PRIMARY KEY (dataset_id, layer_name, effective_from)
);

-- 数据湖治理策略
CREATE TABLE governance_policies (
    policy_id INTEGER PRIMARY KEY,
    policy_name VARCHAR NOT NULL,
    policy_type VARCHAR,           -- 'retention', 'security', 'quality', 'access'
    target_scope JSON,             -- 适用范围
    policy_rules JSON,             -- 策略规则
    enforcement_level VARCHAR,     -- 'strict', 'warning', 'monitor'
    active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 策略执行记录
CREATE TABLE policy_executions (
    execution_id INTEGER PRIMARY KEY,
    policy_id INTEGER REFERENCES governance_policies(policy_id),
    target_dataset VARCHAR,
    execution_status VARCHAR,      -- 'success', 'failed', 'warning'
    execution_result JSON,         -- 执行结果详情
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_by VARCHAR
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">数据摄取和处理</h3>

            <CodeBlock
              title="数据湖ETL流程"
              code={`-- 数据摄取配置
CREATE TABLE ingestion_jobs (
    job_id INTEGER PRIMARY KEY,
    job_name VARCHAR NOT NULL,
    source_type VARCHAR,           -- 'database', 'api', 'file', 'stream'
    source_config JSON,            -- 源配置
    target_layer VARCHAR REFERENCES data_layers(layer_name),
    ingestion_schedule JSON,       -- 调度配置
    transformation_pipeline JSON,  -- 处理管道
    quality_checks JSON,           -- 质量检查
    error_handling JSON,           -- 错误处理策略
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 增量摄取跟踪
CREATE TABLE ingestion_watermarks (
    job_id INTEGER REFERENCES ingestion_jobs(job_id),
    watermark_column VARCHAR,      -- 水印列名
    last_value VARCHAR,            -- 最后处理的值
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (job_id, watermark_column)
);

-- 数据转换管道
CREATE TABLE transformation_steps (
    step_id INTEGER PRIMARY KEY,
    pipeline_name VARCHAR,
    step_order INTEGER,
    step_type VARCHAR,             -- 'filter', 'transform', 'aggregate', 'join', 'validate'
    step_config JSON,              -- 步骤配置
    input_schema JSON,             -- 输入模式
    output_schema JSON,            -- 输出模式
    error_handling VARCHAR,        -- 错误处理方式
    active BOOLEAN DEFAULT TRUE
);

-- 数据质量门禁
CREATE TABLE quality_gates (
    gate_id INTEGER PRIMARY KEY,
    dataset_id VARCHAR REFERENCES data_lake_catalog(dataset_id),
    gate_name VARCHAR,
    quality_checks JSON,           -- 质量检查规则
    threshold DECIMAL(3,2),        -- 通过阈值
    blocking BOOLEAN DEFAULT TRUE, -- 是否阻塞发布
    notification_channels JSON,    -- 通知渠道
    last_checked TIMESTAMP,
    last_status VARCHAR            -- 'passed', 'failed', 'warning'
);

-- 执行数据摄取
CREATE FUNCTION execute_data_ingestion(job_id INTEGER) AS (
    DECLARE job_config = (SELECT * FROM ingestion_jobs WHERE job_id = job_id);

    -- 1. 检查水印，确定增量范围
    DECLARE watermark_value = (
        SELECT last_value FROM ingestion_watermarks
        WHERE job_id = job_id AND watermark_column = job_config.source_config->>'watermark_column'
    );

    -- 2. 提取数据
    DECLARE extracted_data = execute_data_extraction(job_config.source_type, job_config.source_config, watermark_value);

    -- 3. 执行转换管道
    DECLARE transformed_data = extracted_data;
    FOR step IN (SELECT * FROM transformation_steps
                 WHERE pipeline_name = job_config.transformation_pipeline->>'name'
                 ORDER BY step_order) LOOP
        transformed_data = execute_transformation_step(transformed_data, step.step_config);
    END LOOP;

    -- 4. 质量检查
    DECLARE quality_result = execute_quality_checks(transformed_data, job_config.quality_checks);

    -- 5. 写入目标层
    IF quality_result.passed OR NOT job_config.quality_checks->>'block_on_failure' THEN
        PERFORM write_to_data_lake(transformed_data, job_config.target_layer, job_config.data_format);

        -- 6. 更新水印
        UPDATE ingestion_watermarks
        SET last_value = quality_result.new_watermark,
            last_updated = CURRENT_TIMESTAMP
        WHERE job_id = job_id;

        -- 7. 记录血缘
        INSERT INTO data_lineage_lake (source_dataset, target_dataset, transformation_type, execution_engine)
        VALUES (job_config.source_config->>'source_dataset', job_config.target_layer, 'ingest', 'duckdb');
    ELSE
        -- 记录质量失败
        INSERT INTO data_quality_issues (job_id, issue_type, details)
        VALUES (job_id, 'quality_gate_failed', quality_result.details);
    END IF;
);

-- 数据湖查询优化
CREATE FUNCTION optimize_lake_query(query_text TEXT, dataset_ids TEXT[]) AS (
    -- 分析查询模式
    DECLARE query_pattern = analyze_query_pattern(query_text);

    -- 确定最佳访问路径
    DECLARE optimal_access = (
        SELECT
            dl.layer_name,
            dl.storage_class,
            ap.access_type,
            ap.performance_requirements
        FROM dataset_layers dl
        JOIN access_patterns ap ON dl.layer_name = ap.dataset_id
        WHERE dl.dataset_id = ANY(dataset_ids)
          AND ap.access_type = query_pattern.access_type
        ORDER BY
            CASE dl.storage_class
                WHEN 'hot' THEN 1
                WHEN 'warm' THEN 2
                WHEN 'cold' THEN 3
                ELSE 4
            END,
            ap.frequency_score DESC
        LIMIT 1
    );

    -- 生成优化后的查询
    RETURN generate_optimized_query(query_text, optimal_access.layer_name, optimal_access.storage_class);
);

-- 数据生命周期管理
CREATE FUNCTION manage_data_lifecycle() AS (
    -- 移动到冷存储
    UPDATE dataset_layers
    SET layer_name = (
        SELECT layer_name FROM data_layers
        WHERE layer_type = 'archive' AND storage_class = 'cold'
        LIMIT 1
    ),
        migration_reason = 'lifecycle_policy'
    WHERE dataset_id IN (
        SELECT dataset_id FROM data_lake_catalog
        WHERE created_at < CURRENT_DATE - INTERVAL '1 year'
          AND layer_name IN (SELECT layer_name FROM data_layers WHERE storage_class = 'hot')
    );

    -- 删除过期数据
    DELETE FROM data_lake_catalog
    WHERE dataset_id IN (
        SELECT dataset_id FROM dataset_layers dl
        JOIN data_layers l ON dl.layer_name = l.layer_name
        WHERE l.retention_policy->>'max_age_days' IS NOT NULL
          AND dl.effective_from < CURRENT_DATE - INTERVAL '1 day' * (l.retention_policy->>'max_age_days')::INTEGER
    );
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：构建企业数据湖</p>
                  <p>为一家零售公司设计完整的数据湖架构：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计多层数据架构</li>
                    <li>实现数据摄取管道</li>
                    <li>构建数据治理策略</li>
                    <li>优化查询访问模式</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'streaming-data':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">流数据处理</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"实时处理连续数据流"</p>

            <Paragraph {...noteProps('p1')}>
              流数据处理专注于对实时、连续到达的数据进行处理和分析。与批处理不同，流处理需要在数据到达时立即进行计算。本节介绍流数据处理的核心概念和技术。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">流处理架构</h3>

            <CodeBlock
              title="流数据管道设计"
              code={`-- 流数据源配置
CREATE TABLE stream_sources (
    source_id VARCHAR PRIMARY KEY,
    source_type VARCHAR,           -- 'kafka', 'kinesis', 'eventhub', 'websocket', 'file'
    connection_config JSON,        -- 连接配置
    topic_stream_name VARCHAR,     -- 主题或流名称
    data_format VARCHAR,           -- 'json', 'avro', 'protobuf', 'csv'
    schema_definition JSON,        -- 数据模式
    partition_count INTEGER,       -- 分区数量
    retention_policy JSON,         -- 保留策略
    active BOOLEAN DEFAULT TRUE
);

-- 流处理作业定义
CREATE TABLE stream_jobs (
    job_id VARCHAR PRIMARY KEY,
    job_name VARCHAR NOT NULL,
    source_id VARCHAR REFERENCES stream_sources(source_id),
    processing_logic TEXT,         -- 处理逻辑（SQL或代码）
    window_type VARCHAR,           -- 'tumbling', 'sliding', 'session'
    window_size_seconds INTEGER,   -- 窗口大小
    slide_interval_seconds INTEGER,-- 滑动间隔
    output_destination JSON,       -- 输出目的地
    state_backend VARCHAR,         -- 状态后端
    checkpoint_interval_seconds INTEGER DEFAULT 60,
    parallelism INTEGER DEFAULT 1, -- 并行度
    status VARCHAR DEFAULT 'stopped'
);

-- 流数据窗口聚合
CREATE TABLE stream_aggregations (
    aggregation_id INTEGER PRIMARY KEY,
    job_id VARCHAR REFERENCES stream_jobs(job_id),
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    group_by_fields JSON,          -- 分组字段
    aggregate_functions JSON,      -- 聚合函数
    result_data JSON,              -- 聚合结果
    record_count BIGINT,           -- 处理记录数
    processing_time_ms INTEGER,    -- 处理时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 流处理状态管理
CREATE TABLE stream_state (
    job_id VARCHAR,
    state_key VARCHAR,             -- 状态键
    state_value JSON,              -- 状态值
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ttl_seconds INTEGER,           -- 生存时间
    PRIMARY KEY (job_id, state_key)
);

-- 事件时间和处理时间
CREATE TABLE event_time_processing (
    event_id VARCHAR PRIMARY KEY,
    event_time TIMESTAMP,          -- 事件发生时间
    ingestion_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 数据摄取时间
    processing_time TIMESTAMP,     -- 数据处理时间
    watermark TIMESTAMP,           -- 水印时间
    lateness_seconds INTEGER,      -- 延迟时间
    dropped BOOLEAN DEFAULT FALSE  -- 是否因延迟被丢弃
);

-- 水印管理
CREATE FUNCTION update_watermark(job_id VARCHAR, current_event_time TIMESTAMP) AS (
    DECLARE max_lateness_seconds = 300; -- 5分钟最大延迟

    -- 更新作业的水印
    UPDATE stream_jobs
    SET watermark = GREATEST(
        COALESCE(watermark, '1970-01-01'::TIMESTAMP),
        current_event_time - INTERVAL '1 second' * max_lateness_seconds
    )
    WHERE job_id = job_id;

    -- 清理过期状态
    DELETE FROM stream_state
    WHERE job_id = job_id
      AND last_updated < CURRENT_TIMESTAMP - INTERVAL '1 second' * ttl_seconds;
);

-- 窗口聚合计算
CREATE FUNCTION process_window_aggregation(
    job_id VARCHAR,
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    event_data JSON
) AS (
    DECLARE window_key = job_id || '_' || window_start::VARCHAR || '_' || window_end::VARCHAR;

    -- 获取或创建窗口状态
    DECLARE window_state = COALESCE(
        (SELECT state_value FROM stream_state WHERE job_id = job_id AND state_key = window_key),
        '{"count": 0, "sum": 0, "min": null, "max": null, "values": []}'::JSON
    );

    -- 更新窗口状态
    DECLARE new_state = json_set(
        window_state,
        'count', window_state->>'count'::INTEGER + 1
    );

    -- 根据聚合类型更新状态
    IF event_data ? 'amount' THEN
        new_state = json_set(new_state, 'sum', (new_state->>'sum')::DECIMAL + (event_data->>'amount')::DECIMAL);
    END IF;

    IF event_data ? 'value' THEN
        DECLARE current_min = new_state->>'min';
        DECLARE current_max = new_state->>'max';
        DECLARE event_value = (event_data->>'value')::DECIMAL;

        new_state = json_set(new_state, 'min',
            LEAST(COALESCE(current_min::DECIMAL, event_value), event_value)::VARCHAR);
        new_state = json_set(new_state, 'max',
            GREATEST(COALESCE(current_max::DECIMAL, event_value), event_value)::VARCHAR);
    END IF;

    -- 更新状态存储
    INSERT INTO stream_state (job_id, state_key, state_value, last_updated)
    VALUES (job_id, window_key, new_state, CURRENT_TIMESTAMP)
    ON CONFLICT (job_id, state_key) DO UPDATE SET
        state_value = EXCLUDED.state_value,
        last_updated = EXCLUDED.last_updated;

    -- 检查窗口是否完成
    IF CURRENT_TIMESTAMP >= window_end THEN
        -- 输出窗口结果
        INSERT INTO stream_aggregations (job_id, window_start, window_end, result_data, record_count)
        VALUES (job_id, window_start, window_end, new_state, new_state->>'count'::INTEGER);

        -- 清理窗口状态
        DELETE FROM stream_state WHERE job_id = job_id AND state_key = window_key;
    END IF;
);

-- 流数据质量监控
CREATE TABLE stream_quality_metrics (
    job_id VARCHAR,
    metric_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    records_processed BIGINT,
    records_dropped BIGINT,
    avg_processing_latency_ms DECIMAL(8,2),
    max_processing_latency_ms INTEGER,
    watermark_delay_seconds INTEGER,
    checkpoint_duration_ms INTEGER,
    backpressure_ratio DECIMAL(5,2), -- 背压比率
    PRIMARY KEY (job_id, metric_time)
);

-- 实时质量检查
CREATE FUNCTION monitor_stream_quality(job_id VARCHAR) AS (
    DECLARE recent_metrics = (
        SELECT
            AVG(records_processed) as avg_processed,
            AVG(records_dropped) as avg_dropped,
            AVG(avg_processing_latency_ms) as avg_latency,
            MAX(max_processing_latency_ms) as max_latency
        FROM stream_quality_metrics
        WHERE job_id = job_id
          AND metric_time >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
    );

    -- 检查质量阈值
    IF recent_metrics.avg_latency > 1000 THEN -- 1秒平均延迟
        INSERT INTO stream_alerts (job_id, alert_type, severity, message)
        VALUES (job_id, 'high_latency', 'warning', '平均处理延迟超过1秒');
    END IF;

    IF recent_metrics.avg_dropped > recent_metrics.avg_processed * 0.1 THEN -- 10%丢弃率
        INSERT INTO stream_alerts (job_id, alert_type, severity, message)
        VALUES (job_id, 'high_drop_rate', 'error', '数据丢弃率超过10%');
    END IF;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">复杂事件处理</h3>

            <CodeBlock
              title="CEP模式和时序分析"
              code={`-- 复杂事件模式定义
CREATE TABLE cep_patterns (
    pattern_id INTEGER PRIMARY KEY,
    pattern_name VARCHAR NOT NULL,
    pattern_type VARCHAR,          -- 'sequence', 'and', 'or', 'negation', 'iteration'
    pattern_definition JSON,       -- 模式定义
    time_window_seconds INTEGER,   -- 时间窗口
    max_occurs INTEGER,            -- 最大发生次数
    condition_expression TEXT,     -- 条件表达式
    action_definition JSON,        -- 触发动作
    active BOOLEAN DEFAULT TRUE
);

-- 事件序列检测
CREATE TABLE event_sequences (
    sequence_id VARCHAR PRIMARY KEY,
    pattern_id INTEGER REFERENCES cep_patterns(pattern_id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    events JSON,                   -- 事件序列
    matched_conditions JSON,       -- 匹配的条件
    triggered_actions JSON,        -- 触发的动作
    status VARCHAR DEFAULT 'active'
);

-- 事件序列匹配算法
CREATE FUNCTION match_event_sequence(pattern_id INTEGER, event_stream JSON) AS (
    DECLARE pattern = (SELECT * FROM cep_patterns WHERE pattern_id = pattern_id);
    DECLARE matched = FALSE;
    DECLARE sequence_events = '[]'::JSON;

    -- 简单的序列匹配逻辑
    CASE pattern.pattern_type
        WHEN 'sequence' THEN
            -- 检查事件是否按定义的顺序出现
            matched = check_sequence_pattern(event_stream, pattern.pattern_definition);
            IF matched THEN
                sequence_events = extract_sequence_events(event_stream, pattern.pattern_definition);
            END IF;

        WHEN 'and' THEN
            -- 检查所有条件事件是否都出现（顺序无关）
            matched = check_conjunction_pattern(event_stream, pattern.pattern_definition);

        WHEN 'iteration' THEN
            -- 检查事件是否重复出现指定次数
            DECLARE occur_count = count_pattern_occurrences(event_stream, pattern.pattern_definition);
            matched = occur_count >= pattern.max_occurs;
    END CASE;

    IF matched THEN
        -- 记录匹配的序列
        INSERT INTO event_sequences (pattern_id, start_time, end_time, events, matched_conditions)
        VALUES (
            pattern_id,
            CURRENT_TIMESTAMP - INTERVAL '1 second' * pattern.time_window_seconds,
            CURRENT_TIMESTAMP,
            sequence_events,
            pattern.condition_expression::JSON
        );

        -- 执行触发动作
        PERFORM execute_pattern_actions(pattern.action_definition);
    END IF;

    RETURN matched;
);

-- 时序模式分析
CREATE TABLE temporal_patterns (
    pattern_id INTEGER PRIMARY KEY,
    pattern_name VARCHAR,
    time_series_column VARCHAR,    -- 时间序列列
    pattern_type VARCHAR,          -- 'trend', 'seasonal', 'cyclical', 'irregular'
    analysis_window_days INTEGER,  -- 分析窗口
    detection_algorithm VARCHAR,   -- 'arima', 'prophet', 'lstm', 'statistical'
    model_parameters JSON,         -- 模型参数
    accuracy_metrics JSON,         -- 准确性指标
    last_trained TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- 趋势检测
CREATE FUNCTION detect_trends(time_series_data JSON, window_days INTEGER DEFAULT 30) AS (
    -- 计算移动平均和趋势
    DECLARE trend_analysis = (
        SELECT
            AVG(value) as mean_value,
            STDDEV(value) as value_stddev,
            -- 计算线性趋势斜率
            (SUM((row_number - avg_row) * value) / SUM(POWER(row_number - avg_row, 2))) as trend_slope,
            -- 计算R²值
            POWER(
                SUM((row_number - avg_row) * value) /
                SQRT(SUM(POWER(row_number - avg_row, 2)) * SUM(POWER(value - avg_value, 2))),
                2
            ) as r_squared
        FROM (
            SELECT
                ROW_NUMBER() OVER (ORDER BY timestamp) as row_number,
                value::DECIMAL as value
            FROM json_array_elements(time_series_data) as elem,
                 json_extract(elem, '$.timestamp') as timestamp,
                 json_extract(elem, '$.value') as value
            WHERE timestamp >= CURRENT_DATE - INTERVAL '1 day' * window_days
        ) series
        CROSS JOIN (
            SELECT AVG(ROW_NUMBER() OVER (ORDER BY timestamp)) as avg_row,
                   AVG(value::DECIMAL) as avg_value
            FROM json_array_elements(time_series_data) as elem,
                 json_extract(elem, '$.timestamp') as timestamp,
                 json_extract(elem, '$.value') as value
        ) stats
    );

    RETURN json_build_object(
        'trend_direction', CASE
            WHEN trend_analysis.trend_slope > 0.1 THEN 'increasing'
            WHEN trend_analysis.trend_slope < -0.1 THEN 'decreasing'
            ELSE 'stable'
        END,
        'trend_strength', ABS(trend_analysis.trend_slope),
        'r_squared', trend_analysis.r_squared,
        'confidence', CASE
            WHEN trend_analysis.r_squared > 0.8 THEN 'high'
            WHEN trend_analysis.r_squared > 0.6 THEN 'medium'
            ELSE 'low'
        END
    );
);

-- 异常检测
CREATE FUNCTION detect_anomalies(time_series_data JSON, sensitivity DECIMAL DEFAULT 3.0) AS (
    -- 计算统计异常检测
    DECLARE stats = (
        SELECT
            AVG(value::DECIMAL) as mean_value,
            STDDEV(value::DECIMAL) as std_dev
        FROM json_array_elements(time_series_data) as elem,
             json_extract(elem, '$.value') as value
    );

    -- 识别异常点
    SELECT json_agg(
        json_build_object(
            'timestamp', timestamp,
            'value', value,
            'z_score', ABS(value::DECIMAL - stats.mean_value) / NULLIF(stats.std_dev, 0),
            'is_anomaly', ABS(value::DECIMAL - stats.mean_value) > sensitivity * stats.std_dev
        )
    )
    FROM json_array_elements(time_series_data) as elem,
         json_extract(elem, '$.timestamp') as timestamp,
         json_extract(elem, '$.value') as value;
);

-- 季节性分析
CREATE FUNCTION analyze_seasonality(time_series_data JSON, period_type VARCHAR DEFAULT 'daily') AS (
    DECLARE period_seconds = CASE
        WHEN period_type = 'hourly' THEN 3600
        WHEN period_type = 'daily' THEN 86400
        WHEN period_type = 'weekly' THEN 604800
        ELSE 86400
    END;

    -- 计算周期性模式
    SELECT
        period_type,
        COUNT(*) as data_points,
        AVG(value::DECIMAL) as overall_mean,
        json_object_agg(
            period_offset,
            json_build_object('mean', period_mean, 'count', period_count)
        ) as seasonal_pattern
    FROM (
        SELECT
            MOD(EXTRACT(epoch FROM timestamp::TIMESTAMP) / period_seconds, 1) * period_seconds as period_offset,
            AVG(value::DECIMAL) as period_mean,
            COUNT(*) as period_count
        FROM json_array_elements(time_series_data) as elem,
             json_extract(elem, '$.timestamp') as timestamp,
             json_extract(elem, '$.value') as value
        GROUP BY MOD(EXTRACT(epoch FROM timestamp::TIMESTAMP) / period_seconds, 1) * period_seconds
    ) seasonal;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：实时用户行为分析</p>
                  <p>构建实时用户行为分析系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计流数据处理管道</li>
                    <li>实现滑动窗口聚合</li>
                    <li>构建复杂事件检测</li>
                    <li>实现实时告警系统</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'batch-processing':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">批处理优化</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"高效处理大规模数据集"</p>

            <Paragraph {...noteProps('p1')}>
              批处理专注于对大量历史数据进行批量计算和分析。与流处理相比，批处理可以进行更复杂的计算，但延迟较高。本节介绍批处理的优化技术和最佳实践。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">批处理架构设计</h3>

            <CodeBlock
              title="批处理作业编排和优化"
              code={`-- 批处理作业定义
CREATE TABLE batch_jobs (
    job_id VARCHAR PRIMARY KEY,
    job_name VARCHAR NOT NULL,
    job_type VARCHAR,              -- 'etl', 'analytics', 'ml_training', 'report'
    input_datasets JSON,           -- 输入数据集列表
    output_datasets JSON,          -- 输出数据集列表
    processing_engine VARCHAR,     -- 'duckdb', 'spark', 'presto', 'athena'
    execution_config JSON,         -- 执行配置
    schedule_config JSON,          -- 调度配置
    dependency_jobs JSON,          -- 依赖作业
    retry_config JSON,             -- 重试配置
    sla_requirements JSON,         -- SLA要求
    status VARCHAR DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 作业执行实例
CREATE TABLE job_executions (
    execution_id VARCHAR PRIMARY KEY,
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    execution_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_end TIMESTAMP,
    status VARCHAR,                -- 'running', 'success', 'failed', 'cancelled'
    exit_code INTEGER,
    error_message TEXT,
    metrics JSON,                  -- 执行指标
    resource_usage JSON,           -- 资源使用情况
    log_location VARCHAR,          -- 日志位置
    triggered_by VARCHAR           -- 触发者
);

-- 数据分片策略
CREATE TABLE data_partitioning (
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    partition_column VARCHAR,      -- 分区列
    partition_type VARCHAR,        -- 'hash', 'range', 'list'
    partition_count INTEGER,       -- 分区数量
    partition_bounds JSON,         -- 分区边界
    skew_detection_enabled BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (job_id, partition_column)
);

-- 执行数据分片
CREATE FUNCTION create_data_partitions(job_id VARCHAR, table_name VARCHAR, partition_config JSON) AS (
    DECLARE partition_type = partition_config->>'type';
    DECLARE partition_count = (partition_config->>'count')::INTEGER;

    -- 创建分片表
    CASE partition_type
        WHEN 'hash' THEN
            -- 哈希分区
            FOR i IN 0..partition_count-1 LOOP
                EXECUTE format('CREATE TABLE %I_partition_%s AS SELECT * FROM %I WHERE ABS(hash(%I)) %% %s = %s',
                    table_name, i, table_name, partition_config->>'column', partition_count, i);
            END LOOP;

        WHEN 'range' THEN
            -- 范围分区
            DECLARE bounds = partition_config->>'bounds';
            FOR i IN 0..json_array_length(bounds)-2 LOOP
                DECLARE lower_bound = json_extract(bounds, format('$[%s]', i));
                DECLARE upper_bound = json_extract(bounds, format('$[%s]', i+1));

                EXECUTE format('CREATE TABLE %I_partition_%s AS SELECT * FROM %I WHERE %I >= %s AND %I < %s',
                    table_name, i, table_name, partition_config->>'column', lower_bound, partition_config->>'column', upper_bound);
            END LOOP;
    END CASE;
);

-- 批处理优化配置
CREATE TABLE optimization_configs (
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    optimization_type VARCHAR,     -- 'predicate_pushdown', 'column_pruning', 'partition_pruning'
    config_params JSON,
    enabled BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 1,    -- 优化优先级
    PRIMARY KEY (job_id, optimization_type)
);

-- 查询优化执行
CREATE FUNCTION optimize_batch_query(query_text TEXT, job_id VARCHAR) AS (
    DECLARE optimizations = (SELECT array_agg(optimization_type) FROM optimization_configs
                           WHERE job_id = job_id AND enabled = TRUE ORDER BY priority);

    DECLARE optimized_query = query_text;

    -- 应用各种优化
    FOREACH opt IN ARRAY optimizations LOOP
        optimized_query = apply_optimization(optimized_query, opt);
    END LOOP;

    RETURN optimized_query;
);

-- 谓词下推优化
CREATE FUNCTION apply_predicate_pushdown(query_text TEXT) AS (
    -- 解析查询，识别可以下推的谓词
    -- 这里需要实现SQL解析逻辑
    RETURN query_text; -- 简化实现
);

-- 作业依赖管理
CREATE TABLE job_dependencies (
    upstream_job VARCHAR REFERENCES batch_jobs(job_id),
    downstream_job VARCHAR REFERENCES batch_jobs(job_id),
    dependency_type VARCHAR,       -- 'success', 'completion', 'data_ready'
    condition_expression TEXT,     -- 依赖条件
    timeout_minutes INTEGER,       -- 超时时间
    retry_count INTEGER DEFAULT 0,
    PRIMARY KEY (upstream_job, downstream_job)
);

-- 检查作业依赖
CREATE FUNCTION check_job_dependencies(job_id VARCHAR) AS (
    SELECT
        jd.upstream_job,
        je.status as upstream_status,
        je.execution_end,
        CASE
            WHEN jd.dependency_type = 'success' AND je.status = 'success' THEN TRUE
            WHEN jd.dependency_type = 'completion' AND je.status IN ('success', 'failed') THEN TRUE
            WHEN jd.dependency_type = 'data_ready' AND check_data_ready(jd.upstream_job) THEN TRUE
            ELSE FALSE
        END as dependency_satisfied
    FROM job_dependencies jd
    LEFT JOIN job_executions je ON jd.upstream_job = je.job_id
        AND je.execution_end = (SELECT MAX(execution_end) FROM job_executions WHERE job_id = jd.upstream_job)
    WHERE jd.downstream_job = job_id;
);

-- 资源分配和调度
CREATE TABLE resource_allocations (
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    resource_type VARCHAR,         -- 'cpu', 'memory', 'disk', 'network'
    requested_amount DECIMAL(10,2),
    allocated_amount DECIMAL(10,2),
    allocation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deallocation_time TIMESTAMP
);

-- 智能资源分配
CREATE FUNCTION allocate_job_resources(job_id VARCHAR) AS (
    DECLARE job_config = (SELECT * FROM batch_jobs WHERE job_id = job_id);
    DECLARE available_resources = get_cluster_resources();

    -- 计算资源需求
    DECLARE resource_needs = calculate_resource_requirements(job_config);

    -- 检查资源可用性
    IF check_resource_availability(resource_needs, available_resources) THEN
        -- 分配资源
        INSERT INTO resource_allocations (job_id, resource_type, requested_amount, allocated_amount)
        SELECT
            job_id,
            resource_type,
            requested_amount,
            LEAST(requested_amount, available_amount)
        FROM json_object_keys(resource_needs) as resource_type,
             json_extract(resource_needs, format('$.%s', resource_type)) as requested_amount,
             json_extract(available_resources, format('$.%s', resource_type)) as available_amount;

        RETURN TRUE;
    ELSE
        -- 资源不足，加入等待队列
        INSERT INTO job_queue (job_id, queue_reason, queued_at)
        VALUES (job_id, 'insufficient_resources', CURRENT_TIMESTAMP);

        RETURN FALSE;
    END IF;
);

-- 作业调度器
CREATE FUNCTION schedule_batch_jobs() AS (
    -- 获取可调度的作业
    DECLARE schedulable_jobs = (
        SELECT job_id FROM batch_jobs
        WHERE status = 'scheduled'
          AND check_schedule_time(schedule_config)
          AND check_job_dependencies(job_id)
    );

    -- 为每个作业分配资源并执行
    FOREACH job_id IN ARRAY schedulable_jobs LOOP
        IF allocate_job_resources(job_id) THEN
            PERFORM execute_batch_job(job_id);
        END IF;
    END LOOP;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">性能优化技术</h3>

            <CodeBlock
              title="批处理性能优化策略"
              code={`-- 缓存管理
CREATE TABLE cache_metadata (
    cache_key VARCHAR PRIMARY KEY,
    data_location VARCHAR,         -- 缓存数据位置
    data_size_bytes BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP,
    access_count BIGINT DEFAULT 0,
    ttl_seconds INTEGER,           -- 生存时间
    compression_type VARCHAR,      -- 压缩类型
    checksum VARCHAR               -- 数据校验和
);

-- 智能缓存策略
CREATE FUNCTION get_cached_data(query_hash VARCHAR, ttl_seconds INTEGER DEFAULT 3600) AS (
    DECLARE cache_entry = (SELECT * FROM cache_metadata WHERE cache_key = query_hash);

    IF cache_entry IS NOT NULL THEN
        -- 检查缓存是否有效
        IF CURRENT_TIMESTAMP - cache_entry.created_at < INTERVAL '1 second' * ttl_seconds THEN
            -- 更新访问统计
            UPDATE cache_metadata
            SET last_accessed = CURRENT_TIMESTAMP,
                access_count = access_count + 1
            WHERE cache_key = query_hash;

            -- 返回缓存数据
            RETURN load_cached_data(cache_entry.data_location);
        ELSE
            -- 缓存过期，删除
            PERFORM delete_cached_data(cache_entry.data_location);
            DELETE FROM cache_metadata WHERE cache_key = query_hash;
        END IF;
    END IF;

    RETURN NULL;
);

-- 结果缓存
CREATE FUNCTION cache_query_result(query_text TEXT, result_data JSON) AS (
    DECLARE query_hash = md5(query_text);
    DECLARE data_size = octet_length(result_data::TEXT);
    DECLARE cache_location = format('/cache/%s/%s.json', LEFT(query_hash, 2), query_hash);

    -- 存储结果数据
    PERFORM save_data_to_cache(cache_location, result_data);

    -- 记录缓存元数据
    INSERT INTO cache_metadata (cache_key, data_location, data_size_bytes, ttl_seconds)
    VALUES (query_hash, cache_location, data_size, 3600); -- 1小时TTL
);

-- 中间结果物化
CREATE TABLE materialized_intermediates (
    step_id VARCHAR,
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    intermediate_data JSON,        -- 中间结果
    data_size_bytes BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ttl_seconds INTEGER DEFAULT 3600,
    PRIMARY KEY (step_id, job_id)
);

-- 增量计算检测
CREATE FUNCTION detect_incremental_opportunity(job_id VARCHAR, input_datasets JSON) AS (
    -- 检查输入数据是否有增量
    DECLARE has_incremental_data = FALSE;

    FOR input_dataset IN (SELECT json_array_elements(input_datasets)) LOOP
        DECLARE dataset_changes = get_dataset_changes(input_dataset::TEXT, '1 day'::INTERVAL);
        IF dataset_changes.record_count > 0 THEN
            has_incremental_data = TRUE;
            EXIT;
        END IF;
    END LOOP;

    IF has_incremental_data THEN
        -- 计算增量处理范围
        RETURN calculate_incremental_range(job_id, input_datasets);
    ELSE
        RETURN NULL; -- 需要全量处理
    END IF;
);

-- 并行执行优化
CREATE TABLE parallel_execution_plans (
    job_id VARCHAR REFERENCES batch_jobs(job_id),
    stage_id INTEGER,              -- 执行阶段
    parallelism_degree INTEGER,    -- 并行度
    stage_type VARCHAR,            -- 'map', 'reduce', 'join', 'aggregate'
    input_partitions JSON,         -- 输入分区
    output_partitioning JSON,      -- 输出分区策略
    resource_requirements JSON,    -- 资源需求
    PRIMARY KEY (job_id, stage_id)
);

-- 生成并行执行计划
CREATE FUNCTION generate_parallel_plan(job_id VARCHAR) AS (
    DECLARE job_config = (SELECT * FROM batch_jobs WHERE job_id = job_id);
    DECLARE input_stats = analyze_input_datasets(job_config.input_datasets);

    -- 确定最佳并行度
    DECLARE optimal_parallelism = LEAST(
        input_stats.partition_count,
        (SELECT cpu_cores FROM cluster_config),
        32 -- 最大并行度限制
    );

    -- 生成执行阶段
    INSERT INTO parallel_execution_plans (job_id, stage_id, parallelism_degree, stage_type, input_partitions)
    SELECT
        job_id,
        ROW_NUMBER() OVER (ORDER BY stage_order),
        optimal_parallelism,
        stage_type,
        input_partitions
    FROM generate_execution_stages(job_config, optimal_parallelism);

    -- 优化数据分区
    UPDATE parallel_execution_plans
    SET output_partitioning = optimize_partitioning(input_partitions, stage_type)
    WHERE job_id = job_id;
);

-- 倾斜数据处理
CREATE TABLE data_skew_detection (
    job_id VARCHAR,
    stage_id INTEGER,
    partition_id INTEGER,
    record_count BIGINT,
    data_size_bytes BIGINT,
    processing_time_seconds DECIMAL(8,2),
    skew_ratio DECIMAL(5,2),       -- 倾斜比率
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (job_id, stage_id, partition_id)
);

-- 检测和处理数据倾斜
CREATE FUNCTION handle_data_skew(job_id VARCHAR, stage_id INTEGER) AS (
    -- 计算分区统计
    INSERT INTO data_skew_detection (job_id, stage_id, partition_id, record_count, data_size_bytes, processing_time_seconds)
    SELECT
        job_id,
        stage_id,
        partition_id,
        record_count,
        data_size_bytes,
        processing_time_seconds
    FROM get_partition_stats(job_id, stage_id);

    -- 计算倾斜比率
    UPDATE data_skew_detection
    SET skew_ratio = record_count::DECIMAL / avg_record_count
    FROM (
        SELECT AVG(record_count) as avg_record_count
        FROM data_skew_detection
        WHERE job_id = job_id AND stage_id = stage_id
    ) stats
    WHERE job_id = job_id AND stage_id = stage_id;

    -- 识别倾斜分区
    DECLARE skewed_partitions = (
        SELECT array_agg(partition_id)
        FROM data_skew_detection
        WHERE job_id = job_id AND stage_id = stage_id AND skew_ratio > 2.0
    );

    IF skewed_partitions IS NOT NULL THEN
        -- 重新分区倾斜数据
        PERFORM repartition_skewed_data(job_id, stage_id, skewed_partitions);
    END IF;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：大规模数据分析作业</p>
                  <p>构建电商数据分析批处理系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计作业依赖和调度</li>
                    <li>实现数据分区和并行处理</li>
                    <li>构建缓存和中间结果管理</li>
                    <li>优化查询性能和资源利用</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'data-compression':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据压缩技术</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"减少存储空间，提升I/O性能"</p>

            <Paragraph {...noteProps('p1')}>
              数据压缩可以显著减少存储空间需求并提升I/O性能。本节介绍不同类型的压缩算法及其在大数据处理中的应用。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">压缩算法选择</h3>

            <CodeBlock
              title="压缩策略和配置"
              code={`-- 压缩配置表
CREATE TABLE compression_configs (
    table_name VARCHAR,
    column_name VARCHAR,
    compression_algorithm VARCHAR, -- 'snappy', 'gzip', 'lz4', 'zstd', 'brotli'
    compression_level INTEGER,     -- 压缩级别 (1-9)
    dictionary_size_kb INTEGER,    -- 字典大小
    adaptive_compression BOOLEAN DEFAULT FALSE, -- 自适应压缩
    sample_data_used BOOLEAN DEFAULT TRUE,      -- 使用样本数据优化
    PRIMARY KEY (table_name, column_name)
);

-- 压缩效果评估
CREATE TABLE compression_metrics (
    table_name VARCHAR,
    column_name VARCHAR,
    original_size_bytes BIGINT,
    compressed_size_bytes BIGINT,
    compression_ratio DECIMAL(5,2),
    compression_time_ms INTEGER,
    decompression_time_ms INTEGER,
    compression_algorithm VARCHAR,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 智能压缩算法选择
CREATE FUNCTION choose_compression_algorithm(table_name VARCHAR, column_name VARCHAR) AS (
    -- 分析列数据特征
    DECLARE column_stats = analyze_column_data(table_name, column_name);

    -- 根据数据特征选择最佳算法
    SELECT
        CASE
            WHEN column_stats.data_type = 'text' AND column_stats.cardinality > 1000 THEN 'zstd'  -- 高压缩比
            WHEN column_stats.data_type = 'numeric' AND column_stats.sorted_ratio > 0.8 THEN 'lz4' -- 快速压缩
            WHEN column_stats.compressibility > 0.7 THEN 'gzip'  -- 通用高压缩
            ELSE 'snappy'  -- 快速通用
        END as recommended_algorithm,
        CASE
            WHEN column_stats.data_type = 'text' THEN 6  -- 中等压缩级别
            WHEN column_stats.compressibility > 0.8 THEN 9 -- 最大压缩
            ELSE 3  -- 快速压缩
        END as recommended_level;
);

-- 应用压缩配置
CREATE FUNCTION apply_compression_config(table_name VARCHAR, column_name VARCHAR) AS (
    DECLARE config = choose_compression_algorithm(table_name, column_name);

    INSERT INTO compression_configs (table_name, column_name, compression_algorithm, compression_level)
    VALUES (table_name, column_name, config.recommended_algorithm, config.recommended_level);

    -- 重新压缩现有数据
    PERFORM recompress_column_data(table_name, column_name, config.recommended_algorithm, config.recommended_level);
);

-- 压缩效果监控
CREATE FUNCTION monitor_compression_effectiveness() AS (
    SELECT
        table_name,
        column_name,
        compression_algorithm,
        AVG(compression_ratio) as avg_ratio,
        AVG(compression_time_ms) as avg_compress_time,
        AVG(decompression_time_ms) as avg_decompress_time,
        COUNT(*) as assessments
    FROM compression_metrics
    WHERE assessed_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY table_name, column_name, compression_algorithm
    ORDER BY avg_ratio DESC;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：数据压缩优化</p>
                  <p>为数据仓库实现智能压缩策略：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>分析数据压缩特性</li>
                    <li>选择合适的压缩算法</li>
                    <li>评估压缩效果和性能</li>
                    <li>实现自动化压缩配置</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'memory-management':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">内存管理策略</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"优化内存使用，提升查询性能"</p>

            <Paragraph {...noteProps('p1')}>
              有效的内存管理是大数据处理系统性能优化的关键。本节介绍内存分配、缓存策略和垃圾回收优化技术。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">内存分配优化</h3>

            <CodeBlock
              title="内存使用监控和优化"
              code={`-- 内存使用统计
CREATE TABLE memory_usage_stats (
    process_id VARCHAR,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_memory_mb BIGINT,
    used_memory_mb BIGINT,
    free_memory_mb BIGINT,
    cache_memory_mb BIGINT,
    swap_memory_mb BIGINT,
    memory_pressure DECIMAL(3,2)  -- 内存压力 (0-1)
);

-- 查询内存使用监控
CREATE TABLE query_memory_usage (
    query_id VARCHAR,
    peak_memory_mb BIGINT,
    avg_memory_mb BIGINT,
    memory_efficiency DECIMAL(5,2), -- 内存效率评分
    spilled_to_disk BOOLEAN,
    spill_size_mb BIGINT,
    execution_time_ms INTEGER
);

-- 内存分配策略
CREATE FUNCTION optimize_memory_allocation(query_complexity VARCHAR) AS (
    DECLARE base_memory_mb = 1024; -- 基础内存分配

    -- 根据查询复杂度调整内存分配
    DECLARE memory_multiplier = CASE
        WHEN query_complexity = 'simple' THEN 1.0
        WHEN query_complexity = 'medium' THEN 2.0
        WHEN query_complexity = 'complex' THEN 4.0
        WHEN query_complexity = 'very_complex' THEN 8.0
        ELSE 1.0
    END;

    RETURN (base_memory_mb * memory_multiplier)::INTEGER;
);

-- 内存压力检测
CREATE FUNCTION detect_memory_pressure() AS (
    DECLARE current_usage = (SELECT AVG(used_memory_mb) / AVG(total_memory_mb)
                           FROM memory_usage_stats
                           WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '5 minutes');

    RETURN CASE
        WHEN current_usage > 0.9 THEN 'critical'
        WHEN current_usage > 0.8 THEN 'high'
        WHEN current_usage > 0.7 THEN 'medium'
        WHEN current_usage > 0.6 THEN 'low'
        ELSE 'normal'
    END;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：内存优化实践</p>
                  <p>优化大数据查询的内存使用：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>监控内存使用模式</li>
                    <li>实现内存分配策略</li>
                    <li>优化缓存使用</li>
                    <li>处理内存溢出场景</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'parallel-computing':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">并行计算</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"利用多核CPU，提升计算性能"</p>

            <Paragraph {...noteProps('p1')}>
              并行计算通过同时执行多个任务来提升处理性能。本节介绍并行查询执行、任务调度和负载均衡技术。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并行执行策略</h3>

            <CodeBlock
              title="并行查询优化"
              code={`-- 并行执行配置
CREATE TABLE parallel_execution_config (
    query_type VARCHAR PRIMARY KEY,
    max_parallelism INTEGER,
    min_partition_size INTEGER,  -- 最小分区大小
    adaptive_parallelism BOOLEAN DEFAULT TRUE
);

-- 并行度计算
CREATE FUNCTION calculate_optimal_parallelism(query_complexity VARCHAR, data_size_gb DECIMAL) AS (
    DECLARE available_cores = (SELECT cpu_count FROM system_info);
    DECLARE memory_per_core_gb = 2.0; -- 每个核心2GB内存

    -- 基于数据大小的并行度
    DECLARE size_based_parallelism = LEAST(
        CEIL(data_size_gb / 10.0), -- 每10GB数据一个并行任务
        available_cores
    );

    -- 基于查询复杂度的并行度
    DECLARE complexity_multiplier = CASE
        WHEN query_complexity = 'simple' THEN 0.5
        WHEN query_complexity = 'medium' THEN 1.0
        WHEN query_complexity = 'complex' THEN 1.5
        ELSE 1.0
    END;

    RETURN LEAST(
        CEIL(size_based_parallelism * complexity_multiplier),
        available_cores
    );
);

-- 任务并行调度
CREATE TABLE parallel_tasks (
    task_id VARCHAR PRIMARY KEY,
    parent_query_id VARCHAR,
    task_type VARCHAR,  -- 'scan', 'filter', 'aggregate', 'join'
    partition_info JSON,
    assigned_worker INTEGER,
    status VARCHAR DEFAULT 'pending',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    execution_time_ms INTEGER
);

-- 工作负载分配
CREATE FUNCTION distribute_parallel_tasks(query_id VARCHAR, task_list JSON) AS (
    DECLARE worker_count = (SELECT COUNT(*) FROM active_workers);
    DECLARE task_index = 0;

    FOR task IN (SELECT json_array_elements(task_list)) LOOP
        DECLARE assigned_worker = (task_index % worker_count) + 1;

        INSERT INTO parallel_tasks (task_id, parent_query_id, task_type, partition_info, assigned_worker)
        VALUES (
            format('%s_task_%s', query_id, task_index),
            query_id,
            task->>'type',
            task->'partition',
            assigned_worker
        );

        task_index = task_index + 1;
    END LOOP;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：并行查询优化</p>
                  <p>实现并行数据处理系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计并行执行计划</li>
                    <li>实现任务调度算法</li>
                    <li>优化负载均衡</li>
                    <li>处理并行执行中的同步问题</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'data-skipping':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据跳跃技术</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"跳过无关数据，加速查询"</p>

            <Paragraph {...noteProps('p1')}>
              数据跳跃技术通过预计算数据的统计信息和索引，允许查询在执行时跳过不符合条件的数据块，大幅提升查询性能。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">跳跃索引构建</h3>

            <CodeBlock
              title="数据跳跃索引和统计信息"
              code={`-- 数据块统计信息
CREATE TABLE block_statistics (
    table_name VARCHAR,
    column_name VARCHAR,
    block_id INTEGER,
    min_value VARCHAR,
    max_value VARCHAR,
    null_count BIGINT,
    distinct_count BIGINT,
    data_type VARCHAR,
    compression_type VARCHAR,
    block_size_bytes BIGINT,
    PRIMARY KEY (table_name, column_name, block_id)
);

-- 构建块统计信息
CREATE FUNCTION build_block_statistics(table_name VARCHAR, column_name VARCHAR, block_size INTEGER DEFAULT 100000) AS (
    DECLARE total_rows = (SELECT COUNT(*) FROM table_name);
    DECLARE block_count = CEIL(total_rows / block_size);

    FOR block_id IN 0..block_count-1 LOOP
        EXECUTE format('
            INSERT INTO block_statistics (table_name, column_name, block_id, min_value, max_value, null_count, distinct_count)
            SELECT
                %L, %L, %s,
                MIN(%I), MAX(%I),
                COUNT(*) FILTER (WHERE %I IS NULL),
                COUNT(DISTINCT %I)
            FROM %I
            LIMIT %s OFFSET %s
        ', table_name, column_name, block_id, column_name, column_name, column_name, column_name, table_name, block_size, block_id * block_size);
    END LOOP;
);

-- 查询时使用跳跃索引
CREATE FUNCTION can_skip_block(table_name VARCHAR, column_name VARCHAR, block_id INTEGER,
                              filter_condition JSON) AS (
    DECLARE stats = (SELECT * FROM block_statistics
                    WHERE table_name = table_name AND column_name = column_name AND block_id = block_id);

    -- 解析过滤条件
    DECLARE op = filter_condition->>'operator';
    DECLARE value = filter_condition->>'value';

    -- 基于块统计判断是否可以跳过
    RETURN CASE op
        WHEN '>' THEN stats.max_value <= value
        WHEN '<' THEN stats.min_value >= value
        WHEN '=' THEN stats.min_value > value OR stats.max_value < value
        WHEN '>=' THEN stats.max_value < value
        WHEN '<=' THEN stats.min_value > value
        ELSE FALSE
    END;
);

-- 布隆过滤器实现
CREATE TABLE bloom_filters (
    table_name VARCHAR,
    column_name VARCHAR,
    filter_data BYTEA,  -- 布隆过滤器数据
    false_positive_rate DECIMAL(5,4),
    item_count BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (table_name, column_name)
);

-- 创建布隆过滤器
CREATE FUNCTION create_bloom_filter(table_name VARCHAR, column_name VARCHAR) AS (
    -- 计算过滤器参数
    DECLARE item_count = (SELECT COUNT(DISTINCT column_name) FROM table_name WHERE column_name IS NOT NULL);
    DECLARE filter_size_bits = item_count * 10; -- 10 bits per item
    DECLARE hash_functions = 4;

    -- 创建过滤器并插入所有值
    DECLARE filter_data = create_empty_bloom_filter(filter_size_bits);

    FOR value IN (SELECT DISTINCT column_name FROM table_name WHERE column_name IS NOT NULL) LOOP
        filter_data = add_to_bloom_filter(filter_data, value, hash_functions);
    END LOOP;

    INSERT INTO bloom_filters (table_name, column_name, filter_data, false_positive_rate, item_count)
    VALUES (table_name, column_name, filter_data, 0.01, item_count);
);

-- 使用布隆过滤器快速判断
CREATE FUNCTION bloom_filter_lookup(table_name VARCHAR, column_name VARCHAR, search_value VARCHAR) AS (
    DECLARE filter = (SELECT filter_data FROM bloom_filters
                     WHERE table_name = table_name AND column_name = column_name);

    IF filter IS NULL THEN
        RETURN TRUE; -- 没有过滤器，假设可能存在
    END IF;

    RETURN check_bloom_filter(filter, search_value);
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：跳跃索引优化</p>
                  <p>为大数据查询构建跳跃索引：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>分析查询模式</li>
                    <li>构建块统计信息</li>
                    <li>实现查询时数据跳跃</li>
                    <li>评估性能提升效果</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'ml-concepts':
        return (
          <MLConceptsSection
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      case 'feature-engineering':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">特征工程</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从数据中提取有价值的特征"</p>

            <Paragraph {...noteProps('p1')}>
              特征工程是将原始数据转换为机器学习算法可以有效使用的特征的过程。这个项目将构建一个完整的特征工程流水线。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">特征提取和构造</h3>

            <CodeBlock
              title="特征工程技术实现"
              code={`-- 特征存储和管理
CREATE TABLE feature_definitions (
    feature_name VARCHAR PRIMARY KEY,
    feature_type VARCHAR,          -- 'numeric', 'categorical', 'text', 'temporal'
    data_type VARCHAR,             -- 底层数据类型
    description VARCHAR,
    source_table VARCHAR,
    source_column VARCHAR,
    transformation_logic TEXT,     -- 特征构造逻辑
    dependencies JSON,             -- 依赖的其他特征
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数值特征处理
CREATE TABLE numeric_feature_stats (
    feature_name VARCHAR PRIMARY KEY,
    min_value DECIMAL(15,6),
    max_value DECIMAL(15,6),
    mean_value DECIMAL(15,6),
    std_dev DECIMAL(15,6),
    median_value DECIMAL(15,6),
    skewness DECIMAL(10,6),        -- 偏度
    kurtosis DECIMAL(10,6),        -- 峰度
    null_ratio DECIMAL(5,4),
    outlier_ratio DECIMAL(5,4),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 计算数值特征统计
CREATE FUNCTION compute_numeric_stats(feature_name VARCHAR, table_name VARCHAR, column_name VARCHAR) AS (
    INSERT INTO numeric_feature_stats (feature_name, min_value, max_value, mean_value, std_dev, median_value, skewness, kurtosis, null_ratio, outlier_ratio)
    SELECT
        feature_name,
        MIN(value), MAX(value), AVG(value), STDDEV(value),
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value),
        -- 计算偏度和峰度（简化版）
        (SUM(POWER((value - avg_val), 3)) / COUNT(*) / POWER(std_val, 3)) as skewness,
        (SUM(POWER((value - avg_val), 4)) / COUNT(*) / POWER(std_val, 4) - 3) as kurtosis,
        COUNT(*) FILTER (WHERE value IS NULL)::DECIMAL / COUNT(*),
        COUNT(*) FILTER (WHERE ABS(value - avg_val) > 3 * std_val)::DECIMAL / COUNT(*)
    FROM (
        SELECT
            CASE WHEN column_name = 'age' THEN age::DECIMAL
                 WHEN column_name = 'income' THEN income::DECIMAL
                 WHEN column_name = 'score' THEN score::DECIMAL
                 ELSE 0 END as value
        FROM users
        WHERE value IS NOT NULL
    ) t
    CROSS JOIN (
        SELECT AVG(value) as avg_val, STDDEV(value) as std_val
        FROM (
            SELECT
                CASE WHEN column_name = 'age' THEN age::DECIMAL
                     WHEN column_name = 'income' THEN income::DECIMAL
                     WHEN column_name = 'score' THEN score::DECIMAL
                     ELSE 0 END as value
            FROM users
            WHERE value IS NOT NULL
        ) s
    ) stats
    ON CONFLICT (feature_name) DO UPDATE SET
        min_value = EXCLUDED.min_value,
        max_value = EXCLUDED.max_value,
        mean_value = EXCLUDED.mean_value,
        std_dev = EXCLUDED.std_dev,
        median_value = EXCLUDED.median_value,
        skewness = EXCLUDED.skewness,
        kurtosis = EXCLUDED.kurtosis,
        null_ratio = EXCLUDED.null_ratio,
        outlier_ratio = EXCLUDED.outlier_ratio,
        last_updated = CURRENT_TIMESTAMP;
);

-- 类别特征编码
CREATE TABLE categorical_encodings (
    feature_name VARCHAR,
    original_value VARCHAR,
    encoded_value INTEGER,         -- 标签编码
    frequency INTEGER,             -- 出现频率
    target_mean DECIMAL(8,4),      -- 目标变量均值（用于目标编码）
    weight DECIMAL(8,4),           -- 样本权重
    PRIMARY KEY (feature_name, original_value)
);

-- 目标编码计算
CREATE FUNCTION compute_target_encoding(feature_name VARCHAR, target_column VARCHAR) AS (
    INSERT INTO categorical_encodings (feature_name, original_value, encoded_value, frequency, target_mean)
    SELECT
        feature_name,
        category_value,
        ROW_NUMBER() OVER (ORDER BY category_value),
        category_count,
        avg_target
    FROM (
        SELECT
            category_value,
            COUNT(*) as category_count,
            AVG(CASE WHEN target_column = 'churned' THEN churned::INTEGER
                     WHEN target_column = 'purchased' THEN purchased::INTEGER
                     ELSE 0 END) as avg_target
        FROM users
        GROUP BY category_value
    ) t
    ON CONFLICT (feature_name, original_value) DO UPDATE SET
        frequency = EXCLUDED.frequency,
        target_mean = EXCLUDED.target_mean;
);

-- 文本特征提取
CREATE TABLE text_features (
    document_id VARCHAR,
    feature_name VARCHAR,
    feature_value DECIMAL(8,4),
    extraction_method VARCHAR,      -- 'tfidf', 'word2vec', 'bert_embedding'
    vocabulary_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (document_id, feature_name)
);

-- TF-IDF计算
CREATE FUNCTION compute_tfidf_features(documents JSON) AS (
    -- 计算词频 (TF)
    WITH term_frequency AS (
        SELECT
            doc_id,
            term,
            COUNT(*) as term_count,
            (SELECT COUNT(*) FROM json_object_keys(doc_terms)) as doc_length
        FROM (
            SELECT
                doc->>'id' as doc_id,
                json_object_keys(doc->'terms') as term,
                (doc->'terms'->>json_object_keys(doc->'terms'))::INTEGER as count
            FROM json_array_elements(documents) as doc
        ) t
        GROUP BY doc_id, term, doc_length
    ),
    -- 计算文档频率 (DF)
    document_frequency AS (
        SELECT
            term,
            COUNT(DISTINCT doc_id) as df,
            (SELECT COUNT(*) FROM json_array_elements(documents)) as total_docs
        FROM term_frequency
        GROUP BY term
    ),
    -- 计算TF-IDF
    tfidf_scores AS (
        SELECT
            tf.doc_id,
            tf.term,
            (tf.term_count::DECIMAL / tf.doc_length) *
            LN((df.total_docs + 1)::DECIMAL / (df.df + 1)) as tfidf_score
        FROM term_frequency tf
        JOIN document_frequency df ON tf.term = df.term
    )
    -- 存储TF-IDF特征
    INSERT INTO text_features (document_id, feature_name, feature_value, extraction_method)
    SELECT
        doc_id,
        'tfidf_' || term,
        tfidf_score,
        'tfidf'
    FROM tfidf_scores;
);

-- 时间特征构造
CREATE TABLE temporal_features (
    entity_id VARCHAR,
    feature_name VARCHAR,
    date_value DATE,
    day_of_week INTEGER,
    day_of_month INTEGER,
    day_of_year INTEGER,
    week_of_year INTEGER,
    month_of_year INTEGER,
    quarter_of_year INTEGER,
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    days_since_epoch INTEGER,
    PRIMARY KEY (entity_id, feature_name, date_value)
);

-- 提取时间特征
CREATE FUNCTION extract_temporal_features(entity_id VARCHAR, date_column DATE) AS (
    INSERT INTO temporal_features (
        entity_id, feature_name, date_value, day_of_week, day_of_month,
        day_of_year, week_of_year, month_of_year, quarter_of_year,
        is_weekend, days_since_epoch
    ) VALUES (
        entity_id,
        'temporal_features',
        date_column,
        EXTRACT(dow FROM date_column),
        EXTRACT(day FROM date_column),
        EXTRACT(doy FROM date_column),
        EXTRACT(week FROM date_column),
        EXTRACT(month FROM date_column),
        EXTRACT(quarter FROM date_column),
        EXTRACT(dow FROM date_column) IN (0, 6),
        FALSE, -- 简化为非节假日
        EXTRACT(epoch FROM date_column)::INTEGER / 86400
    );
);

-- 特征重要性评估
CREATE TABLE feature_importance (
    model_name VARCHAR,
    feature_name VARCHAR,
    importance_score DECIMAL(8,4),
    importance_rank INTEGER,
    evaluation_method VARCHAR,      -- 'gain', 'split', 'weight', 'permutation'
    cross_validation_fold INTEGER,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (model_name, feature_name, evaluation_method)
);

-- 计算特征重要性
CREATE FUNCTION assess_feature_importance(model_name VARCHAR, feature_list JSON, target_data JSON) AS (
    -- 这里需要集成ML库来计算特征重要性
    -- 简化实现：基于相关性排序
    INSERT INTO feature_importance (model_name, feature_name, importance_score, importance_rank, evaluation_method)
    SELECT
        model_name,
        feature_name,
        ABS(correlation_coeff) as importance_score,
        ROW_NUMBER() OVER (ORDER BY ABS(correlation_coeff) DESC) as importance_rank,
        'correlation'
    FROM (
        SELECT
            f.feature_name,
            CORR(
                f.feature_value::DECIMAL,
                t.target_value::DECIMAL
            ) as correlation_coeff
        FROM json_array_elements(feature_list) as f(feature_name, feature_value)
        CROSS JOIN json_array_elements(target_data) as t(target_value)
    ) correlations;
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">特征选择和降维</h3>

            <CodeBlock
              title="特征选择算法实现"
              code={`-- 特征选择结果存储
CREATE TABLE feature_selection_results (
    selection_id VARCHAR PRIMARY KEY,
    dataset_name VARCHAR,
    selection_method VARCHAR,       -- 'filter', 'wrapper', 'embedded', 'dimensionality_reduction'
    selected_features JSON,         -- 选中的特征列表
    feature_scores JSON,            -- 特征评分
    reduction_ratio DECIMAL(5,2),   -- 降维比例
    performance_impact JSON,        -- 对模型性能的影响
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 过滤式特征选择（基于统计检验）
CREATE FUNCTION filter_feature_selection(dataset_name VARCHAR, target_column VARCHAR, method VARCHAR DEFAULT 'f_test') AS (
    DECLARE selected_features = '[]'::JSON;
    DECLARE feature_scores = '{}'::JSON;

    FOR feature_rec IN (
        SELECT
            column_name,
            CASE
                WHEN method = 'f_test' THEN
                    -- F检验统计量计算
                    calculate_f_statistic(dataset_name, column_name, target_column)
                WHEN method = 'mutual_info' THEN
                    -- 互信息计算
                    calculate_mutual_info(dataset_name, column_name, target_column)
                WHEN method = 'correlation' THEN
                    -- 相关系数
                    ABS(calculate_correlation(dataset_name, column_name, target_column))
                ELSE 0
            END as score
        FROM information_schema.columns
        WHERE table_name = dataset_name AND column_name != target_column
    ) LOOP
        -- 选择评分高于阈值的特征
        IF feature_rec.score > 0.1 THEN
            selected_features = json_append(selected_features, feature_rec.column_name);
            feature_scores = json_set(feature_scores, feature_rec.column_name, feature_rec.score::VARCHAR);
        END IF;
    END LOOP;

    -- 存储选择结果
    INSERT INTO feature_selection_results (
        selection_id, dataset_name, selection_method, selected_features, feature_scores
    ) VALUES (
        format('%s_%s_%s', dataset_name, method, CURRENT_TIMESTAMP),
        dataset_name, method, selected_features, feature_scores
    );

    RETURN selected_features;
);

-- 包装式特征选择（递归特征消除）
CREATE FUNCTION wrapper_feature_selection(dataset_name VARCHAR, target_column VARCHAR, max_features INTEGER DEFAULT 10) AS (
    DECLARE all_features = (
        SELECT array_agg(column_name)
        FROM information_schema.columns
        WHERE table_name = dataset_name AND column_name != target_column
    );

    DECLARE best_features = all_features;
    DECLARE best_score = 0;

    -- 递归消除最不重要的特征
    WHILE array_length(best_features, 1) > max_features LOOP
        DECLARE worst_feature = NULL;
        DECLARE worst_score = 999;

        -- 尝试移除每个特征，评估性能下降
        FOREACH feature IN ARRAY best_features LOOP
            DECLARE remaining_features = array_remove(best_features, feature);
            DECLARE temp_score = evaluate_feature_subset(dataset_name, remaining_features, target_column);

            IF temp_score < worst_score THEN
                worst_score = temp_score;
                worst_feature = feature;
            END IF;
        END LOOP;

        -- 移除最差的特征
        best_features = array_remove(best_features, worst_feature);
        best_score = worst_score;
    END LOOP;

    -- 存储最终结果
    INSERT INTO feature_selection_results (
        selection_id, dataset_name, selection_method, selected_features
    ) VALUES (
        format('%s_wrapper_%s', dataset_name, CURRENT_TIMESTAMP),
        dataset_name, 'wrapper', json_build_array(best_features)
    );

    RETURN best_features;
);

-- 主成分分析 (PCA) 降维
CREATE TABLE pca_components (
    dataset_name VARCHAR,
    component_id INTEGER,
    explained_variance DECIMAL(8,4),  -- 解释方差
    explained_variance_ratio DECIMAL(8,4), -- 解释方差比例
    component_weights JSON,           -- 主成分权重向量
    cumulative_variance_ratio DECIMAL(8,4), -- 累积解释方差比例
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dataset_name, component_id)
);

-- 执行PCA降维
CREATE FUNCTION perform_pca(dataset_name VARCHAR, n_components INTEGER DEFAULT NULL) AS (
    -- 计算协方差矩阵
    DECLARE cov_matrix = compute_covariance_matrix(dataset_name);

    -- 计算特征值和特征向量（简化实现）
    DECLARE eigenvalues = extract_eigenvalues(cov_matrix);
    DECLARE eigenvectors = extract_eigenvectors(cov_matrix);

    -- 选择前N个主成分
    DECLARE selected_components = CASE
        WHEN n_components IS NOT NULL THEN n_components
        ELSE array_length(eigenvalues, 1) -- 默认使用所有成分
    END;

    DECLARE cumulative_variance = 0;

    FOR i IN 1..selected_components LOOP
        cumulative_variance = cumulative_variance + eigenvalues[i];

        INSERT INTO pca_components (
            dataset_name, component_id, explained_variance,
            explained_variance_ratio, component_weights, cumulative_variance_ratio
        ) VALUES (
            dataset_name, i, eigenvalues[i],
            eigenvalues[i] / sum(eigenvalues),
            json_build_object('weights', eigenvectors[i]),
            cumulative_variance / sum(eigenvalues)
        );
    END LOOP;

    RETURN format('PCA completed with %s components', selected_components);
);

-- 特征工程流水线
CREATE TABLE feature_pipeline (
    pipeline_id VARCHAR PRIMARY KEY,
    pipeline_name VARCHAR,
    steps JSON,                      -- 流水线步骤定义
    input_dataset VARCHAR,
    output_dataset VARCHAR,
    status VARCHAR DEFAULT 'draft', -- 'draft', 'active', 'deprecated'
    performance_metrics JSON,       -- 流水线性能指标
    last_executed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 执行特征工程流水线
CREATE FUNCTION execute_feature_pipeline(pipeline_id VARCHAR) AS (
    DECLARE pipeline = (SELECT * FROM feature_pipeline WHERE pipeline_id = pipeline_id);
    DECLARE current_data = pipeline.input_dataset;

    -- 按顺序执行每个步骤
    FOR step IN (SELECT json_array_elements(pipeline.steps)) LOOP
        DECLARE step_type = step->>'type';
        DECLARE step_config = step->'config';

        CASE step_type
            WHEN 'scaling' THEN
                current_data = apply_feature_scaling(current_data, step_config);
            WHEN 'encoding' THEN
                current_data = apply_categorical_encoding(current_data, step_config);
            WHEN 'transformation' THEN
                current_data = apply_feature_transformation(current_data, step_config);
            WHEN 'selection' THEN
                current_data = apply_feature_selection(current_data, step_config);
            WHEN 'reduction' THEN
                current_data = apply_dimensionality_reduction(current_data, step_config);
        END CASE;
    END LOOP;

    -- 更新输出数据集
    UPDATE feature_pipeline
    SET output_dataset = current_data,
        last_executed = CURRENT_TIMESTAMP
    WHERE pipeline_id = pipeline_id;

    RETURN current_data;
);`}
              {...noteProps('code2')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：用户画像特征工程</p>
                  <p>为电商用户构建完整的特征工程系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>提取用户行为特征</li>
                    <li>构造时间序列特征</li>
                    <li>实现特征选择算法</li>
                    <li>构建特征工程流水线</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'model-training':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">模型训练数据流</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"优化训练数据的准备和处理"</p>

            <Paragraph {...noteProps('p1')}>
              高效的模型训练需要精心准备的数据流。本节介绍训练数据的处理、批次生成和数据增强技术。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">训练数据准备</h3>

            <CodeBlock
              title="训练数据流水线"
              code={`-- 训练数据集管理
CREATE TABLE training_datasets (
    dataset_id VARCHAR PRIMARY KEY,
    dataset_name VARCHAR,
    data_source VARCHAR,            -- 数据来源
    feature_columns JSON,           -- 特征列定义
    target_column VARCHAR,          -- 目标变量
    train_split_ratio DECIMAL(3,2), -- 训练集比例
    validation_split_ratio DECIMAL(3,2), -- 验证集比例
    preprocessing_pipeline JSON,    -- 预处理流水线
    data_quality_metrics JSON,      -- 数据质量指标
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 数据分割策略
CREATE TABLE data_splits (
    dataset_id VARCHAR,
    split_type VARCHAR,             -- 'train', 'validation', 'test'
    record_ids JSON,                -- 记录ID列表
    split_ratio DECIMAL(5,2),
    stratification_column VARCHAR,  -- 分层抽样列
    random_seed INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dataset_id, split_type)
);

-- 执行数据分割
CREATE FUNCTION create_train_test_split(dataset_id VARCHAR, train_ratio DECIMAL DEFAULT 0.7,
                                      val_ratio DECIMAL DEFAULT 0.2, stratify_by VARCHAR DEFAULT NULL) AS (
    DECLARE total_records = (SELECT COUNT(*) FROM get_dataset_table(dataset_id));

    -- 分层抽样分割
    IF stratify_by IS NOT NULL THEN
        INSERT INTO data_splits (dataset_id, split_type, record_ids, split_ratio)
        SELECT
            dataset_id,
            split_type,
            json_agg(record_id),
            split_ratio
        FROM (
            SELECT
                record_id,
                stratify_value,
                CASE
                    WHEN ROW_NUMBER() OVER (PARTITION BY stratify_value ORDER BY RANDOM()) /
                         COUNT(*) OVER (PARTITION BY stratify_value) <= train_ratio THEN 'train'
                    WHEN ROW_NUMBER() OVER (PARTITION BY stratify_value ORDER BY RANDOM()) /
                         COUNT(*) OVER (PARTITION BY stratify_value) <= (train_ratio + val_ratio) THEN 'validation'
                    ELSE 'test'
                END as split_type,
                CASE
                    WHEN split_type = 'train' THEN train_ratio
                    WHEN split_type = 'validation' THEN val_ratio
                    ELSE 1 - train_ratio - val_ratio
                END as split_ratio
            FROM (
                SELECT
                    id as record_id,
                    CASE WHEN stratify_by = 'category' THEN category
                         WHEN stratify_by = 'age_group' THEN age_group
                         ELSE 'default' END as stratify_value
                FROM get_dataset_table(dataset_id)
            ) stratified
        ) grouped
        GROUP BY split_type, split_ratio;
    ELSE
        -- 随机分割
        INSERT INTO data_splits (dataset_id, split_type, record_ids, split_ratio)
        SELECT
            dataset_id,
            split_type,
            json_agg(record_id),
            split_ratio
        FROM (
            SELECT
                record_id,
                CASE
                    WHEN random() <= train_ratio THEN 'train'
                    WHEN random() <= (train_ratio + val_ratio) THEN 'validation'
                    ELSE 'test'
                END as split_type
            FROM (
                SELECT id as record_id FROM get_dataset_table(dataset_id)
                ORDER BY RANDOM()
            ) randomized
        ) grouped
        GROUP BY split_type, split_ratio;
    END IF;
);

-- 批次数据生成器
CREATE TABLE batch_generators (
    generator_id VARCHAR PRIMARY KEY,
    dataset_id VARCHAR REFERENCES training_datasets(dataset_id),
    batch_size INTEGER DEFAULT 32,
    shuffle BOOLEAN DEFAULT TRUE,
    sampling_method VARCHAR DEFAULT 'random', -- 'random', 'stratified', 'weighted'
    augmentation_pipeline JSON,   -- 数据增强流水线
    cache_enabled BOOLEAN DEFAULT FALSE,
    cache_location VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 生成训练批次
CREATE FUNCTION generate_training_batch(generator_id VARCHAR, batch_number INTEGER) AS (
    DECLARE generator = (SELECT * FROM batch_generators WHERE generator_id = generator_id);
    DECLARE split_type = 'train'; -- 可以参数化

    -- 获取该批次的记录
    DECLARE batch_records = (
        SELECT json_agg(record_data)
        FROM (
            SELECT record_data
            FROM get_split_records(generator.dataset_id, split_type) records
            ORDER BY CASE WHEN generator.shuffle THEN RANDOM() ELSE id END
            LIMIT generator.batch_size
            OFFSET (batch_number - 1) * generator.batch_size
        ) batch
    );

    -- 应用数据增强
    IF generator.augmentation_pipeline IS NOT NULL THEN
        batch_records = apply_data_augmentation(batch_records, generator.augmentation_pipeline);
    END IF;

    RETURN batch_records;
);

-- 数据增强配置
CREATE TABLE data_augmentations (
    augmentation_id VARCHAR PRIMARY KEY,
    augmentation_type VARCHAR,      -- 'noise', 'rotation', 'scaling', 'cropping', 'mixup'
    parameters JSON,                -- 增强参数
    probability DECIMAL(3,2),       -- 应用概率
    target_data_type VARCHAR,       -- 'image', 'text', 'tabular'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 应用数据增强
CREATE FUNCTION apply_data_augmentation(batch_data JSON, augmentation_config JSON) AS (
    DECLARE augmented_batch = '[]'::JSON;

    FOR record IN (SELECT json_array_elements(batch_data)) LOOP
        DECLARE processed_record = record;

        -- 应用每个增强技术
        FOR aug IN (SELECT json_array_elements(augmentation_config)) LOOP
            IF RANDOM() <= (aug->>'probability')::DECIMAL THEN
                processed_record = apply_single_augmentation(processed_record, aug);
            END IF;
        END LOOP;

        augmented_batch = json_append(augmented_batch, processed_record);
    END LOOP;

    RETURN augmented_batch;
);

-- 训练监控和指标
CREATE TABLE training_metrics (
    training_run_id VARCHAR,
    epoch INTEGER,
    batch_number INTEGER,
    loss DECIMAL(10,6),
    accuracy DECIMAL(5,4),
    learning_rate DECIMAL(10,6),
    gradient_norm DECIMAL(10,4),
    training_time_seconds DECIMAL(8,2),
    memory_usage_mb INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (training_run_id, epoch, batch_number)
);

-- 记录训练指标
CREATE FUNCTION log_training_metrics(run_id VARCHAR, epoch INTEGER, batch_num INTEGER,
                                   metrics JSON) AS (
    INSERT INTO training_metrics (
        training_run_id, epoch, batch_number, loss, accuracy,
        learning_rate, gradient_norm, training_time_seconds, memory_usage_mb
    ) VALUES (
        run_id, epoch, batch_num,
        (metrics->>'loss')::DECIMAL,
        (metrics->>'accuracy')::DECIMAL,
        (metrics->>'learning_rate')::DECIMAL,
        (metrics->>'gradient_norm')::DECIMAL,
        (metrics->>'training_time')::DECIMAL,
        (metrics->>'memory_usage')::INTEGER
    );
);

-- 早停机制
CREATE TABLE early_stopping_configs (
    run_id VARCHAR PRIMARY KEY,
    monitor_metric VARCHAR DEFAULT 'val_loss',
    patience INTEGER DEFAULT 10,    -- 容忍多少个epoch没有改善
    min_delta DECIMAL(8,4) DEFAULT 0.001, -- 最小的改善阈值
    restore_best_weights BOOLEAN DEFAULT TRUE,
    best_metric_value DECIMAL(10,4),
    wait_count INTEGER DEFAULT 0,
    stopped_epoch INTEGER,
    stopped BOOLEAN DEFAULT FALSE
);

-- 检查早停条件
CREATE FUNCTION check_early_stopping(run_id VARCHAR, current_metric DECIMAL) AS (
    DECLARE config = (SELECT * FROM early_stopping_configs WHERE run_id = run_id);

    IF config IS NULL THEN
        RETURN FALSE; -- 没有配置早停
    END IF;

    -- 检查是否有改善
    DECLARE improved = CASE config.monitor_metric
        WHEN 'val_loss' THEN current_metric < (config.best_metric_value - config.min_delta)
        WHEN 'val_accuracy' THEN current_metric > (config.best_metric_value + config.min_delta)
        ELSE FALSE
    END;

    IF improved THEN
        -- 有改善，重置等待计数
        UPDATE early_stopping_configs
        SET best_metric_value = current_metric,
            wait_count = 0
        WHERE run_id = run_id;
    ELSE
        -- 没有改善，增加等待计数
        UPDATE early_stopping_configs
        SET wait_count = wait_count + 1
        WHERE run_id = run_id;

        -- 检查是否应该停止
        IF config.wait_count >= config.patience THEN
            UPDATE early_stopping_configs
            SET stopped = TRUE,
                stopped_epoch = (SELECT MAX(epoch) FROM training_metrics WHERE training_run_id = run_id)
            WHERE run_id = run_id;

            RETURN TRUE; -- 触发早停
        END IF;
    END IF;

    RETURN FALSE;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：训练数据流水线</p>
                  <p>构建完整的模型训练数据准备系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现数据分割策略</li>
                    <li>构建批次数据生成器</li>
                    <li>实现数据增强技术</li>
                    <li>添加训练监控和早停</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'prediction-queries':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">预测查询</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"在SQL中执行机器学习预测"</p>

            <Paragraph {...noteProps('p1')}>
              将训练好的机器学习模型集成到SQL查询中，实现实时预测。本节介绍模型部署和预测查询的实现方法。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">模型部署和预测</h3>

            <CodeBlock
              title="SQL中的模型预测"
              code={`-- 模型注册表
CREATE TABLE ml_models (
    model_id VARCHAR PRIMARY KEY,
    model_name VARCHAR NOT NULL,
    model_type VARCHAR,             -- 'linear_regression', 'random_forest', 'neural_network'
    framework VARCHAR,              -- 'sklearn', 'tensorflow', 'pytorch', 'xgboost'
    version VARCHAR DEFAULT '1.0',
    model_binary BYTEA,             -- 模型二进制数据
    model_metadata JSON,            -- 模型元数据
    feature_columns JSON,           -- 特征列定义
    target_type VARCHAR,            -- 预测目标类型
    performance_metrics JSON,       -- 模型性能指标
    deployment_status VARCHAR DEFAULT 'inactive', -- 'active', 'inactive', 'deprecated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 模型预测函数
CREATE FUNCTION predict_with_model(model_id VARCHAR, feature_values JSON) AS (
    DECLARE model = (SELECT * FROM ml_models WHERE model_id = model_id AND deployment_status = 'active');

    IF model IS NULL THEN
        RAISE EXCEPTION 'Model % not found or not active', model_id;
    END IF;

    -- 验证输入特征
    DECLARE required_features = model.feature_columns;
    DECLARE provided_features = json_object_keys(feature_values);

    IF NOT arrays_contain(required_features, provided_features) THEN
        RAISE EXCEPTION 'Missing required features. Required: %, Provided: %',
                       required_features, provided_features;
    END IF;

    -- 调用模型预测（这里需要集成ML运行时）
    DECLARE prediction = call_model_prediction(model.model_binary, feature_values, model.framework);

    -- 记录预测结果
    INSERT INTO prediction_logs (model_id, input_features, prediction_result, prediction_time)
    VALUES (model_id, feature_values, prediction, CURRENT_TIMESTAMP);

    RETURN prediction;
);

-- 批量预测优化
CREATE FUNCTION batch_predict_with_model(model_id VARCHAR, batch_features JSON) AS (
    DECLARE model = (SELECT * FROM ml_models WHERE model_id = model_id);
    DECLARE batch_size = json_array_length(batch_features);
    DECLARE predictions = '[]'::JSON;

    -- 分批处理以避免内存溢出
    DECLARE batch_chunk_size = 100;

    FOR i IN 0..(batch_size / batch_chunk_size) LOOP
        DECLARE chunk_start = i * batch_chunk_size;
        DECLARE chunk_end = LEAST((i + 1) * batch_chunk_size, batch_size);
        DECLARE chunk_features = json_extract(batch_features, format('$[%s:%s]', chunk_start, chunk_end));

        DECLARE chunk_predictions = call_batch_model_prediction(model.model_binary, chunk_features, model.framework);

        -- 合并预测结果
        predictions = json_array_concat(predictions, chunk_predictions);
    END LOOP;

    -- 记录批量预测
    INSERT INTO prediction_logs (model_id, input_features, prediction_result, prediction_time, is_batch)
    VALUES (model_id, batch_features, predictions, CURRENT_TIMESTAMP, TRUE);

    RETURN predictions;
);

-- 实时预测缓存
CREATE TABLE prediction_cache (
    cache_key VARCHAR PRIMARY KEY,
    model_id VARCHAR,
    input_hash VARCHAR,              -- 输入特征的哈希
    input_features JSON,
    prediction_result JSON,
    confidence_score DECIMAL(5,4),
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ttl_seconds INTEGER DEFAULT 3600,
    hit_count INTEGER DEFAULT 1
);

-- 带缓存的预测
CREATE FUNCTION cached_predict(model_id VARCHAR, feature_values JSON, use_cache BOOLEAN DEFAULT TRUE) AS (
    IF NOT use_cache THEN
        RETURN predict_with_model(model_id, feature_values);
    END IF;

    DECLARE input_hash = md5(feature_values::TEXT);
    DECLARE cache_key = format('%s_%s', model_id, input_hash);

    -- 检查缓存
    DECLARE cached_result = (
        SELECT prediction_result
        FROM prediction_cache
        WHERE cache_key = cache_key
          AND cached_at > CURRENT_TIMESTAMP - INTERVAL '1 second' * ttl_seconds
        LIMIT 1
    );

    IF cached_result IS NOT NULL THEN
        -- 更新缓存命中计数
        UPDATE prediction_cache
        SET hit_count = hit_count + 1
        WHERE cache_key = cache_key;

        RETURN cached_result;
    END IF;

    -- 缓存未命中，执行预测
    DECLARE prediction = predict_with_model(model_id, feature_values);

    -- 存储到缓存
    INSERT INTO prediction_cache (cache_key, model_id, input_hash, input_features, prediction_result)
    VALUES (cache_key, model_id, input_hash, feature_values, prediction);

    RETURN prediction;
);

-- A/B测试框架
CREATE TABLE ab_tests (
    test_id VARCHAR PRIMARY KEY,
    test_name VARCHAR,
    model_a_id VARCHAR REFERENCES ml_models(model_id),
    model_b_id VARCHAR REFERENCES ml_models(model_id),
    traffic_split DECIMAL(3,2) DEFAULT 0.5, -- A模型流量比例
    target_metric VARCHAR,           -- 测试目标指标
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR DEFAULT 'active', -- 'active', 'completed', 'stopped'
    winner_model VARCHAR,
    confidence_level DECIMAL(5,4)
);

-- A/B测试预测路由
CREATE FUNCTION ab_test_predict(test_id VARCHAR, feature_values JSON) AS (
    DECLARE test_config = (SELECT * FROM ab_tests WHERE test_id = test_id AND status = 'active');

    IF test_config IS NULL THEN
        RAISE EXCEPTION 'A/B test % not found or not active', test_id;
    END IF;

    -- 流量分配逻辑
    DECLARE user_id = feature_values->>'user_id';
    DECLARE traffic_hash = ABS(hash(user_id)) % 100;
    DECLARE use_model_a = (traffic_hash / 100.0) <= test_config.traffic_split;

    DECLARE selected_model = CASE WHEN use_model_a THEN test_config.model_a_id ELSE test_config.model_b_id END;
    DECLARE prediction = predict_with_model(selected_model, feature_values);

    -- 记录A/B测试结果
    INSERT INTO ab_test_logs (test_id, user_id, model_used, prediction, traffic_percentage)
    VALUES (test_id, user_id, selected_model, prediction,
            CASE WHEN use_model_a THEN test_config.traffic_split ELSE 1 - test_config.traffic_split END);

    RETURN prediction;
);

-- 模型性能监控
CREATE TABLE model_performance_monitor (
    model_id VARCHAR,
    time_window_start TIMESTAMP,
    metric_name VARCHAR,             -- 'accuracy', 'precision', 'recall', 'latency'
    metric_value DECIMAL(8,4),
    sample_count INTEGER,
    threshold_value DECIMAL(8,4),
    status VARCHAR,                  -- 'normal', 'warning', 'critical'
    alert_sent BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (model_id, time_window_start, metric_name)
);

-- 监控模型性能
CREATE FUNCTION monitor_model_performance(model_id VARCHAR, time_window_minutes INTEGER DEFAULT 60) AS (
    DECLARE window_start = CURRENT_TIMESTAMP - INTERVAL '1 minute' * time_window_minutes;

    -- 计算性能指标
    INSERT INTO model_performance_monitor (
        model_id, time_window_start, metric_name, metric_value, sample_count
    )
    SELECT
        model_id,
        date_trunc('hour', prediction_time),
        'prediction_count',
        COUNT(*),
        COUNT(*)
    FROM prediction_logs
    WHERE model_id = model_id
      AND prediction_time >= window_start
    GROUP BY date_trunc('hour', prediction_time);

    -- 计算预测延迟
    INSERT INTO model_performance_monitor (
        model_id, time_window_start, metric_name, metric_value, sample_count
    )
    SELECT
        model_id,
        date_trunc('hour', prediction_time),
        'avg_latency_ms',
        AVG(EXTRACT(epoch FROM (CURRENT_TIMESTAMP - prediction_time)) * 1000),
        COUNT(*)
    FROM prediction_logs
    WHERE model_id = model_id
      AND prediction_time >= window_start
    GROUP BY date_trunc('hour', prediction_time);

    -- 检查阈值并告警
    UPDATE model_performance_monitor
    SET status = CASE
            WHEN metric_value < threshold_value * 0.8 THEN 'critical'
            WHEN metric_value < threshold_value * 0.9 THEN 'warning'
            ELSE 'normal'
        END,
        alert_sent = CASE
            WHEN metric_value < threshold_value * 0.9 AND NOT alert_sent THEN TRUE
            ELSE alert_sent
        END
    WHERE model_id = model_id
      AND time_window_start >= window_start;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：实时预测服务</p>
                  <p>构建SQL集成的人工智能预测服务：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现模型注册和部署</li>
                    <li>构建预测查询接口</li>
                    <li>实现预测结果缓存</li>
                    <li>添加A/B测试框架</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'ml-pipelines':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">ML 管道</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"端到端的机器学习工作流"</p>

            <Paragraph {...noteProps('p1')}>
              ML管道是将数据准备、特征工程、模型训练、评估和部署连接起来的自动化工作流。本节介绍如何构建和管理ML管道。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">管道编排和执行</h3>

            <CodeBlock
              title="ML管道架构"
              code={`-- ML管道定义
CREATE TABLE ml_pipelines (
    pipeline_id VARCHAR PRIMARY KEY,
    pipeline_name VARCHAR NOT NULL,
    description TEXT,
    pipeline_config JSON,           -- 管道配置
    steps JSON,                     -- 管道步骤定义
    schedule_config JSON,           -- 调度配置
    dependencies JSON,              -- 管道依赖
    status VARCHAR DEFAULT 'draft', -- 'draft', 'active', 'paused', 'failed'
    created_by VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_executed TIMESTAMP,
    execution_count INTEGER DEFAULT 0
);

-- 管道步骤定义
CREATE TABLE pipeline_steps (
    step_id VARCHAR PRIMARY KEY,
    pipeline_id VARCHAR REFERENCES ml_pipelines(pipeline_id),
    step_name VARCHAR,
    step_type VARCHAR,              -- 'data_ingest', 'feature_engineering', 'model_training', 'model_evaluation', 'model_deployment'
    step_config JSON,               -- 步骤配置
    dependencies JSON,              -- 步骤依赖
    retry_config JSON,              -- 重试配置
    timeout_seconds INTEGER,
    step_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管道执行实例
CREATE TABLE pipeline_executions (
    execution_id VARCHAR PRIMARY KEY,
    pipeline_id VARCHAR REFERENCES ml_pipelines(pipeline_id),
    execution_status VARCHAR,       -- 'running', 'completed', 'failed', 'cancelled'
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    execution_duration_seconds INTEGER,
    triggered_by VARCHAR,           -- 'schedule', 'manual', 'api', 'dependency'
    trigger_source VARCHAR,         -- 触发源详情
    error_message TEXT,
    metrics JSON,                   -- 执行指标
    artifacts JSON                  -- 生成的产物
);

-- 步骤执行记录
CREATE TABLE step_executions (
    execution_id VARCHAR REFERENCES pipeline_executions(execution_id),
    step_id VARCHAR REFERENCES pipeline_steps(step_id),
    step_status VARCHAR,            -- 'pending', 'running', 'completed', 'failed', 'skipped'
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    output_data JSON,               -- 步骤输出
    metrics JSON,                   -- 步骤指标
    PRIMARY KEY (execution_id, step_id)
);

-- 执行ML管道
CREATE FUNCTION execute_ml_pipeline(pipeline_id VARCHAR, trigger_info JSON DEFAULT NULL) AS (
    DECLARE pipeline = (SELECT * FROM ml_pipelines WHERE pipeline_id = pipeline_id);
    DECLARE execution_id = format('exec_%s_%s', pipeline_id, CURRENT_TIMESTAMP);

    -- 创建执行实例
    INSERT INTO pipeline_executions (execution_id, pipeline_id, execution_status, triggered_by, trigger_source)
    VALUES (
        execution_id,
        pipeline_id,
        'running',
        COALESCE(trigger_info->>'triggered_by', 'manual'),
        trigger_info->>'trigger_source'
    );

    -- 执行管道步骤
    DECLARE step_results = execute_pipeline_steps(execution_id, pipeline.steps);

    -- 更新执行状态
    UPDATE pipeline_executions
    SET execution_status = CASE WHEN step_results->>'status' = 'success' THEN 'completed' ELSE 'failed' END,
        end_time = CURRENT_TIMESTAMP,
        execution_duration_seconds = EXTRACT(epoch FROM (CURRENT_TIMESTAMP - start_time)),
        metrics = step_results->'metrics',
        artifacts = step_results->'artifacts'
    WHERE execution_id = execution_id;

    -- 更新管道统计
    UPDATE ml_pipelines
    SET last_executed = CURRENT_TIMESTAMP,
        execution_count = execution_count + 1
    WHERE pipeline_id = pipeline_id;

    RETURN execution_id;
);

-- 执行管道步骤
CREATE FUNCTION execute_pipeline_steps(execution_id VARCHAR, steps_config JSON) AS (
    DECLARE step_results = '{}'::JSON;
    DECLARE overall_status = 'success';

    -- 按步骤顺序执行
    FOR step_config IN (SELECT json_array_elements(steps_config) ORDER BY (value->>'order')::INTEGER) LOOP
        DECLARE step_id = step_config->>'step_id';
        DECLARE step_start = CURRENT_TIMESTAMP;
        DECLARE step_result;

        -- 检查依赖
        IF NOT check_step_dependencies(step_id, execution_id) THEN
            -- 依赖未满足，跳过步骤
            INSERT INTO step_executions (execution_id, step_id, step_status, start_time, end_time)
            VALUES (execution_id, step_id, 'skipped', step_start, CURRENT_TIMESTAMP);

            CONTINUE;
        END IF;

        -- 执行步骤
        BEGIN
            step_result = execute_single_step(step_id, step_config, execution_id);

            INSERT INTO step_executions (
                execution_id, step_id, step_status, start_time, end_time,
                duration_seconds, output_data, metrics
            ) VALUES (
                execution_id, step_id, 'completed', step_start, CURRENT_TIMESTAMP,
                EXTRACT(epoch FROM (CURRENT_TIMESTAMP - step_start)),
                step_result->'output', step_result->'metrics'
            );

            -- 存储步骤结果
            step_results = json_set(step_results, step_id, step_result);

        EXCEPTION WHEN OTHERS THEN
            -- 步骤执行失败
            INSERT INTO step_executions (
                execution_id, step_id, step_status, start_time, end_time,
                error_message
            ) VALUES (
                execution_id, step_id, 'failed', step_start, CURRENT_TIMESTAMP,
                SQLERRM
            );

            overall_status = 'failed';

            -- 检查重试逻辑
            IF should_retry_step(step_id, step_config) THEN
                PERFORM retry_step_execution(execution_id, step_id, step_config);
            END IF;
        END;
    END LOOP;

    RETURN json_build_object(
        'status', overall_status,
        'step_results', step_results,
        'execution_id', execution_id
    );
);

-- 管道调度器
CREATE TABLE pipeline_schedules (
    schedule_id VARCHAR PRIMARY KEY,
    pipeline_id VARCHAR REFERENCES ml_pipelines(pipeline_id),
    schedule_type VARCHAR,          -- 'cron', 'interval', 'event_triggered'
    schedule_config JSON,           -- 调度配置
    is_active BOOLEAN DEFAULT TRUE,
    last_scheduled TIMESTAMP,
    next_run TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 检查并触发管道执行
CREATE FUNCTION check_pipeline_schedules() AS (
    FOR schedule IN (SELECT * FROM pipeline_schedules WHERE is_active = TRUE) LOOP
        DECLARE should_run = FALSE;

        CASE schedule.schedule_type
            WHEN 'cron' THEN
                -- 检查cron表达式
                should_run = evaluate_cron_expression(schedule.schedule_config->>'cron', CURRENT_TIMESTAMP);
            WHEN 'interval' THEN
                -- 检查间隔
                should_run = CURRENT_TIMESTAMP >= COALESCE(schedule.last_scheduled, '1970-01-01'::TIMESTAMP) +
                           INTERVAL '1 second' * (schedule.schedule_config->>'interval_seconds')::INTEGER;
            WHEN 'event_triggered' THEN
                -- 检查事件触发条件
                should_run = check_event_trigger_condition(schedule.schedule_config);
        END CASE;

        IF should_run THEN
            -- 触发管道执行
            PERFORM execute_ml_pipeline(schedule.pipeline_id,
                                      json_build_object('triggered_by', 'schedule', 'schedule_id', schedule.schedule_id));

            -- 更新调度信息
            UPDATE pipeline_schedules
            SET last_scheduled = CURRENT_TIMESTAMP,
                next_run = calculate_next_run(schedule)
            WHERE schedule_id = schedule.schedule_id;
        END IF;
    END LOOP;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：端到端ML管道</p>
                  <p>构建完整的机器学习工作流管道：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>设计管道步骤和依赖关系</li>
                    <li>实现管道编排和调度</li>
                    <li>构建错误处理和重试机制</li>
                    <li>添加监控和日志记录</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'model-evaluation':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">模型评估</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"量化模型性能和可靠性"</p>

            <Paragraph {...noteProps('p1')}>
              模型评估是确保机器学习模型质量和可靠性的关键步骤。本节介绍各种评估指标和验证方法。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">评估指标计算</h3>

            <CodeBlock
              title="模型性能评估框架"
              code={`-- 评估结果存储
CREATE TABLE model_evaluations (
    evaluation_id VARCHAR PRIMARY KEY,
    model_id VARCHAR REFERENCES ml_models(model_id),
    evaluation_type VARCHAR,        -- 'train', 'validation', 'test', 'cross_validation'
    dataset_split VARCHAR,          -- 'train', 'val', 'test'
    metrics JSON,                   -- 评估指标
    confusion_matrix JSON,          -- 混淆矩阵（分类任务）
    feature_importance JSON,        -- 特征重要性
    evaluation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluation_duration_seconds DECIMAL(8,2)
);

-- 计算分类指标
CREATE FUNCTION calculate_classification_metrics(predictions JSON, actuals JSON) AS (
    -- 构建混淆矩阵
    DECLARE confusion_matrix = '{}'::JSON;
    DECLARE tp = 0, tn = 0, fp = 0, fn = 0;

    FOR i IN 0..json_array_length(predictions)-1 LOOP
        DECLARE pred = (predictions->>i)::INTEGER;
        DECLARE actual = (actuals->>i)::INTEGER;

        IF pred = 1 AND actual = 1 THEN tp = tp + 1;
        ELSIF pred = 0 AND actual = 0 THEN tn = tn + 1;
        ELSIF pred = 1 AND actual = 0 THEN fp = fp + 1;
        ELSIF pred = 0 AND actual = 1 THEN fn = fn + 1;
        END IF;
    END LOOP;

    -- 计算各项指标
    DECLARE accuracy = (tp + tn)::DECIMAL / (tp + tn + fp + fn);
    DECLARE precision = tp::DECIMAL / NULLIF(tp + fp, 0);
    DECLARE recall = tp::DECIMAL / NULLIF(tp + fn, 0);
    DECLARE f1_score = 2 * precision * recall / NULLIF(precision + recall, 0);

    RETURN json_build_object(
        'accuracy', accuracy,
        'precision', precision,
        'recall', recall,
        'f1_score', f1_score,
        'confusion_matrix', json_build_object(
            'tp', tp, 'tn', tn, 'fp', fp, 'fn', fn
        )
    );
);

-- 计算回归指标
CREATE FUNCTION calculate_regression_metrics(predictions JSON, actuals JSON) AS (
    DECLARE n = json_array_length(predictions);
    DECLARE sum_squared_errors = 0::DECIMAL;
    DECLARE sum_abs_errors = 0::DECIMAL;
    DECLARE sum_actuals = 0::DECIMAL;
    DECLARE sum_predictions = 0::DECIMAL;

    FOR i IN 0..n-1 LOOP
        DECLARE pred = (predictions->>i)::DECIMAL;
        DECLARE actual = (actuals->>i)::DECIMAL;
        DECLARE error = pred - actual;

        sum_squared_errors = sum_squared_errors + error * error;
        sum_abs_errors = sum_abs_errors + ABS(error);
        sum_actuals = sum_actuals + actual;
        sum_predictions = sum_predictions + pred;
    END LOOP;

    DECLARE mean_actuals = sum_actuals / n;
    DECLARE mse = sum_squared_errors / n;
    DECLARE rmse = SQRT(mse);
    DECLARE mae = sum_abs_errors / n;

    -- 计算R²分数
    DECLARE ss_tot = 0::DECIMAL;
    DECLARE ss_res = sum_squared_errors;

    FOR i IN 0..n-1 LOOP
        DECLARE actual = (actuals->>i)::DECIMAL;
        ss_tot = ss_tot + POWER(actual - mean_actuals, 2);
    END LOOP;

    DECLARE r_squared = 1 - (ss_res / NULLIF(ss_tot, 0));

    RETURN json_build_object(
        'mse', mse,
        'rmse', rmse,
        'mae', mae,
        'r_squared', r_squared
    );
);

-- 交叉验证
CREATE FUNCTION perform_cross_validation(model_id VARCHAR, dataset_id VARCHAR, folds INTEGER DEFAULT 5) AS (
    DECLARE cv_results = '[]'::JSON;

    FOR fold IN 1..folds LOOP
        -- 创建交叉验证折
        PERFORM create_cv_fold(dataset_id, fold, folds);

        -- 在训练折上训练模型
        DECLARE fold_model_id = train_model_on_fold(model_id, dataset_id, fold);

        -- 在验证折上评估
        DECLARE fold_metrics = evaluate_model_on_fold(fold_model_id, dataset_id, fold);

        cv_results = json_append(cv_results, fold_metrics);
    END LOOP;

    -- 计算交叉验证汇总统计
    RETURN json_build_object(
        'fold_results', cv_results,
        'mean_metrics', calculate_cv_summary(cv_results),
        'std_metrics', calculate_cv_stddev(cv_results)
    );
);

-- 学习曲线分析
CREATE FUNCTION analyze_learning_curves(model_id VARCHAR, training_history JSON) AS (
    RETURN json_build_object(
        'convergence_analysis', analyze_convergence(training_history),
        'overfitting_detection', detect_overfitting(training_history),
        'optimal_epochs', find_optimal_epochs(training_history),
        'stability_metrics', calculate_stability_metrics(training_history)
    );
);

-- 模型校准
CREATE FUNCTION calibrate_model_predictions(model_id VARCHAR, calibration_data JSON) AS (
    -- 使用Platt缩放或等渗回归进行校准
    DECLARE calibration_method = 'platt_scaling'; -- 或 'isotonic_regression'

    RETURN json_build_object(
        'calibration_method', calibration_method,
        'calibration_params', perform_calibration(calibration_data, calibration_method),
        'calibration_plot_data', generate_calibration_plot_data(calibration_data)
    );
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：模型评估框架</p>
                  <p>构建完整的模型评估和验证系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现多种评估指标计算</li>
                    <li>构建交叉验证框架</li>
                    <li>实现学习曲线分析</li>
                    <li>添加模型校准功能</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'online-learning':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">在线学习</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"持续学习，适应变化"</p>

            <Paragraph {...noteProps('p1')}>
              在线学习允许模型在部署后持续学习和适应新的数据。本节介绍在线学习算法和实现方法。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">在线学习算法</h3>

            <CodeBlock
              title="增量学习和概念漂移检测"
              code={`-- 在线学习模型状态
CREATE TABLE online_models (
    model_id VARCHAR PRIMARY KEY,
    base_model_id VARCHAR REFERENCES ml_models(model_id),
    learning_algorithm VARCHAR,     -- 'sgd', 'adagrad', 'adam', 'passive_aggressive'
    learning_rate DECIMAL(8,6),
    current_weights JSON,           -- 当前模型权重
    update_count BIGINT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    drift_threshold DECIMAL(5,4) DEFAULT 0.1,
    adaptation_rate DECIMAL(5,4) DEFAULT 0.01
);

-- 增量学习更新
CREATE FUNCTION update_online_model(model_id VARCHAR, new_features JSON, new_target DECIMAL) AS (
    DECLARE model = (SELECT * FROM online_models WHERE model_id = model_id);
    DECLARE prediction = predict_with_online_model(model.current_weights, new_features);
    DECLARE error = new_target - prediction;

    -- 计算梯度
    DECLARE gradient = calculate_gradient(new_features, error, model.learning_algorithm);

    -- 更新权重
    DECLARE new_weights = update_weights(model.current_weights, gradient, model.learning_rate);

    -- 存储更新
    UPDATE online_models
    SET current_weights = new_weights,
        update_count = update_count + 1,
        last_updated = CURRENT_TIMESTAMP
    WHERE model_id = model_id;

    -- 记录学习历史
    INSERT INTO online_learning_history (model_id, features, target, prediction, error, gradient, update_time)
    VALUES (model_id, new_features, new_target, prediction, error, gradient, CURRENT_TIMESTAMP);

    RETURN new_weights;
);

-- 概念漂移检测
CREATE FUNCTION detect_concept_drift(model_id VARCHAR, recent_predictions JSON, recent_actuals JSON) AS (
    -- 计算最近的预测准确率
    DECLARE recent_accuracy = calculate_recent_accuracy(recent_predictions, recent_actuals);

    -- 计算历史准确率基准
    DECLARE historical_accuracy = (
        SELECT AVG(accuracy) FROM model_performance_history
        WHERE model_id = model_id
          AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    );

    -- 检测漂移
    DECLARE drift_detected = ABS(recent_accuracy - historical_accuracy) > 0.1;

    IF drift_detected THEN
        -- 触发模型重新训练或适应
        PERFORM trigger_model_adaptation(model_id, recent_accuracy, historical_accuracy);
    END IF;

    RETURN json_build_object(
        'drift_detected', drift_detected,
        'recent_accuracy', recent_accuracy,
        'historical_accuracy', historical_accuracy,
        'drift_magnitude', ABS(recent_accuracy - historical_accuracy)
    );
);

-- 自适应学习率调整
CREATE FUNCTION adjust_learning_rate(model_id VARCHAR, performance_trend JSON) AS (
    DECLARE current_lr = (SELECT learning_rate FROM online_models WHERE model_id = model_id);

    -- 基于性能趋势调整学习率
    DECLARE new_lr = CASE
        WHEN performance_trend->>'trend' = 'improving' THEN current_lr * 1.05  -- 略微增加
        WHEN performance_trend->>'trend' = 'stable' THEN current_lr             -- 保持不变
        WHEN performance_trend->>'trend' = 'declining' THEN current_lr * 0.8    -- 减少学习率
        ELSE current_lr
    END;

    -- 限制学习率范围
    new_lr = GREATEST(0.0001, LEAST(0.1, new_lr));

    UPDATE online_models SET learning_rate = new_lr WHERE model_id = model_id;

    RETURN new_lr;
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：在线学习系统</p>
                  <p>实现持续学习的自适应模型系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>实现增量学习算法</li>
                    <li>构建概念漂移检测</li>
                    <li>添加自适应学习率调整</li>
                    <li>设计模型更新策略</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'ml-optimization':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">ML 查询优化</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"优化机器学习工作负载的查询性能"</p>

            <Paragraph {...noteProps('p1')}>
              ML查询优化专注于提升机器学习工作负载的执行效率。本节介绍ML特定的查询优化技术和最佳实践。
            </Paragraph>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ML查询优化策略</h3>

            <CodeBlock
              title="机器学习工作负载优化"
              code={`-- ML查询模式识别
CREATE TABLE ml_query_patterns (
    pattern_id VARCHAR PRIMARY KEY,
    pattern_type VARCHAR,           -- 'feature_extraction', 'batch_prediction', 'model_training', 'hyperparameter_tuning'
    query_template TEXT,
    optimization_hints JSON,        -- 优化建议
    performance_characteristics JSON,
    recommended_indexes JSON,
    cache_strategy VARCHAR
);

-- 特征工程查询优化
CREATE FUNCTION optimize_feature_query(feature_query TEXT) AS (
    -- 识别查询模式
    DECLARE query_pattern = identify_query_pattern(feature_query);

    -- 应用模式特定的优化
    DECLARE optimized_query = apply_pattern_optimization(feature_query, query_pattern);

    -- 生成执行计划
    DECLARE execution_plan = generate_ml_execution_plan(optimized_query, query_pattern);

    RETURN json_build_object(
        'original_query', feature_query,
        'optimized_query', optimized_query,
        'execution_plan', execution_plan,
        'estimated_performance', estimate_query_performance(optimized_query)
    );
);

-- 批量预测查询优化
CREATE FUNCTION optimize_batch_prediction(model_id VARCHAR, prediction_query TEXT, batch_size INTEGER) AS (
    -- 分析预测查询特征
    DECLARE query_analysis = analyze_prediction_query(prediction_query);

    -- 确定最佳批处理策略
    DECLARE batch_strategy = CASE
        WHEN query_analysis->>'data_size' > 1000000 THEN 'disk_based'
        WHEN query_analysis->>'complexity' > 0.8 THEN 'memory_optimized'
        ELSE 'standard_batch'
    END;

    -- 生成优化的批处理查询
    DECLARE optimized_batches = generate_optimized_batches(prediction_query, batch_size, batch_strategy);

    -- 配置缓存策略
    DECLARE cache_config = configure_prediction_cache(model_id, query_analysis);

    RETURN json_build_object(
        'batch_strategy', batch_strategy,
        'optimized_batches', optimized_batches,
        'cache_config', cache_config,
        'estimated_latency', estimate_batch_latency(optimized_batches, batch_strategy)
    );
);

-- 模型训练查询优化
CREATE FUNCTION optimize_training_query(training_query TEXT, model_type VARCHAR) AS (
    -- 分析训练数据特征
    DECLARE data_analysis = analyze_training_data(training_query);

    -- 根据模型类型选择优化策略
    DECLARE optimization_strategy = CASE model_type
        WHEN 'linear' THEN 'vectorized_operations'
        WHEN 'tree_based' THEN 'parallel_processing'
        WHEN 'neural_network' THEN 'gpu_acceleration'
        ELSE 'standard_optimization'
    END;

    -- 应用优化变换
    DECLARE optimized_query = apply_training_optimizations(training_query, optimization_strategy, data_analysis);

    -- 生成数据加载策略
    DECLARE data_loading_strategy = generate_data_loading_plan(optimized_query, model_type);

    RETURN json_build_object(
        'optimization_strategy', optimization_strategy,
        'optimized_query', optimized_query,
        'data_loading_strategy', data_loading_strategy,
        'memory_requirements', estimate_memory_requirements(optimized_query),
        'expected_speedup', calculate_expected_speedup(optimization_strategy, data_analysis)
    );
);

-- 超参数调优查询优化
CREATE FUNCTION optimize_hyperparameter_tuning(experiment_config JSON) AS (
    -- 分析调优空间
    DECLARE search_space = experiment_config->'hyperparameters';
    DECLARE search_strategy = experiment_config->>'strategy';

    -- 选择优化算法
    DECLARE optimization_algorithm = CASE search_strategy
        WHEN 'grid' THEN 'parallel_grid_search'
        WHEN 'random' THEN 'adaptive_random_search'
        WHEN 'bayesian' THEN 'gaussian_process_optimization'
        ELSE 'standard_search'
    END;

    -- 生成并行调优计划
    DECLARE parallel_plan = generate_parallel_tuning_plan(search_space, optimization_algorithm, experiment_config);

    -- 配置资源分配
    DECLARE resource_allocation = allocate_tuning_resources(parallel_plan);

    RETURN json_build_object(
        'optimization_algorithm', optimization_algorithm,
        'parallel_plan', parallel_plan,
        'resource_allocation', resource_allocation,
        'estimated_duration', estimate_tuning_duration(parallel_plan, resource_allocation),
        'optimization_potential', estimate_optimization_potential(search_space)
    );
);`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="动手练习" {...noteProps('box1')}>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">任务 1：ML查询性能优化</p>
                  <p>构建机器学习工作负载的查询优化系统：</p>
                  <ul className="list-disc ml-4 text-sm space-y-1">
                    <li>识别ML查询模式</li>
                    <li>实现特征工程查询优化</li>
                    <li>优化批量预测性能</li>
                    <li>加速模型训练查询</li>
                  </ul>
                </div>
              </div>
            </InfoBox>
          </div>
        );

      case 'faq-main':
        return (
          <FAQPage
            sectionId={sectionId}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            getNotesForBlock={getNotesForBlock}
          />
        );

      default:
        return <div className="text-center text-slate-400 py-20">选择一个章节开始学习</div>;
    }
  })();

  return <div className={fontSizeClass}>{content}</div>;
}

// ============================================
// 主应用组件
// ============================================

export function App() {
  const [activeSection, setActiveSection] = useState('why-duckdb');
  const [expandedModules, setExpandedModules] = useState<string[]>(modules.map(m => m.id));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickRefOpen, setQuickRefOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [learningPathOpen, setLearningPathOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [ontologyGraphOpen, setOntologyGraphOpen] = useState(false);
  const [sqlCompareOpen, setSQLCompareOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [learningAssistantOpen, setLearningAssistantOpen] = useState(false);
  const [codeReviewOpen, setCodeReviewOpen] = useState(false);
  const [projectWorkspaceOpen, setProjectWorkspaceOpen] = useState(false);
  
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForBlock,
    getNotesForSection,
    exportNotes,
    importNotes,
    clearAllNotes,
  } = useNotes();

  const {
    markComplete,
    toggleBookmark,
    setCurrentSection,
    getStats,
    resetProgress,
    isCompleted,
    isBookmarked,
  } = useProgress();

  const {
    settings,
    toggleDarkMode,
    setFontSize,
  } = useSettings();

  const {
    query,
    setQuery,
    results,
    suggestions,
    history,
    filters,
    isOpen: searchOpen,
    selectedIndex,
    openSearch,
    closeSearch,
    clearHistory,
    applyFilter,
    clearFilters,
    saveToHistory,
  } = useSearch();

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleNavigate = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentSection]);

  const nextSection = getNextSection(activeSection);
  const prevSection = getPrevSection(activeSection);

  const handlePrevSection = useCallback(() => {
    if (prevSection) handleNavigate(prevSection);
  }, [prevSection, handleNavigate]);

  const handleNextSection = useCallback(() => {
    if (nextSection) handleNavigate(nextSection);
  }, [nextSection, handleNavigate]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  const stats = getStats();
  const currentSectionNotes = getNotesForSection(activeSection);

  return (
    <div className={cn(
      'min-h-screen theme-transition',
      settings.darkMode
        ? 'dark bg-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-white to-amber-50'
    )}>
      {/* 阅读进度条 */}
      <ReadingProgress />

      {/* 键盘快捷键 */}
      <KeyboardShortcuts
        onPrevSection={handlePrevSection}
        onNextSection={handleNextSection}
        onSearch={openSearch}
        onToggleNotes={() => setNotesOpen(!notesOpen)}
      />

      {/* 顶部导航 */}
      <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 nav-enter glass">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦆</span>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 gradient-text">DuckDB 本体论教程</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fast.ai 风格 · MECE 结构 · 本体设计</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="xl:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                title="打开导航菜单"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* 搜索按钮 */}
              <button
                onClick={openSearch}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>搜索</span>
                <kbd className="hidden lg:inline text-xs bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              {/* 进度提示 */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                  <span>✓</span>
                  <span>{stats.completedCount}/{allSections.length}</span>
                </div>
              </div>

              {/* 在线试用 */}
              <a
                href="https://shell.duckdb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              >
                <span>🖥️</span>
                试用
              </a>

              {/* 设置按钮 */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                title="设置"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6 flex gap-6">
        {/* 移动端侧边栏覆盖层 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 侧边栏 */}
        <aside className={cn(
          "w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700",
          "fixed left-0 top-0 h-full z-50 xl:relative xl:z-auto xl:block",
          "transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        )}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 xl:hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">导航菜单</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="p-4 xl:p-0 space-y-1 max-h-[calc(100vh-6rem)] overflow-y-auto sidebar-enter">
            {modules.map(module => (
              <div key={module.id} className="mb-2">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                >
                  <span>{module.title}</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      expandedModules.includes(module.id) ? 'rotate-90' : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedModules.includes(module.id) && (
                  <div className="ml-3 mt-1 space-y-0.5">
                    {module.sections.map(section => {
                      const sectionNoteCount = getNotesForSection(section.id).length;
                      const completed = isCompleted(section.id);
                      const bookmarked = isBookmarked(section.id);
                      return (
                        <button
                          key={section.id}
                          onClick={() => handleNavigate(section.id)}
                          className={cn(
                            'w-full text-left px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-all duration-300 group card-hover',
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 font-medium shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm'
                          )}
                        >
                          <span className="flex-shrink-0">{section.icon}</span>
                          <span className="truncate flex-1">{section.title}</span>
                          <div className="flex items-center gap-1">
                            {bookmarked && <span className="text-yellow-500">★</span>}
                            {completed && <span className="text-green-500 text-xs">✓</span>}
                            {sectionNoteCount > 0 && (
                              <span className="w-4 h-4 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center justify-center">
                                {sectionNoteCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* 主内容 */}
        <main className="flex-1 min-w-0">
          {/* 移动端章节选择器 */}
          <div className="lg:hidden mb-4">
            <select
              value={activeSection}
              onChange={e => handleNavigate(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {modules.map(module => (
                <optgroup key={module.id} label={module.title}>
                  {module.sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.icon} {section.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 教程内容 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 card-hover page-enter">
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeSection)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isBookmarked(activeSection)
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-yellow-500'
                  )}
                  title={isBookmarked(activeSection) ? '取消收藏' : '收藏'}
                >
                  <svg className="w-5 h-5" fill={isBookmarked(activeSection) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  onClick={() => isCompleted(activeSection) ? null : markComplete(activeSection)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
                    isCompleted(activeSection)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  )}
                >
                  {isCompleted(activeSection) ? '✓ 已完成' : '标记完成'}
                </button>
              </div>
              <div className="text-sm text-slate-400">
                {currentSectionNotes.length > 0 && (
                  <span className="flex items-center gap-1">
                    <span>📝</span>
                    {currentSectionNotes.length} 条笔记
                  </span>
                )}
              </div>
            </div>

            <TutorialContent
              sectionId={activeSection}
              addNote={addNote}
              updateNote={updateNote}
              deleteNote={deleteNote}
              getNotesForBlock={getNotesForBlock}
              fontSize={settings.fontSize}
            />
          </div>

          {/* 底部导航 */}
          <div className="mt-6 flex justify-between items-center">
            {prevSection ? (
              <button
                onClick={() => handleNavigate(prevSection)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一节
              </button>
            ) : (
              <div />
            )}
            {nextSection ? (
              <button
                onClick={() => handleNavigate(nextSection)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg button-primary"
              >
                下一节
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>

      {/* 目录 */}
      <TableOfContents sectionId={activeSection} />

      {/* 返回顶部 */}
      <BackToTop />

      {/* 笔记面板 */}
      <NotesPanel
        notes={notes}
        onUpdate={updateNote}
        onDelete={deleteNote}
        onExport={exportNotes}
        onImport={importNotes}
        onClearAll={clearAllNotes}
        onNavigate={handleNavigate}
        getSectionTitle={getSectionTitle}
      />

      {/* 搜索弹窗 */}
      <SearchModal
        isOpen={searchOpen}
        query={query}
        results={results}
        suggestions={suggestions}
        history={history}
        filters={filters}
        selectedIndex={selectedIndex}
        onQueryChange={setQuery}
        onClose={closeSearch}
        onNavigate={handleNavigate}
        onSuggestionSelect={(suggestion) => {
          setQuery(suggestion);
          saveToHistory();
        }}
        onHistorySelect={(historyQuery) => {
          setQuery(historyQuery);
          saveToHistory();
        }}
        onFilterChange={applyFilter}
        onClearFilters={clearFilters}
        onClearHistory={clearHistory}
      />

      {/* 设置面板 */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={settings.darkMode}
        fontSize={settings.fontSize}
        onToggleDarkMode={toggleDarkMode}
        onFontSizeChange={setFontSize}
        completedCount={stats.completedCount}
        totalSections={allSections.length}
        totalTime={stats.totalTime}
        onResetProgress={resetProgress}
        onOpenPlayground={() => setPlaygroundOpen(true)}
        onOpenOntologyGraph={() => setOntologyGraphOpen(true)}
        onOpenSQLCompare={() => setSQLCompareOpen(true)}
        onOpenQuiz={() => setQuizOpen(true)}
        onOpenQuickRef={() => setQuickRefOpen(true)}
        onOpenFlashcards={() => setFlashcardsOpen(true)}
        onOpenLearningPath={() => setLearningPathOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenGlossary={() => setGlossaryOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenProjectWorkspace={() => setProjectWorkspaceOpen(true)}
        onOpenLearningAssistant={() => setLearningAssistantOpen(true)}
        onOpenCodeReview={() => setCodeReviewOpen(true)}
      />

      {/* 快速参考 */}
      <QuickReference 
        isOpen={quickRefOpen} 
        onClose={() => setQuickRefOpen(false)} 
      />

      {/* 闪卡复习 */}
      <Flashcards 
        isOpen={flashcardsOpen} 
        onClose={() => setFlashcardsOpen(false)} 
      />

      {/* 学习路径 */}
      <LearningPath
        isOpen={learningPathOpen}
        onClose={() => setLearningPathOpen(false)}
        onNavigate={handleNavigate}
        completedSections={stats.completedSections || []}
        bookmarkedSections={stats.bookmarkedSections || []}
      />

      {/* 成就系统 */}
      <Achievements
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        completedCount={stats.completedCount}
        totalSections={allSections.length}
        totalTime={stats.totalTime}
        notesCount={notes.length}
        bookmarksCount={stats.bookmarkedSections?.length || 0}
      />

      {/* 术语表 */}
      <Glossary
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />

      {/* SQL 练习场 */}
      <SQLPlayground
        isOpen={playgroundOpen}
        onClose={() => setPlaygroundOpen(false)}
      />

      {/* 本体论概念图 */}
      <OntologyGraph
        isOpen={ontologyGraphOpen}
        onClose={() => setOntologyGraphOpen(false)}
      />

      {/* SQL 对比 */}
      <SQLCompare
        isOpen={sqlCompareOpen}
        onClose={() => setSQLCompareOpen(false)}
      />

      {/* 知识测验 */}
      <Quiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
      />

      {/* 学习仪表盘 */}
      <LearningDashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        stats={{
          completedCount: stats.completedCount,
          totalSections: allSections.length,
          totalTime: stats.totalTime,
          notesCount: notes.length,
          bookmarksCount: stats.bookmarkedSections?.length || 0,
          streakDays: 1,
          lastVisit: Date.now(),
        }}
      />

      {/* 学习助手 */}
      <LearningAssistant
        isOpen={learningAssistantOpen}
        onClose={() => setLearningAssistantOpen(false)}
        currentSection={activeSection}
      />

      {/* 代码审查 */}
      <CodeReview
        isOpen={codeReviewOpen}
        onClose={() => setCodeReviewOpen(false)}
      />

      {/* 项目工作区 */}
      <ProjectWorkspace
        isOpen={projectWorkspaceOpen}
        onClose={() => setProjectWorkspaceOpen(false)}
      />

      {/* 快速操作面板 */}
      <QuickActions
        actions={[
          {
            id: 'search',
            icon: '🔍',
            label: '全局搜索',
            shortcut: '⌘K',
            action: openSearch,
            category: 'navigation'
          },
          {
            id: 'notes',
            icon: '📝',
            label: '笔记面板',
            action: () => setNotesOpen(!notesOpen),
            category: 'content'
          },
          {
            id: 'playground',
            icon: '🎮',
            label: 'SQL 练习场',
            action: () => setPlaygroundOpen(true),
            category: 'tools'
          },
          {
            id: 'quiz',
            icon: '🎯',
            label: '知识测验',
            action: () => setQuizOpen(true),
            category: 'tools'
          },
          {
            id: 'flashcards',
            icon: '🃏',
            label: '闪卡复习',
            action: () => setFlashcardsOpen(true),
            category: 'tools'
          },
          {
            id: 'dashboard',
            icon: '📊',
            label: '学习仪表盘',
            action: () => setDashboardOpen(true),
            category: 'tools'
          },
          {
            id: 'settings',
            icon: '⚙️',
            label: '设置',
            action: () => setSettingsOpen(true),
            category: 'tools'
          }
        ]}
      />

      {/* 页脚 */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 mt-12 py-8 text-center text-slate-500 dark:text-slate-400">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🦆</span>
            <div>
              <p className="font-semibold gradient-text">DuckDB 本体论教程</p>
              <p className="text-xs">Fast.ai 风格 · MECE 结构 · 本体设计原则</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <kbd className="kbd">←</kbd>
              <kbd className="kbd">→</kbd>
              翻页
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">⌘K</kbd>
              搜索
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">?</kbd>
              快捷键
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
