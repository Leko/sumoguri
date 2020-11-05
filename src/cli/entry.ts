import fs from 'fs'
import path from 'path'
import { CLIOptions } from './options'
import { prettify } from '../lib/prettify'
import { filenamify } from '../lib/filename'
import { init } from '../logger'
import { Matrix } from '../Matrix'
import { QueueItem } from '../QueueItem'
import { TaggedWorkerPool } from '../TaggedWorkerPool'

export async function main(options: CLIOptions) {
  const log = init()
  log(options)

  const {
    _: [entrypoint],
    outDir,
  } = options
  if (!entrypoint) {
    throw new Error('The command line argument `entrypoint` must be required')
  }

  const url = new URL(entrypoint)
  const host = url.host
  const pool = new TaggedWorkerPool()
  let open: QueueItem[] = Matrix.build(url, options)
  let depth = 0
  const visited: {
    [locale: string]: {
      [viewport: string]: {
        [prefersColorScheme: string]: {
          [pathname: string]: true
        }
      }
    }
  } = {}
  const artifacts: { item: QueueItem; binary: Buffer }[] = []

  while (open.length) {
    depth++
    const promises: Promise<QueueItem[] | null>[] = open.map((item) => {
      const viewport = item.viewport.join('x')
      visited[item.locale] = visited[item.locale] || {}
      visited[item.locale][viewport] = visited[item.locale][viewport] || {}
      visited[item.locale][viewport][item.prefersColorScheme] =
        visited[item.locale][viewport][item.prefersColorScheme] || {}
      const localVisited =
        visited[item.locale][viewport][item.prefersColorScheme]
      const pathname = prettify(item.url)
      if (localVisited[pathname]) {
        log(
          `visited [${item.locale}][${viewport}][${item.prefersColorScheme}] ${item.url.href}`
        )
        return Promise.resolve(null)
      }
      log(
        `visit [${item.locale}][${viewport}][${item.prefersColorScheme}] ${item.url.href}`
      )
      localVisited[pathname] = true
      return pool
        .run(item, { disableCssAnimation: options.disableCssAnimation })
        .then(({ binary, hrefs }) => {
          artifacts.push({ item, binary })
          if (depth > options.depth) {
            return []
          }
          const nextUrls: URL[] = hrefs
            .filter(Boolean)
            .map((url) => new URL(url))

          return nextUrls
            .filter((url) => url.host === host)
            .map((url) => new QueueItem({ ...item, url }))
        })
    })
    open = (await Promise.all(promises)).flat().filter(Boolean)
  }
  for (let artifact of artifacts) {
    const { item, binary } = artifact
    const filePath = path.join(outDir, filenamify(item, options.flat))
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, binary)
    console.log(`save ${filePath}`)
  }

  await pool.close()
}
