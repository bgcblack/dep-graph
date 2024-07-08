// 定义依赖类型
export type DepTypes = 'dev' | 'prod' | 'peer'

// 定义依赖关系节点
export interface DepGraphNode {
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

// 定义依赖关系
export type DepGraph = DepGraphNode[]
