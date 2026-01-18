import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  codeBlocks?: Array<{ language: string; code: string; title?: string }>;
  analysis?: {
    type: 'sql_analysis' | 'error_detection' | 'performance' | 'optimization';
    issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string; line?: number }>;
    suggestions: string[];
  };
}

interface LearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection?: string;
}

// AI 助手工具函数
const AITools = {
  // SQL 代码分析
  analyzeSQL: (sql: string) => {
    const issues = [];
    const suggestions = [];

    // 语法检查
    if (!sql.trim()) {
      issues.push({ severity: 'error' as const, message: 'SQL 语句不能为空' });
      return { issues, suggestions };
    }

    // 检查 SELECT * 使用
    if (sql.toLowerCase().includes('select *')) {
      issues.push({
        severity: 'warning' as const,
        message: '使用 SELECT * 可能影响性能，建议明确指定需要的列'
      });
      suggestions.push('将 SELECT * 改为 SELECT column1, column2, ...');
    }

    // 检查 WHERE 条件缺失
    if (sql.toLowerCase().includes('from') && !sql.toLowerCase().includes('where') && !sql.toLowerCase().includes('limit')) {
      issues.push({
        severity: 'info' as const,
        message: '查询没有过滤条件，可能返回大量数据'
      });
      suggestions.push('考虑添加 WHERE 条件限制结果集大小');
    }

    // 检查 JOIN 条件
    if (sql.toLowerCase().includes('join') && !sql.toLowerCase().includes(' on ')) {
      issues.push({
        severity: 'error' as const,
        message: 'JOIN 语句缺少 ON 条件，将产生笛卡尔积'
      });
      suggestions.push('为每个 JOIN 添加 ON 条件，如：JOIN table2 ON table1.id = table2.id');
    }

    // 检查子查询优化
    if (sql.toLowerCase().includes(' in (select') && !sql.toLowerCase().includes('exists')) {
      suggestions.push('考虑用 EXISTS 替换 IN 子查询，可能提高性能');
    }

    // 检查索引建议
    if (sql.toLowerCase().includes('where') && sql.toLowerCase().includes('=')) {
      suggestions.push('考虑在 WHERE 条件列上创建索引以提高查询性能');
    }

    return { issues, suggestions };
  },

  // 生成优化后的 SQL
  optimizeSQL: (sql: string) => {
    let optimized = sql;

    // 移除不必要的空格
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // SELECT * 优化建议
    if (optimized.toLowerCase().includes('select *')) {
      return optimized + '\n\n💡 优化建议：将 SELECT * 改为具体的列名可以提高性能并减少网络传输';
    }

    // 添加 LIMIT 建议
    if (!optimized.toLowerCase().includes('limit') && !optimized.toLowerCase().includes('count(')) {
      optimized += '\nLIMIT 100; -- 限制结果集大小';
    }

    return optimized;
  },

  // 生成示例代码
  generateExample: (topic: string) => {
    const examples = {
      'join': `SELECT
    c.name AS 概念名称,
    p.name AS 父概念名称,
    c.description
FROM concepts c
LEFT JOIN concepts p ON c.parent_id = p.id
ORDER BY c.name;`,

      'aggregate': `SELECT
    category,
    COUNT(*) AS 总数,
    AVG(price) AS 平均价格,
    SUM(quantity) AS 总数量,
    MAX(price) AS 最高价格,
    MIN(price) AS 最低价格
FROM products
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY 总数量 DESC;`,

      'subquery': `SELECT *
FROM products
WHERE category_id IN (
    SELECT id
    FROM categories
    WHERE parent_category IS NOT NULL
)
AND price > (
    SELECT AVG(price)
    FROM products
);`,

      'window': `SELECT
    product_name,
    category,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category,
    AVG(price) OVER (PARTITION BY category) AS category_avg_price,
    price - LAG(price) OVER (ORDER BY price) AS price_diff_from_prev
FROM products
ORDER BY category, rank_in_category;`
    };

    return examples[topic as keyof typeof examples] || '抱歉，我还没有这个主题的示例代码。';
  },

  // 学习路径推荐
  recommendPath: (currentSection?: string) => {
    const paths = {
      beginner: [
        'why-duckdb - 了解 DuckDB 优势',
        '5min-start - 快速上手体验',
        'create-table - 学习表结构设计',
        'insert - 掌握数据插入',
        'select - 核心查询技能'
      ],
      intermediate: [
        'join - 多表关联查询',
        'aggregate - 数据统计分析',
        'subquery - 复杂查询逻辑',
        'window-functions - 高级分析函数',
        'indexing - 性能优化基础'
      ],
      advanced: [
        'query-optimization - 查询调优',
        'materialized-views - 预计算视图',
        'transactions - 数据一致性',
        'security - 数据安全',
        'extensions - 扩展功能'
      ]
    };

    // 根据当前章节推荐路径
    if (currentSection?.includes('create') || currentSection?.includes('insert')) {
      return paths.beginner;
    } else if (currentSection?.includes('join') || currentSection?.includes('aggregate')) {
      return paths.intermediate;
    } else {
      return paths.beginner;
    }
  }
};

