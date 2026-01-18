import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  sectionId: string;
}

export function TableOfContents({ sectionId }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  // 提取标题
  useEffect(() => {
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('main h2, main h3');
      const tocItems: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const id = `toc-heading-${index}`;
        heading.id = id;
        tocItems.push({
          id,
          text: heading.textContent || '',
          level: heading.tagName === 'H2' ? 2 : 3,
        });
      });
      
      setItems(tocItems);
    }, 100);

    return () => clearTimeout(timer);
  }, [sectionId]);

  // 监听滚动高亮当前标题
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block fixed right-8 top-32 w-56">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>📑</span>
            本章目录
          </span>
          <svg
            className={cn(
              'w-4 h-4 transition-transform',
              isExpanded ? 'rotate-180' : ''
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <nav className="px-2 pb-3 max-h-64 overflow-y-auto">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors truncate',
                  item.level === 3 ? 'ml-3' : '',
                  activeId === item.id
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                {item.text}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
