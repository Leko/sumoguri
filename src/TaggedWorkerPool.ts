import Bottleneck from "bottleneck";
import { Worker, Result } from "./Worker";
import { QueueItem } from "./QueueItem";

export class TaggedWorkerPool {
  private readonly limiter: Bottleneck.Group;
  private readonly states = new Map<string, Worker>();

  static getTag(item: QueueItem): string {
    return [item.locale, item.getDimention()].join("_");
  }

  constructor() {
    this.limiter = new Bottleneck.Group({
      maxConcurrent: 1
    });
  }

  async run(item: QueueItem): Promise<Result> {
    const { url } = item;
    const tag = TaggedWorkerPool.getTag(item);
    return this.limiter.key(tag).schedule(
      async (): Promise<Result> => {
        const worker = await this.getOrInit(item);
        return await worker.run(url);
      }
    );
  }

  async close(): Promise<void> {
    for (let [, worker] of this.states.entries()) {
      await worker.close();
    }
  }

  private async getOrInit(item: QueueItem): Promise<Worker> {
    const tag = TaggedWorkerPool.getTag(item);
    const worker = this.states.get(tag);
    if (!worker) {
      this.states.set(tag, new Worker(item));
    }
    return this.states.get(tag)!;
  }
}
