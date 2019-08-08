import path from "path";

export function escape(url: URL) {
  const p = url.pathname.replace("/", path.sep);
  return p.endsWith("/") ? p + "index.html" : p;
}
