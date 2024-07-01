<template>
  <div ref="graph"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

interface DepGraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
  parentId?: string
}

interface Link extends d3.SimulationLinkDatum<DepGraphNode> {
  source: string | DepGraphNode
  target: string | DepGraphNode
}

const props = defineProps<{
  data: DepGraphNode[]
}>()

const graph = ref<HTMLElement | null>(null)

const createGraph = (data: DepGraphNode[]) => {
  const width = 800
  const height = 600

  d3.select(graph.value).selectAll('*').remove()

  const svg = d3
    .select(graph.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const simulation = d3
    .forceSimulation<DepGraphNode>()
    .force('link', d3.forceLink<DepGraphNode, Link>().id((d) => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))

  const flattenDependencies = (node: DepGraphNode, parentId: string | null = null): DepGraphNode[] => {
    const nodes: DepGraphNode[] = [{ ...node, parentId }]
    node.dependencies.forEach((dep) => {
      nodes.push(...flattenDependencies(dep, node.id))
    })
    return nodes
  }

  const nodes = data.flatMap((d) => flattenDependencies(d))
  console.log("Flattened Nodes:", nodes)

  const links: Link[] = nodes.flatMap((node) =>
    node.dependencies.map((dep) => ({
      source: node.id,
      target: dep.id
    }))
  )
  console.log("Links:", links)

  const link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#999')

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', 'blue')
    .call(
      d3.drag<SVGCircleElement, DepGraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = event.x
          d.fy = event.y
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
      .attr('x1', (d: any) => (d.source as DepGraphNode).x ?? 0)
      .attr('y1', (d: any) => (d.source as DepGraphNode).y ?? 0)
      .attr('x2', (d: any) => (d.target as DepGraphNode).x ?? 0)
      .attr('y2', (d: any) => (d.target as DepGraphNode).y ?? 0)

    node.attr('cx', (d: any) => d.x ?? 0).attr('cy', (d: any) => d.y ?? 0)
  })

  ;(simulation.force<d3.ForceLink<DepGraphNode, Link>>('link')!).links(links)
}

onMounted(() => {
  createGraph(props.data)
})

watch(
  () => props.data,
  (newData) => {
    createGraph(newData)
  },
  { deep: true }
)
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
 