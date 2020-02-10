# sumoguri(素潜り)

[![CircleCI](https://circleci.com/gh/Leko/sumoguri.svg?style=svg)](https://circleci.com/gh/Leko/sumoguri)
[![codecov](https://codecov.io/gh/Leko/sumoguri/branch/master/graph/badge.svg)](https://codecov.io/gh/Leko/sumoguri)
![](https://img.shields.io/npm/v/sumoguri.svg)
![](https://img.shields.io/npm/dm/sumoguri.svg)
![](https://img.shields.io/npm/l/sumoguri.svg)

The CLI command for crawl static website and take screenshots.

## Usage

You can check usage with `--help` option.

```
$ sumoguri --help
sumoguri <ENTRY_URL> [options]

Options:
  --help                 Show help                                     [boolean]
  --version              Show version number                           [boolean]
  --outDir, -o           Output directory.          [default: "__screenshots__"]
  --flat, -f             Flatten output filename.     [boolean] [default: false]
  --include, -i          Including paths.                  [array] [default: []]
  --exclude, -e          Excluding paths.                  [array] [default: []]
  --browsers, -b         Target browsers (comma separated).
                                                  [string] [default: "chromium"]
  --devices, -d          Target devices (comma separated). Available values are
                         listed in --list-devices[string] [default: "iPhone XR"]
  --list-devices         List all devices.                             [boolean]
  --locales, -l          Locales.                             [default: "en-US"]
  --disableCssAnimation  Disable CSS animation and transition.
                                                       [boolean] [default: true]
  --silent                                            [boolean] [default: false]
  --verbose                                           [boolean] [default: false]

Examples:
  sumoguri https://example.com              Take screenshots from example.com
  sumoguri https://example.com --locale     Take screenshots in specified
  ja-JP,zh-CN                               locales
  sumoguri https://example.com --devices    Take screenshots in specified
  'iPhone XR,iPad Pro 11 landscape'         devices
  sumoguri --list-devices                   List all available devices and exit
```

## Contribution

1. Fork this repository
1. Write your code and tests
1. Run tests
1. Create pull request to master branch

## Development

```
git clone git@github.com:Leko/sumoguri.git
cd sumoguri
npm i
```

## License

This package under [MIT](https://opensource.org/licenses/MIT) license.