// 预定义的常见问题和答案
const FAQ_DATABASE = {
  'select': {
    question: 'SELECT 语句的基本语法是什么？',
    answer: 'SELECT 语句的基本语法是：\n\n```sql\nSELECT column1, column2, ...\nFROM table_name\nWHERE condition\nORDER BY column\nLIMIT number;\n```\n\n- SELECT: 指定要选择的列\n- FROM: 指定数据来源表\n- WHERE: 过滤条件\n- ORDER BY: 排序\n- LIMIT: 限制返回行数',
    codeBlocks: [{ language: 'sql', code: 'SELECT name, description FROM concepts WHERE parent_id IS NULL ORDER BY name;' }]
  },
  'join': {
    question: 'JOIN 有哪些类型？',
    answer: 'JOIN 主要有以下类型：\n\n1. **INNER JOIN**: 只返回两表都匹配的行\n2. **LEFT JOIN**: 返回左表所有行 + 右表匹配行\n3. **RIGHT JOIN**: 返回右表所有行 + 左表匹配行\n4. **FULL JOIN**: 返回两表所有行\n5. **CROSS JOIN**: 笛卡尔积，所有组合\n\n```sql\nSELECT *\nFROM table1 t1\nINNER JOIN table2 t2 ON t1.id = t2.id;\n```'
  },
  'index': {
    question: '索引是如何工作的？',
    answer: '索引就像书的目录，帮助数据库快速找到数据：\n\n**工作原理：**\n- 创建索引时，数据库构建一个排序的数据结构\n- 查询时先查索引，再定位到实际数据\n- 避免全表扫描，提高查询速度\n\n**创建索引：**\n```sql\nCREATE INDEX idx_name ON table_name(column_name);\n```\n\n**注意：**\n- 索引加快查询但减慢写入\n- 不是所有列都需要索引\n- 复合索引对多列查询更有效'
  },
  'groupby': {
    question: 'GROUP BY 和聚合函数怎么用？',
    answer: 'GROUP BY 用于按列分组并进行聚合计算：\n\n```sql\nSELECT department, COUNT(*), AVG(salary), MAX(salary)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;\n```\n\n**要点：**\n- SELECT 中的非聚合列必须出现在 GROUP BY 中\n- WHERE 在分组前过滤，HAVING 在分组后过滤\n- 聚合函数：COUNT, SUM, AVG, MAX, MIN 等\n\n**常见错误：**\n```sql\n-- 错误：name 不在 GROUP BY 中\nSELECT department, name, COUNT(*)\nFROM employees\nGROUP BY department;\n```'
  },
  'performance': {
    question: '如何优化查询性能？',
    answer: '查询性能优化的核心原则：\n\n**1. 减少数据量**\n- 使用 WHERE 条件尽早过滤\n- 只 SELECT 需要的列\n- 使用 LIMIT 限制结果\n\n**2. 利用索引**\n- 在 WHERE、JOIN、ORDER BY 列上创建索引\n- 避免在索引列上使用函数\n\n**3. 查询重写**\n- 用 EXISTS 替代 IN 子查询\n- 避免 SELECT *\n- 使用合适的 JOIN 类型\n\n**4. 监控和分析**\n- 使用 EXPLAIN 查看执行计划\n- 分析慢查询日志'
  }
};

