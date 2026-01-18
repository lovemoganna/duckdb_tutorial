import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  type: 'choice' | 'sql';
  question: string;
  options?: string[];
  correctIndex?: number;
  sqlAnswer?: string;
  explanation: string;
  category: string;
  hint?: string;
}

const questions: Question[] = [
  {
    id: 1,
    type: 'choice',
    category: 'DDL',
    question: '哪个 SQL 语句用于创建新表？',
    options: ['INSERT TABLE', 'CREATE TABLE', 'NEW TABLE', 'ADD TABLE'],
    correctIndex: 1,
    explanation: 'CREATE TABLE 是创建新表的标准 SQL 语法。INSERT 用于插入数据，不是创建表结构。',
  },
  {
    id: 2,
    type: 'choice',
    category: 'DML',
    question: 'DELETE 和 TRUNCATE 的主要区别是什么？',
    options: [
      '没有区别，完全相同',
      'DELETE 可以回滚，TRUNCATE 不可以',
      'TRUNCATE 可以带条件，DELETE 不可以',
      'DELETE 只能删除一行',
    ],
    correctIndex: 1,
    explanation: 'DELETE 是 DML 操作，可以在事务中回滚；TRUNCATE 是 DDL 操作，执行后无法回滚。DELETE 可以带 WHERE 条件，TRUNCATE 只能清空整表。',
  },
  {
    id: 3,
    type: 'choice',
    category: 'SELECT',
    question: 'SELECT 语句的执行顺序是什么？',
    options: [
      'SELECT → FROM → WHERE → GROUP BY',
      'FROM → WHERE → GROUP BY → SELECT',
      'WHERE → FROM → SELECT → GROUP BY',
      'FROM → SELECT → WHERE → GROUP BY',
    ],
    correctIndex: 1,
    explanation: 'SQL 的逻辑执行顺序是：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。SELECT 列出的是输出结果，在过滤和分组之后执行。',
  },
  {
    id: 4,
    type: 'choice',
    category: 'JOIN',
    question: 'LEFT JOIN 会返回什么结果？',
    options: [
      '只返回两表都匹配的行',
      '返回左表所有行，右表匹配的行（不匹配为NULL）',
      '返回右表所有行，左表匹配的行',
      '返回两表的笛卡尔积',
    ],
    correctIndex: 1,
    explanation: 'LEFT JOIN 保留左表的所有行，如果右表没有匹配的行，则结果中右表的列为 NULL。这与 INNER JOIN（只返回匹配行）不同。',
  },
  {
    id: 5,
    type: 'choice',
    category: 'WHERE',
    question: '如何判断一个值是否为 NULL？',
    options: [
      "WHERE column = NULL",
      "WHERE column == NULL",
      "WHERE column IS NULL",
      "WHERE column EQUALS NULL",
    ],
    correctIndex: 2,
    explanation: '在 SQL 中，NULL 是特殊值，必须使用 IS NULL 或 IS NOT NULL 来判断。使用 = NULL 会返回 UNKNOWN，不会匹配任何行。',
  },
  {
    id: 6,
    type: 'choice',
    category: 'GROUP BY',
    question: 'HAVING 和 WHERE 的区别是什么？',
    options: [
      '完全相同，可以互换使用',
      'WHERE 过滤分组前的行，HAVING 过滤分组后的结果',
      'HAVING 只能用于数值列',
      'WHERE 只能在子查询中使用',
    ],
    correctIndex: 1,
    explanation: 'WHERE 在 GROUP BY 之前执行，过滤原始行；HAVING 在 GROUP BY 之后执行，过滤聚合结果。HAVING 可以使用聚合函数（如 COUNT、SUM），WHERE 不能。',
  },
  {
    id: 7,
    type: 'choice',
    category: 'CTE',
    question: 'WITH RECURSIVE 递归 CTE 必须包含什么？',
    options: [
      '只需要一个 SELECT 语句',
      '基础情况和递归情况，用 UNION ALL 连接',
      '至少三个 SELECT 语句',
      '必须使用 JOIN',
    ],
    correctIndex: 1,
    explanation: '递归 CTE 由两部分组成：1) 基础情况（锚点成员）：初始查询；2) 递归情况：引用 CTE 自身的查询。两者用 UNION ALL 连接，递归部分会不断执行直到没有新行产生。',
  },
  {
    id: 8,
    type: 'choice',
    category: 'VIEW',
    question: '关于视图（View）的说法，哪个是正确的？',
    options: [
      '视图会复制存储数据',
      '视图是保存的查询，不存储数据',
      '视图不能用 WHERE 过滤',
      '视图不能基于多个表',
    ],
    correctIndex: 1,
    explanation: '视图是虚拟表，不实际存储数据，而是保存一个查询定义。每次访问视图时，数据库会执行这个查询。视图可以基于多表 JOIN，也可以像普通表一样使用 WHERE 过滤。',
  },
  {
    id: 9,
    type: 'choice',
    category: 'INDEX',
    question: '为什么要在经常用于 WHERE 和 JOIN 的列上创建索引？',
    options: [
      '索引会减少数据存储空间',
      '索引可以加速数据查找，减少全表扫描',
      '索引会自动优化 SQL 语句',
      '索引可以防止数据重复',
    ],
    correctIndex: 1,
    explanation: '索引是一种数据结构，可以快速定位数据，避免全表扫描。在 WHERE 条件列和 JOIN 连接列上创建索引，可以显著提高查询性能。但索引会增加写入开销和存储空间。',
  },
  {
    id: 10,
    type: 'choice',
    category: 'Transaction',
    question: 'BEGIN TRANSACTION ... ROLLBACK 的作用是什么？',
    options: [
      '永久保存所有更改',
      '撤销事务中的所有更改，恢复到事务开始前的状态',
      '只撤销最后一条语句',
      '开始一个新事务',
    ],
    correctIndex: 1,
    explanation: 'ROLLBACK 会撤销当前事务中的所有更改，将数据库恢复到 BEGIN TRANSACTION 之前的状态。与之相对，COMMIT 会永久保存所有更改。这是实现数据安全的重要机制。',
  },
  {
    id: 11,
    type: 'sql',
    category: 'SELECT',
    question: '查询所有哺乳动物的名称和描述，按名称排序。',
    sqlAnswer: 'SELECT name, description FROM concepts WHERE parent_id = 4 ORDER BY name;',
    explanation: '这个查询需要：1) 从 concepts 表选择 name 和 description 列；2) 过滤 parent_id = 4（哺乳动物）；3) 按 name 排序。',
    hint: '需要找到哺乳动物的 parent_id，然后按名称排序',
  },
  {
    id: 12,
    type: 'sql',
    category: 'JOIN',
    question: '查询每个概念及其父概念的名称（使用 JOIN）。',
    sqlAnswer: 'SELECT c.name AS concept, p.name AS parent FROM concepts c LEFT JOIN concepts p ON c.parent_id = p.id;',
    explanation: '需要使用 LEFT JOIN 连接 concepts 表自身，通过 parent_id 关联父概念。别名 c 代表子概念，p 代表父概念。',
    hint: '使用自连接（self-join）查询层级关系',
  },
  {
    id: 13,
    type: 'sql',
    category: 'AGGREGATE',
    question: '统计每个父概念有多少个子概念。',
    sqlAnswer: 'SELECT parent_id, COUNT(*) as child_count FROM concepts WHERE parent_id IS NOT NULL GROUP BY parent_id;',
    explanation: '使用 GROUP BY parent_id 分组，然后 COUNT(*) 统计每个组的行数。WHERE 条件排除根节点。',
    hint: '使用 GROUP BY 和 COUNT 聚合函数',
  },
  {
    id: 14,
    type: 'choice',
    category: 'Functions',
    question: '哪个函数可以获取字符串的长度？',
    options: ['LEN()', 'LENGTH()', 'CHAR_LENGTH()', '以上都是'],
    correctIndex: 3,
    explanation: '在大多数 SQL 数据库中，LEN()、LENGTH() 和 CHAR_LENGTH() 都可以用来获取字符串长度。具体的函数名可能因数据库而异。',
  },
  {
    id: 15,
    type: 'choice',
    category: 'Performance',
    question: '关于查询优化的说法，哪个是错误的？',
    options: [
      '索引可以加速查询',
      'SELECT * 比指定列名更快',
      'EXPLAIN 可以查看查询计划',
      'JOIN 条件中的索引很重要',
    ],
    correctIndex: 1,
    explanation: 'SELECT * 会查询所有列，包括不需要的列，会增加网络传输和内存使用。应该只选择需要的列。',
  },
];

