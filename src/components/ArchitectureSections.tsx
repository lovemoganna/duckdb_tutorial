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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">扩展插件</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"扩展数据库能力的魔法"</p>

      <Paragraph {...noteProps('p1')}>
        DuckDB的扩展系统允许你在不修改核心代码的情况下，为数据库添加新功能。从JSON处理到机器学习，从地理空间分析到时间序列处理，扩展插件让DuckDB成为一个真正通用的数据处理平台。
      </Paragraph>

      <SQLExplainer
        sql={`-- 安装扩展
INSTALL json;
INSTALL httpfs;
INSTALL spatial;

-- 加载扩展
LOAD json;
LOAD httpfs;
LOAD spatial;

-- 查看已安装的扩展
SELECT * FROM duckdb_extensions();`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 安装并测试5个不同的扩展插件</p>
          <p><strong>挑战 2：</strong> 创建一个使用多种扩展的数据处理工作流</p>
          <p><strong>挑战 3：</strong> 评估扩展对查询性能的影响</p>
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">最佳实践</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"高效、安全、可维护的SQL开发"</p>

      <Paragraph {...noteProps('p1')}>
        最佳实践是基于经验总结的指导原则，帮助开发者写出更高质量、更高效、更安全的SQL代码。
      </Paragraph>

      <CodeBlock
        title="命名规范"
        code={`-- 好的命名示例
CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引命名
CREATE INDEX idx_user_profiles_email ON user_profiles(email_address);`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 重构一个低效的SQL查询，按照最佳实践重新编写</p>
          <p><strong>挑战 2：</strong> 设计一个完整的数据库命名规范文档</p>
          <p><strong>挑战 3：</strong> 创建一个SQL代码审查清单</p>
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">迁移</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"数据和架构的平滑过渡"</p>

      <Paragraph {...noteProps('p1')}>
        数据库迁移是系统演进的重要环节。无论是从其他数据库迁移到DuckDB，还是在DuckDB内部进行架构升级，良好的迁移策略可以确保数据安全、最小化业务中断。
      </Paragraph>

      <CodeBlock
        title="数据迁移"
        code={`-- 从CSV迁移数据
CREATE TABLE users AS
SELECT * FROM read_csv('users.csv');

-- 数据验证
SELECT COUNT(*) FROM users;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计一个完整的数据库迁移计划</p>
          <p><strong>挑战 2：</strong> 创建一个自动化迁移工具</p>
          <p><strong>挑战 3：</strong> 实现数据一致性校验</p>
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">高可用</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"7×24小时稳定运行的保障"</p>

      <Paragraph {...noteProps('p1')}>
        高可用性确保系统能够在面对各种故障和异常情况时，仍然能够持续提供服务。对于数据系统而言，高可用意味着数据不丢失、服务不中断、性能稳定。
      </Paragraph>

      <CodeBlock
        title="备份策略"
        code={`-- 自动备份
PRAGMA wal_autocheckpoint = 1000;
SET memory_limit = '2GB';`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计一个完整的高可用架构</p>
          <p><strong>挑战 2：</strong> 实现自动化监控和告警系统</p>
          <p><strong>挑战 3：</strong> 创建灾难恢复计划</p>
        </div>
      </InfoBox>
    </div>
  );
}
