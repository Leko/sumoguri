export function prettify(url: URL) {
  return url.pathname.replace(/\/$/, '')
}
