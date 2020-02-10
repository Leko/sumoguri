import { createCombinator } from "deep-combination";
import { DeviceDescriptor, Browsers } from "./types";
import { QueueItem } from "./QueueItem";

export class Matrix {
  static build(
    url: URL,
    {
      locales,
      devices,
      browsers
    }: {
      locales: string[];
      devices: DeviceDescriptor[];
      browsers: Browsers[];
    }
  ): QueueItem[] {
    const combinator = createCombinator()
      .addDimention(browsers)
      .addDimention(devices)
      .addDimention(locales);

    return Array.from(combinator).map(
      ([browserName, deviceDescriptor, locale]) => {
        return new QueueItem({
          url,
          browserName,
          locale,
          deviceDescriptor
        });
      }
    );
  }
}
