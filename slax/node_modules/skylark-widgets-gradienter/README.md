# skylark-ui-gradienter
The skylark gradient picker widget

## Dependences

| Project                                                      | Status | Description                                           |
| ------------------------------------------------------------ | ------ | ----------------------------------------------------- |
| [skylark-langx](https://github.com/skylarklangx/skylark-langx) |        | Javascript language extension library                 |
| [skylark-utils](https://github.com/skylarkutils/skylark-utils) |        | An Universal HTML5 Javascript Library                 |
| [skylark-utils-color](https://github.com/skylarkutils/skylark-utils-color) |        | The dom layout features enhancement for skylark utils |
| [skylark-utils-interact](https://github.com/skylarkutils/skylark-utils-interact) |        | The interact features enhancement for skylark utils   |
| [skylark-ui-swt](https://github.com/skylarkui/skylark-ui-swt) |        | The skylark standard widget tookit                    |
| [skylark-ui-colorpicker](https://github.com/skylarkutils/skylark-ui-colorpicker) |        | The color picker                                      |
| [skylark-utils-dom](https://github.com/skylarkutils/skylark-utils-dom) |        | An Universal DOM Utility Library                      |

## Different builds

builds are in the directory dist.

|                      | build                                     | Description              |
| -------------------- | ----------------------------------------- | ------------------------ |
| full                 | skylark-ui-gradienter-all.js              | included dependences     |
| only                 | skylark-ui-gradienter.js                  | not included dependences |
| full （development） | uncompressed/skylark-ui-gradienter-all.js | included dependences     |
| only （development） | uncompressed/skylark-ui-gradienter.js     | not included dependences |

Please use the "full" version when using this library alone, and use the "only" version when using other skylark libraries.

## Installation

You can get the latest version in many different ways:

- Downloading [a ZIP file from master](https://github.com/skylarkui/skylark-ui-gradienter/archive/master.zip)
- Cloning using Git: `git clone https://github.com/skylarkui/skylark-ui-gradienter.git`
- Installing via NPM: `npm install https://github.com/skylarkui/skylark-ui-gradienter.git#master --save`

## Building 

- Ensure that Node.js is installed.
- Run npm install https://github.com/skylarkjs/skylark-bundle-cli.git -g to ensure sbundle is installed.
- Run npm install to ensure the required dependencies are installed.
- Run npm run build. The builds will be placed in the dist/ directory.

## License

Released under the [MIT](http://opensource.org/licenses/MIT)