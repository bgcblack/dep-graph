import { PnpmDepGraph } from '../graph/pnpm'
import path from 'path'
import { type Context } from 'koa'

// 这些 koa 的逻辑还有用吗？
export const getDependenciesForPnpm = async (ctx: Context) => {
  try {
    const { filename, depth } = ctx.request.query
    console.log(ctx.request.query)
    console.log(filename, depth, '============================')
    // const filePath = path.resolve(__dirname, '../../pnpm-lock.yaml') // 获取文件路径
    const filePath = path.resolve(__dirname, filename as string) // 获取文件路径
    const depGraph = new PnpmDepGraph(filePath, Number(depth)) // 生成依赖关系
    ctx.body = depGraph.parse()
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
