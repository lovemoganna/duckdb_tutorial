import { useState } from 'react';

interface OntologyGraphProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConceptNode {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  x: number;
  y: number;
}

const concepts: Omit<ConceptNode, 'x' | 'y' | 'level'>[] = [
  { id: 1, name: 'Entity', description: '万物之源', parentId: null },
  { id: 2, name: 'Living Thing', description: '有生命的', parentId: 1 },
  { id: 3, name: 'Non-Living', description: '无生命的', parentId: 1 },
  { id: 4, name: 'Animal', description: '动物界', parentId: 2 },
  { id: 5, name: 'Plant', description: '植物界', parentId: 2 },
  { id: 6, name: 'Mammal', description: '哺乳动物', parentId: 4 },
  { id: 7, name: 'Bird', description: '鸟纲', parentId: 4 },
  { id: 8, name: 'Dog', description: '人类好朋友', parentId: 6 },
  { id: 9, name: 'Cat', description: '神秘生物', parentId: 6 },
  { id: 10, name: 'Eagle', description: '鹰', parentId: 7 },
];

// 计算节点位置（树形布局）
function calculateLayout(): ConceptNode[] {
  const levelMap = new Map<number, number>();
  const nodes: ConceptNode[] = [];
  
  // 计算层级
  function getLevel(id: number): number {
    if (levelMap.has(id)) return levelMap.get(id)!;
    const concept = concepts.find(c => c.id === id);
    if (!concept || concept.parentId === null) {
      levelMap.set(id, 0);
      return 0;
    }
    const level = getLevel(concept.parentId) + 1;
    levelMap.set(id, level);
    return level;
  }
  
  concepts.forEach(c => getLevel(c.id));
  
  // 按层级分组
  const levels: number[][] = [];
  concepts.forEach(c => {
    const level = levelMap.get(c.id)!;
    if (!levels[level]) levels[level] = [];
    levels[level].push(c.id);
  });
  
  // 计算位置
  const width = 800;
  const height = 500;
  const levelHeight = height / (levels.length + 1);
  
  levels.forEach((levelNodes, levelIndex) => {
    const nodeWidth = width / (levelNodes.length + 1);
    levelNodes.forEach((nodeId, nodeIndex) => {
      const concept = concepts.find(c => c.id === nodeId)!;
      nodes.push({
        ...concept,
        level: levelIndex,
        x: nodeWidth * (nodeIndex + 1),
        y: levelHeight * (levelIndex + 1),
      });
    });
  });
  
  return nodes;
}

export function OntologyGraph({ isOpen, onClose }: OntologyGraphProps) {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [highlightPath, setHighlightPath] = useState<number[]>([]);
  
  const nodes = calculateLayout();
  
  // 获取节点到根的路径
  const getPathToRoot = (nodeId: number): number[] => {
    const path: number[] = [nodeId];
    let current = nodes.find(n => n.id === nodeId);
    while (current && current.parentId !== null) {
      path.push(current.parentId);
      current = nodes.find(n => n.id === current!.parentId);
    }
    return path;
  };
  
  const handleNodeClick = (node: ConceptNode) => {
    setSelectedNode(node);
    setHighlightPath(getPathToRoot(node.id));
  };
  
  // 层级颜色
  const levelColors = [
    { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, // 黄色 - 根
    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }, // 蓝色
    { bg: '#dcfce7', border: '#22c55e', text: '#166534' }, // 绿色
    { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' }, // 粉色
    { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3' }, // 靛蓝色
  ];
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500 to-purple-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕸️</span>
            <div>
              <h2 className="text-lg font-bold text-white">本体论概念图</h2>
              <p className="text-xs text-white/80">可视化概念层级关系</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded"
              />
              显示描述
            </label>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* SVG 图形 */}
          <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <svg width="100%" height="500" viewBox="0 0 800 500">
              {/* 连接线 */}
              {nodes.map(node => {
                if (node.parentId === null) return null;
                const parent = nodes.find(n => n.id === node.parentId);
                if (!parent) return null;
                
                const isHighlighted = highlightPath.includes(node.id) && highlightPath.includes(parent.id);
                
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={isHighlighted ? '#8b5cf6' : '#94a3b8'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? '0' : '4'}
                    className="transition-all duration-300"
                  />
                );
              })}
              
              {/* 节点 */}
              {nodes.map(node => {
                const color = levelColors[node.level % levelColors.length];
                const isSelected = selectedNode?.id === node.id;
                const isInPath = highlightPath.includes(node.id);
                
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {/* 节点圆圈 */}
                    <circle
                      r={isSelected ? 35 : 30}
                      fill={color.bg}
                      stroke={isInPath ? '#8b5cf6' : color.border}
                      strokeWidth={isSelected ? 4 : 2}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* 节点名称 */}
                    <text
                      textAnchor="middle"
                      dy="0.3em"
                      fontSize="11"
                      fontWeight="600"
                      fill={color.text}
                      className="pointer-events-none"
                    >
                      {node.name.length > 10 ? node.name.slice(0, 8) + '..' : node.name}
                    </text>
                    
                    {/* 描述标签 */}
                    {showLabels && (
                      <text
                        textAnchor="middle"
                        dy="45"
                        fontSize="10"
                        fill="#6b7280"
                        className="pointer-events-none"
                      >
                        {node.description}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* 选中节点信息 */}
          {selectedNode && (
            <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-xl animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-violet-800 dark:text-violet-300 text-lg">
                    {selectedNode.name}
                  </h3>
                  <p className="text-violet-600 dark:text-violet-400 mt-1">
                    {selectedNode.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300 rounded">
                      层级: {selectedNode.level}
                    </span>
                    <span className="px-2 py-1 text-xs bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300 rounded">
                      ID: {selectedNode.id}
                    </span>
                    {selectedNode.parentId && (
                      <span className="px-2 py-1 text-xs bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300 rounded">
                        父节点: {nodes.find(n => n.id === selectedNode.parentId)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedNode(null); setHighlightPath([]); }}
                  className="text-violet-400 hover:text-violet-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 路径展示 */}
              <div className="mt-3 flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                <span>路径：</span>
                {highlightPath.slice().reverse().map((nodeId, i) => (
                  <span key={nodeId} className="flex items-center">
                    {i > 0 && <span className="mx-1">→</span>}
                    <span className={nodeId === selectedNode.id ? 'font-bold' : ''}>
                      {nodes.find(n => n.id === nodeId)?.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 图例 */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            {['根节点', '一级', '二级', '三级', '四级'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: levelColors[i]?.bg,
                    borderColor: levelColors[i]?.border,
                  }}
                />
                <span className="text-slate-600 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
          
          {/* SQL 查询提示 */}
          <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>💡 对应 SQL：</strong>用递归 CTE 可以查询任意节点的完整路径
            </p>
            <pre className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-500 overflow-x-auto">
{`WITH RECURSIVE path AS (
  SELECT id, name, parent_id, name AS full_path
  FROM concepts WHERE name = '${selectedNode?.name || 'Dog'}'
  UNION ALL
  SELECT c.id, c.name, c.parent_id, c.name || ' → ' || p.full_path
  FROM concepts c JOIN path p ON c.id = p.parent_id
)
SELECT full_path FROM path WHERE parent_id IS NULL;`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
