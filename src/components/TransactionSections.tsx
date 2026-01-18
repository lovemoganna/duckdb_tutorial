// ============================================
// 事务处理模块 - 独立章节
// ============================================

import { InfoBox } from './InfoBox';
import { Paragraph } from './Paragraph';
import { SQLExplainer } from './SQLExplainer';
import { CodeBlock } from './CodeBlock';
import { DataFlowAnimation } from './DataFlowAnimation';

interface SectionProps {
  sectionId: string;
  addNote: (sectionId: string, blockId: string, content: string) => void;
  updateNote: (sectionId: string, blockId: string, content: string) => void;
  deleteNote: (sectionId: string, blockId: string) => void;
  getNotesForBlock: (sectionId: string, blockId: string) => any[];
}

// ============================================
// 1. 事务基础概念
// ============================================

export function TransactionBasicsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">事务基础概念</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"理解事务的核心概念和基本原理"</p>

      <Paragraph {...noteProps('intro')}>
        事务（Transaction）是数据库操作的基本单位，它将一系列相关的数据库操作组合成一个不可分割的工作单元。
        事务确保这些操作要么全部成功执行，要么全部失败回滚，从而维护数据库的一致性和完整性。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">为什么需要事务？</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
          <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            <span>没有事务的问题</span>
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-2">
            <li>• 银行转账只扣钱不加钱</li>
            <li>• 订单创建后库存不变</li>
            <li>• 系统崩溃导致数据不一致</li>
            <li>• 并发访问造成数据损坏</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>事务的解决方案</span>
          </h4>
          <ul className="text-sm text-green-700 dark:text-green-400 space-y-2">
            <li>• 要么全部成功，要么全部失败</li>
            <li>• 系统崩溃后自动恢复</li>
            <li>• 并发操作安全隔离</li>
            <li>• 数据一致性得到保证</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">事务的基本状态</h3>

      <div className="my-6">
        <DataFlowAnimation
          type="transaction"
          title="事务状态转换图"
          steps={[
            {
              id: 'start',
              label: '开始事务',
              status: 'idle' as const,
              description: 'BEGIN TRANSACTION'
            },
            {
              id: 'execute',
              label: '执行操作',
              status: 'idle' as const,
              description: '执行 SQL 语句'
            },
            {
              id: 'validate',
              label: '验证约束',
              status: 'idle' as const,
              description: '检查完整性约束'
            },
            {
              id: 'prepare',
              label: '准备提交',
              status: 'idle' as const,
              description: '准备阶段 (2PC)'
            },
            {
              id: 'commit',
              label: '提交事务',
              status: 'idle' as const,
              description: 'COMMIT'
            },
            {
              id: 'rollback',
              label: '回滚事务',
              status: 'idle' as const,
              description: 'ROLLBACK'
            }
          ]}
          connections={[
            { from: 'start', to: 'execute', type: 'normal' as const },
            { from: 'execute', to: 'validate', type: 'normal' as const },
            { from: 'validate', to: 'prepare', type: 'success' as const, label: '成功' },
            { from: 'validate', to: 'rollback', type: 'failure' as const, label: '失败' },
            { from: 'prepare', to: 'commit', type: 'success' as const, label: '所有参与者就绪' },
            { from: 'prepare', to: 'rollback', type: 'failure' as const, label: '参与者失败' }
          ]}
        />
      </div>

      <CodeBlock
        title="事务的基本语法"
        code={`-- 显式开启事务
BEGIN TRANSACTION;

-- 执行一系列操作
INSERT INTO accounts (id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务（永久保存更改）
COMMIT;

-- 或者回滚事务（撤销所有更改）
-- ROLLBACK;`}
        {...noteProps('basic-syntax')}
      />

      <InfoBox type="fastai" title="事务的本质理解" {...noteProps('understanding')}>
        <div className="space-y-3">
          <p>
            <strong>事务不是技术概念，而是业务概念。</strong>它反映了现实世界中的原子性操作：
            购买商品、银行转账、机票预订等，这些都是不可分割的业务单元。
          </p>
          <p>
            数据库事务正是为了在数字世界中模拟这种原子性操作，确保业务逻辑的完整性和一致性。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 2. ACID 属性详解
// ============================================

export function AcidPropertiesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">ACID 属性详解</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"事务的四大基本属性"</p>

      <Paragraph {...noteProps('intro')}>
        ACID 是事务的四个基本属性：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）和持久性（Durability）。
        这四个属性共同确保了数据库操作的可靠性和正确性。
      </Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>原子性 (Atomicity)</span>
          </h4>
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            事务是不可分割的最小工作单元。事务中的所有操作要么全部完成，要么全部不完成，不存在部分完成的中间状态。
          </p>
          <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-lg mb-3">
            <p className="text-xs text-green-800 dark:text-green-300 font-medium">实现机制：</p>
            <ul className="text-xs text-green-700 dark:text-green-400 mt-1 space-y-1">
              <li>• Undo Log：记录事务修改前的值</li>
              <li>• Redo Log：记录事务修改后的值</li>
              <li>• 回滚时使用 Undo Log 恢复数据</li>
            </ul>
          </div>
          <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-lg">
            <p className="text-xs text-green-800 dark:text-green-300">
              <strong>业务示例：</strong>银行转账必须同时扣除转出账户和增加转入账户的金额，不允许只执行其中一步。
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <span>一致性 (Consistency)</span>
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            事务执行前后，数据库必须从一个一致性状态转换到另一个一致性状态。事务不能破坏数据库的完整性约束。
          </p>
          <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-lg mb-3">
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">约束类型：</p>
            <ul className="text-xs text-blue-700 dark:text-blue-400 mt-1 space-y-1">
              <li>• 实体完整性：主键约束、非空约束</li>
              <li>• 参照完整性：外键约束</li>
              <li>• 用户定义完整性：CHECK 约束、触发器</li>
            </ul>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>验证时机：</strong>事务提交时，数据库会检查所有约束条件是否仍然满足。
            </p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            <span>隔离性 (Isolation)</span>
          </h4>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
            并发执行的事务互不干扰，每个事务都感觉自己在独占数据库，不会受到其他并发事务的影响。
          </p>
          <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-lg mb-3">
            <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">隔离机制：</p>
            <ul className="text-xs text-purple-700 dark:text-purple-400 mt-1 space-y-1">
              <li>• 锁机制：共享锁、排他锁</li>
              <li>• 多版本并发控制 (MVCC)</li>
              <li>• 时间戳排序</li>
            </ul>
          </div>
          <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-lg">
            <p className="text-xs text-purple-800 dark:text-purple-300">
              <strong>权衡选择：</strong>在并发性能和数据一致性之间找到最佳平衡点。
            </p>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <span>持久性 (Durability)</span>
          </h4>
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
            一旦事务提交，其结果就是永久性的。即使系统崩溃或断电，事务所做的修改也不会丢失。
          </p>
          <div className="bg-orange-100 dark:bg-orange-800/50 p-3 rounded-lg mb-3">
            <p className="text-xs text-orange-800 dark:text-orange-300 font-medium">持久化技术：</p>
            <ul className="text-xs text-orange-700 dark:text-orange-400 mt-1 space-y-1">
              <li>• 预写日志 (WAL)</li>
              <li>• 定期检查点 (Checkpoint)</li>
              <li>• 磁盘同步写入</li>
            </ul>
          </div>
          <div className="bg-orange-100 dark:bg-orange-800/50 p-3 rounded-lg">
            <p className="text-xs text-orange-800 dark:text-orange-300">
              <strong>恢复机制：</strong>系统重启时通过重放日志来恢复未提交的事务状态。
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">ACID 之间的关系</h3>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4">🔗 ACID 属性间的相互依赖</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-indigo-700 dark:text-indigo-400">原子性</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-500 mt-1">为隔离性提供基础</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700 dark:text-indigo-400">一致性</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-500 mt-1">依赖其他三者保证</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700 dark:text-indigo-400">隔离性</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-500 mt-1">通过锁和 MVCC 实现</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700 dark:text-indigo-400">持久性</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-500 mt-1">通过 WAL 保证</div>
          </div>
        </div>
      </div>

      <InfoBox type="fastai" title="ACID 的实际意义" {...noteProps('significance')}>
        <div className="space-y-3">
          <p>
            <strong>ACID 不仅仅是技术规范，更是一种思维方式。</strong>它教会我们在设计系统时要考虑：
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>操作的原子性和完整性</li>
            <li>系统状态的一致性维护</li>
            <li>并发环境下的安全访问</li>
            <li>故障场景下的数据安全性</li>
          </ul>
          <p>
            理解 ACID 的本质，有助于我们在实际开发中做出正确的架构决策和设计选择。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 3. 隔离级别与并发控制
// ============================================

