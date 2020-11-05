import { filenamify } from './filename'
import { QueueItem } from '../QueueItem'

describe('filenamify', () => {
  it('returns flat path when flat is true', () => {
    const item = new QueueItem({
      locale: 'en-US',
      viewport: [100, 100],
      prefersColorScheme: 'light',
      url: new URL('http://localhost/hoge/foo/bar'),
    })
    const filename = filenamify(item, true)
    expect(filename).toBe('en-US-100x100-light--hoge-foo-bar.png')
  })
  it('returns path when flat is false', () => {
    const item = new QueueItem({
      locale: 'en-US',
      viewport: [100, 100],
      prefersColorScheme: 'light',
      url: new URL('http://localhost/hoge/foo/bar'),
    })
    const filename = filenamify(item, false)
    expect(filename).toBe('en-US/100x100/light/hoge/foo/bar.png')
  })
})
