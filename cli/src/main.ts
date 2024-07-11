import { Command } from 'commander'
import { doAnalysis } from './analysis'

export const main = async () => {
  const program = new Command()

  program.name('dep-cli').usage('<command> [options]').version('1.0.0')

  program
    .command('ana <pnpm-lock-filename>')
    .description('分析模块依赖关系，目前仅支持 pnpm lock file')
    .option('--depth <number>', '分析深度', '5') // 添加 depth 选项，默认值为 5
    .action(async (filename: string, options: { depth: string }) => {
      const depth = parseInt(options.depth, 10) //十进制转换
      await doAnalysis(filename, depth)
    })

  program.parse(process.argv)
}
