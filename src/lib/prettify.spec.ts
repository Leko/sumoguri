import { prettify } from './prettify'

describe('prettify', () => {
  it('should trim trailing slash', () => {
    const url = new URL('http://localhost/about/')
    expect(prettify(url)).toBe('/about')
  })
})
