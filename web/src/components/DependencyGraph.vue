<template>
  <div ref="graph"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import * as d3 from 'd3'

interface DepGraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

interface Link extends d3.SimulationLinkDatum<DepGraphNode> {
  source: DepGraphNode
  target: DepGraphNode
}

const props = defineProps<{
  data: DepGraphNode[]
}>()

const graph = ref<HTMLElement | null>(null)

const createGraph = (data: DepGraphNode[]) => {
  const width = 800
  const height = 600

  const svg = d3
    .select(graph.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const simulation = d3
    .forceSimulation<DepGraphNode>()
    .force(
      'link',
      d3.forceLink<DepGraphNode, Link>().id((d: DepGraphNode) => d.id),
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const flattenDependencies = (node: DepGraphNode): DepGraphNode[] => {
    return [
      node,
      ...node.dependencies.flatMap((dep) => flattenDependencies(dep)),
    ]
  }

  const nodes = data.flatMap((d: DepGraphNode) => flattenDependencies(d))
  nodes.forEach((node) => {
    node.id = `${node.name}@${node.version}`
  })

  const links: Link[] = nodes.flatMap((node) =>
    node.dependencies.map((dep) => ({
      source: node,
      target: dep,
    })),
  )

  const link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', 1)

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .call(
      d3
        .drag<SVGCircleElement, DepGraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }),
    )

  node.append('title').text((d) => d.id)

  simulation.nodes(nodes).on('tick', () => {
    link
      .attr('x1', (d: any) => (d.source.x !== undefined ? d.source.x : 0))
      .attr('y1', (d: any) => (d.source.y !== undefined ? d.source.y : 0))
      .attr('x2', (d: any) => (d.target.x !== undefined ? d.target.x : 0))
      .attr('y2', (d: any) => (d.target.y !== undefined ? d.target.y : 0))

    node
      .attr('cx', (d: any) => (d.x !== undefined ? d.x : 0))
      .attr('cy', (d: any) => (d.y !== undefined ? d.y : 0))
  })
  simulation.force<d3.ForceLink<DepGraphNode, Link>>('link')!.links(links)
}
watchEffect(() => {
  // createGraph(props.data)
})

onMounted(() => {
  createGraph(props.data)
})
</script>

<style scoped>
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}
</style>
