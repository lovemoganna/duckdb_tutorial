# 🦆 DuckDB SQL 教程平台

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://lovemoganna.github.io/duckdb_tutorial/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)](https://vitejs.dev/)

一个现代化的、交互式的 DuckDB SQL 学习平台，采用 React + TypeScript + Tailwind CSS 构建，提供沉浸式的学习体验和丰富的可视化效果。

## ✨ 核心特性

### 🎓 深度学习体验
- **系统性教程体系** - 从基础概念到高级应用的完整学习路径
- **交互式代码示例** - 支持 SQL 代码高亮和实时预览
- **可视化数据流动** - 直观的 SQL 执行流程演示
- **事务状态转换图** - 动态展示 ACID 属性的工作原理

### 🎨 现代化 UI/UX
- **设计系统** - 一致的色彩、字体和组件规范
- **中英双语字体** - Noto Sans SC + Victor Mono 提供优质阅读体验
- **响应式设计** - 完美适配桌面和移动设备
- **微交互动画** - 流畅的过渡和反馈效果

### 🚀 技术栈亮点
- **React 19** - 最新的 React 特性支持
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS 4** - 现代化的样式解决方案
- **Vite** - 极快的构建和开发体验
- **单文件打包** - 优化的部署配置

### 📚 丰富的内容模块

#### 🏗️ 基础架构
- DuckDB 核心概念与优势
- 快速上手指南（5分钟）
- 数据类型系统详解

#### 📊 数据操作
- **DDL (数据定义语言)**
  - 表创建、修改、删除
  - 约束和索引管理

- **DML (数据操作语言)**
  - 数据插入、查询、更新、删除
  - 复杂查询和聚合操作

#### 🔄 事务处理 (深度优化)
- **事务基础概念** - 原子性、一致性、隔离性、持久性
- **ACID 属性详解** - 四大基本属性的深入理解
- **隔离级别与并发控制** - Read Uncommitted 到 Serializable
- **并发问题分析** - 脏读、不可重复读、幻读的产生与解决
- **保存点与嵌套事务** - 高级事务控制技术
- **事务设计模式** - Unit of Work、Saga、两阶段提交
- **实际应用案例** - 电商、银行、库存等真实场景
- **性能优化与监控** - 事务调优和健康监控

#### 🔧 高级特性
- 函数与表达式
- 性能优化技巧
- 最佳实践指南

### 🛠️ 开发工具

#### 学习辅助功能
- **智能搜索** - 全文内容搜索和过滤
- **笔记系统** - 支持为每个知识点添加个人笔记
- **学习进度追踪** - 可视化学习进度和成就系统
- **代码复制** - 一键复制代码片段
- **快捷键支持** - 键盘导航和快捷操作

#### 可视化组件
- **DataFlowAnimation** - 数据流动可视化
- **SQLExplainer** - SQL 查询解释器
- **InteractiveTutorial** - 交互式教程
- **LearningDashboard** - 学习数据面板

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/lovemoganna/duckdb_tutorial.git
cd duckdb_tutorial

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 🏗️ 项目结构

```
duckdb_tutorial/
├── src/
│   ├── components/          # UI 组件库
│   │   ├── DataFlowAnimation.tsx    # 数据流动可视化
│   │   ├── TransactionSections.tsx  # 事务处理章节
│   │   ├── DesignSystem.tsx         # 设计系统
│   │   └── ...
│   ├── data/               # 数据配置
│   │   ├── sections.ts     # 教程章节配置
│   │   └── searchIndex.ts  # 搜索索引
│   ├── hooks/              # 自定义 Hooks
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数
├── .github/
│   └── workflows/          # GitHub Actions 配置
│       └── deploy.yml      # 自动部署配置
├── dist/                   # 构建输出目录
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── README.md              # 项目文档
```

## 🎨 设计特色

