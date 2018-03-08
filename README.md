[![npm](https://shields.beevelop.com/npm/v/rasa-client.svg?style=flat-square)](https://www.npmjs.com/package/rasa-client)
[![Release](https://shields.beevelop.com/github/release/beevelop/rasa-client.svg?style=flat-square)](https://github.com/beevelop/rasa-client/releases)
[![xo-code-style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/xojs/xo)
![Badges](https://shields.beevelop.com/badge/badges-5-brightgreen.svg?style=flat-square)
[![Beevelop](https://links.beevelop.com/honey-badge)](https://beevelop.com)

# Rasa Core HTTP Client for Node.js :bird:

> :warning: Still WIP: API is unstable and might change.

> Simple Node.js wrapper around the [Rasa core](https://core.rasa.ai/) [HTTP server](https://core.rasa.ai/http.html).

## Installation

### Install via npm:
```bash
npm install --save rasa-client
```

## Usage
```js
const RasaClient = require('rasa-client')
const rc = new RasaClient('http://localhost:5005')
rc.parse('Hello world').then((res) => console.log)
rc.getVersion().then((res) => console.log)
```

## [Documentation](https://beevelop.github.io/rasa-client/)