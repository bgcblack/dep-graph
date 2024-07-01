import { generateDepGraph } from '../graph/dependencies'
import path from 'path'
import { type Context } from 'koa'

export const getDependenciesForYarm = async (ctx: Context) => {
  try {
    const filePath = path.resolve(__dirname, '../../pnpm-lock.yaml') // 获取文件路径
    const depGraph = await generateDepGraph(filePath, 5) // 生成依赖关系
    ctx.body = depGraph // 返回依赖关系
    ctx.body = {
      code: 0,
      data: depGraph,
      message: 'success',
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: -1,
      data: null,
      message: error + 'Failed to generate dependency graph',
    } // 返回错误信息
  }
  return ctx
}
