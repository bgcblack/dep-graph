import path from 'path'
import { PnpmDepGraph } from '../../core/src/graph/dependencies'
import { startWebProject } from '../../web/src/server/index' // 确保导入路径正确
import { type DepGraph } from './types'
interface Params {
  graph: DepGraph
}
export const doAnalysis = async (filename: string): Promise<void> => {
  const graph = new PnpmDepGraph(path.dirname(filename), 5)
  const res = await graph.parse()

  // 启动web项目并将res传给web中的方法
  const params: Params = { graph: res }
  startWebProject(params.graph)
}
