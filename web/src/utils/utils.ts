interface Dependency {
  name: string
  version: string
  external: boolean
  dependencies: Dependency[]
}

interface NodeItem {
  id: string
}

interface LinkItem {
  source: string
  target: string
}

interface GraphData {
  nodes: NodeItem[]
  links: LinkItem[]
}

// 这个 data 是啥玩意儿？
const data: Dependency[] = [
  {
    name: '@cspotcode/source-map-support',
    version: '0.8.1',
    external: false,
    dependencies: [
      {
        name: '@jridgewell/trace-mapping',
        version: '0.3.9',
        external: false,
        dependencies: [
          {
            name: '@jridgewell/resolve-uri',
            version: '3.1.2',
            external: false,
            dependencies: [],
          },
          {
            name: '@jridgewell/sourcemap-codec',
            version: '1.4.15',
            external: false,
            dependencies: [],
          },
        ],
      },
    ],
  },
  {
    name: '@hapi/bourne',
    version: '3.0.0',
    external: false,
    dependencies: [],
  },
  {
    name: '@jridgewell/trace-mapping',
    version: '0.3.9',
    external: false,
    dependencies: [
      {
        name: '@jridgewell/resolve-uri',
        version: '3.1.2',
        external: false,
        dependencies: [],
      },
      {
        name: '@jridgewell/sourcemap-codec',
        version: '1.4.15',
        external: false,
        dependencies: [],
      },
    ],
  },
  {
    name: '@pnpm/constants',
    version: '8.0.0',
    external: false,
    dependencies: [],
  },
  {
    name: '@pnpm/core-loggers',
    version: '10.0.2',
    external: false,
    dependencies: [
      {
        name: '@pnpm/logger',
        version: '5.0.0',
        external: false,
        dependencies: [
          {
            name: 'bole',
            version: '5.0.13',
            external: false,
            dependencies: [
              {
                name: 'fast-safe-stringify',
                version: '2.1.1',
                external: false,
                dependencies: [],
              },
              {
                name: 'individual',
                version: '3.0.0',
                external: false,
                dependencies: [],
              },
            ],
          },
          {
            name: 'ndjson',
            version: '2.0.0',
            external: false,
            dependencies: [
              {
                name: 'json-stringify-safe',
                version: '5.0.1',
                external: false,
                dependencies: [],
              },
              {
                name: 'minimist',
                version: '1.2.8',
                external: false,
                dependencies: [],
              },
              {
                name: 'readable-stream',
                version: '3.6.2',
                external: false,
                dependencies: [
                  {
                    name: 'inherits',
                    version: '2.0.4',
                    external: false,
                    dependencies: [],
                  },
                  {
                    name: 'string_decoder',
                    version: '1.3.0',
                    external: false,
                    dependencies: [
                      {
                        name: 'safe-buffer',
                        version: '5.2.1',
                        external: false,
                        dependencies: [],
                      },
                    ],
                  },
                  {
                    name: 'util-deprecate',
                    version: '1.0.2',
                    external: false,
                    dependencies: [],
                  },
                ],
              },
              {
                name: 'split2',
                version: '3.2.2',
                external: false,
                dependencies: [
                  {
                    name: 'readable-stream',
                    version: '3.6.2',
                    external: false,
                    dependencies: [
                      {
                        name: 'inherits',
                        version: '2.0.4',
                        external: false,
                        dependencies: [],
                      },
                      {
                        name: 'string_decoder',
                        version: '1.3.0',
                        external: false,
                        dependencies: [],
                      },
                      {
                        name: 'util-deprecate',
                        version: '1.0.2',
                        external: false,
                        dependencies: [],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'through2',
                version: '4.0.2',
                external: false,
                dependencies: [
                  {
                    name: 'readable-stream',
                    version: '3.6.2',
                    external: false,
                    dependencies: [
                      {
                        name: 'inherits',
                        version: '2.0.4',
                        external: false,
                        dependencies: [],
                      },
                      {
                        name: 'string_decoder',
                        version: '1.3.0',
                        external: false,
                        dependencies: [],
                      },
                      {
                        name: 'util-deprecate',
                        version: '1.0.2',
                        external: false,
                        dependencies: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '@pnpm/types',
        version: '10.1.1',
        external: false,
        dependencies: [],
      },
    ],
  },
]

export const transformData = (data: Dependency[]): GraphData => {
  const nodes: NodeItem[] = []
  const links: LinkItem[] = []
  const nodeSet: Set<string> = new Set()

  function addNode(name: string) {
    if (!nodeSet.has(name)) {
      nodes.push({ id: name })
      nodeSet.add(name)
    }
  }

  function traverse(dependency: Dependency, parentName: string | null) {
    addNode(dependency.name)
    if (parentName) {
      links.push({ source: parentName, target: dependency.name })
    }
    dependency.dependencies.forEach((child) => traverse(child, dependency.name))
  }

  data.forEach((dependency) => traverse(dependency, null))

  return { nodes, links }
}

// const graphData = transformData(data)
// console.log(graphData, 'graphData')
