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

const dependencyData = ref<DepGraphNode[]>([
  {
    name: "Node 1",
    version: "1.0.0",
    external: false,
    dependencies: [
      {
        name: "Node 2",
        version: "1.0.0",
        external: false,
        dependencies: []
      },
      {
        name: "Node 3",
        version: "1.0.0",
        external: false,
        dependencies: []
      }
    ]
  }
])

test()
// 异步函数，获取依赖关系图数据
const getDependencyGraph = async (): Promise<DepGraphNode[]> => {
  const response = await getDepGraphNode()

  return response.data
}

onMounted(() => {
  // 确保组件挂载后再进行渲染
  // getDependencyGraph().then((res) => {
  //   dependencyData.value = res
  // })
})
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
}
</style>
