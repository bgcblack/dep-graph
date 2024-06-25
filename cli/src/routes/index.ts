import Router from 'koa-router'
import { type Context } from 'koa'
import { getDependenciesForYarm } from './dependencies'

const router = new Router()
router.get('/test', async (ctx: Context) => {
  ctx.body = {
    code: 0,
    message: 'testData',
  }
})

router.get('/dependencies', getDependenciesForYarm)

export default router
