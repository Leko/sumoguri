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

const cmd = Yargs.options({
  outDir: {
    alias: 'o',
    description: 'Output directory.',
    default: '__screenshots__',
  },
  flat: {
    alias: 'f',
    type: 'boolean',
    description: 'Flatten output filename.',
    default: false,
  },
  include: {
    alias: 'i',
    description: 'Including paths.',
    type: 'array',
    default: [],
  },
  exclude: {
    alias: 'e',
    description: 'Excluding paths.',
    type: 'array',
    default: [],
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
  prefersColorSchemes: {
    description: 'Specify prefers-color-scheme.',
    default: 'light',
    coerce: (args: string) => {
      return args.split(',').map((arg) => arg.trim())
    },
  },
  disableCssAnimation: {
    description: 'Disable CSS animation and transition.',
    type: 'boolean',
    default: true,
  },
})

export const parse = cmd.parse.bind(cmd)
