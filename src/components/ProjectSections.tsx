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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据仓库</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"企业级数据分析平台"</p>

      <Paragraph {...noteProps('p1')}>
        数据仓库是一个面向分析的数据库，专门用于支持企业决策制定。它整合来自多个源系统的数据，提供统一的视图用于报表、分析和商业智能。
      </Paragraph>

      <SQLExplainer
        sql={`-- 星型模式设计
CREATE TABLE fact_sales (
    sale_id INTEGER PRIMARY KEY,
    date_key INTEGER NOT NULL,
    product_key INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL
);`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 设计并实现一个完整的星型模式数据仓库</p>
          <p><strong>挑战 2：</strong> 构建ETL流程，从多个数据源加载数据</p>
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
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">数据分析</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 italic">"从数据中发现洞察"</p>

      <Paragraph {...noteProps('p1')}>
        数据分析是将原始数据转换为有意义的洞察的过程。通过统计分析、趋势识别、模式发现等技术，我们可以从数据中提取有价值的信息。
      </Paragraph>

      <CodeBlock
        title="探索性数据分析"
        code={`-- 数据概览
SELECT COUNT(*) AS total_records FROM sales_data;

-- 数值统计
SELECT AVG(amount) AS mean, STDDEV(amount) AS std FROM sales_data;`}
      />

      <InfoBox type="experiment" title="动手练习" {...noteProps('box2')}>
        <div className="space-y-2">
          <p><strong>挑战 1：</strong> 进行完整的探索性数据分析</p>
          <p><strong>挑战 2：</strong> 构建相关性分析矩阵</p>
        </div>
      </InfoBox>
    </div>
  );
}

// 其余实战项目章节的简化实现
export function ApiIntegrationSection() { return <div>API集成项目章节</div>; }
export function TimeSeriesSection() { return <div>时序数据项目章节</div>; }
export function MlPreprocessingSection() { return <div>机器学习预处理项目章节</div>; }
export function RealtimeDashboardSection() { return <div>实时仪表板项目章节</div>; }
export function LogAnalysisSection() { return <div>日志分析项目章节</div>; }
export function RecommendationSystemSection() { return <div>推荐系统项目章节</div>; }
export function GraphAnalysisSection() { return <div>图分析项目章节</div>; }
export function DataLineageSection() { return <div>数据血缘项目章节</div>; }
export function DataQualitySection() { return <div>数据质量项目章节</div>; }
