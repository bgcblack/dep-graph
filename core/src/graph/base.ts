import { type DepGraph } from '../types/index'

export abstract class BaseDepGraph {
  abstract parse(): Promise<DepGraph>
}
