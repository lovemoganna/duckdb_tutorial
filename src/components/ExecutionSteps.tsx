import { useState } from 'react';

interface Step {
  title: string;
  description: string;
  sql?: string;
  result?: string[][];
  highlight?: string;
}

interface ExecutionStepsProps {
  steps: Step[];
  darkMode?: boolean;
}

export function ExecutionSteps({ steps, darkMode = false }: ExecutionStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSteps = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStep(step);
      }
    }, 1500);
  };

  const highlightSQL = (sql: string, highlight?: string) => {
    let result = sql
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const keywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|DROP|TABLE|JOIN|LEFT|RIGHT|ON|AND|OR|NOT|NULL|IS|AS|ORDER|BY|GROUP|HAVING|LIMIT|WITH)\b/gi;
    result = result.replace(keywords, '<span class="sql-keyword">$1</span>');
    result = result.replace(/('[^']*')/g, '<span class="sql-string">$1</span>');
    
    if (highlight) {
      const regex = new RegExp(`(${highlight})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">$1</mark>');
    }
    
    return result;
  };

  const step = steps[currentStep];

  return (
    <div className={`my-6 rounded-xl overflow-hidden border shadow-lg ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* 标题栏 */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            SQL 执行步骤演示
          </h3>
        </div>
        <button
          onClick={playSteps}
          disabled={isPlaying}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            isPlaying
              ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              播放中
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              自动播放
            </>
          )}
        </button>
      </div>

      <div className="p-4">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index === currentStep
                  ? 'bg-cyan-500 text-white scale-110 shadow-lg'
                  : index < currentStep
                  ? 'bg-green-500 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-slate-200 text-slate-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </button>
          ))}
        </div>

        {/* 当前步骤内容 */}
        <div className="min-h-[200px]">
          <div className="text-center mb-4">
            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              步骤 {currentStep + 1}: {step.title}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {step.description}
            </p>
          </div>

          {step.sql && (
            <div className="code-block-body rounded-lg overflow-hidden mb-4">
              <pre className="p-4 overflow-x-auto">
                <code 
                  className="text-sm font-mono"
                  dangerouslySetInnerHTML={{ __html: highlightSQL(step.sql, step.highlight) }}
                />
              </pre>
            </div>
          )}

          {step.result && (
            <div className={`rounded-lg overflow-hidden border ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className={darkMode ? 'bg-slate-700' : 'bg-slate-100'}>
                    {step.result[0].map((header, i) => (
                      <th key={i} className={`px-4 py-2 text-left font-semibold ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.result.slice(1).map((row, i) => (
                    <tr key={i} className={`animate-fadeIn ${
                      darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`} style={{ animationDelay: `${i * 100}ms` }}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-2 ${
                          darkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 手动导航按钮 */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${darkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ← 上一步
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              currentStep === steps.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${darkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            下一步 →
          </button>
        </div>
      </div>
    </div>
  );
}
