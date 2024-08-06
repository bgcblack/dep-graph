import Koa from 'koa'
import router from './routes/index'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods()) // 允许的 HTTP 方法

// port 最好别写死，最好能做成动态生成的
// 以及，这里是一个 node server 的话，为啥 web/src/server 那边又是一个 node server？
const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`) // 启动服务器
})
