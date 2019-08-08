import { Viewport } from "./Viewport";
import { QueueItem } from "./QueueItem";

export class Matrix {
  static build(
    url: URL,
    {
      locales,
      viewports
    }: {
      locales: string[];
      viewports: Viewport[];
    }
  ): QueueItem[] {
    return locales.flatMap(locale => {
      return viewports.map(
        viewport =>
          new QueueItem({
            url,
            locale,
            viewport
          })
      );
    });
  }
}
