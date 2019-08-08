import fs from "fs";
import path from "path";
import { CLIOptions } from "./options";
import { prettify } from "../lib/prettify";
import { escape } from "../lib/escape";
import { init } from "../logger";
import { Matrix } from "../Matrix";
import { QueueItem } from "../QueueItem";
import { TaggedWorkerPool } from "../TaggedWorkerPool";

export async function main(options: CLIOptions) {
  const log = init(options);
  log(options);

  const {
    _: [entrypoint],
    outDir
  } = options;
  if (!entrypoint) {
    throw new Error("The command line argument `entrypoint` must be required");
  }

  const url = new URL(entrypoint);
  const host = url.host;
  const pool = new TaggedWorkerPool(options);
  let open: QueueItem[] = Matrix.build(url, options);
  const visited: {
    [locale: string]: { [viewport: string]: { [pathname: string]: true } };
  } = {};
  const artifacts: { item: QueueItem; binary: Buffer }[] = [];

  while (open.length) {
    const promises: Promise<QueueItem[] | null>[] = open.map(item => {
      const viewport = item.viewport.join("x");
      visited[item.locale] = visited[item.locale] || {};
      visited[item.locale][viewport] = visited[item.locale][viewport] || {};
      const localVisited = visited[item.locale][viewport];
      const pathname = prettify(item.url);
      if (localVisited[pathname]) {
        log(`visited [${item.locale}][${viewport}] ${item.url.href}`);
        return Promise.resolve(null);
      }
      log(`visit [${item.locale}][${viewport}] ${item.url.href}`);
      localVisited[pathname] = true;
      return pool
        .run({
          locale: item.locale,
          viewport: item.viewport,
          url: item.url
        })
        .then(({ binary, hrefs }) => {
          artifacts.push({ item, binary });
          const nextUrls: URL[] = hrefs
            .filter(Boolean)
            .map(url => new URL(url));

          return nextUrls
            .filter(url => url.host === host)
            .map(url => new QueueItem({ ...item, url }));
        });
    });
    open = (await Promise.all(promises)).flat().filter(Boolean);
  }
  for (let artifact of artifacts) {
    const {
      item: { locale, viewport, url },
      binary
    } = artifact;
    const filePath = options.flat
      ? path.join(
          outDir,
          `${locale}-${viewport.join("x")}-${escape(url).replace(/\//g, "-") +
            ".png"}`
        )
      : path.join(outDir, locale, viewport.join("x"), escape(url) + ".png");
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, binary);
    console.log(`save ${filePath}`);
  }

  await pool.close();
}
