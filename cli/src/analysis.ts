import path from 'path'
import { PnpmDepGraph } from '../../core/src/graph/pnpm'
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
