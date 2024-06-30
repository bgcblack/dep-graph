import { generateDepGraph } from '../graph/dependencies'
import path from 'path'
import { type Context } from 'koa'

// 定义 /dependencies 路由，返回依赖关系图
export const getDependenciesForYarm = async (ctx: Context) => {
  try {
    const filePath = path.resolve(__dirname, '../../pnpm-lock.yaml') // 获取文件路径
    const depGraph = await generateDepGraph(filePath) // 生成依赖关系图
    ctx.body = depGraph // 返回依赖关系图
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: error + 'Failed to generate dependency graph' } // 返回错误信息
  }
  return
}
