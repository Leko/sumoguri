import { Viewport } from './Viewport'

export class QueueItem {
  public readonly url: URL
  public readonly locale: string
  public readonly viewport: Viewport
  public readonly prefersColorScheme: string

  constructor({
    url,
    locale,
    viewport,
    prefersColorScheme,
  }: {
    url: URL
    locale: string
    viewport: Viewport
    prefersColorScheme: string
  }) {
    this.url = url
    this.locale = locale
    this.viewport = viewport
    this.prefersColorScheme = prefersColorScheme
  }
}
