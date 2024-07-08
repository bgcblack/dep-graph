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
import { getDepGraphNode } from '../api/graph'
import { type DepGraphNode } from '../types/graph'
import { useGraphStore } from '../stores/graph'

const dependencyData = ref<DepGraphNode[]>([])

// 获取依赖关系图数据
const getDependencyGraph = async (): Promise<DepGraphNode[]> => {
  // const response = await getDepGraphNode()
  const response = useGraphStore()
  dependencyData.value = response.graphData
  return dependencyData.value
}

onMounted(() => {
  getDependencyGraph()
})
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
}
</style>
