import debug from "debug";

export function init({
  verbose,
  silent
}: {
  verbose: boolean;
  silent: boolean;
}) {
  const ns = "sumoguri";
  const logger = debug(ns);
  if (silent) {
    debug.disable();
  }
  if (verbose) {
    debug.enable(ns);
  }
  return logger;
}
