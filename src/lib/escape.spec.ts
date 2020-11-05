import { escape } from './escape'

describe('escape', () => {
  it('returns index suffixed pathname', () => {
    const url = new URL('http://localhost')
    expect(escape(url)).toBe('/index')
  })
  it('returns index suffixed pathname when endsWith slash', () => {
    const url = new URL('http://localhost/')
    expect(escape(url)).toBe('/index')
  })
  it('removes .html', () => {
    const url = new URL('http://localhost/hoge.html')
    expect(escape(url)).toBe('/hoge')
  })
})
