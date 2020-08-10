#!/usr/bin/env node
const chalk = require('chalk');
const prompts = require('prompts');
const WebSocket = require('ws');

const requestInstruction = require('./requestInstruction');

const config = {
  webSocketAddress: 'ws://localhost:8080',
};

// Store current state here

console.clear();
process.stdout.write('Establishing connection to server... ');

const ws = new WebSocket(config.webSocketAddress);

ws.on('open', function open() {
  process.stdout.write(chalk.green('connected'));
  console.log();

  // ws.send(JSON.stringify({ request: 'commands' }));
});

ws.on('error', function error() {
  process.stdout.write(chalk.red('failed'));
  console.log();
});

//

ws.on('message', async function incoming(data) {
  // console.log(data);
  const parsedMessage = JSON.parse(data.toString());

  if (parsedMessage.type === 'render') {
    console.log(parsedMessage.data.message);
    return;
  }

  if (parsedMessage.type === 'requestInstruction') {
    await requestInstruction.process(ws, parsedMessage.data);
    return;
  }
});
