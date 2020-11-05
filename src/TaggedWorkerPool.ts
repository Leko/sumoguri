import Bottleneck from "bottleneck";
import { Viewport } from "./Viewport";
import { Worker, Result } from "./Worker";

export class TaggedWorkerPool {
  private readonly limiter: Bottleneck.Group;
  private readonly states = new Map<string, Worker>();

  static getTag({
    locale,
    prefersColorScheme,
    viewport
  }: {
    locale: string;
    prefersColorScheme: string;
    viewport: Viewport;
  }): string {
    return [locale, viewport.join("x"), prefersColorScheme].join("_");
  }

  constructor() {
    this.limiter = new Bottleneck.Group({
      maxConcurrent: 1
    });
  }

  async run({
    locale,
    prefersColorScheme,
    viewport,
    url
  }: {
    locale: string;
    prefersColorScheme: string;
    viewport: Viewport;
    url: URL;
  }, {
    disableCssAnimation,
  }: {
    disableCssAnimation: boolean;
  }): Promise<Result> {
    const tag = TaggedWorkerPool.getTag({ locale, viewport, prefersColorScheme });
    return this.limiter.key(tag).schedule(
      async (): Promise<Result> => {
        const worker = await this.getOrInit({ locale, viewport, prefersColorScheme, disableCssAnimation });
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
    prefersColorScheme,
    viewport,
    disableCssAnimation,
  }: {
    locale: string;
    prefersColorScheme: string;
    viewport: Viewport;
    disableCssAnimation: boolean;
  }): Promise<Worker> {
    const tag = TaggedWorkerPool.getTag({ locale, viewport, prefersColorScheme });
    const worker = this.states.get(tag);
    if (!worker) {
      this.states.set(tag, new Worker({ locale, viewport, prefersColorScheme, disableCssAnimation }));
    }
    return this.states.get(tag)!;
  }
}
