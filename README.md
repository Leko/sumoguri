# sumoguri(素潜り)

[![CircleCI](https://circleci.com/gh/Leko/sumoguri.svg?style=svg)](https://circleci.com/gh/Leko/sumoguri)
[![codecov](https://codecov.io/gh/Leko/sumoguri/branch/master/graph/badge.svg)](https://codecov.io/gh/Leko/sumoguri)
![](https://img.shields.io/npm/v/sumoguri.svg)
![](https://img.shields.io/npm/dm/sumoguri.svg)
![](https://img.shields.io/npm/l/sumoguri.svg)

The CLI command for crawl static website and take screenshots.

## Usage

```
sumoguri --help
```

### Example: Run with external url

- URL: `http://example.com/`
- Viewports: `1680x1050`, `828x1792`
- Locales: `en-US`, `ja-JP`

`sumoguri http://example.com --locales en-US,ja-JP --viewports 1680x1050,828x1792`

Then sumoguri will generate these screenshots:

- `__screenshots__/ja-JP/828x1792/index.png`
- `__screenshots__/en-US/828x1792/index.png`
- `__screenshots__/en-US/1680x1050/index.png`
- `__screenshots__/ja-JP/1680x1050/index.png`

### Example: Run with localhost

```sh
$ ls public
index.html
$ npx serve public &
[1] 50730

npx: installed 78 in 5.382s

   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:5000       │
   │   - On Your Network:  http://192.168.10.33:5000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘

$ sumoguri http://localhost:5000
save __screenshots__/en-US/800x600/index.png
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
