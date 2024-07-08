import express from 'express'
import path from 'path'

let app: express.Application

export const startWebProject = (): void => {
  app = express()
  const port = 3000

  // 设置静态文件目录为Vue构建后的dist目录
  const publicDir = path.join(__dirname, '../../../dist')
  app.use(express.static(publicDir))

  app.use(express.json())

  app.post('/render', (req, res) => {
    const graphData = req.body
    renderGraph(graphData)
    res.send('Graph rendered successfully')
  })

  // 默认路由
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })

  app.listen(port, () => {
    console.log(`Web project is running at http://localhost:${port}`)
  })
}

export const renderGraph = (graphData: any): void => {
  console.log('Rendering graph with data:', graphData)
  // 这里可以调用实际的渲染逻辑，例如将数据发送到前端页面
}