export function Quiz({ isOpen, onClose }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sqlAnswer, setSqlAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setSqlAnswer('');
      setShowExplanation(false);
      setScore(0);
      setAnswered(new Array(questions.length).fill(false));
      setIsComplete(false);
    }
  }, [isOpen]);

  const normalizeSQL = (sql: string): string => {
    return sql
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/;$/, '')
      .replace(/\s*=\s*/g, '=')
      .replace(/\s*,\s*/g, ',');
  };

  const validateSQL = (userSQL: string, correctSQL: string): boolean => {
    const normalizedUser = normalizeSQL(userSQL);
    const normalizedCorrect = normalizeSQL(correctSQL);

    // 精确匹配
    if (normalizedUser === normalizedCorrect) return true;

    // 允许一些灵活性（比如别名顺序不同）
    const userParts = normalizedUser.split(/\s+/);
    const correctParts = normalizedCorrect.split(/\s+/);

    if (userParts.length !== correctParts.length) return false;

    // 检查主要关键词和结构
    const importantKeywords = ['select', 'from', 'where', 'join', 'group', 'order', 'limit'];
    for (const keyword of importantKeywords) {
      const userHasKeyword = userParts.includes(keyword);
      const correctHasKeyword = correctParts.includes(keyword);
      if (userHasKeyword !== correctHasKeyword) return false;
    }

    return true;
  };

  const handleAnswer = (optionIndex: number) => {
    if (answered[currentIndex]) return;

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const newAnswered = [...answered];
    newAnswered[currentIndex] = true;
    setAnswered(newAnswered);

    if (optionIndex === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleSQLSubmit = () => {
    if (answered[currentIndex]) return;

    const isCorrect = currentQuestion.sqlAnswer ?
      validateSQL(sqlAnswer, currentQuestion.sqlAnswer) : false;

    setShowExplanation(true);

    const newAnswered = [...answered];
    newAnswered[currentIndex] = true;
    setAnswered(newAnswered);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setSqlAnswer('');
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSqlAnswer('');
    setShowExplanation(false);
    setScore(0);
    setAnswered(new Array(questions.length).fill(false));
    setIsComplete(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-lg font-bold text-white">SQL 知识测验</h2>
              <p className="text-xs text-white/80">测试你的 SQL 掌握程度</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isComplete ? (
          /* 完成页面 */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= 8 ? '🏆' : score >= 6 ? '🎉' : score >= 4 ? '💪' : '📚'}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              测验完成！
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              你的得分：<span className="font-bold text-amber-600">{score}</span> / {questions.length}
            </p>
            
            <div className="mb-6">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-2">
                <div 
                  className={cn(
                    "h-4 rounded-full transition-all duration-500",
                    score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-amber-500' : score >= 4 ? 'bg-blue-500' : 'bg-red-500'
                  )}
                  style={{ width: `${(score / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {score >= 8 ? '🌟 太棒了！你是 SQL 大师！' : 
                 score >= 6 ? '👍 不错！继续加油！' : 
                 score >= 4 ? '💡 还需要多练习哦' : 
                 '📖 建议重新学习相关章节'}
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                重新测验
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        ) : (
          /* 题目页面 */
          <div className="p-6">
            {/* 进度条 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                第 {currentIndex + 1} 题 / 共 {questions.length} 题
              </span>
              <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                {currentQuestion.category}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* 问题 */}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
              {currentQuestion.question}
            </h3>

            {/* 选择题选项 */}
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctIndex;
                  const isSelected = selectedAnswer === index;
                  const isAnswered = answered[currentIndex];

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={isAnswered}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                        isAnswered
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                            : 'border-slate-200 dark:border-slate-700 opacity-50'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                        isAnswered
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      )}>
                        {isAnswered ? (isCorrect ? '✓' : isSelected ? '✗' : String.fromCharCode(65 + index)) : String.fromCharCode(65 + index)}
                      </span>
                      <span className={cn(
                        'text-sm',
                        isAnswered && isCorrect
                          ? 'text-green-700 dark:text-green-300 font-medium'
                          : isAnswered && isSelected
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-slate-700 dark:text-slate-300'
                      )}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* SQL 编写题 */}
            {currentQuestion.type === 'sql' && (
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    请输入 SQL 查询语句：
                  </label>
                  <textarea
                    value={sqlAnswer}
                    onChange={(e) => setSqlAnswer(e.target.value)}
                    disabled={answered[currentIndex]}
                    placeholder="SELECT ... FROM ... WHERE ..."
                    className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
                    spellCheck={false}
                  />
                  {currentQuestion.hint && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      💡 提示：{currentQuestion.hint}
                    </p>
                  )}
                </div>
                {!answered[currentIndex] && (
                  <button
                    onClick={handleSQLSubmit}
                    disabled={!sqlAnswer.trim()}
                    className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    提交答案
                  </button>
                )}
              </div>
            )}

            {/* 解释 */}
            {showExplanation && (
              <div className={cn(
                'p-4 rounded-xl mb-6 animate-fadeIn',
                currentQuestion.type === 'choice'
                  ? (selectedAnswer === currentQuestion.correctIndex
                      ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                      : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700')
                  : (validateSQL(sqlAnswer, currentQuestion.sqlAnswer || '')
                      ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                      : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700')
              )}>
                <div className="space-y-2">
                  {currentQuestion.type === 'sql' && currentQuestion.sqlAnswer && (
                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">参考答案：</p>
                      <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {currentQuestion.sqlAnswer}
                      </code>
                    </div>
                  )}
                  <p className={cn(
                    'text-sm',
                    currentQuestion.type === 'choice'
                      ? (selectedAnswer === currentQuestion.correctIndex
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-amber-700 dark:text-amber-300')
                      : (validateSQL(sqlAnswer, currentQuestion.sqlAnswer || '')
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-amber-700 dark:text-amber-300')
                  )}>
                    <strong>💡 解释：</strong>{currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* 下一题按钮 */}
            {answered[currentIndex] && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
              >
                {currentIndex < questions.length - 1 ? '下一题 →' : '查看结果'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
