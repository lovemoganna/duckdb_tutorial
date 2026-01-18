import { cn } from '../utils/cn';
import { modules, allSections, getSectionTitle } from '../data/sections';

interface LearningProgressProps {
  completedSections: string[];
  currentSection?: string;
  className?: string;
}

export function LearningProgress({
  completedSections,
  currentSection,
  className
}: LearningProgressProps) {
  const totalSections = allSections.length;
  const completedCount = completedSections.length;
  const completionPercentage = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // 计算每个模块的完成情况
  const moduleProgress = modules.map(module => {
    const moduleSections = module.sections;
    const completedInModule = moduleSections.filter(section =>
      completedSections.includes(section.id)
    ).length;

    return {
      ...module,
      totalSections: moduleSections.length,
      completedSections: completedInModule,
      percentage: moduleSections.length > 0 ? Math.round((completedInModule / moduleSections.length) * 100) : 0,
      isCurrentModule: module.sections.some(section => section.id === currentSection)
    };
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* 总体进度 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            学习进度
          </h3>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {completedCount} / {totalSections} 章节
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-300">总体完成度</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalSections - completedCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">待完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {completionPercentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">完成率</div>
          </div>
        </div>
      </div>

      {/* 模块进度 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          模块进度
        </h3>

        <div className="space-y-4">
          {moduleProgress.map(module => (
            <div
              key={module.id}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                module.isCurrentModule
                  ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{module.icon}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {module.title}
                  </span>
                  {module.isCurrentModule && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      当前学习
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {module.completedSections}/{module.totalSections}
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${module.percentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {module.percentage}% 完成
                </span>
                {module.percentage === 100 && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    ✓ 已完成
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 学习路径建议 */}
      {completionPercentage < 100 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            🎯 学习建议
          </h3>

          <div className="space-y-3">
            {completionPercentage === 0 && (
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">📚</span>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    从基础开始，建议先学习 "为什么学 DuckDB？" 和 "5分钟快速上手"
                  </p>
                </div>
              </div>
            )}

            {completionPercentage > 0 && completionPercentage < 30 && (
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">🔧</span>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    继续学习 DDL 和 DML 基础，这些是使用数据库的核心知识
                  </p>
                </div>
              </div>
            )}

            {completionPercentage >= 30 && completionPercentage < 70 && (
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">🚀</span>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    开始学习进阶查询和性能优化，这些将显著提升你的 SQL 技能
                  </p>
                </div>
              </div>
            )}

            {completionPercentage >= 70 && completionPercentage < 100 && (
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">🏗️</span>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    深入学习架构设计和实战项目，为实际应用奠定基础
                  </p>
                </div>
              </div>
            )}

            {currentSection && (
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">📖</span>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    当前正在学习: <strong>{getSectionTitle(currentSection)}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 完成庆祝 */}
      {completionPercentage === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            恭喜完成所有学习内容！
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            你已经掌握了 DuckDB 的核心概念和高级应用技巧
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              📊 查看学习报告
            </button>
            <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors">
              🔄 重新学习
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 学习里程碑组件
export function LearningMilestones({ completedSections }: { completedSections: string[] }) {
  const milestones = [
    { id: 'basics', title: '基础入门', required: 5, icon: '🚀', description: '掌握 DuckDB 基本概念和安装' },
    { id: 'ddl-dml', title: '数据操作', required: 8, icon: '🔧', description: '熟练使用 DDL 和 DML 语句' },
    { id: 'queries', title: '查询进阶', required: 16, icon: '🎯', description: '掌握复杂的查询技术和优化方法' },
    { id: 'functions', title: '函数与扩展', required: 11, icon: '🛠️', description: '熟悉内置函数和扩展系统' },
    { id: 'data-io', title: '数据处理', required: 7, icon: '📁', description: '掌握数据导入导出和处理流程' },
    { id: 'views', title: '视图管理', required: 4, icon: '👁️', description: '理解和使用各种视图技术' },
    { id: 'security', title: '安全架构', required: 5, icon: '🔒', description: '掌握数据库安全和权限管理' },
    { id: 'optimization', title: '性能优化', required: 8, icon: '⚡', description: '学习索引、查询优化和监控' },
    { id: 'architecture', title: '架构设计', required: 4, icon: '🏗️', description: '理解系统架构和最佳实践' },
    { id: 'projects', title: '实战项目', required: 12, icon: '🎓', description: '完成实际业务场景的项目' },
    { id: 'distributed', title: '分布式系统', required: 8, icon: '🌐', description: '掌握分布式架构和集群部署' },
    { id: 'bigdata', title: '大数据处理', required: 7, icon: '📊', description: '学习大数据处理技术和优化' },
    { id: 'ml-integration', title: '机器学习集成', required: 7, icon: '🤖', description: '理解 ML 与数据库的集成' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
        🏆 学习里程碑
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map(milestone => {
          const module = modules.find(m => m.id === milestone.id);
          const completedInModule = module?.sections.filter(section =>
            completedSections.includes(section.id)
          ).length || 0;

          const isCompleted = completedInModule >= milestone.required;
          const progress = Math.min((completedInModule / milestone.required) * 100, 100);

          return (
            <div
              key={milestone.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                isCompleted
                  ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'text-2xl',
                  isCompleted ? 'text-green-500' : 'text-slate-400'
                )}>
                  {isCompleted ? '✅' : milestone.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium mb-1',
                    isCompleted ? 'text-green-800 dark:text-green-200' : 'text-slate-800 dark:text-slate-200'
                  )}>
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {milestone.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        {completedInModule} / {milestone.required} 章节
                      </span>
                      <span className={cn(
                        'font-medium',
                        isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'
                      )}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-500',
                          isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
