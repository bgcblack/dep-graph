import api from './server'
import type { DepGraph } from '../types/graph'
export const getDepGraphNode = async () => {
  const res = await api.get<DepGraph>('/api/dependencies')
  return res
}
export const test = async () => {
  const res = await api.get<any>('/api/test')
  return res
}
