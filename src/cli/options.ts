import Yargs from 'yargs'
import { Viewport } from '../Viewport'

export type CLIOptions = {
  _: string[]
  outDir: string
  parallel: number
  flat: boolean
  include: string[]
  exclude: string[]
  depth: number
  viewports: Viewport[]
  locales: string[]
  prefersColorSchemes: string[]
  disableCssAnimation: boolean
}

export const cmd = Yargs.scriptName('sumoguri')
  .usage('Usage: $0 <entry_url> [options]')
  .example('$0 https://example.com', 'Run with default settings')
  .example(
    '$0 https://example.com --viewports 1680x1050,828x1792',
    'Test in multiple viewports'
  )
  .example(
    '$0 https://example.com --locales en-US,ja-JP',
    'Test in multiple locales'
  )
  .example(
    '$0 https://example.com --prefers-color-schemes=light,dark',
    'Test in multiple color schemes'
  )
  .example('$0 https://example.com --depth 0', 'Do not traverse links')
  .epilog('repository: https://github.com/Leko/sumoguri')
  .options({
    outDir: {
      alias: 'o',
      description: 'Output directory.',
      default: '__screenshots__',
    },
    flat: {
      alias: 'f',
      type: 'boolean',
      description: 'Flatten output file structure.',
      default: false,
    },
    depth: {
      alias: 'd',
      description: 'Depth of traversing.',
      default: 100,
      type: 'number',
    },
    viewports: {
      alias: 'V',
      description: 'Viewports.',
      default: '800x600',
      coerce: (args: string) => {
        return args
          .split(',')
          .map((arg) => arg.split('x').map((n) => parseInt(n, 10)))
      },
    },
    locales: {
      alias: 'l',
      description: 'Locales.',
      default: 'en-US',
      coerce: (args: string) => {
        return args.split(',').map((arg) => arg.trim())
      },
    },
    'prefers-color-schemes': {
      description: 'Specify prefers-color-scheme.',
      default: 'light',
      coerce: (args: string) => {
        return args.split(',').map((arg) => arg.trim())
      },
    },
    'disable-css-animation': {
      description: 'Disable CSS animation and transition.',
      type: 'boolean',
      default: true,
    },
  })

export const parse = cmd.parse.bind(cmd)
