#!/usr/bin/env node
require("core-js/features/array/flat");
require("core-js/features/array/flat-map");
const chalk = require("chalk");
const { main } = require("./dist/cli/entry");
const { parse } = require("./dist/cli/options");

main(parse()).catch(e => {
  console.error(chalk.red(e.stack));
  process.exit(1);
});
