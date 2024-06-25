<template>
  <el-card class="dependency-graph-card">
    <!-- 定义一个 SVG 元素用于渲染依赖关系图 -->
    <svg ref="graph"></svg>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import 'element-plus/dist/index.css'
import { getDepGraphNode, test } from '../api/graph'
// 定义依赖关系节点的接口
interface DepGraphNode {
  name: string
  external: boolean
  dependencies: { name: string; version: string; depType: string }[]
}

// 定义扩展节点类型以包含 D3 模拟的属性
interface SimulationNodeDatum extends d3.SimulationNodeDatum {
  id: string
  fx?: number | null
  fy?: number | null
}

const graph = ref<SVGSVGElement | null>(null) // 获取 SVG 元素的引用
test()
// 异步函数，获取依赖关系图数据
const getDependencyGraph = async (): Promise<DepGraphNode[]> => {
  const response = await getDepGraphNode()
  return response.json()
}

// 使用 D3.js 渲染依赖关系图
const renderGraph = (data: DepGraphNode[]) => {
  if (!graph.value) return

  const width = 800
  const height = 600

  const svg = d3.select(graph.value).attr('width', width).attr('height', height)

  const nodes: SimulationNodeDatum[] = data.map((d) => ({ id: d.name }))

  // 使用 map 和 reduce 代替 flatMap
  const links = data
    .map((d) =>
      d.dependencies.map((dep) => ({ source: d.name, target: dep.name })),
    )
    .reduce((acc, val) => acc.concat(val), [])

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => (d as any).id),
    )
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))

  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999')

  const link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#arrow)')

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
      d3
        .drag<SVGCircleElement, SimulationNodeDatum>()
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

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => (d as any).source.x)
      .attr('y1', (d) => (d as any).source.y)
      .attr('x2', (d) => (d as any).target.x)
      .attr('y2', (d) => (d as any).target.y)

    node.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!)
  })
}

// 组件挂载后，获取依赖数据并渲染图表
onMounted(async () => {
  const data = await getDependencyGraph()
  renderGraph(data)
})
</script>

<style scoped>
.dependency-graph-card {
  width: 100%;
  height: 600px;
  overflow: hidden;
}
</style>
