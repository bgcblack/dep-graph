import { defineStore } from 'pinia'
import { type DepGraphNode } from '../types/graph'
import { getDepGraphNode } from '../api/graph'

export const useGraphStore = defineStore('graph', {
  state: () => ({
    graphData: [] as DepGraphNode[],
  }),
  actions: {
    async getGraphData() {
      try {
        const response = await getDepGraphNode()
        const data = await response.json()
        this.graphData = data
      } catch (error) {
        console.error('Failed to fetch graph data:', error)
      }
    },
  },
})
