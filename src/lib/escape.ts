import path from 'path'

export function escape(url: URL) {
  const p = url.pathname.replace('/', path.sep)
  const str = p.endsWith('/') ? p + 'index' : p
  return str.replace('.html', '')
}
