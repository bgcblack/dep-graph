<template>
  <div class="dependency-analyzer">
    <el-input v-model="packageName" placeholder="输入依赖包名称"></el-input>
    <el-button type="primary" @click="fetchDependencyGraph"
      >查询依赖关系</el-button
    >
    <div ref="graphContainer" class="dependency-graph"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios' // 使用 axios 发送 HTTP 请求

export default defineComponent({
  name: 'DependencyAnalyzer',
  setup() {
    const packageName = ref('')
    const dependencyData = ref(null)
    const error = ref(null)
    const graphContainer = ref(null)

    const fetchDependencyGraph = async () => {
      try {
        const response = await axios.post('/api/analyze-dependencies', {
          packageName: packageName.value,
        })
        dependencyData.value = response.data
        renderGraph()
      } catch (error) {
        error.value = '获取依赖数据时出错'
        console.error('Error fetching dependency data:', error)
      }
    }

    const renderGraph = () => {
      if (dependencyData.value) {
        // 在这里使用 D3.js 或其他可视化库渲染图表
        // 示例代码：
        // const graph = new Graph(graphContainer.value, dependencyData.value);
        // graph.render();
      }
    }

    return {
      packageName,
      fetchDependencyGraph,
      graphContainer,
    }
  },
})
</script>

<style scoped>
.dependency-analyzer {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.dependency-graph {
  margin-top: 20px;
  height: 400px;
  border: 1px solid #ccc;
}
</style>
