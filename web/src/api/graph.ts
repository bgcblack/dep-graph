import api from './server'
import { type GraphData } from '../types/graph'
export const getDepGraphNode = async () => {
  const res = await api.get<GraphData>('/api/dependencies')
  return res
}
