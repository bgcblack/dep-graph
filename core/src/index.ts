import Koa from 'koa'
import router from './routes/index'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods()) // 允许的 HTTP 方法

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`) // 启动服务器
})
