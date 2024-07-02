import * as d3 from 'd3'

export interface DepGraphNode {
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

export interface NodeItem extends d3.SimulationNodeDatum {
  id: string
}

export interface LinkItem extends d3.SimulationLinkDatum<NodeItem> {
  source: string
  target: string
}

export interface GraphData {
  nodes: NodeItem[]
  links: LinkItem[]
}