// ============================================
// 性能优化章节组件 - 简化版本
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
// 查询计划章节
// ============================================

export function QueryPlansSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">查询计划</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SQL 执行的路线图"</p>

      <Paragraph {...noteProps('p1')}>
        查询计划是数据库执行SQL查询时的详细执行方案。它描述了数据库如何访问数据、使用哪些索引、如何连接表、使用什么算法等。
      </Paragraph>

      <SQLExplainer
        sql={`EXPLAIN SELECT * FROM users WHERE age > 25;
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 25;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 分析查询计划，识别性能瓶颈</p>
          <p><strong>挑战 2：</strong> 比较不同查询写法的执行效率</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 内存缓存章节
// ============================================

export function MemoryCachingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">内存缓存</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据访问的加速器"</p>

      <Paragraph {...noteProps('p1')}>
        内存缓存通过将经常访问的数据存储在内存中，显著减少磁盘I/O操作，提升查询响应速度。
      </Paragraph>

      <CodeBlock
        title="缓存配置"
        code={`PRAGMA cache_size = 100000;  -- 设置缓存大小
SET memory_limit = '2GB';    -- 内存限制`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 配置合适的缓存大小</p>
          <p><strong>挑战 2：</strong> 创建热点数据缓存</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 并行处理章节
// ============================================

export function ParallelProcessingSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">并行处理</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"多核并发的威力"</p>

      <Paragraph {...noteProps('p1')}>
        并行处理利用现代CPU的多核架构，将大数据集的处理任务分配给多个处理器核心同时执行，大幅提升查询性能。
      </Paragraph>

      <CodeBlock
        title="并行查询配置"
        code={`SET threads = 8;  -- 设置并行线程数
PRAGMA enable_parallel_processing;  -- 启用并行处理`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 测试不同线程数的性能表现</p>
          <p><strong>挑战 2：</strong> 分析哪些查询适合并行处理</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 统计信息章节
// ============================================

export function StatisticsInfoSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">统计信息</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"查询优化的数据基础"</p>

      <Paragraph {...noteProps('p1')}>
        统计信息是查询优化器的决策依据，包括表的大小、列的分布、索引的选择性等信息。准确的统计信息能帮助生成最优的查询计划。
      </Paragraph>

      <CodeBlock
        title="统计信息管理"
        code={`ANALYZE table_name;           -- 收集表统计信息
ANALYZE;                       -- 分析所有表
SELECT * FROM pg_stats;         -- 查看统计信息`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 分析表统计信息的准确性</p>
          <p><strong>挑战 2：</strong> 观察统计信息对查询计划的影响</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 分区章节
// ============================================

export function PartitioningSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">分区</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"大数据集的高效管理"</p>

      <Paragraph {...noteProps('p1')}>
        分区将大表分割成更小的、更易管理的片段。查询时可以只扫描相关的分区，大幅提升性能并简化维护。
      </Paragraph>

      <CodeBlock
        title="表分区"
        code={`-- 范围分区
CREATE TABLE sales (
    id INTEGER,
    date DATE,
    amount DECIMAL
) PARTITION BY RANGE (date);

-- 列表分区
CREATE TABLE logs (
    id INTEGER,
    level VARCHAR,
    message TEXT
) PARTITION BY LIST (level);`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计合适的分区策略</p>
          <p><strong>挑战 2：</strong> 比较分区表和非分区表的性能</p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 向量化章节
// ============================================

export function VectorizationSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">向量化</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"SIMD 并行计算"</p>

      <Paragraph {...noteProps('p1')}>
        向量化利用现代CPU的SIMD（单指令多数据）指令，同时对多个数据元素执行相同的操作，大幅提升数值计算和数据处理的性能。
      </Paragraph>

      <CodeBlock
        title="向量化查询"
        code={`-- 向量化聚合
SELECT SUM(amount), AVG(price), COUNT(*)
FROM sales WHERE date >= '2024-01-01';

-- 向量化过滤
SELECT * FROM data
WHERE x > 100 AND y < 200 AND z BETWEEN 50 AND 150;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 观察向量化对不同数据类型的性能影响</p>
          <p><strong>挑战 2：</strong> 比较向量化查询和传统查询的性能差异</p>
        </div>
      </InfoBox>
    </div>
  );
}
