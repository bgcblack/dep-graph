import path from 'path'
import {
  readWantedLockfile,
  type PackageSnapshot,
  type Lockfile,
} from '@pnpm/lockfile-file'

// 定义依赖类型
type DepTypes = 'dev' | 'prod' | 'peer'

// 定义依赖关系节点
interface DepGraphNode {
  name: string
  version: string
  external: boolean
  dependencies: DepGraphNode[]
}

// 定义依赖关系
type DepGraph = DepGraphNode[]

const parseFromSpecify = (specifier: string) => {
  const REGEXP = /(@?[\w\-\d\.]+(\/[\w\-\d\.]+)?)@?([\d\w\.\-]+)?/
  if (!REGEXP.test(specifier)) {
    throw new Error(`Can not parse this key: ${specifier}`)
  }
  const [, name, , version] = REGEXP.exec(specifier)!

  return {
    name,
    specifier,
    localVersion: version, // 使用version代替localVersion，因为我们只捕获了一个版本号
    version, // 并且直接提供version字段
  }
}

// 获取依赖关系节点
const getDepGraphNode = (
  name: string,
  version: string,
  depType: DepTypes,
  packages: Record<string, PackageSnapshot>,
  currentDepth: number,
  maxDepth: number,
  packageKey: string
): DepGraphNode => {
  const packageInfo = packages[packageKey] // 获取包信息

  if (!packageInfo) {
    return {
      name,
      version,
      external: true,
      dependencies: [],
    }
  }

  // 获取包的依赖列表，并确保递归深度限制
  const deps: DepGraphNode[] =
    currentDepth < maxDepth
      ? Object.entries(packageInfo.dependencies || {}).map(
          ([depName, depVersion]) => {
            const { name, version } = parseFromSpecify(depName)
            return getDepGraphNode(
              name,
              depVersion as string,
              depType,
              packages,
              currentDepth + 1,
              maxDepth,
              depName + '@' + depVersion
            )
          }
        )
      : []

  return {
    name,
    version,
    external: !!packageInfo.resolution && 'type' in packageInfo.resolution, // 判断是否为外部依赖
    dependencies: deps,
  }
}

// 生成依赖关系
const generateDepGraph = async (
  filePath: string,
  maxDepth: number
): Promise<DepGraph> => {
  const lockfile: Lockfile | null = await readWantedLockfile(
    path.dirname(filePath),
    {
      ignoreIncompatible: false,
    }
  )
  if (!lockfile) throw new Error('Failed to read lockfile')

  const packages = lockfile.packages as Record<string, PackageSnapshot>

  if (!packages) {
    throw new Error('No packages found in lockfile')
  }

  const depGraph: DepGraph = Object.entries(packages).map((keys) => {
    const [packageKey, packageInfo] = keys
    const { name, version } = parseFromSpecify(packageKey)
    const depType: DepTypes =
      'peerDependencies' in packageInfo
        ? 'peer'
        : 'devDependencies' in packageInfo
        ? 'dev'
        : 'prod' // 确定依赖类型

    return getDepGraphNode(
      name,
      version,
      depType,
      packages,
      0,
      maxDepth,
      packageKey
    ) // 获取依赖关系节点并控制递归深度
  })

  return depGraph
}

export { generateDepGraph }
