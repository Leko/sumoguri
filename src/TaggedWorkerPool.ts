import Bottleneck from "bottleneck";
import { Viewport } from "./Viewport";
import { Worker, Result } from "./Worker";

export class TaggedWorkerPool {
  private readonly limiter: Bottleneck.Group;
  private readonly states = new Map<string, Worker>();

  static getTag({
    locale,
    viewport
  }: {
    locale: string;
    viewport: Viewport;
  }): string {
    return [locale, viewport.join("x")].join("_");
  }

  constructor(options: { parallel: number }) {
    this.limiter = new Bottleneck.Group({
      maxConcurrent: options.parallel
    });
  }

  async run({
    locale,
    viewport,
    url
  }: {
    locale: string;
    viewport: Viewport;
    url: URL;
  }): Promise<Result> {
    const runinternal = async (retry = 0): Promise<Result> => {
      const worker = await this.getOrInit({ locale, viewport });
      try {
        return await worker.run(url);
      } catch (e) {
        if (retry < 3 && e.message.includes("net::ERR_ABORTED")) {
          await new Promise(resolve => setTimeout(resolve, 50));
          return runinternal(retry + 1);
        } else {
          throw e;
        }
      }
    };

    const tag = TaggedWorkerPool.getTag({ locale, viewport });
    return this.limiter.key(tag).schedule(runinternal);
  }

  async close(): Promise<void> {
    for (let [, worker] of this.states.entries()) {
      await worker.close();
    }
  }

  private async getOrInit({
    locale,
    viewport
  }: {
    locale: string;
    viewport: Viewport;
  }): Promise<Worker> {
    const tag = TaggedWorkerPool.getTag({ locale, viewport });
    const worker = this.states.get(tag);
    if (!worker) {
      this.states.set(tag, new Worker({ locale, viewport }));
    }
    return this.states.get(tag)!;
  }
}
