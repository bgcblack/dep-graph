import { Command } from 'commander'
import { doAnalysis } from './analysis'

export const main = async () => {
  const program = new Command()

  program.name('xx-cli').usage('<command> [options]').version('1.0.0')

  program
    .command('ana <pnpm-lock-filename>')
    .description('分析模块依赖关系，目前仅支持 pnpm lock file')
    .action(async (filename: string) => {
      await doAnalysis(filename)
    })

  program.parse(process.argv)
}
