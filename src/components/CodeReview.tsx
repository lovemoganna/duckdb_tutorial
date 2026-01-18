import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface ReviewIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  category: 'performance' | 'security' | 'quality' | 'best-practice';
  title: string;
  description: string;
  suggestion: string;
  line?: number;
  severity: 'high' | 'medium' | 'low';
}

interface CodeReviewProps {
  isOpen: boolean;
  onClose: () => void;
  code?: string;
}

export function CodeReview({ isOpen, onClose, code }: CodeReviewProps) {
  const [sqlCode, setSqlCode] = useState(code || '');
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');

  useEffect(() => {
    if (code) {
      setSqlCode(code);
      analyzeCode(code);
    }
  }, [code]);

  const analyzeCode = async (code: string) => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setActiveTab('results');

    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    const foundIssues: ReviewIssue[] = [];

    // 基础分析规则
    const lines = code.split('\n');
    const upperCode = code.toUpperCase();

    // 1. 性能问题检查
    if (upperCode.includes('SELECT *')) {
      foundIssues.push({
        id: 'perf-1',
        type: 'warning',
        category: 'performance',
        title: '使用 SELECT *',
        description: 'SELECT * 会选择所有列，可能传输不必要的数据',
        suggestion: '明确指定需要的列名，如：SELECT id, name, description',
        severity: 'medium'
      });
    }

    if (upperCode.includes('WHERE') && !upperCode.includes('INDEX') && !upperCode.includes('CREATE INDEX')) {
      foundIssues.push({
        id: 'perf-2',
        type: 'info',
        category: 'performance',
        title: 'WHERE 条件可能需要索引',
        description: 'WHERE 子句中的列如果没有索引，查询可能会很慢',
        suggestion: '考虑在过滤列上创建索引：CREATE INDEX idx_column ON table_name(column_name);',
        severity: 'low'
      });
    }

    if (upperCode.includes(' LIKE ') && upperCode.includes('%') && !upperCode.includes('LIKE \'') && upperCode.includes('LIKE \'%')) {
      foundIssues.push({
        id: 'perf-3',
        type: 'warning',
        category: 'performance',
        title: '前缀通配符 LIKE 查询',
        description: 'LIKE \'%text\' 不会使用索引，导致全表扫描',
        suggestion: '如果可能，使用前缀匹配：LIKE \'text%\' 或考虑其他搜索方案',
        severity: 'high'
      });
    }

    // 2. 安全问题检查
    if (upperCode.includes('\'\'\'') || upperCode.includes('1=1') || upperCode.includes('OR 1=1')) {
      foundIssues.push({
        id: 'sec-1',
        type: 'error',
        category: 'security',
        title: '可能的 SQL 注入风险',
        description: '检测到可能被利用的注入模式',
        suggestion: '使用参数化查询或预编译语句，避免直接拼接用户输入',
        severity: 'high'
      });
    }

    if (upperCode.includes('DROP ') || upperCode.includes('DELETE ') && !upperCode.includes('WHERE')) {
      foundIssues.push({
        id: 'sec-2',
        type: 'warning',
        category: 'security',
        title: '危险的删除操作',
        description: '没有 WHERE 条件的 DELETE 或 DROP 操作',
        suggestion: '添加 WHERE 条件限制影响范围，或使用事务保护',
        severity: 'high'
      });
    }

    // 3. 代码质量检查
    const selectCount = (upperCode.match(/SELECT/g) || []).length;
    const fromCount = (upperCode.match(/FROM/g) || []).length;
    if (selectCount > fromCount * 2) {
      foundIssues.push({
        id: 'qual-1',
        type: 'info',
        category: 'quality',
        title: '复杂的查询结构',
        description: '查询中包含多个子查询，建议简化',
        suggestion: '考虑使用 CTE (WITH 子句) 或视图来简化复杂查询',
        severity: 'medium'
      });
    }

    if (!upperCode.includes(';')) {
      foundIssues.push({
        id: 'qual-2',
        type: 'warning',
        category: 'quality',
        title: '缺少语句结束符',
        description: 'SQL 语句应该以分号结束',
        suggestion: '在语句末尾添加分号 (;)',
        severity: 'low'
      });
    }

    // 4. 最佳实践检查
    if (upperCode.includes('UNION') && !upperCode.includes('UNION ALL')) {
      foundIssues.push({
        id: 'best-1',
        type: 'info',
        category: 'best-practice',
        title: '考虑使用 UNION ALL',
        description: 'UNION 会自动去重，如果不需要去重，使用 UNION ALL 性能更好',
        suggestion: '如果确定不需要去重，使用 UNION ALL 替代 UNION',
        severity: 'low'
      });
    }

    if (upperCode.includes('GROUP BY') && upperCode.includes('SELECT') && !upperCode.includes('HAVING')) {
      const selectMatch = code.match(/SELECT\s+(.+?)\s+FROM/i);
      const groupByMatch = code.match(/GROUP BY\s+(.+)/i);
      if (selectMatch && groupByMatch) {
        const selectCols = selectMatch[1].split(',').map(s => s.trim().toLowerCase());
        const groupCols = groupByMatch[1].split(',').map(s => s.trim().toLowerCase());
        const hasNonAgg = selectCols.some(col =>
          !col.includes('count(') && !col.includes('sum(') && !col.includes('avg(') &&
          !col.includes('max(') && !col.includes('min(') &&
          !groupCols.some(g => col.includes(g))
        );
        if (hasNonAgg) {
          foundIssues.push({
            id: 'best-2',
            type: 'warning',
            category: 'best-practice',
            title: 'GROUP BY 列不匹配',
            description: 'SELECT 中的非聚合列必须出现在 GROUP BY 中',
            suggestion: '要么添加聚合函数，要么将列加入 GROUP BY 子句',
            severity: 'high'
          });
        }
      }
    }

    // 5. 语法和风格检查
    if (upperCode.includes('  ') || upperCode.includes('\t')) {
      foundIssues.push({
        id: 'style-1',
        type: 'info',
        category: 'quality',
        title: '格式化建议',
        description: '代码缩进和格式可以更规范',
        suggestion: '使用一致的缩进，使用 AS 给列取有意义的别名',
        severity: 'low'
      });
    }

    // 如果没有发现问题，给出正面反馈
    if (foundIssues.length === 0) {
      foundIssues.push({
        id: 'success-1',
        type: 'success',
        category: 'quality',
        title: '代码质量良好！',
        description: '没有发现明显的性能、安全或质量问题',
        suggestion: '继续保持良好的编码习惯！可以考虑添加注释提高可读性。',
        severity: 'low'
      });
    }

    setIssues(foundIssues);
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    analyzeCode(sqlCode);
  };

  const getTypeColor = (type: ReviewIssue['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityColor = (severity: ReviewIssue['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
    }
  };

  const getCategoryIcon = (category: ReviewIssue['category']) => {
    switch (category) {
      case 'performance': return '⚡';
      case 'security': return '🔒';
      case 'quality': return '✨';
      case 'best-practice': return '📚';
    }
  };

  const issueStats = {
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    infos: issues.filter(i => i.type === 'info').length,
    successes: issues.filter(i => i.type === 'success').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🔍</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">代码审查</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">自动分析 SQL 代码质量、性能和安全</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('input')}
            className={cn(
              'px-6 py-3 font-medium text-sm transition-colors',
              activeTab === 'input'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            输入代码
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={cn(
              'px-6 py-3 font-medium text-sm transition-colors',
              activeTab === 'results'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            分析结果 {issues.length > 0 && `(${issues.length})`}
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'input' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">粘贴或输入 SQL 代码进行分析</span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={!sqlCode.trim() || isAnalyzing}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isAnalyzing ? '分析中...' : '开始分析'}
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  placeholder={`-- 输入 SQL 代码，例如：
SELECT *
FROM users
WHERE name LIKE '%john%'
ORDER BY created_at DESC;`}
                  className="w-full h-full p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="h-full flex flex-col">
              {/* 统计信息 */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>错误: {issueStats.errors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>警告: {issueStats.warnings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>信息: {issueStats.infos}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>通过: {issueStats.successes}</span>
                  </div>
                </div>
              </div>

              {/* 问题列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600 dark:text-slate-400">正在分析代码...</p>
                    </div>
                  </div>
                ) : issues.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">输入 SQL 代码开始分析</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={cn(
                          'border rounded-xl p-4 transition-all',
                          getTypeColor(issue.type)
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-white text-sm',
                              getSeverityColor(issue.severity)
                            )}>
                              {getCategoryIcon(issue.category)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{issue.title}</h4>
                              <span className={cn(
                                'px-2 py-1 text-xs rounded-full font-medium',
                                issue.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                issue.severity === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              )}>
                                {issue.severity === 'high' ? '高' : issue.severity === 'medium' ? '中' : '低'}
                              </span>
                            </div>
                            <p className="text-sm mb-3 opacity-90">{issue.description}</p>
                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400 font-mono text-sm mt-0.5">💡</span>
                                <div>
                                  <div className="font-medium text-sm mb-1">建议改进：</div>
                                  <div className="text-sm opacity-90">{issue.suggestion}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              支持 SQL 语法检查、性能分析、安全漏洞检测、最佳实践建议
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSqlCode('')}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                清空
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
