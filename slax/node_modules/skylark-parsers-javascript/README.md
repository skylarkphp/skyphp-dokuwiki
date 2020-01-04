# skylark-scripts-js The skylark javascript utility library

## Dependences

| Project                                                      | Status | Description                           |
| ------------------------------------------------------------ | ------ | ------------------------------------- |
| [skylark-langx](https://github.com/skylarklangx/skylark-langx) |        | Javascript language extension library |

## Different builds

builds are in the directory dist.

|                      | build                                | Description              |
| -------------------- | ------------------------------------ | ------------------------ |
| full                 | skylark-scripts-js-all.js              | included dependences     |
| only                 | skylark-scripts-js.js                  | not included dependences |
| full （development） | uncompressed/skylark-scripts-js-all.js | included dependences     |
| only （development） | uncompressed/skylark-scripts-js.js     | not included dependences |

Please use the "full" version when using this library alone, and use the "only" version when using other skylark libraries.

## Installation

You can get the latest version in many different ways:

- Downloading [a ZIP file from master](https://github.com/skylarkutils/skylark-scripts-js/archive/master.zip)
- Cloning using Git: `git clone https://github.com/skylark-scripts/skylark-scripts-js.git`
- Installing via NPM: `npm install https://github.com/skylark-scripts/skylark-scripts-js.git#master --save`

## Building 

- Ensure that Node.js is installed.
- Run npm install https://github.com/skylarkjs/skylark-bundle-cli.git -g to ensure sbundle is installed.
- Run npm install to ensure the required dependencies are installed.
- Run npm run build. The builds will be placed in the dist/ directory.

## License

Released under the [MIT](http://opensource.org/licenses/MIT)