export function LearningAssistant({ isOpen, onClose, currentSection }: LearningAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的 SQL 学习助手。我可以帮你解答关于 DuckDB 和 SQL 的问题，提供学习建议，还能分析你的代码。试着问我一些问题吧！',
      timestamp: new Date(),
      suggestions: ['SELECT 语句怎么写？', 'JOIN 有哪些类型？', '如何创建索引？']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // 检测是否包含 SQL 代码进行分析
    const sqlPattern = /\b(select|insert|update|delete|create|alter|drop)\b/i;
    const hasSQL = sqlPattern.test(userMessage);

    if (hasSQL && (lowerMessage.includes('分析') || lowerMessage.includes('检查') || lowerMessage.includes('优化'))) {
      // 提取 SQL 代码
      const sqlMatch = userMessage.match(/```sql\n([\s\S]*?)```/) ||
                      userMessage.match(/```\n([\s\S]*?)```/) ||
                      userMessage.match(/(select[\s\S]*?;)/i);

      if (sqlMatch) {
        const sqlCode = sqlMatch[1] || sqlMatch[0];
        const analysis = AITools.analyzeSQL(sqlCode);
        const optimized = AITools.optimizeSQL(sqlCode);

        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `我来帮你分析这段 SQL 代码：\n\n\`\`\`sql\n${sqlCode}\n\`\`\``,
          timestamp: new Date(),
          analysis: {
            type: 'sql_analysis',
            issues: analysis.issues,
            suggestions: analysis.suggestions
          },
          codeBlocks: [{
            language: 'sql',
            code: optimized,
            title: '优化后的代码'
          }],
          suggestions: ['应用这个优化', '解释这些问题', '生成测试数据']
        };
      }
    }

    // 检查是否匹配常见问题
    for (const [key, faq] of Object.entries(FAQ_DATABASE)) {
      if (lowerMessage.includes(key) || faq.question.toLowerCase().includes(lowerMessage)) {
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: faq.answer,
          timestamp: new Date(),
          suggestions: ['还有其他问题吗？', '可以给我看段代码吗？', '推荐学习路径'],
          codeBlocks: faq.codeBlocks
        };
      }
    }

    // 示例代码请求
    if (lowerMessage.includes('例子') || lowerMessage.includes('示例') || lowerMessage.includes('example')) {
      const topics = ['join', 'aggregate', 'subquery', 'window'];
      const matchedTopic = topics.find(topic => lowerMessage.includes(topic));

      if (matchedTopic) {
        const example = AITools.generateExample(matchedTopic);
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `这是关于 ${matchedTopic} 的示例代码：`,
          timestamp: new Date(),
          codeBlocks: [{ language: 'sql', code: example, title: `${matchedTopic} 示例` }],
          suggestions: ['解释这个例子', '修改这个查询', '添加更多条件']
        };
      }
    }

    // 学习路径推荐
    if (lowerMessage.includes('学习路径') || lowerMessage.includes('推荐学习') || lowerMessage.includes('怎么学')) {
      const path = AITools.recommendPath(currentSection);
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `根据你的学习进度，这里是推荐的学习路径：\n\n📚 **推荐学习顺序：**\n${path.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n💡 **学习建议：**\n- 按照顺序逐步学习，每个概念都动手实践\n- 完成每个章节的练习题\n- 遇到问题随时询问我\n- 多在 SQL 练习场中实验\n\n你可以从下一节开始，或者告诉我你想重点学习哪个部分！`,
        timestamp: new Date(),
        suggestions: ['从下一节开始', '查看练习题', '重点学习 JOIN']
      };
    }

    // 智能回复逻辑
    if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: '我可以帮你：\n\n🎯 **SQL 问题解答**\n- 语法解释和示例\n- 最佳实践建议\n- 性能优化指导\n\n📚 **学习建议**\n- 根据你的进度推荐内容\n- 练习题目和解题思路\n\n🔍 **代码分析**\n- SQL 代码质量检查\n- 性能优化建议\n- 安全漏洞检测\n\n💡 **试试问我：**\n- "SELECT 语句怎么写？"\n- "如何优化这个查询？"\n- "推荐学习路径"',
        timestamp: new Date(),
        suggestions: ['查看当前章节', '性能优化建议', '练习题目']
      };
    }

    if (lowerMessage.includes('练习') || lowerMessage.includes('题目')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: '根据你的学习进度，这里有一些练习建议：\n\n**基础查询练习：**\n1. 查询所有概念及其父概念\n2. 统计每个父概念有多少子概念\n3. 找出没有子概念的叶子节点\n\n**进阶练习：**\n1. 用递归查询显示完整层级路径\n2. 创建概念的统计视图\n3. 实现模糊搜索功能\n\n**性能优化练习：**\n1. 在合适列上创建索引\n2. 用 EXPLAIN 分析查询计划\n3. 优化慢查询\n\n你可以把你的解法发给我，我来帮你检查！',
        timestamp: new Date(),
        suggestions: ['基础查询练习', '进阶练习', '性能优化']
      };
    }

    if (lowerMessage.includes('bug') || lowerMessage.includes('错误') || lowerMessage.includes('问题')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: '遇到问题不要慌，让我来帮你诊断：\n\n🔍 **常见 SQL 错误：**\n\n1. **语法错误**\n   - 忘记逗号、分号\n   - 拼写错误\n   - 括号不匹配\n\n2. **逻辑错误**\n   - WHERE 条件写错\n   - JOIN 条件缺失\n   - 分组逻辑错误\n\n3. **性能问题**\n   - 没有索引\n   - 查询设计不合理\n   - 数据量过大\n\n💡 **调试建议：**\n- 把复杂查询分解成简单查询\n- 使用 LIMIT 查看部分结果\n- 检查数据类型是否匹配\n- 用 EXPLAIN 查看执行计划\n\n把你的错误信息发给我，我来帮你分析！',
        timestamp: new Date(),
        suggestions: ['发送错误信息', '查看调试技巧', '最佳实践']
      };
    }

    // 默认回复
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `关于"${userMessage}"，让我想想...\n\n我可以帮你：\n\n📖 **概念解释**\n详细解释 SQL 概念和语法\n\n💡 **代码示例**\n提供实用的代码片段\n\n🔧 **问题解决**\n帮你调试和优化代码\n\n🎯 **学习规划**\n根据你的进度推荐学习内容\n\n你可以：\n- 描述你遇到的问题\n- 分享一段代码让我分析\n- 询问特定 SQL 概念\n- 请求学习建议`,
      timestamp: new Date(),
      suggestions: ['解释这个概念', '给我个例子', '帮我检查代码']
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 模拟 AI 回复延迟
    setTimeout(() => {
      const assistantMessage = generateResponse(input);
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">学习助手</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">AI 驱动的 SQL 学习助手</p>
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

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                )}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                {/* 代码块显示 */}
                {message.codeBlocks && message.codeBlocks.map((block, index) => (
                  <div key={index} className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm overflow-x-auto">
                    {block.title && (
                      <div className="text-xs text-slate-400 mb-2 pb-2 border-b border-slate-700">
                        {block.title}
                      </div>
                    )}
                    <pre className="whitespace-pre-wrap">{block.code}</pre>
                  </div>
                ))}

                {/* 分析结果显示 */}
                {message.analysis && (
                  <div className="mt-3 space-y-3">
                    {message.analysis.issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">🔍 发现的问题：</h4>
                        {message.analysis.issues.map((issue, index) => (
                          <div key={index} className={`p-2 rounded-lg text-sm ${
                            issue.severity === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            issue.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                            'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          }`}>
                            <span className="font-medium">
                              {issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'}
                            </span>
                            {issue.message}
                            {issue.line && <span className="ml-2 text-xs">(第{issue.line}行)</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {message.analysis.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">💡 优化建议：</h4>
                        {message.analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                            <span className="font-medium">✅</span> {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1 bg-white/20 dark:bg-slate-600/50 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/70 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-600 dark:text-slate-300 text-sm">👤</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="询问 SQL 问题、分享代码、寻求建议..."
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              发送
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => handleSuggestionClick('SELECT 语句怎么写？')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              SELECT 语法
            </button>
            <button
              onClick={() => handleSuggestionClick('JOIN 有哪些类型？')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              JOIN 类型
            </button>
            <button
              onClick={() => handleSuggestionClick('如何优化查询性能？')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              性能优化
            </button>
            <button
              onClick={() => handleSuggestionClick('练习题目')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              练习建议
            </button>
            <button
              onClick={() => handleSuggestionClick('推荐学习路径')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              学习路径
            </button>
            <button
              onClick={() => handleSuggestionClick('给我个 JOIN 的例子')}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              示例代码
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
