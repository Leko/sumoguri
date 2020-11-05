import path from 'path'
import { QueueItem } from '../QueueItem'
import { escape } from './escape'

export function filenamify(item: QueueItem, flat: boolean): string {
  const { locale, viewport, prefersColorScheme, url } = item
  const vp = viewport.join('x')
  const escaped = escape(url)

  if (flat) {
    return `${locale}-${vp}-${prefersColorScheme}-${
      escaped.replace(/\//g, '-') + '.png'
    }`
  }
  return path.join(locale, vp, prefersColorScheme, escaped + '.png')
}
