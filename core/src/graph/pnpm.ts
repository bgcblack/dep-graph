import path from 'path'
import {
  readWantedLockfile,
  type PackageSnapshot,
  type Lockfile,
} from '@pnpm/lockfile-file'
import { type DepTypes, type DepGraphNode, type DepGraph } from '../types/index'
import { BaseDepGraph } from './base'

const parseFromSpecify = (specifier: string) => {
  const REGEXP = /(@?[\w\-\d\.]+(\/[\w\-\d\.]+)?)@?([\d\w\.\-]+)?/
  if (!REGEXP.test(specifier)) {
    throw new Error(`Can not parse this key: ${specifier}`)
  }
  const [, name, , version] = REGEXP.exec(specifier)!

  return {
    name,
    specifier,
    localVersion: version,
    version,
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
            const { name } = parseFromSpecify(depName)
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

// 定义继承自 BaseDepGraph 的类
export class PnpmDepGraph extends BaseDepGraph {
  private filePath: string
  private maxDepth: number

  constructor(filePath: string, maxDepth: number) {
    super()
    this.filePath = filePath
    this.maxDepth = maxDepth
  }

  async parse(): Promise<DepGraph> {
    const lockfile: Lockfile | null = await readWantedLockfile(
      path.dirname(this.filePath),
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
          : 'prod'

      return getDepGraphNode(
        name,
        version,
        depType,
        packages,
        0,
        this.maxDepth,
        packageKey
      ) // 获取依赖关系节点并控制递归深度
    })

    return depGraph
  }
}
