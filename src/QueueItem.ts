import { Viewport } from "./Viewport";

export class QueueItem {
  public readonly url: URL;
  public readonly locale: string;
  public readonly viewport: Viewport;

  constructor({
    url,
    locale,
    viewport
  }: {
    url: URL;
    locale: string;
    viewport: Viewport;
  }) {
    this.url = url;
    this.locale = locale;
    this.viewport = viewport;
  }
}
