import fs from "fs";
import path from "path";
import { devices } from "playwright";
import { CLIOptions } from "./options";
import { prettify } from "../lib/prettify";
import { filenamify } from "../lib/filename";
import { init } from "../logger";
import { Matrix } from "../Matrix";
import { QueueItem } from "../QueueItem";
import { TaggedWorkerPool } from "../TaggedWorkerPool";

export async function main(options: CLIOptions) {
  const log = init(options);
  log(options);

  const {
    _: [entrypoint],
    "list-devices": listDevicesAndExit,
    outDir
  } = options;
  if (listDevicesAndExit) {
    for (let name in devices) {
      if (/^\d+$/.test(name)) {
        continue;
      }

      const {
        viewport: { width, height, deviceScaleFactor }
      } = devices[name];
      console.log(name, `(${width}x${height}@${deviceScaleFactor})`);
    }
    process.exit(0);
  }

  if (!entrypoint) {
    throw new Error("The command line argument `entrypoint` must be required");
  }

  const url = new URL(entrypoint);
  const host = url.host;
  const pool = new TaggedWorkerPool();
  let open: QueueItem[] = Matrix.build(url, options);
  const visited: {
    [browserName: string]: {
      [locale: string]: { [viewport: string]: { [pathname: string]: true } };
    };
  } = {};
  const artifacts: { item: QueueItem; binary: Buffer }[] = [];
  while (open.length) {
    const promises: Promise<QueueItem[] | null>[] = open.map(item => {
      const {
        locale,
        browserName,
        url: { href }
      } = item;
      const dimention = item.getDimention();
      visited[browserName] = visited[browserName] || {};
      visited[browserName][locale] = visited[browserName][locale] || {};
      visited[browserName][locale][dimention] =
        visited[browserName][locale][dimention] || {};
      const localVisited = visited[browserName][locale][dimention];
      const pathname = prettify(item.url);
      if (localVisited[pathname]) {
        log(`visited [${browserName}][${locale}][${dimention}] ${href}`);
        return Promise.resolve(null);
      }
      log(`visit [${browserName}][${locale}][${dimention}] ${href}`);
      localVisited[pathname] = true;
      return pool.run(item).then(({ binary, hrefs }) => {
        artifacts.push({ item, binary });
        const nextUrls: URL[] = hrefs.filter(Boolean).map(url => new URL(url));

        return nextUrls
          .filter(url => url.host === host)
          .map(url => new QueueItem({ ...item, url }));
      });
    });
    open = (await Promise.all(promises)).flat().filter(Boolean);
  }
  for (let artifact of artifacts) {
    const { item, binary } = artifact;
    const filePath = path.join(outDir, filenamify(item, options.flat));
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, binary);
    console.log(`save ${filePath}`);
  }

  await pool.close();
}
