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
  TransactionsSection,
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
              本体论的精髓在于"关系"。概念之间通过关系连接，形成知识网络。要查询这些关系，就需要 JOIN。
            </Paragraph>

            <SQLFlowDiagram type="join" />

            <DataFlowAnimation type="join" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">JOIN 类型一览</h3>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-700 dark:text-blue-300">INNER JOIN</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">只返回两表都匹配的行</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-bold text-green-700 dark:text-green-300">LEFT JOIN</h4>
                <p className="text-sm text-green-600 dark:text-green-400">返回左表所有行 + 右表匹配行</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <h4 className="font-bold text-amber-700 dark:text-amber-300">RIGHT JOIN</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">返回右表所有行 + 左表匹配行</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="font-bold text-purple-700 dark:text-purple-300">FULL JOIN</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">返回两表所有行</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实战：查询概念层级</h3>

            <CodeBlock
              title="自连接 - 查询父子关系"
              code={`-- 查询每个概念及其父概念名称
SELECT 
    c.name AS 概念,
    c.description AS 描述,
    p.name AS 父概念
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id
ORDER BY c.id;

-- 结果示例：
-- ┌──────────────┬────────────────┬──────────────┐
-- │     概念     │      描述       │    父概念    │
-- ├──────────────┼────────────────┼──────────────┤
-- │ Entity       │ 万物之源        │ NULL         │
-- │ Living Thing │ 有生命的实体    │ Entity       │
-- │ Animal       │ 动物界          │ Living Thing │
-- │ Dog          │ 犬科            │ Mammal       │
-- └──────────────┴────────────────┴──────────────┘`}
              {...noteProps('code1')}
            />

            <InfoBox type="experiment" title="思考题" {...noteProps('box1')}>
              如何找出所有没有子概念的"叶子节点"？
              <details className="mt-2">
                <summary className="cursor-pointer text-purple-600 dark:text-purple-400">查看答案</summary>
                <code className="block mt-2 bg-purple-100 dark:bg-purple-900 p-2 rounded text-sm whitespace-pre">
{`SELECT c.*
FROM concepts c
LEFT JOIN concepts child ON child.parent_id = c.id
WHERE child.id IS NULL;`}
                </code>
              </details>
            </InfoBox>
          </div>
        );

      case 'subquery':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">子查询与 CTE</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"查询中嵌套查询，威力翻倍"</p>

            <SQLFlowDiagram type="cte" />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">子查询</h3>

            <CodeBlock
              title="WHERE 中的子查询"
              code={`-- 查询有子概念的概念
SELECT * FROM concepts
WHERE id IN (
    SELECT DISTINCT parent_id 
    FROM concepts 
    WHERE parent_id IS NOT NULL
);

-- 使用 EXISTS（通常更高效）
SELECT * FROM concepts c
WHERE EXISTS (
    SELECT 1 FROM properties p 
    WHERE p.concept_id = c.id
);`}
              {...noteProps('code1')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">CTE（公共表表达式）</h3>

            <Paragraph {...noteProps('p1')}>
              CTE 用 <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">WITH</code> 语法定义临时结果集，让复杂查询更清晰、可复用。
            </Paragraph>

            <CodeBlock
              title="WITH 子句"
              code={`-- 使用 CTE 让查询更清晰
WITH mammals AS (
    SELECT * FROM concepts WHERE parent_id = 4
),
parent_info AS (
    SELECT id, name AS parent_name FROM concepts
)
SELECT 
    m.name,
    m.description,
    p.parent_name
FROM mammals m
LEFT JOIN parent_info p ON m.parent_id = p.id;`}
              {...noteProps('code2')}
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">递归 CTE（重点！）</h3>

            <CodeBlock
              title="递归查询层级路径"
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
              {...noteProps('code3')}
            />

            <InfoBox type="fastai" title="递归的威力" {...noteProps('box1')}>
              递归 CTE 是处理层级数据的利器！本体论、组织架构、分类目录都是典型场景。掌握它，你的 SQL 能力将上一个台阶。
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

      case 'transactions':
        return (
          <TransactionsSection
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

      case 'extensions':
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
    isOpen: searchOpen,
    openSearch,
    closeSearch,
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
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-float">🦆</span>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 gradient-text">DuckDB 本体论教程</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fast.ai 风格 · MECE 结构 · 本体设计</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* 侧边栏 */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <nav className="sticky top-20 space-y-1 max-h-[calc(100vh-6rem)] overflow-y-auto sidebar-enter">
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
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg button-primary animate-pulse-glow"
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
        onQueryChange={setQuery}
        onClose={closeSearch}
        onNavigate={handleNavigate}
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

      {/* 浮动工具栏 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-2xl border border-slate-200/50 dark:border-slate-700/50 glass animate-slideUp">
        <button
          onClick={() => setPlaygroundOpen(true)}
          className="p-2.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="SQL 练习场"
        >
          <span className="text-lg">🎮</span>
        </button>
        <button
          onClick={() => setOntologyGraphOpen(true)}
          className="p-2.5 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="本体论概念图"
        >
          <span className="text-lg">🕸️</span>
        </button>
        <button
          onClick={() => setSQLCompareOpen(true)}
          className="p-2.5 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="SQL 语法对比"
        >
          <span className="text-lg">⚖️</span>
        </button>
        <button
          onClick={() => setQuizOpen(true)}
          className="p-2.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="知识测验"
        >
          <span className="text-lg">🎯</span>
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <button
          onClick={() => setQuickRefOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="SQL 快速参考"
        >
          <span className="text-lg">📋</span>
        </button>
        <button
          onClick={() => setFlashcardsOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="闪卡复习"
        >
          <span className="text-lg">🃏</span>
        </button>
        <button
          onClick={() => setLearningPathOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="学习路径"
        >
          <span className="text-lg">🗺️</span>
        </button>
        <button
          onClick={() => setAchievementsOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="成就系统"
        >
          <span className="text-lg">🏆</span>
        </button>
        <button
          onClick={() => setGlossaryOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="术语表"
        >
          <span className="text-lg">📖</span>
        </button>
        <button
          onClick={() => setDashboardOpen(true)}
          className="p-2.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="学习仪表盘"
        >
          <span className="text-lg">📊</span>
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <button
          onClick={() => setProjectWorkspaceOpen(true)}
          className="p-2.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="项目工作区"
        >
          <span className="text-lg">💻</span>
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <button
          onClick={() => setLearningAssistantOpen(true)}
          className="p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="学习助手"
        >
          <span className="text-lg">🤖</span>
        </button>
        <button
          onClick={() => setCodeReviewOpen(true)}
          className="p-2.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-slate-600 dark:text-slate-300"
          title="代码审查"
        >
          <span className="text-lg">🔍</span>
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title={settings.darkMode ? '切换浅色' : '切换暗色'}
        >
          <span className="text-lg">{settings.darkMode ? '☀️' : '🌙'}</span>
        </button>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 mt-12 py-8 text-center text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl animate-bounce-soft">🦆</span>
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
