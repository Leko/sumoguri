import { Viewport } from './Viewport'
import { QueueItem } from './QueueItem'

export class Matrix {
  static build(
    url: URL,
    {
      locales,
      viewports,
      prefersColorSchemes,
    }: {
      locales: string[]
      viewports: Viewport[]
      prefersColorSchemes: string[]
    }
  ): QueueItem[] {
    return locales.flatMap((locale) => {
      return viewports.flatMap((viewport) => {
        return prefersColorSchemes.map(
          (prefersColorScheme) =>
            new QueueItem({
              url,
              locale,
              viewport,
              prefersColorScheme,
            })
        )
      })
    })
  }
}