### 字体系统
- **中文**: Noto Sans SC - 专业的简体中文字体
- **英文/代码**: Victor Mono - 等宽编程字体
- **自动加载**: Google Fonts CDN 加速

### 视觉设计
- **色彩系统**: 现代化的蓝紫色调配色方案
- **动画效果**: 流畅的微交互和状态转换
- **图标系统**: 表情符号 + 自定义图标结合
- **响应式**: Mobile-first 设计理念

### 交互体验
- **本体感设计** - 界面元素直观反映功能属性
- **渐进式展开** - 信息层次分明，用户可控
- **即时反馈** - 操作结果的实时视觉反馈
- **无障碍设计** - 键盘导航和屏幕阅读器支持

## 🔧 技术架构

### 前端架构
```typescript
// 现代化的 React 架构
React 19 + TypeScript + Tailwind CSS 4
├── 组件化设计      - 可复用的 UI 组件
├── 状态管理        - React Hooks + Context
├── 类型安全        - 完整的 TypeScript 支持
├── 性能优化        - Lazy loading + Code splitting
└── 测试友好        - 组件级别的单元测试支持
```

### 构建工具链
```javascript
// Vite 生态系统
Vite 7.2.4 + 现代化插件
├── 快速热重载      - 毫秒级开发反馈
├── 单文件打包      - 优化的生产构建
├── 依赖预构建      - 提升开发体验
├── CSS 代码分割    - 按需加载样式
└── 资源优化        - 图片压缩和字体子集化
```

### CI/CD 流程
```yaml
# GitHub Actions 自动部署
name: Deploy to GitHub Pages
on:
  push:
    branches: [ master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
      - uses: actions/deploy-pages@v4
```

## 📈 项目特色

### 🎯 学习导向设计
- **渐进式学习** - 从基础到高级的合理知识结构
- **实践结合理论** - 丰富的代码示例和实际应用场景
- **可视化教学** - 图表、动画、流程图辅助理解
- **互动性学习** - 笔记、搜索、练习等学习工具

### 🔍 技术创新
- **数据可视化** - 创新的 SQL 执行流程演示
- **事务模拟** - 直观的 ACID 属性工作原理展示
- **响应式设计** - 优秀的移动端适配体验
- **性能优化** - 懒加载、虚拟滚动等性能技术

### 🌟 用户体验
- **直观导航** - 清晰的章节结构和导航系统
- **搜索功能** - 强大的全文搜索和内容过滤
- **个性化** - 学习进度追踪和个人笔记
- **无障碍性** - 完整的键盘导航和屏幕阅读器支持

## 🤝 贡献指南

### 开发环境设置
```bash
# 1. Fork 本项目
# 2. 克隆到本地
git clone https://github.com/your-username/duckdb_tutorial.git

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev

# 5. 创建功能分支
git checkout -b feature/your-feature-name
```

### 代码规范
- **TypeScript** - 严格的类型检查
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Conventional Commits** - 规范的提交信息

### 提交规范
```bash
# 功能提交
git commit -m "feat: add new tutorial section"

# 修复提交
git commit -m "fix: resolve animation bug"

# 文档提交
git commit -m "docs: update README"

# 样式提交
git commit -m "style: update component styling"
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **DuckDB** - 优秀的分析型数据库
- **React** - 用户界面库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 下一代前端构建工具
- **Google Fonts** - 优质的字体资源

## 📞 联系我们

- **项目主页**: [GitHub Pages](https://lovemoganna.github.io/duckdb_tutorial/)
- **问题反馈**: [GitHub Issues](https://github.com/lovemoganna/duckdb_tutorial/issues)
- **功能建议**: [GitHub Discussions](https://github.com/lovemoganna/duckdb_tutorial/discussions)

---

<div align="center">

**🚀 开启您的 DuckDB 学习之旅！**

[开始学习](https://lovemoganna.github.io/duckdb_tutorial/) • [查看源码](https://github.com/lovemoganna/duckdb_tutorial)

</div>
