export interface DepGraphNode {
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

// 定义依赖关系
export type DepGraph = DepGraphNode[]
