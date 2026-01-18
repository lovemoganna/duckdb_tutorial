// 笔记类型
export interface Note {
  id: string;
  sectionId: string;
  blockId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// 教程章节类型
export interface Section {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
}

// 教程模块类型
export interface Module {
  id: string;
  title: string;
  icon: string;
  sections: Section[];
}
