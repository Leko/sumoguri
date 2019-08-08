import path from "path";
import { QueueItem } from "../QueueItem";
import { escape } from "./escape";

export function filenamify(item: QueueItem, flat: boolean): string {
  const { locale, viewport, url } = item;
  const vp = viewport.join("x");
  const escaped = escape(url);

  if (flat) {
    return `${locale}-${vp}-${escaped.replace(/\//g, "-") + ".png"}`;
  }
  return path.join(locale, vp, escaped + ".png");
}
