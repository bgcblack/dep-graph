import path from 'path'
import { PnpmDepGraph } from '../../core/src/graph/dependencies'
import { startWebProject } from '../../web/src/server/index' // 确保导入路径正确

export const doAnalysis = async (filename: string): Promise<void> => {
  const graph = new PnpmDepGraph(path.dirname(filename), 5)
  const res = await graph.parse()

  // 启动web项目并将res传给web中的方法
  console.log(res, '=================================')
  startWebProject()

  // 动态导入 fetch 模块
  const { default: fetch } = await import('node-fetch')

  // 使用fetch向服务器发送POST请求
  try {
    const response = await fetch('http://localhost:3000/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(res),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const text = await response.text()
    console.log(text)
  } catch (err) {
    console.error('Error:', err)
  }
}
