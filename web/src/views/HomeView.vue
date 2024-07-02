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
import  { type DepGraphNode}  from '../types/graph'


const dependencyData = ref<DepGraphNode[]>([])

// 获取依赖关系图数据
const getDependencyGraph = async (): Promise<DepGraphNode[]> => {
  const response = await getDepGraphNode()
  dependencyData.value = response.data
  return response.data
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
