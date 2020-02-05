import path from "path";
import { QueueItem } from "../QueueItem";
import { escape } from "./escape";

export function filenamify(item: QueueItem, flat: boolean): string {
  const { locale, browserName, url } = item;
  const vp = item.getDimention();
  const escaped = escape(url);

  if (flat) {
    return `${browserName}-${locale}-${vp}-${escaped.replace(/\//g, "-") +
      ".png"}`;
  }
  return path.join(browserName, locale, vp, escaped + ".png");
}