export function IsolationLevelsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">隔离级别与并发控制</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"平衡并发性能与数据一致性"</p>

      <Paragraph {...noteProps('intro')}>
        事务隔离级别决定了事务之间的可见性和并发控制程度。不同的隔离级别在性能和一致性之间做出不同权衡，
        DuckDB 支持标准的 SQL 隔离级别，每种级别都有其特定的应用场景和权衡考虑。
      </Paragraph>

      <div className="space-y-6 my-6">
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📖</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">READ UNCOMMITTED</h4>
              <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">最低隔离级别</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ 优点</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 并发性能最好</li>
                <li>• 几乎没有锁竞争</li>
                <li>• 响应速度最快</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ 问题</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 脏读：读取未提交数据</li>
                <li>• 不可重复读</li>
                <li>• 幻读</li>
              </ul>
            </div>
          </div>
          <CodeBlock
            code={`SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- 或者
BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;`}
            language="sql"
            className="text-xs mt-4"
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔒</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">READ COMMITTED</h4>
              <span className="text-sm text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">DuckDB 默认</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ 优点</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 防止脏读</li>
                <li>• 性能和一致性的良好平衡</li>
                <li>• 大多数应用场景的首选</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">⚠️ 仍可能出现</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 不可重复读</li>
                <li>• 幻读</li>
              </ul>
            </div>
          </div>
          <CodeBlock
            code={`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- 或者
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;`}
            language="sql"
            className="text-xs mt-4"
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔄</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">REPEATABLE READ</h4>
              <span className="text-sm text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">严格一致性</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ 优点</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 防止不可重复读</li>
                <li>• 保证读取一致性</li>
                <li>• 适合报表和分析场景</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">⚠️ 仍可能出现</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 幻读</li>
                <li>• 性能开销较大</li>
              </ul>
            </div>
          </div>
          <CodeBlock
            code={`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- 或者
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;`}
            language="sql"
            className="text-xs mt-4"
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">SERIALIZABLE</h4>
              <span className="text-sm text-red-600 bg-red-100 dark:bg-red-900 px-2 py-1 rounded">最高隔离</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ 优点</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 完全防止所有并发问题</li>
                <li>• 事务串行化执行</li>
                <li>• 最强一致性保证</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ 缺点</h5>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• 性能最差</li>
                <li>• 容易出现死锁</li>
                <li>• 并发能力严重受限</li>
              </ul>
            </div>
          </div>
          <CodeBlock
            code={`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 或者
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;`}
            language="sql"
            className="text-xs mt-4"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">隔离级别选择指南</h3>

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-cyan-800 dark:text-cyan-300 mb-4">🎯 如何选择合适的隔离级别？</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2">高性能优先的场景</h5>
            <ul className="text-sm text-cyan-600 dark:text-cyan-500 space-y-1">
              <li>• 实时数据分析</li>
              <li>• 只读报表查询</li>
              <li>• 数据导入/导出</li>
              <li>• 批量处理任务</li>
            </ul>
            <div className="mt-2 text-xs bg-cyan-100 dark:bg-cyan-800/50 p-2 rounded">
              <strong>推荐：</strong>READ UNCOMMITTED 或 READ COMMITTED
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2">数据一致性优先的场景</h5>
            <ul className="text-sm text-cyan-600 dark:text-cyan-500 space-y-1">
              <li>• 金融交易系统</li>
              <li>• 库存管理系统</li>
              <li>• 用户账户操作</li>
              <li>• 订单处理系统</li>
            </ul>
            <div className="mt-2 text-xs bg-cyan-100 dark:bg-cyan-800/50 p-2 rounded">
              <strong>推荐：</strong>REPEATABLE READ 或 SERIALIZABLE
            </div>
          </div>
        </div>
      </div>

      <InfoBox type="warning" title="隔离级别设置的最佳实践" {...noteProps('best-practices')}>
        <ul className="list-disc ml-4 space-y-2">
          <li><strong>按需选择：</strong>不要盲目使用最高隔离级别，根据业务需求选择合适的级别</li>
          <li><strong>会话级别：</strong>可以在会话开始时设置默认隔离级别</li>
          <li><strong>事务级别：</strong>也可以在具体事务中指定隔离级别</li>
          <li><strong>性能监控：</strong>定期监控不同隔离级别下的性能表现</li>
          <li><strong>应用层补偿：</strong>有时候通过应用层逻辑可以避免使用过高的隔离级别</li>
        </ul>
      </InfoBox>
    </div>
  );
}

// ============================================
// 4. 并发问题分析
// ============================================

export function ConcurrencyProblemsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">并发问题分析</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"理解并发访问下的数据一致性问题"</p>

      <Paragraph {...noteProps('intro')}>
        当多个事务并发执行时，如果没有适当的隔离控制，会出现各种数据不一致的问题。这些问题统称为并发问题，
        理解这些问题对于正确设计事务处理策略至关重要。
      </Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
          <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">💩</span>
            <span>脏读 (Dirty Read)</span>
          </h4>
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
            事务A读取了事务B未提交的数据，如果事务B回滚，事务A读取的就是无效数据。
          </p>
          <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded text-xs mb-3">
            <strong>时间序列：</strong>
            <div className="mt-1 space-y-1">
              <div>T1: 事务A读取 x=100</div>
              <div>T2: 事务B将 x 更新为 200</div>
              <div>T3: 事务A再次读取 x=200 (脏数据)</div>
              <div>T4: 事务B回滚，x恢复为100</div>
              <div>T5: 事务A基于脏数据200进行计算</div>
            </div>
          </div>
          <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded text-xs">
            <strong>业务场景：</strong>用户看到账户余额增加，但实际转账失败了
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <span>不可重复读</span>
          </h4>
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
            事务A在同一事务中两次读取同一数据，但得到不同结果，因为事务B在两次读取之间修改了数据。
          </p>
          <div className="bg-orange-100 dark:bg-orange-800/30 p-3 rounded text-xs mb-3">
            <strong>时间序列：</strong>
            <div className="mt-1 space-y-1">
              <div>T1: 事务A读取 x=100</div>
              <div>T2: 事务B提交 x=200</div>
              <div>T3: 事务A再次读取 x=200</div>
              <div>T4: 事务A基于前后不一致的数据做决策</div>
            </div>
          </div>
          <div className="bg-orange-100 dark:bg-orange-800/30 p-3 rounded text-xs">
            <strong>业务场景：</strong>统计报表在生成过程中数据发生变化
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">👻</span>
            <span>幻读 (Phantom Read)</span>
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
            事务A查询某个范围的数据，事务B在该范围内插入新数据，导致事务A再次查询时看到"幻影"记录。
          </p>
          <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded text-xs mb-3">
            <strong>时间序列：</strong>
            <div className="mt-1 space-y-1">
              <div>T1: 事务A查询"年龄&gt;30"的记录，得到3条</div>
              <div>T2: 事务B插入一条年龄=35的记录</div>
              <div>T3: 事务A再次查询，得到4条记录（幻读）</div>
            </div>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded text-xs">
            <strong>业务场景：</strong>分页查询时总记录数发生变化
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并发问题的根本原因</h3>

      <div className="bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-4">🔍 并发问题的产生机制</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">事务执行的交错</h5>
            <p className="text-sm text-amber-600 dark:text-amber-500">
              多个事务的操作在时间线上交替执行，导致读取到中间状态的数据。
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">缺乏同步机制</h5>
            <p className="text-sm text-amber-600 dark:text-amber-500">
              没有适当的锁机制或版本控制，导致事务间的操作相互干扰。
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">并发控制技术</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>基于锁的并发控制</span>
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            通过锁机制阻止并发事务同时访问同一数据，保证事务的串行化执行。
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• 共享锁 (Shared Lock)：允许多个读操作</li>
            <li>• 排他锁 (Exclusive Lock)：只允许一个写操作</li>
            <li>• 锁升级：从细粒度锁升级到粗粒度锁</li>
            <li>• 死锁检测和预防</li>
          </ul>
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>多版本并发控制 (MVCC)</span>
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            为每个数据项维护多个版本，避免读操作阻塞写操作，提高并发性能。
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• 版本链：维护数据的多个历史版本</li>
            <li>• 快照隔离：事务看到数据的一致快照</li>
            <li>• 无锁读取：读操作不阻塞写操作</li>
            <li>• 垃圾回收：清理过期的版本数据</li>
          </ul>
        </div>
      </div>

      <InfoBox type="fastai" title="理解并发问题的关键" {...noteProps('key-insights')}>
        <div className="space-y-3">
          <p>
            <strong>并发问题不是 bug，而是并发访问的必然结果。</strong>理解这些问题有助于：
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>正确评估应用的数据一致性需求</li>
            <li>选择合适的隔离级别和并发控制策略</li>
            <li>设计合理的应用层并发处理逻辑</li>
            <li>避免过度依赖数据库的隔离机制</li>
          </ul>
          <p>
            有时候，通过应用层的设计可以避免使用过高的数据库隔离级别，从而获得更好的性能。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 5. 保存点与嵌套事务
// ============================================

