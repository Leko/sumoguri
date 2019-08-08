import { cpus } from "os";
import Yargs from "yargs";
import { Viewport } from "../Viewport";

export type CLIOptions = {
  _: string[];
  outDir: string;
  parallel: number;
  flat: boolean;
  include: string[];
  exclude: string[];
  viewports: Viewport[];
  locales: string[];
  disableCssAnimation: boolean;
  silent: boolean;
  verbose: boolean;
};

const cmd = Yargs.options({
  outDir: {
    alias: "o",
    description: "Output directory.",
    default: "__screenshots__"
  },
  parallel: {
    alias: "p",
    description: "Number of browsers to screenshot.",
    default: cpus().length
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
  viewports: {
    alias: "V",
    description: "Viewports.",
    default: "800x600",
    coerce: (args: string) => {
      return args
        .split(",")
        .map(arg => arg.split("x").map(n => parseInt(n, 10)));
    }
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
  silent: { default: false },
  verbose: { default: false }
});

export const parse = cmd.parse.bind(cmd);
