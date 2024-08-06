import path from 'path'
// 不要跨 package 引用代码，应该通过 workspace 方式，导入依赖
import { PnpmDepGraph } from '../../core/src/graph/pnpm'
// 这种依赖方式处理的不错，但是不要跨 package 引用！
import { startWebProject } from '../../web/src/server/index' // mode_modules确保导入路径正确
import { type DepGraph } from './types'
interface Params {
  graph: DepGraph
}
export const doAnalysis = async (
  filename: string,
  depth: number
): Promise<void> => {
  const graph = new PnpmDepGraph(path.dirname(filename), depth)
  const res = await graph.parse()

  // 启动web项目并将graph传给web中的方法
  const params: Params = { graph: res }
  startWebProject(params.graph)
}
