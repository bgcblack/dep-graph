import express from 'express'
import path from 'path'
import open from 'open'

let app: express.Application

export const startWebProject = (data: any): void => {
  app = express()
  const port = 3000

  // 设置静态文件目录为Vue构建后的dist目录
  const publicDir = path.join(__dirname, '../../dist')

  console.log(publicDir, 'publicDir')

  app.use(express.static(publicDir))

  app.use(express.json())

  // 提供一个API接口获取graphData
  app.get('/api/graph-data', (req, res) => {
    res.json(data)
  })

  // 默认路由
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })

  app.listen(port, () => {
    console.log(`Web project is running at http://localhost:${port}`)
  })
  open(`http://localhost:${port}`)
}

export const renderGraph = (graphData: any): void => {
  console.log('Rendering graph with data:', graphData)
  // 这里可以调用实际的渲染逻辑，例如将数据发送到前端页面
}