export function SavepointsNestedSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">保存点与嵌套事务</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"实现更细粒度的错误恢复和事务控制"</p>

      <Paragraph {...noteProps('intro')}>
        保存点（Savepoint）允许在事务执行过程中设置中间检查点，实现部分回滚功能。
        这为复杂的事务处理提供了更灵活的错误恢复机制，避免了全事务回滚带来的性能损失。
      </Paragraph>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">保存点的基本用法</h3>

      <CodeBlock
        title="保存点的基础使用"
        code={`-- 开始事务
BEGIN TRANSACTION;

-- 执行第一阶段操作
INSERT INTO orders (customer_id, total) VALUES (1, 100);
SAVEPOINT order_created;

-- 执行第二阶段操作
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;
SAVEPOINT inventory_updated;

-- 执行第三阶段操作（可能失败）
UPDATE payments SET status = 'completed' WHERE order_id = 1;

-- 检查支付结果
IF payment_failed THEN
    -- 只回滚支付相关操作，保留订单和库存更新
    ROLLBACK TO SAVEPOINT inventory_updated;

    -- 更新订单状态为等待支付
    UPDATE orders SET status = 'payment_pending' WHERE id = 1;
ELSE
    -- 支付成功，提交整个事务
    COMMIT;
END IF;`}
        {...noteProps('basic-savepoints')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">保存点的特性</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>保存点的优势</span>
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
            <li><strong>细粒度控制：</strong>可以部分回滚，而不是全部回滚</li>
            <li><strong>性能优化：</strong>避免重新执行已成功的操作</li>
            <li><strong>错误恢复：</strong>提供更灵活的异常处理机制</li>
            <li><strong>业务连续性：</strong>最大化已完成工作的保留</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <span>使用注意事项</span>
          </h4>
          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-2">
            <li><strong>命名唯一性：</strong>同一事务中的保存点名称必须唯一</li>
            <li><strong>作用域限制：</strong>保存点只在当前事务内有效</li>
            <li><strong>资源开销：</strong>过多保存点会增加内存使用</li>
            <li><strong>调试复杂性：</strong>增加了事务逻辑的复杂度</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">嵌套事务的概念</h3>

      <Paragraph {...noteProps('nested-intro')}>
        虽然 SQL 标准定义了嵌套事务的概念，但大多数数据库（包括 DuckDB）并不真正支持嵌套事务。
        所谓的"嵌套事务"实际上是通过保存点来模拟的外部行为。
      </Paragraph>

      <CodeBlock
        title="使用保存点模拟嵌套事务"
        code={`-- 主事务开始
BEGIN TRANSACTION;

-- 子事务1：订单处理
SAVEPOINT sub_transaction_1;
BEGIN
    INSERT INTO orders (customer_id, total) VALUES (1, 100);
    UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;

    -- 子事务1 成功
    RELEASE SAVEPOINT sub_transaction_1;
END;

-- 子事务2：支付处理
SAVEPOINT sub_transaction_2;
BEGIN
    UPDATE payments SET status = 'processing' WHERE order_id = 1;

    -- 模拟支付失败
    IF random() < 0.1 THEN  -- 10% 失败率
        ROLLBACK TO SAVEPOINT sub_transaction_2;
        UPDATE orders SET status = 'payment_failed' WHERE id = 1;
    ELSE
        UPDATE payments SET status = 'completed' WHERE order_id = 1;
        RELEASE SAVEPOINT sub_transaction_2;
    END IF;
END;

-- 主事务提交
COMMIT;`}
        {...noteProps('nested-simulation')}
      />

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">实际应用场景</h3>

      <div className="space-y-4 my-6">
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">💳</span>
            复杂业务流程处理
          </h4>
          <CodeBlock
            code={`-- 多步骤业务处理
BEGIN TRANSACTION;

-- 步骤1：预订资源
SAVEPOINT booking_start;
UPDATE rooms SET status = 'reserved' WHERE room_id = ?;
INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?);

-- 步骤2：处理支付
SAVEPOINT payment_start;
INSERT INTO payments (booking_id, amount, method) VALUES (?, ?, ?);
UPDATE user_accounts SET balance = balance - ? WHERE user_id = ?;

-- 步骤3：发送确认邮件
SAVEPOINT notification_start;
INSERT INTO notifications (user_id, type, message) VALUES (?, 'booking_confirmed', ?);

-- 如果任何步骤失败，可以选择性回滚
IF payment_failed THEN
    ROLLBACK TO SAVEPOINT payment_start;
    UPDATE rooms SET status = 'available' WHERE room_id = ?;
ELSE
    COMMIT;
END IF;`}
            {...noteProps('complex-workflow')}
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            数据批量处理
          </h4>
          <CodeBlock
            code={`-- 批量数据导入
BEGIN TRANSACTION;

DECLARE batch_size INTEGER = 100;
DECLARE processed INTEGER = 0;

WHILE EXISTS (SELECT 1 FROM temp_import_data) LOOP
    SAVEPOINT batch_start;

    -- 处理一批数据
    INSERT INTO target_table
    SELECT * FROM temp_import_data
    LIMIT batch_size;

    DELETE FROM temp_import_data
    LIMIT batch_size;

    -- 验证批处理结果
    IF validation_failed THEN
        ROLLBACK TO SAVEPOINT batch_start;
        -- 记录错误并继续下一批
        INSERT INTO import_errors (batch_id, error_message)
        VALUES (processed / batch_size + 1, ?);
    ELSE
        processed = processed + batch_size;
        RELEASE SAVEPOINT batch_start;
    END IF;
END LOOP;

COMMIT;`}
            {...noteProps('batch-processing')}
          />
        </div>
      </div>

      <InfoBox type="fastai" title="保存点的设计哲学" {...noteProps('design-philosophy')}>
        <div className="space-y-3">
          <p>
            <strong>保存点体现了"渐进式提交"的设计思想。</strong>与其在事务结束时一次性决定成败，
            不如在关键节点设置检查点，实现更细粒度的控制和恢复。
          </p>
          <p>
            这种设计特别适用于：
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>复杂的工作流处理</li>
            <li>需要部分错误恢复的场景</li>
            <li>长事务的性能优化</li>
            <li>业务逻辑的分层控制</li>
          </ul>
          <p>
            合理使用保存点，可以让事务处理更加健壮和高效。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

// 其他事务章节的组件实现将在这里继续...由于篇幅限制，我先展示这几个核心章节

export function TransactionPatternsSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">事务设计模式</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"常见的事务处理模式和最佳实践"</p>

      <Paragraph {...noteProps('intro')}>
        在实际应用开发中，事务处理往往遵循一些成熟的设计模式。这些模式不仅提高了代码的可维护性，
        也确保了数据操作的可靠性和一致性。本章节介绍几种常见且实用的设计模式。
      </Paragraph>

      {/* Unit of Work 模式 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🔄 Unit of Work 模式</h3>

      <Paragraph {...noteProps('uow-intro')}>
        Unit of Work（工作单元）模式将所有相关的数据库操作组合成一个原子单元，确保要么全部成功，要么全部失败。
        这种模式特别适用于复杂的业务逻辑处理。
      </Paragraph>

      <CodeBlock
        title="工作单元模式的完整实现"
        code={`-- 工作单元：订单处理流程
CREATE OR REPLACE FUNCTION process_order(
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    coupon_code VARCHAR(50) DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    available_stock INTEGER;
    unit_price DECIMAL(10,2);
    order_total DECIMAL(10,2);
    discount_amount DECIMAL(10,2) := 0;
    final_total DECIMAL(10,2);
    order_id INTEGER;
    result JSON;
BEGIN
    -- 工作单元开始：验证和准备阶段
    -- 1. 检查商品是否存在且有库存
    SELECT stock_quantity, price INTO available_stock, unit_price
    FROM products WHERE id = product_id;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', '商品不存在');
    END IF;

    IF available_stock < quantity THEN
        RETURN json_build_object('success', false, 'message', '库存不足');
    END IF;

    -- 2. 计算订单金额
    order_total := unit_price * quantity;

    -- 3. 检查并应用优惠券
    IF coupon_code IS NOT NULL THEN
        SELECT discount_amount INTO discount_amount
        FROM coupons
        WHERE code = coupon_code
          AND is_active = true
          AND valid_until > NOW()
          AND usage_limit > usage_count;

        IF NOT FOUND THEN
            discount_amount := 0;
        END IF;
    END IF;

    final_total := order_total - discount_amount;

    -- 工作单元核心：原子操作阶段
    -- 4. 创建订单记录
    INSERT INTO orders (customer_id, total_amount, discount_amount, final_amount, status)
    VALUES (customer_id, order_total, discount_amount, final_total, 'processing')
    RETURNING id INTO order_id;

    -- 5. 扣减库存
    UPDATE products
    SET stock_quantity = stock_quantity - quantity,
        updated_at = NOW()
    WHERE id = product_id;

    -- 6. 创建订单明细
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (order_id, product_id, quantity, unit_price, order_total);

    -- 7. 更新优惠券使用情况
    IF coupon_code IS NOT NULL AND discount_amount > 0 THEN
        UPDATE coupons
        SET usage_count = usage_count + 1,
            updated_at = NOW()
        WHERE code = coupon_code;
    END IF;

    -- 8. 创建订单日志
    INSERT INTO order_logs (order_id, action, details, created_at)
    VALUES (order_id, 'order_created', json_build_object(
        'customer_id', customer_id,
        'product_id', product_id,
        'quantity', quantity,
        'total', final_total
    ), NOW());

    -- 工作单元成功完成
    UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE id = order_id;

    result := json_build_object(
        'success', true,
        'message', '订单处理成功',
        'order_id', order_id,
        'total_amount', final_total
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- 工作单元失败：记录错误并返回失败信息
        INSERT INTO error_logs (error_type, error_message, details, created_at)
        VALUES ('order_processing_error', SQLERRM, json_build_object(
            'customer_id', customer_id,
            'product_id', product_id,
            'quantity', quantity
        ), NOW());

        RETURN json_build_object('success', false, 'message', '订单处理失败: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('unit-of-work')}
      />

      {/* Saga 模式 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🎭 Saga 模式</h3>

      <Paragraph {...noteProps('saga-intro')}>
        Saga 模式适用于需要协调多个服务或长时间运行的复杂事务。它通过一系列本地事务和补偿操作来实现分布式事务。
      </Paragraph>

      <CodeBlock
        title="Saga 模式在订单处理中的应用"
        code={`-- Saga 事务表结构
CREATE TABLE sagas (
    saga_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saga_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'running',
    steps JSONB NOT NULL,
    current_step INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saga_compensations (
    compensation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saga_id UUID REFERENCES sagas(saga_id),
    step_name VARCHAR(100) NOT NULL,
    compensation_data JSONB,
    executed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- 创建订单处理 Saga
CREATE OR REPLACE FUNCTION create_order_saga(
    customer_id INTEGER,
    items JSONB
) RETURNS UUID AS $$
DECLARE
    saga_id UUID;
    steps_data JSONB;
BEGIN
    -- 定义 Saga 步骤
    steps_data := jsonb_build_array(
        jsonb_build_object(
            'name', 'reserve_inventory',
            'action', 'reserve_inventory',
            'compensation', 'release_inventory'
        ),
        jsonb_build_object(
            'name', 'process_payment',
            'action', 'process_payment',
            'compensation', 'refund_payment'
        ),
        jsonb_build_object(
            'name', 'create_shipment',
            'action', 'create_shipment',
            'compensation', 'cancel_shipment'
        ),
        jsonb_build_object(
            'name', 'send_notification',
            'action', 'send_notification',
            'compensation', 'send_failure_notification'
        )
    );

    -- 创建 Saga 记录
    INSERT INTO sagas (saga_type, steps)
    VALUES ('order_processing', steps_data)
    RETURNING saga_id INTO saga_id;

    -- 启动第一个步骤
    PERFORM execute_saga_step(saga_id, 0, items);

    RETURN saga_id;
END;
$$ LANGUAGE plpgsql;

-- 执行 Saga 步骤
CREATE OR REPLACE FUNCTION execute_saga_step(
    saga_id UUID,
    step_index INTEGER,
    context_data JSONB
) RETURNS VOID AS $$
DECLARE
    step_data JSONB;
    action_result JSONB;
BEGIN
    -- 获取步骤信息
    SELECT steps->step_index INTO step_data
    FROM sagas WHERE id = saga_id;

    IF step_data IS NULL THEN
        -- Saga 完成
        UPDATE sagas SET status = 'completed', updated_at = NOW()
        WHERE id = saga_id;
        RETURN;
    END IF;

    -- 执行步骤动作
    EXECUTE format('SELECT %I($1)', step_data->>'action')
    INTO action_result
    USING context_data;

    IF action_result->>'success' = 'true' THEN
        -- 步骤成功，执行下一步
        UPDATE sagas SET current_step = step_index + 1, updated_at = NOW()
        WHERE id = saga_id;

        PERFORM execute_saga_step(saga_id, step_index + 1, context_data);
    ELSE
        -- 步骤失败，开始补偿
        PERFORM compensate_saga(saga_id, step_index);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Saga 补偿机制
CREATE OR REPLACE FUNCTION compensate_saga(
    saga_id UUID,
    failed_step INTEGER
) RETURNS VOID AS $$
DECLARE
    step_index INTEGER := failed_step;
    step_data JSONB;
BEGIN
    UPDATE sagas SET status = 'compensating', updated_at = NOW()
    WHERE id = saga_id;

    -- 从失败步骤开始逆序执行补偿
    WHILE step_index >= 0 LOOP
        SELECT steps->step_index INTO step_data
        FROM sagas WHERE id = saga_id;

        -- 记录补偿操作
        INSERT INTO saga_compensations (saga_id, step_name, compensation_data)
        VALUES (saga_id, step_data->>'name', step_data);

        -- 执行补偿动作
        EXECUTE format('SELECT %I($1)', step_data->>'compensation')
        USING step_data;

        step_index := step_index - 1;
    END LOOP;

    -- 标记 Saga 为失败
    UPDATE sagas SET status = 'failed', updated_at = NOW()
    WHERE id = saga_id;
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('saga-pattern')}
      />

      {/* 两阶段提交模式 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🔐 两阶段提交 (2PC)</h3>

      <Paragraph {...noteProps('2pc-intro')}>
        两阶段提交是一种分布式事务协议，确保跨多个数据库或服务的事务要么全部提交，要么全部回滚。
        虽然 DuckDB 主要用于单机场景，但理解 2PC 有助于理解分布式系统的设计。
      </Paragraph>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4">📋 两阶段提交协议流程</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <h5 className="font-semibold text-blue-700 dark:text-blue-400">准备阶段 (Prepare Phase)</h5>
                <ul className="text-sm text-blue-600 dark:text-blue-500 mt-1 space-y-1">
                  <li>• 协调者询问所有参与者是否准备好提交</li>
                  <li>• 参与者执行事务但不提交</li>
                  <li>• 参与者返回"准备就绪"或"失败"</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <h5 className="font-semibold text-green-700 dark:text-green-400">提交阶段 (Commit Phase)</h5>
                <ul className="text-sm text-green-600 dark:text-green-500 mt-1 space-y-1">
                  <li>• 如果所有参与者都准备就绪，协调者发送提交命令</li>
                  <li>• 如果任何参与者失败，协调者发送回滚命令</li>
                  <li>• 参与者执行最终的提交或回滚操作</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h6 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚡ 优点</h6>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• 保证分布式事务的一致性</li>
                <li>• 协议简单，易于实现</li>
                <li>• 适用于大多数分布式场景</li>
              </ul>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
              <h6 className="font-semibold text-red-800 dark:text-red-300 mb-2">⚠️ 缺点</h6>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• 协调者单点故障风险</li>
                <li>• 阻塞协议，性能较差</li>
                <li>• 可能出现不确定状态</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 最佳实践模式 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">✨ 事务处理最佳实践模式</h3>

      <div className="space-y-6 my-6">
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            防御性编程模式
          </h4>
          <CodeBlock
            code={`-- 防御性事务处理模式
CREATE OR REPLACE FUNCTION safe_transaction_example(
    param1 INTEGER,
    param2 TEXT
) RETURNS JSON AS $$
DECLARE
    result JSON;
    start_time TIMESTAMP;
BEGIN
    -- 记录开始时间用于监控
    start_time := clock_timestamp();

    -- 1. 参数验证
    IF param1 IS NULL OR param1 <= 0 THEN
        RETURN json_build_object('success', false, 'error', '无效的参数1');
    END IF;

    IF param2 IS NULL OR length(trim(param2)) = 0 THEN
        RETURN json_build_object('success', false, 'error', '参数2不能为空');
    END IF;

    -- 2. 业务逻辑验证
    IF NOT EXISTS (SELECT 1 FROM related_table WHERE id = param1) THEN
        RETURN json_build_object('success', false, 'error', '相关记录不存在');
    END IF;

    -- 3. 原子操作
    BEGIN
        -- 主要业务逻辑
        INSERT INTO target_table (field1, field2, created_at)
        VALUES (param1, param2, NOW());

        UPDATE related_table
        SET status = 'processed', updated_at = NOW()
        WHERE id = param1;

        -- 记录操作日志
        INSERT INTO operation_logs (operation, details, duration_ms, created_at)
        VALUES ('safe_transaction', json_build_object('param1', param1, 'param2', param2),
                EXTRACT(epoch FROM (clock_timestamp() - start_time)) * 1000, NOW());

        result := json_build_object('success', true, 'message', '操作成功');

    EXCEPTION
        WHEN unique_violation THEN
            result := json_build_object('success', false, 'error', '数据已存在');
        WHEN foreign_key_violation THEN
            result := json_build_object('success', false, 'error', '关联数据不存在');
        WHEN check_violation THEN
            result := json_build_object('success', false, 'error', '数据验证失败');
        WHEN OTHERS THEN
            -- 记录详细错误信息
            INSERT INTO error_logs (error_type, error_message, context, created_at)
            VALUES ('transaction_error', SQLERRM, json_build_object(
                'param1', param1, 'param2', param2, 'state', SQLSTATE
            ), NOW());

            result := json_build_object('success', false, 'error', '系统错误，请稍后重试');
    END;

    RETURN result;
END;
$$ LANGUAGE plpgsql;`}
            {...noteProps('defensive-pattern')}
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            重试模式
          </h4>
          <CodeBlock
            code={`-- 事务重试模式（处理临时性失败）
CREATE OR REPLACE FUNCTION retryable_transaction(
    max_attempts INTEGER DEFAULT 3,
    base_delay INTERVAL DEFAULT '100ms'
) RETURNS JSON AS $$
DECLARE
    attempt INTEGER := 1;
    current_delay INTERVAL := base_delay;
    result JSON;
BEGIN
    LOOP
        BEGIN
            -- 主要事务逻辑
            -- ... 执行可能失败的操作 ...

            result := json_build_object('success', true, 'attempts', attempt);
            RETURN result;

        EXCEPTION
            WHEN serialization_failure OR deadlock_detected THEN
                -- 临时性并发错误，可以重试
                IF attempt < max_attempts THEN
                    attempt := attempt + 1;

                    -- 记录重试信息
                    INSERT INTO retry_logs (operation, attempt, error, delay, created_at)
                    VALUES ('retryable_transaction', attempt, SQLERRM, current_delay, NOW());

                    -- 指数退避延迟
                    PERFORM pg_sleep(EXTRACT(epoch FROM current_delay));
                    current_delay := current_delay * 2;

                    CONTINUE;
                ELSE
                    -- 重试次数用尽
                    RETURN json_build_object('success', false, 'error', '重试失败', 'attempts', attempt);
                END IF;

            WHEN OTHERS THEN
                -- 不可重试的错误
                RETURN json_build_object('success', false, 'error', SQLERRM, 'attempts', attempt);
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;`}
            {...noteProps('retry-pattern')}
          />
        </div>
      </div>

      <InfoBox type="fastai" title="事务设计模式的核心价值" {...noteProps('patterns-value')}>
        <div className="space-y-3">
          <p>
            <strong>事务设计模式是将复杂性转化为可管理性的关键。</strong>通过标准化的模式，我们可以：
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>提高代码的可维护性和可读性</li>
            <li>减少重复代码和错误</li>
            <li>确保业务逻辑的一致性</li>
            <li>简化错误处理和恢复</li>
            <li>提升系统的可靠性和稳定性</li>
          </ul>
          <p>
            选择合适的模式比完美实现更重要。理解每种模式的适用场景和权衡点，才能做出最佳的设计决策。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

// ============================================
// 7. 实际应用案例
// ============================================

export function RealWorldExamplesSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">实际应用案例</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"事务在真实业务场景中的深度应用"</p>

      <Paragraph {...noteProps('intro')}>
        事务处理不仅仅是数据库技术，更是业务逻辑的核心。通过实际案例，我们可以看到事务如何确保业务操作的可靠性和一致性。
        以下案例展示了不同行业中事务处理的具体应用。
      </Paragraph>

      {/* 电商订单系统 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🛒 电商订单处理系统</h3>

      <Paragraph {...noteProps('ecommerce-intro')}>
        电商系统的订单处理是事务应用最经典的场景之一。订单创建涉及库存扣减、支付处理、物流安排等多个步骤，
        任何一个环节失败都可能导致严重的业务问题。
      </Paragraph>

      <CodeBlock
        title="完整的电商订单事务处理"
        code={`-- 电商订单处理事务
CREATE OR REPLACE FUNCTION create_order_transaction(
    customer_id INTEGER,
    items JSONB,  -- 购物车商品列表
    payment_method VARCHAR(50),
    shipping_address JSONB
) RETURNS JSON AS $$
DECLARE
    order_id INTEGER;
    total_amount DECIMAL(10,2) := 0;
    available_stock INTEGER;
    payment_result JSONB;
    result JSON;
BEGIN
    -- 事务开始：订单创建和库存预扣
    -- 1. 创建订单主记录（预订单状态）
    INSERT INTO orders (
        customer_id,
        order_date,
        status,
        shipping_address,
        payment_method
    ) VALUES (
        customer_id,
        NOW(),
        'pending',
        shipping_address,
        payment_method
    ) RETURNING id INTO order_id;

    -- 2. 处理每个商品项
    FOR item IN SELECT * FROM jsonb_array_elements(items) LOOP
        DECLARE
            product_id INTEGER := (item->>'product_id')::INTEGER;
            quantity INTEGER := (item->>'quantity')::INTEGER;
            unit_price DECIMAL(10,2);
            item_total DECIMAL(10,2);
        BEGIN
            -- 检查商品和库存
            SELECT stock_quantity, price INTO available_stock, unit_price
            FROM products WHERE id = product_id;

            IF available_stock < quantity THEN
                RAISE EXCEPTION '商品 % 库存不足，当前库存：%，需求数量：%',
                    product_id, available_stock, quantity;
            END IF;

            -- 计算商品总价
            item_total := unit_price * quantity;
            total_amount := total_amount + item_total;

            -- 预扣库存（软扣减）
            UPDATE products
            SET reserved_stock = reserved_stock + quantity,
                updated_at = NOW()
            WHERE id = product_id;

            -- 创建订单明细
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                unit_price,
                total_price
            ) VALUES (
                order_id,
                product_id,
                quantity,
                unit_price,
                item_total
            );
        END;
    END LOOP;

    -- 3. 更新订单总金额
    UPDATE orders SET total_amount = total_amount WHERE id = order_id;

    -- 4. 处理支付（假设有支付服务接口）
    SELECT process_payment(order_id, total_amount, payment_method) INTO payment_result;

    IF payment_result->>'success' != 'true' THEN
        RAISE EXCEPTION '支付失败：%', payment_result->>'message';
    END IF;

    -- 5. 确认订单并实际扣减库存
    UPDATE orders SET
        status = 'confirmed',
        payment_id = (payment_result->>'payment_id')::INTEGER,
        confirmed_at = NOW()
    WHERE id = order_id;

    -- 实际扣减库存
    UPDATE products
    SET stock_quantity = stock_quantity - order_items.quantity,
        reserved_stock = reserved_stock - order_items.quantity
    FROM order_items
    WHERE products.id = order_items.product_id
      AND order_items.order_id = create_order_transaction.order_id;

    -- 6. 创建物流单（异步处理）
    INSERT INTO shipping_orders (
        order_id,
        status,
        created_at
    ) VALUES (
        order_id,
        'pending',
        NOW()
    );

    -- 7. 发送订单确认邮件（异步处理）
    INSERT INTO email_queue (
        recipient,
        template,
        data,
        priority
    ) SELECT
        customers.email,
        'order_confirmation',
        json_build_object('order_id', order_id, 'total', total_amount),
        'high'
    FROM customers WHERE id = customer_id;

    -- 事务成功完成
    result := json_build_object(
        'success', true,
        'order_id', order_id,
        'total_amount', total_amount,
        'message', '订单创建成功'
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- 事务失败：记录错误并清理预扣库存
        INSERT INTO order_errors (
            order_id,
            error_type,
            error_message,
            context
        ) VALUES (
            COALESCE(order_id, -1),
            'order_creation_failed',
            SQLERRM,
            json_build_object(
                'customer_id', customer_id,
                'items_count', jsonb_array_length(items),
                'payment_method', payment_method
            )
        );

        -- 清理预扣库存（如果订单已创建）
        IF order_id IS NOT NULL THEN
            UPDATE products
            SET reserved_stock = reserved_stock - order_items.quantity
            FROM order_items
            WHERE products.id = order_items.product_id
              AND order_items.order_id = order_id;
        END IF;

        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', '订单创建失败，请稍后重试'
        );
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('ecommerce-order')}
      />

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-green-800 dark:text-green-300 mb-4">🛒 电商事务的关键设计点</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">库存管理策略</h5>
            <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
              <li>• 预扣库存：先锁定库存，再确认支付</li>
              <li>• 软删除：保留历史订单数据</li>
              <li>• 库存预警：低库存时触发补货流程</li>
              <li>• 并发控制：防止超卖现象</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">失败处理机制</h5>
            <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
              <li>• 支付失败：释放预扣库存</li>
              <li>• 系统异常：记录错误日志</li>
              <li>• 超时处理：自动取消未支付订单</li>
              <li>• 补偿机制：失败时的数据清理</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 银行转账系统 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🏦 银行转账系统</h3>

      <Paragraph {...noteProps('banking-intro')}>
        银行转账是事务 ACID 属性最典型的体现。转账操作必须确保要么全部成功（转出和转入同时完成），
        要么全部失败，绝对不能出现钱从一个账户消失而没有到达另一个账户的情况。
      </Paragraph>

      <CodeBlock
        title="银行转账事务实现"
        code={`-- 银行账户表结构
CREATE TABLE accounts (
    account_id VARCHAR(20) PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    balance DECIMAL(15,2) NOT NULL CHECK (balance >= 0),
    account_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 转账记录表
CREATE TABLE transfers (
    transfer_id SERIAL PRIMARY KEY,
    from_account VARCHAR(20) NOT NULL REFERENCES accounts(account_id),
    to_account VARCHAR(20) NOT NULL REFERENCES accounts(account_id),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    transfer_type VARCHAR(20) DEFAULT 'internal',
    status VARCHAR(20) DEFAULT 'pending',
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    transaction_fee DECIMAL(8,2) DEFAULT 0,
    description TEXT
);

-- 银行转账事务函数
CREATE OR REPLACE FUNCTION bank_transfer(
    from_account_id VARCHAR(20),
    to_account_id VARCHAR(20),
    transfer_amount DECIMAL(15,2),
    description TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    from_balance DECIMAL(15,2);
    to_balance DECIMAL(15,2);
    transfer_id INTEGER;
    fee_amount DECIMAL(8,2) := 0;
    result JSON;
BEGIN
    -- 输入验证
    IF from_account_id = to_account_id THEN
        RETURN json_build_object('success', false, 'error', '不能向自己转账');
    END IF;

    IF transfer_amount <= 0 THEN
        RETURN json_build_object('success', false, 'error', '转账金额必须大于0');
    END IF;

    -- 检查账户状态和余额
    SELECT balance INTO from_balance
    FROM accounts
    WHERE account_id = from_account_id AND status = 'active';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', '转出账户不存在或已冻结');
    END IF;

    SELECT balance INTO to_balance
    FROM accounts
    WHERE account_id = to_account_id AND status = 'active';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', '转入账户不存在或已冻结');
    END IF;

    -- 计算手续费（示例：每笔转账1元）
    fee_amount := 1.00;

    -- 检查余额是否足够（包括手续费）
    IF from_balance < (transfer_amount + fee_amount) THEN
        RETURN json_build_object('success', false, 'error', '账户余额不足');
    END IF;

    -- 创建转账记录
    INSERT INTO transfers (
        from_account,
        to_account,
        amount,
        transaction_fee,
        description
    ) VALUES (
        from_account_id,
        to_account_id,
        transfer_amount,
        fee_amount,
        description
    ) RETURNING transfer_id INTO transfer_id;

    -- 执行转账操作（原子性保证）
    -- 1. 扣除转出账户金额
    UPDATE accounts
    SET balance = balance - transfer_amount - fee_amount,
        updated_at = NOW()
    WHERE account_id = from_account_id;

    -- 2. 增加转入账户金额
    UPDATE accounts
    SET balance = balance + transfer_amount,
        updated_at = NOW()
    WHERE account_id = to_account_id;

    -- 3. 更新转账状态为成功
    UPDATE transfers
    SET status = 'completed',
        completed_at = NOW()
    WHERE transfer_id = transfer_id;

    -- 4. 记录交易日志（审计要求）
    INSERT INTO transaction_logs (
        account_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        reference_id,
        description
    ) VALUES
    (
        from_account_id,
        'debit',
        transfer_amount + fee_amount,
        from_balance,
        from_balance - transfer_amount - fee_amount,
        transfer_id,
        '转出: ' || description
    ),
    (
        to_account_id,
        'credit',
        transfer_amount,
        to_balance,
        to_balance + transfer_amount,
        transfer_id,
        '转入: ' || description
    );

    -- 返回成功结果
    result := json_build_object(
        'success', true,
        'transfer_id', transfer_id,
        'amount', transfer_amount,
        'fee', fee_amount,
        'message', '转账成功'
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- 转账失败：记录失败状态
        IF transfer_id IS NOT NULL THEN
            UPDATE transfers
            SET status = 'failed',
                completed_at = NOW()
            WHERE transfer_id = transfer_id;
        END IF;

        -- 记录错误日志
        INSERT INTO transfer_errors (
            from_account,
            to_account,
            amount,
            error_message,
            error_details
        ) VALUES (
            from_account_id,
            to_account_id,
            transfer_amount,
            SQLERRM,
            json_build_object('sqlstate', SQLSTATE, 'transfer_id', transfer_id)
        );

        RETURN json_build_object(
            'success', false,
            'error', '转账失败：' || SQLERRM,
            'message', '转账处理失败，请稍后重试或联系客服'
        );
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('bank-transfer')}
      />

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4">🏦 银行转账的关键安全特性</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="font-semibold text-blue-700 dark:text-blue-400">原子性保证</div>
            <div className="text-sm text-blue-600 dark:text-blue-500">要么全部成功，要么全部失败</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-blue-700 dark:text-blue-400">一致性维护</div>
            <div className="text-sm text-blue-600 dark:text-blue-500">账户余额总和保持不变</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-semibold text-blue-700 dark:text-blue-400">审计追踪</div>
            <div className="text-sm text-blue-600 dark:text-blue-500">完整的交易记录和日志</div>
          </div>
        </div>
      </div>

      {/* 库存管理系统 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">📦 库存管理系统</h3>

      <Paragraph {...noteProps('inventory-intro')}>
        库存管理系统需要处理复杂的并发场景，包括多用户同时下单、补货操作、库存盘点等。
        事务处理确保库存数据的准确性和一致性，防止超卖或库存不符的问题。
      </Paragraph>

      <CodeBlock
        title="库存事务处理系统"
        code={`-- 库存事务处理函数
CREATE OR REPLACE FUNCTION process_inventory_transaction(
    operation_type VARCHAR(20),  -- 'sale', 'restock', 'adjustment', 'transfer'
    product_id INTEGER,
    quantity INTEGER,
    warehouse_id INTEGER DEFAULT NULL,
    reference_id INTEGER DEFAULT NULL,
    operator_id INTEGER DEFAULT NULL,
    notes TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    current_stock INTEGER;
    new_stock INTEGER;
    transaction_id INTEGER;
    result JSON;
BEGIN
    -- 输入验证
    IF quantity <= 0 THEN
        RETURN json_build_object('success', false, 'error', '数量必须大于0');
    END IF;

    -- 检查商品是否存在
    SELECT COALESCE(SUM(quantity), 0) INTO current_stock
    FROM inventory
    WHERE product_id = process_inventory_transaction.product_id
      AND warehouse_id = COALESCE(process_inventory_transaction.warehouse_id, warehouse_id);

    IF operation_type NOT IN ('sale', 'restock', 'adjustment', 'transfer') THEN
        RETURN json_build_object('success', false, 'error', '无效的操作类型');
    END IF;

    -- 计算新的库存数量
    CASE operation_type
        WHEN 'sale' THEN
            new_stock := current_stock - quantity;
            IF new_stock < 0 THEN
                RETURN json_build_object('success', false, 'error', '库存不足，无法销售');
            END IF;
        WHEN 'restock' THEN
            new_stock := current_stock + quantity;
        WHEN 'adjustment' THEN
            new_stock := quantity;  -- 直接设置为指定数量
        WHEN 'transfer' THEN
            -- 转仓操作需要同时更新两个仓库
            -- 这里简化处理，实际需要更复杂的逻辑
            new_stock := current_stock - quantity;
    END CASE;

    -- 记录库存事务
    INSERT INTO inventory_transactions (
        product_id,
        warehouse_id,
        operation_type,
        quantity_before,
        quantity_change,
        quantity_after,
        reference_id,
        operator_id,
        notes,
        transaction_date
    ) VALUES (
        product_id,
        warehouse_id,
        operation_type,
        current_stock,
        CASE operation_type
            WHEN 'sale' THEN -quantity
            WHEN 'restock' THEN quantity
            WHEN 'adjustment' THEN quantity - current_stock
            WHEN 'transfer' THEN -quantity
        END,
        new_stock,
        reference_id,
        operator_id,
        notes,
        NOW()
    ) RETURNING transaction_id INTO transaction_id;

    -- 更新库存
    IF operation_type = 'adjustment' THEN
        -- 调整操作：直接设置库存数量
        INSERT INTO inventory (product_id, warehouse_id, quantity, last_updated)
        VALUES (product_id, warehouse_id, new_stock, NOW())
        ON CONFLICT (product_id, warehouse_id)
        DO UPDATE SET
            quantity = EXCLUDED.quantity,
            last_updated = EXCLUDED.last_updated;
    ELSE
        -- 其他操作：增加或减少库存
        UPDATE inventory
        SET quantity = new_stock,
            last_updated = NOW()
        WHERE product_id = process_inventory_transaction.product_id
          AND warehouse_id = COALESCE(process_inventory_transaction.warehouse_id, warehouse_id);
    END IF;

    -- 检查库存预警
    IF new_stock <= (SELECT COALESCE(low_stock_threshold, 10) FROM products WHERE id = product_id) THEN
        INSERT INTO inventory_alerts (
            product_id,
            warehouse_id,
            alert_type,
            current_stock,
            threshold,
            created_at
        ) VALUES (
            product_id,
            warehouse_id,
            'low_stock',
            new_stock,
            (SELECT COALESCE(low_stock_threshold, 10) FROM products WHERE id = product_id),
            NOW()
        );
    END IF;

    -- 返回成功结果
    result := json_build_object(
        'success', true,
        'transaction_id', transaction_id,
        'operation', operation_type,
        'product_id', product_id,
        'quantity_change', quantity,
        'new_stock', new_stock,
        'message', operation_type || ' 操作成功'
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- 记录错误
        INSERT INTO inventory_errors (
            product_id,
            warehouse_id,
            operation_type,
            quantity,
            error_message,
            error_details,
            occurred_at
        ) VALUES (
            product_id,
            warehouse_id,
            operation_type,
            quantity,
            SQLERRM,
            json_build_object('sqlstate', SQLSTATE),
            NOW()
        );

        RETURN json_build_object(
            'success', false,
            'error', '库存操作失败：' || SQLERRM,
            'message', '操作已回滚，请检查数据后重试'
        );
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('inventory-system')}
      />

      {/* 财务记账系统 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">💰 财务记账系统</h3>

      <Paragraph {...noteProps('accounting-intro')}>
        财务记账系统要求极高的一致性和准确性。复式记账法要求每个业务事件都同时记录在借方和贷方，
        任何不平衡都可能导致财务报表错误。
      </Paragraph>

      <CodeBlock
        title="财务记账事务处理"
        code={`-- 会计分录表
CREATE TABLE journal_entries (
    entry_id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    reference_number VARCHAR(50),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'draft'
);

-- 分录明细表（借贷明细）
CREATE TABLE journal_entry_lines (
    line_id SERIAL PRIMARY KEY,
    entry_id INTEGER REFERENCES journal_entries(entry_id),
    account_id INTEGER NOT NULL,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    memo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT debit_credit_check CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- 财务记账事务函数
CREATE OR REPLACE FUNCTION create_journal_entry(
    entry_date DATE,
    description TEXT,
    reference_number VARCHAR(50),
    entry_lines JSONB,  -- 借贷明细数组
    created_by INTEGER
) RETURNS JSON AS $$
DECLARE
    entry_id INTEGER;
    total_debit DECIMAL(15,2) := 0;
    total_credit DECIMAL(15,2) := 0;
    line_data JSONB;
    result JSON;
BEGIN
    -- 验证分录明细
    IF jsonb_array_length(entry_lines) = 0 THEN
        RETURN json_build_object('success', false, 'error', '至少需要一条分录明细');
    END IF;

    -- 计算借贷合计
    FOR line_data IN SELECT * FROM jsonb_array_elements(entry_lines) LOOP
        total_debit := total_debit + COALESCE((line_data->>'debit_amount')::DECIMAL, 0);
        total_credit := total_credit + COALESCE((line_data->>'credit_amount')::DECIMAL, 0);
    END LOOP;

    -- 验证借贷平衡（复式记账基本原则）
    IF ABS(total_debit - total_credit) > 0.01 THEN
        RETURN json_build_object(
            'success', false,
            'error', '借贷不平衡',
            'debit_total', total_debit,
            'credit_total', total_credit
        );
    END IF;

    -- 创建会计分录
    INSERT INTO journal_entries (
        entry_date,
        description,
        reference_number,
        created_by
    ) VALUES (
        entry_date,
        description,
        reference_number,
        created_by
    ) RETURNING entry_id INTO entry_id;

    -- 创建分录明细
    FOR line_data IN SELECT * FROM jsonb_array_elements(entry_lines) LOOP
        INSERT INTO journal_entry_lines (
            entry_id,
            account_id,
            debit_amount,
            credit_amount,
            memo
        ) VALUES (
            entry_id,
            (line_data->>'account_id')::INTEGER,
            COALESCE((line_data->>'debit_amount')::DECIMAL, 0),
            COALESCE((line_data->>'credit_amount')::DECIMAL, 0),
            line_data->>'memo'
        );
    END LOOP;

    -- 更新账户余额
    UPDATE accounts
    SET balance = balance + (
        SELECT COALESCE(SUM(debit_amount - credit_amount), 0)
        FROM journal_entry_lines
        WHERE account_id = accounts.account_id
          AND entry_id = create_journal_entry.entry_id
    )
    WHERE account_id IN (
        SELECT DISTINCT account_id
        FROM journal_entry_lines
        WHERE entry_id = create_journal_entry.entry_id
    );

    -- 标记分录为已过账
    UPDATE journal_entries
    SET status = 'posted'
    WHERE entry_id = entry_id;

    -- 返回成功结果
    result := json_build_object(
        'success', true,
        'entry_id', entry_id,
        'debit_total', total_debit,
        'credit_total', total_credit,
        'message', '会计分录创建成功'
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- 记录错误
        INSERT INTO journal_errors (
            entry_date,
            description,
            error_message,
            entry_lines,
            created_by,
            occurred_at
        ) VALUES (
            entry_date,
            description,
            SQLERRM,
            entry_lines,
            created_by,
            NOW()
        );

        RETURN json_build_object(
            'success', false,
            'error', '会计分录创建失败：' || SQLERRM,
            'message', '分录已被撤销，请检查数据后重试'
        );
END;
$$ LANGUAGE plpgsql;`}
        {...noteProps('accounting-system')}
      />

      <InfoBox type="fastai" title="跨行业事务处理的最佳实践" {...noteProps('cross-industry-lessons')}>
        <div className="space-y-3">
          <p>
            <strong>不同行业的业务场景各异，但事务处理的核心原则是相通的：</strong>
          </p>
          <ul className="list-disc ml-4 space-y-2">
            <li>
              <strong>业务理解先行：</strong>深入理解业务规则，才能设计出正确的事务边界。
              电商的订单流程、银行的转账逻辑、财务的复式记账，都有其独特的业务约束。
            </li>
            <li>
              <strong>失败模式设计：</strong>不仅仅考虑成功路径，更要设计完善的失败处理和补偿机制。
              支付失败的库存释放、转账异常的审计记录、记账错误的冲销处理。
            </li>
            <li>
              <strong>性能与一致性的平衡：</strong>根据业务重要性选择合适的隔离级别。
              核心业务使用严格一致性，次要业务可以适当放松要求。
            </li>
            <li>
              <strong>监控和审计：</strong>完善的日志记录和监控体系是事务处理的重要保障。
              不仅帮助排查问题，还能满足合规和审计要求。
            </li>
          </ul>
          <p>
            事务处理不仅仅是技术实现，更是业务逻辑的可靠保障。通过合理设计事务边界和处理逻辑，
            我们可以构建出健壮、可靠的业务系统。
          </p>
        </div>
      </InfoBox>
    </div>
  );
}

export function PerformanceTuningSection({ sectionId, addNote, updateNote, deleteNote, getNotesForBlock }: SectionProps) {
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">性能优化与监控</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"事务性能调优和监控策略"</p>

      <Paragraph {...noteProps('intro')}>
        事务处理是数据库系统的核心功能，但不当的事务设计可能严重影响系统性能。本章节介绍事务性能优化的关键策略、
        监控方法以及常见性能问题的诊断和解决。
      </Paragraph>

      {/* 事务性能瓶颈分析 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🔍 事务性能瓶颈分析</h3>

      <Paragraph {...noteProps('bottleneck-intro')}>
        事务性能问题通常源于几个关键方面：锁竞争、I/O操作、事务大小和隔离级别设置。
        理解这些瓶颈的成因，才能制定有效的优化策略。
      </Paragraph>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-4">⚡ 常见性能瓶颈类型</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <h5 className="font-semibold text-red-700 dark:text-red-400">锁等待 (Lock Wait)</h5>
                <ul className="text-sm text-red-600 dark:text-red-500 mt-1 space-y-1">
                  <li>• 行级锁竞争</li>
                  <li>• 表级锁阻塞</li>
                  <li>• 死锁情况</li>
                  <li>• 锁升级问题</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <h5 className="font-semibold text-yellow-700 dark:text-yellow-400">I/O 密集操作</h5>
                <ul className="text-sm text-yellow-600 dark:text-yellow-500 mt-1 space-y-1">
                  <li>• 大量日志写入</li>
                  <li>• 索引更新开销</li>
                  <li>• WAL 文件同步</li>
                  <li>• 临时表空间使用</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <h5 className="font-semibold text-purple-700 dark:text-purple-400">事务设计问题</h5>
                <ul className="text-sm text-purple-600 dark:text-purple-500 mt-1 space-y-1">
                  <li>• 事务过大过长</li>
                  <li>• 不必要的隔离级别</li>
                  <li>• 频繁的提交</li>
                  <li>• 嵌套事务滥用</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <h5 className="font-semibold text-blue-700 dark:text-blue-400">资源竞争</h5>
                <ul className="text-sm text-blue-600 dark:text-blue-500 mt-1 space-y-1">
                  <li>• 连接池耗尽</li>
                  <li>• 内存压力</li>
                  <li>• CPU 竞争</li>
                  <li>• 网络延迟</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CodeBlock
        title="事务性能监控查询"
        code={`-- 活跃事务监控
SELECT
    pid,
    datname as database,
    usename as username,
    state,
    state_change,
    EXTRACT(epoch FROM (now() - state_change)) as duration_seconds,
    query
FROM pg_stat_activity
WHERE state = 'active'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY duration_seconds DESC
LIMIT 10;

-- 锁等待分析
SELECT
    blocked_locks.pid as blocked_pid,
    blocked_activity.usename as blocked_user,
    blocking_locks.pid as blocking_pid,
    blocking_activity.usename as blocking_user,
    blocked_activity.query as blocked_query,
    blocking_activity.query as blocking_query,
    blocked_locks.locktype,
    blocked_locks.mode as blocked_mode,
    blocking_locks.mode as blocking_mode
FROM pg_locks blocked_locks
JOIN pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database = blocked_locks.database
    AND blocking_locks.relation = blocked_locks.relation
    AND blocking_locks.page = blocked_locks.page
    AND blocking_locks.tuple = blocked_locks.tuple
    AND blocking_locks.virtualtransaction = blocked_locks.virtualtransaction
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- 事务统计信息
SELECT
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    ROUND(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) as dead_tuple_ratio
FROM pg_stat_user_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC
LIMIT 20;

-- 长事务检测
SELECT
    pid,
    datname,
    usename,
    xact_start,
    EXTRACT(epoch FROM (now() - xact_start)) / 60 as transaction_minutes,
    state,
    query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
  AND EXTRACT(epoch FROM (now() - xact_start)) > 300  -- 超过5分钟
ORDER BY xact_start;`}
        {...noteProps('performance-monitoring')}
      />

      {/* 事务优化策略 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">⚡ 事务优化策略</h3>

      <div className="space-y-6 my-6">
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            事务大小优化
          </h4>
          <Paragraph {...noteProps('transaction-size')}>
            大事务会持有锁更长时间，增加阻塞风险。应该将大事务拆分为多个小事务，或使用批量处理策略。
          </Paragraph>
          <CodeBlock
            code={`-- ❌ 反例：大事务处理大量数据
BEGIN;
    -- 处理10000条记录的大事务
    UPDATE large_table SET status = 'processed' WHERE batch_id = 123;
    -- 持有锁时间过长，阻塞其他操作
COMMIT;

-- ✅ 优化：分批处理
CREATE OR REPLACE FUNCTION process_batch_data(batch_id INTEGER) RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    batch_size INTEGER := 1000;
BEGIN
    LOOP
        -- 小事务处理一批数据
        WITH updated_rows AS (
            UPDATE large_table
            SET status = 'processed', processed_at = NOW()
            WHERE batch_id = process_batch_data.batch_id
              AND status = 'pending'
            LIMIT batch_size
            RETURNING id
        )
        SELECT COUNT(*) INTO processed_count FROM updated_rows;

        -- 如果没有更多数据，退出循环
        IF processed_count = 0 THEN
            EXIT;
        END IF;

        -- 提交当前批次，释放锁
        COMMIT;

        -- 检查是否还有更多工作（可选）
        PERFORM pg_sleep(0.1);  -- 小延迟避免过度竞争

        -- 开始新事务处理下一批
        BEGIN;
    END LOOP;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;`}
            {...noteProps('batch-processing')}
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            锁优化策略
          </h4>
          <Paragraph {...noteProps('lock-optimization')}>
            通过合理的索引设计、查询优化和锁模式选择，可以显著减少锁竞争和等待时间。
          </Paragraph>
          <CodeBlock
            code={`-- 乐观锁模式（适用于低冲突场景）
CREATE OR REPLACE FUNCTION update_with_optimistic_lock(
    record_id INTEGER,
    new_value TEXT,
    expected_version INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    current_version INTEGER;
    updated_count INTEGER;
BEGIN
    -- 使用版本号进行乐观锁控制
    UPDATE versioned_table
    SET value = new_value,
        version = version + 1,
        updated_at = NOW()
    WHERE id = record_id
      AND version = expected_version;

    GET DIAGNOSTICS updated_count = ROW_COUNT;

    -- 如果没有更新到记录，说明版本冲突
    IF updated_count = 0 THEN
        RAISE EXCEPTION '版本冲突：记录已被其他事务修改';
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 悲观锁模式（适用于高冲突场景）
CREATE OR REPLACE FUNCTION update_with_pessimistic_lock(
    record_id INTEGER,
    new_value TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    -- 使用 SELECT FOR UPDATE 获取排他锁
    PERFORM * FROM critical_table
    WHERE id = record_id
    FOR UPDATE;

    -- 执行业务逻辑
    UPDATE critical_table
    SET value = new_value,
        updated_at = NOW()
    WHERE id = record_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 索引优化减少锁竞争
CREATE INDEX CONCURRENTLY idx_status_updated
ON orders (status, updated_at)
WHERE status IN ('pending', 'processing');

-- 查询优化避免全表扫描
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE customer_id = $1
  AND status = 'active'
  AND created_at >= $2;`}
            {...noteProps('lock-optimization')}
          />
        </div>

        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            隔离级别优化
          </h4>
          <Paragraph {...noteProps('isolation-optimization')}>
            根据业务需求选择合适的隔离级别。不是所有场景都需要最严格的序列化隔离。
          </Paragraph>
          <CodeBlock
            code={`-- 根据业务场景选择隔离级别
CREATE OR REPLACE FUNCTION process_with_appropriate_isolation(
    operation_type VARCHAR(20)
) RETURNS VOID AS $$
BEGIN
    CASE operation_type
        WHEN 'read_only_report' THEN
            -- 只读报表：使用最低隔离级别
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            -- 执行只读查询...

        WHEN 'user_profile_update' THEN
            -- 用户资料更新：标准读已提交
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            -- 执行更新操作...

        WHEN 'financial_transfer' THEN
            -- 金融转账：需要可重复读保证
            SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
            -- 执行转账逻辑...

        WHEN 'critical_inventory' THEN
            -- 关键库存操作：最高隔离级别
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
            -- 执行关键业务逻辑...

    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 动态隔离级别选择
DO $$
DECLARE
    business_criticality VARCHAR(20) := 'high';
    isolation_level VARCHAR(30);
BEGIN
    -- 根据业务关键性动态选择隔离级别
    CASE business_criticality
        WHEN 'low' THEN isolation_level := 'READ UNCOMMITTED';
        WHEN 'medium' THEN isolation_level := 'READ COMMITTED';
        WHEN 'high' THEN isolation_level := 'REPEATABLE READ';
        WHEN 'critical' THEN isolation_level := 'SERIALIZABLE';
    END CASE;

    -- 设置事务隔离级别
    EXECUTE format('SET TRANSACTION ISOLATION LEVEL %s', isolation_level);

    RAISE NOTICE '使用隔离级别: %', isolation_level;
END;
$$;`}
            {...noteProps('isolation-optimization')}
          />
        </div>
      </div>

      {/* 监控和诊断工具 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">📊 监控和诊断工具</h3>

      <Paragraph {...noteProps('monitoring-tools')}>
        建立完善的事务性能监控体系，能够及时发现和解决性能问题。监控应该覆盖事务执行时间、锁等待、
        死锁发生、回滚频率等关键指标。
      </Paragraph>

      <CodeBlock
        title="事务性能监控仪表板"
        code={`-- 创建事务性能监控视图
CREATE OR REPLACE VIEW transaction_performance_metrics AS
SELECT
    schemaname,
    tablename,
    seq_scan as sequential_scans,
    idx_scan as index_scans,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_tup_hot_upd as hot_updates,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples,
    ROUND(
        EXTRACT(epoch FROM (now() - last_vacuum)) / 3600, 2
    ) as hours_since_vacuum,
    ROUND(
        EXTRACT(epoch FROM (now() - last_autovacuum)) / 3600, 2
    ) as hours_since_autovacuum
FROM pg_stat_user_tables
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC;

-- 锁监控视图
CREATE OR REPLACE VIEW lock_monitoring AS
SELECT
    blocked_locks.pid as blocked_pid,
    blocked_activity.usename as blocked_user,
    blocking_locks.pid as blocking_pid,
    blocking_activity.usename as blocking_user,
    blocked_locks.locktype,
    blocked_locks.mode as blocked_mode,
    blocking_locks.mode as blocking_mode,
    EXTRACT(epoch FROM (now() - blocked_activity.state_change)) as wait_seconds,
    blocked_activity.query as blocked_query
FROM pg_locks blocked_locks
JOIN pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database = blocked_locks.database
    AND blocking_locks.relation = blocked_locks.relation
    AND blocking_locks.page = blocked_locks.page
    AND blocking_locks.tuple = blocked_locks.tuple
    AND blocking_locks.virtualtransaction = blocked_locks.virtualtransaction
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- 事务监控存储过程
CREATE OR REPLACE FUNCTION monitor_transaction_health() RETURNS TABLE (
    metric_name TEXT,
    metric_value NUMERIC,
    status TEXT,
    recommendation TEXT
) AS $$
DECLARE
    long_running_txns INTEGER;
    lock_waits INTEGER;
    dead_tuples_ratio NUMERIC;
    cache_hit_ratio NUMERIC;
BEGIN
    -- 检查长时间运行的事务
    SELECT COUNT(*) INTO long_running_txns
    FROM pg_stat_activity
    WHERE xact_start IS NOT NULL
      AND EXTRACT(epoch FROM (now() - xact_start)) > 300; -- 5分钟

    -- 检查锁等待
    SELECT COUNT(*) INTO lock_waits FROM lock_monitoring;

    -- 检查死元组比例
    SELECT AVG(
        CASE WHEN n_live_tup > 0
             THEN n_dead_tup::NUMERIC / n_live_tup
             ELSE 0 END
    ) INTO dead_tuples_ratio
    FROM pg_stat_user_tables;

    -- 检查缓存命中率
    SELECT ROUND(
        SUM(blks_hit)::NUMERIC / NULLIF(SUM(blks_hit + blks_read), 0) * 100, 2
    ) INTO cache_hit_ratio
    FROM pg_stat_database;

    -- 返回监控结果
    RETURN QUERY VALUES
        ('long_running_transactions', long_running_txns,
         CASE WHEN long_running_txns > 5 THEN 'CRITICAL' WHEN long_running_txns > 2 THEN 'WARNING' ELSE 'OK' END,
         '检查并终止长时间运行的事务'),

        ('lock_waits', lock_waits,
         CASE WHEN lock_waits > 10 THEN 'CRITICAL' WHEN lock_waits > 3 THEN 'WARNING' ELSE 'OK' END,
         '优化查询减少锁竞争，或升级硬件'),

        ('dead_tuples_ratio', ROUND(dead_tuples_ratio * 100, 2),
         CASE WHEN dead_tuples_ratio > 0.3 THEN 'CRITICAL' WHEN dead_tuples_ratio > 0.1 THEN 'WARNING' ELSE 'OK' END,
         '执行VACUUM清理死元组'),

        ('cache_hit_ratio', cache_hit_ratio,
         CASE WHEN cache_hit_ratio < 90 THEN 'WARNING' ELSE 'OK' END,
         '增加共享缓冲区或优化查询');
END;
$$ LANGUAGE plpgsql;

-- 自动性能告警函数
CREATE OR REPLACE FUNCTION check_transaction_performance_alerts() RETURNS TABLE (
    alert_level TEXT,
    alert_message TEXT,
    suggested_action TEXT
) AS $$
DECLARE
    metrics RECORD;
BEGIN
    FOR metrics IN SELECT * FROM monitor_transaction_health() LOOP
        IF metrics.status IN ('WARNING', 'CRITICAL') THEN
            RETURN QUERY SELECT
                metrics.status,
                format('%s: %s', metrics.metric_name, metrics.metric_value),
                metrics.recommendation;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 使用示例
SELECT * FROM monitor_transaction_health();
SELECT * FROM check_transaction_performance_alerts();`}
        {...noteProps('performance-dashboard')}
      />

      {/* 自动化调优策略 */}
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4">🤖 自动化调优策略</h3>

      <Paragraph {...noteProps('auto-tuning')}>
        通过自动化脚本和智能算法，实现事务性能的持续优化。结合机器学习技术，可以预测性能问题并提前干预。
      </Paragraph>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl my-6">
        <h4 className="font-bold text-green-800 dark:text-green-300 mb-4">🔧 自动化调优工具</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-green-800 dark:text-green-300">动态索引优化</div>
            <div className="text-sm text-green-600 dark:text-green-400">
              根据查询模式自动创建和删除索引
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-green-800 dark:text-green-300">连接池管理</div>
            <div className="text-sm text-green-600 dark:text-green-400">
              智能调整连接池大小和超时设置
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-green-800 dark:text-green-300">查询重写</div>
            <div className="text-sm text-green-600 dark:text-green-400">
              自动优化慢查询的执行计划
            </div>
          </div>
        </div>
      </div>

      <CodeBlock
        title="自动化性能优化脚本"
        code={`-- 自动索引优化
CREATE OR REPLACE FUNCTION auto_index_optimization() RETURNS TABLE (
    action TEXT,
    object_name TEXT,
    reason TEXT
) AS $$
DECLARE
    slow_query RECORD;
    index_candidate RECORD;
BEGIN
    -- 分析慢查询
    FOR slow_query IN
        SELECT query, calls, mean_time, rows
        FROM pg_stat_statements
        WHERE mean_time > 1000  -- 超过1秒
          AND calls > 10        -- 执行次数足够多
        ORDER BY mean_time DESC
        LIMIT 10
    LOOP
        -- 分析可能的索引机会
        SELECT * INTO index_candidate
        FROM analyze_index_candidates(slow_query.query);

        IF index_candidate IS NOT NULL THEN
            -- 创建索引
            EXECUTE format('CREATE INDEX CONCURRENTLY %s ON %s (%s)',
                index_candidate.index_name,
                index_candidate.table_name,
                index_candidate.columns);

            RETURN QUERY SELECT
                'CREATE_INDEX',
                index_candidate.index_name,
                format('慢查询优化：%s', slow_query.query);
        END IF;
    END LOOP;

    -- 清理未使用的索引
    FOR index_candidate IN
        SELECT schemaname, tablename, indexname
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0  -- 从未使用过的索引
          AND schemaname NOT IN ('pg_catalog', 'information_schema')
    LOOP
        -- 删除未使用的索引
        EXECUTE format('DROP INDEX CONCURRENTLY %s.%s',
            index_candidate.schemaname,
            index_candidate.indexname);

        RETURN QUERY SELECT
            'DROP_INDEX',
            index_candidate.indexname,
            '索引未使用，自动清理';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 自动VACUUM调度
CREATE OR REPLACE FUNCTION smart_vacuum_scheduler() RETURNS VOID AS $$
DECLARE
    table_record RECORD;
    dead_tuple_threshold NUMERIC := 0.2;  -- 20%的死元组触发VACUUM
    last_vacuum_threshold INTERVAL := '24 hours';
BEGIN
    FOR table_record IN
        SELECT
            schemaname,
            tablename,
            n_dead_tup,
            n_live_tup,
            last_vacuum,
            last_autovacuum
        FROM pg_stat_user_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    LOOP
        -- 检查是否需要VACUUM
        IF (table_record.n_dead_tup::NUMERIC /
            NULLIF(table_record.n_live_tup, 0)) > dead_tuple_threshold
        OR table_record.last_vacuum < now() - last_vacuum_threshold THEN

            -- 执行VACUUM
            EXECUTE format('VACUUM ANALYZE %I.%I',
                table_record.schemaname,
                table_record.tablename);

            -- 记录操作日志
            INSERT INTO maintenance_log (
                operation,
                object_type,
                object_name,
                reason,
                executed_at
            ) VALUES (
                'VACUUM',
                'TABLE',
                format('%s.%s', table_record.schemaname, table_record.tablename),
                format('死元组比例: %s, 上次VACUUM: %s',
                    ROUND(table_record.n_dead_tup::NUMERIC /
                          NULLIF(table_record.n_live_tup, 0) * 100, 2),
                    table_record.last_vacuum),
                NOW()
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 定期执行维护任务
SELECT cron.schedule(
    'auto-index-optimization',
    '0 2 * * *',  -- 每天凌晨2点
    'SELECT auto_index_optimization();'
);

SELECT cron.schedule(
    'smart-vacuum',
    '0 */4 * * *',  -- 每4小时
    'SELECT smart_vacuum_scheduler();'
);`}
        {...noteProps('auto-tuning-scripts')}
      />

      <InfoBox type="fastai" title="事务性能优化最佳实践总结" {...noteProps('performance-best-practices')}>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🔍 监控先行</h5>
            <p className="text-sm">
              建立完善的事务性能监控体系，实时跟踪关键指标，及早发现性能问题。
              监控应该覆盖事务执行时间、锁等待、死锁、资源使用等全方位指标。
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">⚡ 分层优化</h5>
            <p className="text-sm">
              从应用层、数据库层、系统层三个维度进行优化。应用层关注事务设计，
              数据库层关注查询优化和索引策略，系统层关注硬件资源配置。
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">🔄 持续改进</h5>
            <p className="text-sm">
              性能优化是一个持续的过程。通过自动化工具和定期审查，
              确保系统性能随着业务增长而不断优化。
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">🛡️ 平衡考虑</h5>
            <p className="text-sm">
              在性能和一致性之间找到最佳平衡点。不是所有场景都需要最高隔离级别，
              根据业务需求选择合适的折中方案。
            </p>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
