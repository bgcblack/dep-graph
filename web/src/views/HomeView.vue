<template>
  <el-container>
    <el-header>
      <h1>Dependency Graph</h1>
    </el-header>
    <el-main>
      <DependencyGraph :data="dependencyData" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import DependencyGraph from '@/components/DependencyGraph.vue'
import 'element-plus/dist/index.css'
import { ref, onMounted } from 'vue'
import { getDepGraphNode, test } from '../api/graph'

interface DepGraphNode {
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

const dependencyData = ref<DepGraphNode[]>([])

test()
// 异步函数，获取依赖关系图数据
const getDependencyGraph = async (): Promise<DepGraphNode[]> => {
  const response = await getDepGraphNode()
  dependencyData.value = response.data
  return response.data
}

onMounted(() => {
  // 确保组件挂载后再进行渲染
  getDependencyGraph()
})
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
}
</style>
