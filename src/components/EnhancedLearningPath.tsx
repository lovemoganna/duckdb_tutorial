import { useState, useMemo, useCallback } from 'react';
import { cn } from '../utils/cn';
import { modules, allSections } from '../data/sections';
import { OntologicalCard, OntologicalButton, LoadingState } from './DesignSystem';

interface LearningProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  timeCommitment: 'casual' | 'regular' | 'intensive';
  completedSections: string[];
  currentStreak: number;
  totalStudyTime: number;
}

interface LearningPathProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  completedSections: string[];
  bookmarkedSections: string[];
  userProfile?: Partial<LearningProfile>;
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sections: string[];
  estimatedHours: number;
  prerequisites: string[];
}

export function EnhancedLearningPath({
  isOpen,
  onClose,
  onNavigate,
  completedSections,
  bookmarkedSections,
  userProfile = {}
}: LearningPathProps) {
  const [activeTab, setActiveTab] = useState<'path' | 'recommendations' | 'plans'>('path');
  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // 学习资料分析
  const learningStats = useMemo(() => {
    const totalSections = allSections.length;
    const completedCount = completedSections.length;
    const progress = Math.round((completedCount / totalSections) * 100);

    const moduleProgress = modules.map(module => {
      const moduleSections = module.sections.map(s => s.id);
      const completedInModule = moduleSections.filter(id => completedSections.includes(id)).length;
      const progress = Math.round((completedInModule / moduleSections.length) * 100);
      return { ...module, progress, completedCount: completedInModule };
    });

    // 推断用户水平
    let inferredLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (progress > 70) inferredLevel = 'advanced';
    else if (progress > 30) inferredLevel = 'intermediate';

    // 兴趣分析（基于书签和完成情况）
    const interestMap = new Map<string, number>();
    [...completedSections, ...bookmarkedSections].forEach(sectionId => {
      const module = modules.find(m => m.sections.some(s => s.id === sectionId));
      if (module) {
        interestMap.set(module.id, (interestMap.get(module.id) || 0) + 1);
      }
    });

    const interests = Array.from(interestMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id);

    return {
      totalSections,
      completedCount,
      progress,
      moduleProgress,
      inferredLevel,
      interests
    };
  }, [completedSections, bookmarkedSections]);

  // 智能推荐
  const recommendations = useMemo(() => {
    const recs: Array<{
      type: 'next' | 'related' | 'challenge' | 'review';
      sectionId: string;
      title: string;
      reason: string;
      priority: number;
    }> = [];

    // 推荐下一节
    const currentIndex = allSections.findIndex(s => !completedSections.includes(s.id));
    if (currentIndex >= 0) {
      const nextSection = allSections[currentIndex];
      recs.push({
        type: 'next',
        sectionId: nextSection.id,
        title: nextSection.title,
        reason: '继续你的学习旅程',
        priority: 10
      });
    }

    // 推荐相关内容（基于当前完成的模块）
    const completedModules = new Set(
      completedSections.map(id =>
        modules.find(m => m.sections.some(s => s.id === id))?.id
      ).filter(Boolean)
    );

    modules.forEach(module => {
      if (!completedModules.has(module.id)) {
        const completedInModule = module.sections.filter(s => completedSections.includes(s.id)).length;
        if (completedInModule > 0 && completedInModule < module.sections.length) {
          const nextInModule = module.sections.find(s => !completedSections.includes(s.id));
          if (nextInModule) {
            recs.push({
              type: 'related',
              sectionId: nextInModule.id,
              title: nextInModule.title,
              reason: `继续学习 ${module.title} 模块`,
              priority: 8
            });
          }
        }
      }
    });

    // 推荐挑战内容
    if (learningStats.inferredLevel === 'intermediate' || learningStats.inferredLevel === 'advanced') {
      const advancedSections = allSections.filter(s => {
        const module = modules.find(m => m.sections.some(sec => sec.id === s.id));
        return module?.id === 'advanced' || module?.id === 'optimization';
      }).filter(s => !completedSections.includes(s.id));

      if (advancedSections.length > 0) {
        recs.push({
          type: 'challenge',
          sectionId: advancedSections[0].id,
          title: advancedSections[0].title,
          reason: '挑战更高难度的内容',
          priority: 6
        });
      }
    }

    // 推荐复习内容
    if (completedSections.length > 5) {
      const oldCompleted = completedSections.slice(-3);
      oldCompleted.forEach(sectionId => {
        const section = allSections.find(s => s.id === sectionId);
        if (section) {
          recs.push({
            type: 'review',
            sectionId,
            title: section.title,
            reason: '巩固已学知识',
            priority: 4
          });
        }
      });
    }

    return recs.sort((a, b) => b.priority - a.priority).slice(0, 6);
  }, [completedSections, learningStats.inferredLevel]);

  // 预定义学习计划
  const learningPlans: LearningPlan[] = [
    {
      id: 'beginner-sql',
      title: 'SQL 入门之旅',
      description: '从零开始掌握 SQL 基础语法和概念',
      duration: '2-3 周',
      difficulty: 'beginner',
      estimatedHours: 20,
      prerequisites: [],
      sections: [
        'why-duckdb', '5min-start', 'create-table', 'insert', 'select',
        'alter-table', 'drop-table', 'data-types'
      ]
    },
    {
      id: 'query-master',
      title: '查询高手养成',
      description: '掌握复杂查询和数据分析技巧',
      duration: '3-4 周',
      difficulty: 'intermediate',
      estimatedHours: 30,
      prerequisites: ['beginner-sql'],
      sections: [
        'join', 'subquery', 'aggregate', 'window-functions',
        'conditional', 'set-operations', 'pivot'
      ]
    },
    {
      id: 'performance-expert',
      title: '性能优化专家',
      description: '学习数据库性能调优和最佳实践',
      duration: '2-3 周',
      difficulty: 'advanced',
      estimatedHours: 25,
      prerequisites: ['query-master'],
      sections: [
        'indexing', 'query-optimization', 'query-plans',
        'memory-caching', 'parallel-processing'
      ]
    },
    {
      id: 'data-engineer',
      title: '数据工程师之路',
      description: '掌握数据导入导出和工程化实践',
      duration: '4-5 周',
      difficulty: 'advanced',
      estimatedHours: 35,
      prerequisites: ['query-master'],
      sections: [
        'import-csv', 'import-json', 'export-data',
        'data-warehouse', 'api-integration', 'real-time-processing'
      ]
    }
  ];

  // 生成个性化学习计划
  const generatePersonalizedPlan = useCallback(async () => {
    setIsGeneratingPlan(true);

    // 模拟AI生成计划的延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    const personalizedPlan: LearningPlan = {
      id: 'personalized',
      title: '个性化学习计划',
      description: `基于你的学习进度和兴趣定制的专属计划`,
      duration: learningStats.inferredLevel === 'beginner' ? '4-6 周' : '2-4 周',
      difficulty: learningStats.inferredLevel,
      estimatedHours: learningStats.inferredLevel === 'beginner' ? 40 :
                     learningStats.inferredLevel === 'intermediate' ? 30 : 25,
      prerequisites: [],
      sections: recommendations.map(r => r.sectionId)
    };

    setSelectedPlan(personalizedPlan);
    setIsGeneratingPlan(false);
  }, [learningStats.inferredLevel, recommendations]);

  const tabs = [
    { id: 'path', label: '学习路径', icon: '🗺️' },
    { id: 'recommendations', label: '智能推荐', icon: '🎯' },
    { id: 'plans', label: '学习计划', icon: '📋' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <OntologicalCard className="w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">智能学习路径</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                个性化推荐，科学规划你的学习之旅
              </p>
            </div>
          </div>
          <OntologicalButton variant="secondary" size="sm" onClick={onClose}>
            关闭
          </OntologicalButton>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 学习路径 */}
          {activeTab === 'path' && (
            <div className="space-y-6">
              {/* 总体进度 */}
              <OntologicalCard className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">学习进度</h3>
                <div className="text-5xl font-bold text-amber-500 mb-4">
                  {learningStats.progress}%
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  已完成 {learningStats.completedCount} / {learningStats.totalSections} 个章节
                </p>
              </OntologicalCard>

              {/* 模块进度 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">模块进度</h3>
                {learningStats.moduleProgress.map((module, index) => (
                  <OntologicalCard key={module.id} className="stagger-item">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{module.icon}</span>
                        <div>
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {module.completedCount} / {module.sections.length} 章节
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-amber-500">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </OntologicalCard>
                ))}
              </div>
            </div>
          )}

          {/* 智能推荐 */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* 用户画像 */}
              <OntologicalCard>
                <h3 className="text-lg font-semibold mb-4">你的学习画像</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-sm font-medium">当前水平</div>
                    <div className="text-lg">
                      {learningStats.inferredLevel === 'beginner' ? '初级' :
                       learningStats.inferredLevel === 'intermediate' ? '中级' : '高级'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium">学习进度</div>
                    <div className="text-lg">{learningStats.progress}%</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-sm font-medium">兴趣领域</div>
                    <div className="text-sm">
                      {learningStats.interests.length > 0
                        ? learningStats.interests.map(id =>
                            modules.find(m => m.id === id)?.title
                          ).filter(Boolean).join('、')
                        : '探索中...'
                      }
                    </div>
                  </div>
                </div>
              </OntologicalCard>

              {/* 推荐内容 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">为你推荐</h3>
                {recommendations.map((rec, index) => {
                  const section = allSections.find(s => s.id === rec.sectionId);
                  if (!section) return null;

                  const isCompleted = completedSections.includes(rec.sectionId);
                  const isBookmarked = bookmarkedSections.includes(rec.sectionId);

                  return (
                    <OntologicalCard
                      key={rec.sectionId}
                      className={cn(
                        'stagger-item cursor-pointer',
                        isCompleted && 'opacity-75'
                      )}
                      onClick={() => onNavigate(rec.sectionId)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{section.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{section.title}</h4>
                            {isCompleted && <span className="text-green-500 text-sm">✓ 已完成</span>}
                            {isBookmarked && <span className="text-amber-500 text-sm">⭐ 已收藏</span>}
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded',
                              rec.type === 'next' ? 'bg-blue-100 text-blue-700' :
                              rec.type === 'related' ? 'bg-green-100 text-green-700' :
                              rec.type === 'challenge' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-700'
                            )}>
                              {rec.type === 'next' ? '继续学习' :
                               rec.type === 'related' ? '相关内容' :
                               rec.type === 'challenge' ? '挑战' : '复习'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {rec.reason}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {modules.find(m => m.sections.some(s => s.id === rec.sectionId))?.title}
                            </span>
                          </div>
                        </div>
                        <OntologicalButton size="sm" variant="secondary">
                          开始学习
                        </OntologicalButton>
                      </div>
                    </OntologicalCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* 学习计划 */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* 生成个性化计划 */}
              <OntologicalCard>
                <div className="text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold mb-2">AI 个性化学习计划</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    基于你的学习习惯和进度，生成专属学习计划
                  </p>
                  <OntologicalButton
                    onClick={generatePersonalizedPlan}
                    disabled={isGeneratingPlan}
                  >
                    {isGeneratingPlan ? (
                      <>
                        <LoadingState size="sm" className="mr-2" />
                        正在生成...
                      </>
                    ) : (
                      '生成我的学习计划'
                    )}
                  </OntologicalButton>
                </div>
              </OntologicalCard>

              {/* 显示生成的计划 */}
              {selectedPlan && (
                <OntologicalCard>
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl">📋</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{selectedPlan.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">
                        {selectedPlan.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <span>⏱️</span>
                          {selectedPlan.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📚</span>
                          {selectedPlan.sections.length} 个章节
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🎯</span>
                          {selectedPlan.difficulty === 'beginner' ? '初级' :
                           selectedPlan.difficulty === 'intermediate' ? '中级' : '高级'}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🕐</span>
                          约 {selectedPlan.estimatedHours} 小时
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">学习章节：</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPlan.sections.map((sectionId, index) => {
                        const section = allSections.find(s => s.id === sectionId);
                        if (!section) return null;

                        const isCompleted = completedSections.includes(sectionId);

                        return (
                          <div
                            key={sectionId}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                              isCompleted
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                            )}
                            onClick={() => onNavigate(sectionId)}
                          >
                            <span className="text-lg">{section.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{section.title}</span>
                                {isCompleted && <span className="text-green-500 text-xs">✓</span>}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">{index + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </OntologicalCard>
              )}

              {/* 预定义计划 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">推荐学习计划</h3>
                {learningPlans.map((plan, index) => (
                  <OntologicalCard
                    key={plan.id}
                    className="stagger-item cursor-pointer"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {plan.difficulty === 'beginner' ? '🌱' :
                         plan.difficulty === 'intermediate' ? '🚀' : '⭐'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{plan.title}</h3>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            plan.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {plan.difficulty === 'beginner' ? '初级' :
                             plan.difficulty === 'intermediate' ? '中级' : '高级'}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          {plan.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span>⏱️ {plan.duration}</span>
                          <span>📚 {plan.sections.length} 章节</span>
                          <span>🕐 {plan.estimatedHours} 小时</span>
                        </div>
                      </div>
                      <OntologicalButton size="sm" variant="secondary">
                        查看详情
                      </OntologicalButton>
                    </div>
                  </OntologicalCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </OntologicalCard>
    </div>
  );
}
