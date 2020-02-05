import { DeviceDescriptor, Browsers } from "./types";

export class QueueItem {
  public readonly url: URL;
  public readonly locale: string;
  public readonly browserName: Browsers;
  public readonly deviceDescriptor: DeviceDescriptor;

  constructor({
    url,
    locale,
    browserName,
    deviceDescriptor
  }: {
    url: URL;
    locale: string;
    browserName: Browsers;
    deviceDescriptor: DeviceDescriptor;
  }) {
    this.url = url;
    this.locale = locale;
    this.browserName = browserName;
    this.deviceDescriptor = deviceDescriptor;
    if (!deviceDescriptor) {
      console.error(new Error().stack);
    }
  }

  getDimention() {
    try {
      const {
        viewport: { width, height }
      } = this.deviceDescriptor;
      return [width, height].join("x");
    } catch (e) {
      console.error(this);
      throw e;
    }
  }
}
