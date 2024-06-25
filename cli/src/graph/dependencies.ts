import { promises as fs } from 'fs'
import path from 'path'
import { readWantedLockfile } from '@pnpm/lockfile-file'
// 定义依赖类型
type DepTypes = 'dev' | 'prod' | 'peer'

// 定义依赖关系节点
interface DepGraphNode {
  name: string // 包名
  external: boolean // 是否为外部依赖
  dependencies: { name: string; version: string; depType: DepTypes }[] // 包依赖列表
}

// 定义依赖关系图
type DepGraph = DepGraphNode[]

// 获取依赖关系节点
const getDepGraphNode = (
  name: string,
  version: string,
  depType: DepTypes,
  dependencies: any
): DepGraphNode => {
  console.log(dependencies, '==========================1')
  const packageKey = `${name}@${version}` // 拼接包名和版本号
  console.log(packageKey, '==========================2')
  const packageInfo = dependencies[packageKey] // 获取包信息

  // 获取包的依赖列表，确保版本是字符串类型
  const deps = Object.entries(packageInfo.dependencies || {}).map(
    ([depName, depVersion]) => ({
      name: depName,
      version: depVersion as string,
      depType: depType,
    })
  )

  return {
    name: name,
    external: packageInfo.resolution.type === 'tarball', // 判断是否为外部依赖
    dependencies: deps,
  }
}

// 生成依赖关系图
const generateDepGraph = async (filePath: string): Promise<DepGraph> => {
  const lockfile = await readWantedLockfile(path.dirname(filePath), {
    ignoreIncompatible: false,
  })
  if (!lockfile) throw new Error('Failed to read lockfile')

  const { packages } = lockfile

  // 生成依赖关系图
  const depGraph: DepGraph = Object.entries(packages!).map(
    ([packageKey, packageInfo]: [string, any]) => {
      const [name, version] = packageKey.split('/')
      const depType: DepTypes = packageInfo.dev
        ? 'dev'
        : packageInfo.peer
        ? 'peer'
        : 'prod' // 确定依赖类型

      return getDepGraphNode(name, version, depType, packages) // 获取依赖关系节点
    }
  )

  return depGraph
}

export { generateDepGraph }
