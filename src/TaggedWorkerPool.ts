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

  constructor() {
    this.limiter = new Bottleneck.Group({
      maxConcurrent: 1
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
    const tag = TaggedWorkerPool.getTag({ locale, viewport });
    return this.limiter.key(tag).schedule(
      async (): Promise<Result> => {
        const worker = await this.getOrInit({ locale, viewport });
        return await worker.run(url);
      }
    );
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
