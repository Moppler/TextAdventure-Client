#!/usr/bin/env node
const Game = require('./game');

const config = {
  webSocketAddress: 'ws://localhost:2230', //'ws://ta.moppler.co.uk:2230',
};

const consoleInterface = {
  clear() {
    console.clear();
  },
  in: process.stdin,
  out: process.stdout,
};

new Game(config, consoleInterface);
