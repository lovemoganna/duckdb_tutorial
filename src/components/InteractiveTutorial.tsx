import { useState, useMemo } from 'react';
import { cn } from '../utils/cn';

interface TutorialStep {
  title: string;
  description: string;
  code: string;
  expectedResult?: string[][];
  hint?: string;
}

interface InteractiveTutorialProps {
  title: string;
  steps: TutorialStep[];
}

// Token 类型
type TokenType = 'keyword' | 'function' | 'type' | 'string' | 'comment' | 'number' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'DROP', 'TABLE', 'JOIN', 'LEFT', 'RIGHT', 'ON', 'AND', 'OR', 'NOT',
  'NULL', 'IS', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'WITH', 'RECURSIVE'
]);

const SQL_FUNCTIONS = new Set(['COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'ROW_NUMBER', 'RANK']);

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#7dd3fc',
  function: '#c4b5fd',
  type: '#86efac',
  string: '#fcd34d',
  comment: '#9ca3af',
  number: '#fdba74',
  plain: '#f1f5f9',
};

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    if (/\s/.test(code[i])) {
      let value = '';
      while (i < code.length && /\s/.test(code[i])) value += code[i++];
      tokens.push({ type: 'plain', value });
      continue;
    }
    if (code.slice(i, i + 2) === '--') {
      let value = '';
      while (i < code.length && code[i] !== '\n') value += code[i++];
      tokens.push({ type: 'comment', value });
      continue;
    }
    if (code[i] === "'") {
      let value = code[i++];
      while (i < code.length && code[i] !== "'") value += code[i++];
      if (i < code.length) value += code[i++];
      tokens.push({ type: 'string', value });
      continue;
    }
    if (/\d/.test(code[i])) {
      let value = '';
      while (i < code.length && /[\d.]/.test(code[i])) value += code[i++];
      tokens.push({ type: 'number', value });
      continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let value = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) value += code[i++];
      const upper = value.toUpperCase();
      if (SQL_KEYWORDS.has(upper)) tokens.push({ type: 'keyword', value });
      else if (SQL_FUNCTIONS.has(upper)) tokens.push({ type: 'function', value });
      else tokens.push({ type: 'plain', value });
      continue;
    }
    tokens.push({ type: 'plain', value: code[i++] });
  }
  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const tokens = useMemo(() => tokenize(code), [code]);
  return (
    <code className="text-sm font-mono">
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>
          {t.value}
        </span>
      ))}
    </code>
  );
}

export function InteractiveTutorial({ title, steps }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [userCode, setUserCode] = useState(steps[0]?.code || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const step = steps[currentStep];
  const progress = (completedSteps.size / steps.length) * 100;

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setUserCode(steps[index].code);
    setShowHint(false);
    setResult(null);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setResult(null);

    setTimeout(() => {
      // 模拟执行
      const isCorrect = userCode.trim().toLowerCase().includes(
        step.code.split('\n').filter(l => !l.trim().startsWith('--'))[0]?.toLowerCase().slice(0, 20) || ''
      );
      
      if (isCorrect) {
        setResult({ success: true, message: '执行成功！代码正确。' });
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      } else {
        setResult({ success: false, message: '结果不太对，再检查一下代码？' });
      }
      setIsExecuting(false);
    }, 800);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-white/80">
                第 {currentStep + 1} 步，共 {steps.length} 步
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/80">{Math.round(progress)}%</span>
            <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 步骤导航 */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto bg-slate-50 dark:bg-slate-800">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => handleStepChange(i)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all',
              i === currentStep
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-500 bg-white dark:bg-slate-700'
                : completedSteps.has(i)
                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            )}
          >
            <span className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-xs',
              completedSteps.has(i)
                ? 'bg-green-500 text-white'
                : i === currentStep
                ? 'bg-violet-500 text-white'
                : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
            )}>
              {completedSteps.has(i) ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="p-6 bg-white dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {step.description}
        </p>

        {/* 代码编辑器 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              编写代码：
            </label>
            {step.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'text-xs px-2 py-1 rounded transition-colors',
                  showHint
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                )}
              >
                💡 {showHint ? '隐藏提示' : '显示提示'}
              </button>
            )}
          </div>

          {showHint && step.hint && (
            <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">💡 {step.hint}</p>
            </div>
          )}

          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-40 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-lg border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
            spellCheck={false}
          />
        </div>

        {/* 参考答案 */}
        <details className="mb-4">
          <summary className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
            📝 查看参考代码
          </summary>
          <div className="mt-2 p-4 bg-slate-900 rounded-lg overflow-x-auto">
            <pre className="whitespace-pre-wrap">
              <HighlightedCode code={step.code} />
            </pre>
          </div>
        </details>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={cn(
              'px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors',
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-700 text-slate-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            ← 上一步
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={cn(
                'px-6 py-2 text-sm rounded-lg font-medium flex items-center gap-2 transition-all',
                isExecuting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              )}
            >
              {isExecuting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  执行中...
                </>
              ) : (
                <>
                  ▶️ 运行
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={cn(
              'px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors',
              currentStep === steps.length - 1
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-700 text-slate-400'
                : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50'
            )}
          >
            下一步 →
          </button>
        </div>

        {/* 执行结果 */}
        {result && (
          <div className={cn(
            'mt-4 p-4 rounded-lg animate-fadeIn',
            result.success
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
          )}>
            <p className={cn(
              'flex items-center gap-2 font-medium',
              result.success
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            )}>
              <span>{result.success ? '✅' : '❌'}</span>
              {result.message}
            </p>
          </div>
        )}

        {/* 预期结果 */}
        {step.expectedResult && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              预期结果：
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    {step.expectedResult[0]?.map((h, i) => (
                      <th key={i} className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.expectedResult.slice(1).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 底部完成提示 */}
      {completedSteps.size === steps.length && (
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-center">
          <p className="text-white font-medium flex items-center justify-center gap-2">
            <span className="text-xl">🎉</span>
            恭喜！你已完成本教程的所有步骤！
          </p>
        </div>
      )}
    </div>
  );
}
