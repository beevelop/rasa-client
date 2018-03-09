[![Travis](https://shields.beevelop.com/travis/beevelop/rasa-client.svg?style=flat-square)](https://travis-ci.org/beevelop/rasa-client)
[![npm](https://shields.beevelop.com/npm/v/rasa-client.svg?style=flat-square)](https://www.npmjs.com/package/rasa-client)
[![Release](https://shields.beevelop.com/github/release/beevelop/rasa-client.svg?style=flat-square)](https://github.com/beevelop/rasa-client/releases)
[![xo-code-style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/xojs/xo)
![Badges](https://shields.beevelop.com/badge/badges-6-brightgreen.svg?style=flat-square)
[![Beevelop](https://links.beevelop.com/honey-badge)](https://beevelop.com)

# Rasa Core HTTP Client for Node.js :bird:

> :warning: Still WIP: API is unstable and might change. Consider this a technical preview.

> Simple Node.js wrapper around the [Rasa core](https://core.rasa.ai/) [HTTP server](https://core.rasa.ai/http.html).

## Installation

### Install via npm:
```bash
npm install --save rasa-client
```

## Usage
```js
const RasaClient = require('rasa-client')

// first param is the endpoint without trailing slash
// optionally the second parameter can be an authentication token
const rc = new RasaClient('http://localhost:5005')
rc.parse('Hello world').then((res) => console.log)
rc.getVersion().then((res) => console.log)
```

## [API documentation](https://beevelop.github.io/rasa-client/)

## Examples
```js
// Full example with the remotebot example (from the official Rasa core repo)

const SENDER_ID = 'anon'
// Greet the bot
const msg1 = 'hello'
rc.parse(msg1, SENDER_ID).then(reply => {
  return rc.continue({
    executed_action: 'greet'
  }, SENDER_ID)
}).then(cont1 => {
  // next_action is action_listen in this case
  // therefore we can initiate a new parse request

  // Send venues request
  const msg2 = 'Whats the next event'
  return rc.parse(msg2, SENDER_ID)
}).then(reply => {
  return rc.continue({
    executed_action: 'search_concerts',
    events: [{ event: 'slot', name: 'venues', value: [
      {name: "Big Arena", reviews: 4.5},
      {name: "Small Arena", reviews: 4.2}
    ]}]
  }, SENDER_ID)
}).then(cont2 => {
  // you get the point...
})
```