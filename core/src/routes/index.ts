import Router from 'koa-router'
import { getDependenciesForPnpm } from './dependencies'

const router = new Router()

router.get('/dependencies', getDependenciesForPnpm)

export default router
