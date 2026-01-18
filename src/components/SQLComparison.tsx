interface ComparisonItem {
  label: string;
  code: string;
  description: string;
  pros?: string[];
  cons?: string[];
}

interface SQLComparisonProps {
  title: string;
  items: ComparisonItem[];
  darkMode?: boolean;
}

export function SQLComparison({ title, items, darkMode = false }: SQLComparisonProps) {
  // SQL 语法高亮
  const highlightSQL = (code: string) => {
    let result = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const keywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|DROP|TABLE|VIEW|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|NULL|IS|AS|ORDER|BY|GROUP|HAVING|LIMIT|WITH|RECURSIVE|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|UNIQUE|IF|EXISTS|CASCADE|TRUNCATE|LIKE|IN|BETWEEN)\b/gi;
    result = result.replace(keywords, '<span class="sql-keyword">$1</span>');
    
    result = result.replace(/('[^']*')/g, '<span class="sql-string">$1</span>');
    result = result.replace(/(--.*$)/gm, '<span class="sql-comment">$1</span>');
    
    return result;
  };

  return (
    <div className={`my-6 rounded-xl overflow-hidden border shadow-lg ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* 标题 */}
      <div className={`px-4 py-3 border-b ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {title}
          </h3>
        </div>
      </div>

      {/* 对比内容 */}
      <div className={`grid gap-4 p-4 ${
        items.length === 2 ? 'md:grid-cols-2' : items.length === 3 ? 'md:grid-cols-3' : 'grid-cols-1'
      }`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg border p-4 ${
              darkMode 
                ? 'bg-slate-700/50 border-slate-600' 
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* 标签 */}
            <div className={`inline-block px-2 py-1 text-xs font-medium rounded mb-3 ${
              index === 0 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : index === 1
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
            }`}>
              {item.label}
            </div>

            {/* 代码 */}
            <div className="code-block-body rounded-lg overflow-hidden mb-3">
              <pre className="p-3 overflow-x-auto">
                <code 
                  className="text-xs font-mono"
                  dangerouslySetInnerHTML={{ __html: highlightSQL(item.code) }}
                />
              </pre>
            </div>

            {/* 描述 */}
            <p className={`text-sm mb-3 ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {item.description}
            </p>

            {/* 优缺点 */}
            {item.pros && item.pros.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">优点：</span>
                <ul className="mt-1 space-y-0.5">
                  {item.pros.map((pro, i) => (
                    <li key={i} className={`text-xs flex items-start gap-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span className="text-green-500 mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.cons && item.cons.length > 0 && (
              <div>
                <span className="text-xs font-medium text-red-600 dark:text-red-400">缺点：</span>
                <ul className="mt-1 space-y-0.5">
                  {item.cons.map((con, i) => (
                    <li key={i} className={`text-xs flex items-start gap-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span className="text-red-500 mt-0.5">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
