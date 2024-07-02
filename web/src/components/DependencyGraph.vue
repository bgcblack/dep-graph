<template>
  <div ref="graph"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import * as d3 from 'd3'
import { transformData } from '../utils/utils'
import { type DepGraphNode, type NodeItem, type LinkItem , type GraphData} from '../types/graph'

const props = defineProps<{ data: DepGraphNode[] }>()

const graph = ref<HTMLElement | null>(null)
let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>

const createGraph = (data: GraphData) => {
  const width = 800
  const height = 600

  // 清理旧图表
  d3.select(graph.value).selectAll('*').remove()

  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', (d3: any) => zoomed(d3))

  const svg = d3
    .select(graph.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(zoom as d3.ZoomBehavior<any, any>)

  simulation = d3
    .forceSimulation(data.nodes as any)
    .force(
      'link',
      d3.forceLink(data.links).id((d: any) => d.id),
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', '#999')

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#69b3a2')
    .call(drag)

  node.append('title').text((d: any) => d.id)

  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
  })

  function zoomed(event: any) {
    const transform = event.transform
    link.attr('transform', transform)
    node.attr('transform', transform)
  }
}

const drag = () => {
  const dragstarted = (event: any) => {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  const dragged = (event: any) => {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  const dragended = (event: any) => {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

onMounted(() => {
  const graphData = transformData(props.data)
  createGraph(graphData)
})

watchEffect(() => {
  if (props.data) {
    const graphData = transformData(props.data)
    createGraph(graphData)
  }
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
