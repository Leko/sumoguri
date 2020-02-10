import Yargs from "yargs";
import { devices } from "playwright";
import { DeviceDescriptor, Browsers } from "../types";

export type CLIOptions = {
  _: string[];
  outDir: string;
  parallel: number;
  flat: boolean;
  include: string[];
  exclude: string[];
  browsers: Browsers[];
  devices: DeviceDescriptor[];
  locales: string[];
  disableCssAnimation: boolean;
  silent: boolean;
  verbose: boolean;
  "list-devices": boolean;
};

const cmd = Yargs.scriptName("sumoguri")
  .usage("$0 <ENTRY_URL> [options]")
  .example("$0 https://example.com", "Take screenshots from example.com")
  .example(
    "$0 https://example.com --locale ja-JP,zh-CN",
    "Take screenshots in specified locales"
  )
  .example(
    "$0 https://example.com --devices 'iPhone XR,iPad Pro 11 landscape'",
    "Take screenshots in specified devices"
  )
  .example("$0 --list-devices", "List all available devices and exit")
  .options({
    outDir: {
      alias: "o",
      description: "Output directory.",
      default: "__screenshots__"
    },
    flat: {
      alias: "f",
      type: "boolean",
      description: "Flatten output filename.",
      default: false
    },
    include: {
      alias: "i",
      description: "Including paths.",
      type: "array",
      default: []
    },
    exclude: {
      alias: "e",
      description: "Excluding paths.",
      type: "array",
      default: []
    },
    browsers: {
      alias: "b",
      description: "Target browsers (comma separated).",
      type: "string",
      default: "chromium",
      coerce: opts => {
        return opts.split(",");
      }
    },
    devices: {
      alias: "d",
      description:
        "Target devices (comma separated). Available values are listed in --list-devices",
      type: "string",
      default: "iPhone XR",
      coerce: opts => {
        return opts
          .split(",")
          .map((deviceName: string) =>
            devices.find(d => d.name === deviceName)
          );
      }
    },
    "list-devices": {
      description: "List all devices.",
      type: "boolean"
    },
    locales: {
      alias: "l",
      description: "Locales.",
      default: "en-US",
      coerce: (args: string) => {
        return args.split(",").map(arg => arg.trim());
      }
    },
    disableCssAnimation: {
      description: "Disable CSS animation and transition.",
      type: "boolean",
      default: true
    },
    silent: { type: "boolean", default: false },
    verbose: { type: "boolean", default: false }
  });

export const parse = cmd.parse.bind(cmd);
