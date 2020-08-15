const chalk = require('chalk');
const WebSocket = require('ws');

const requestInstruction = require('./requestInstruction');

// const requestInstruction = require('./requestInstruction');

// const config = {
//   webSocketAddress: 'ws://localhost:2230', //'ws://ta.moppler.co.uk:2230',
// };

// // Store current state here
// const session = {
//   isProcessingInstruction: false,
// };

class Game {
  constructor(config, terminal) {
    this.config = config;
    this.terminal = terminal;

    this.isProcessingInstruction = false;

    this.terminal.clear();
    this.terminal.write('Establishing connection to server... ');

    this.ws = new WebSocket(this.config.webSocketAddress);

    this.ws.on('open', this.open.bind(this));
    this.ws.on('error', this.error.bind(this));
    this.ws.on('message', this.message.bind(this));
  }

  open() {
    this.terminal.write(chalk.green('connected'));

    this.ws.send(
      JSON.stringify({
        type: 'requestAvailableInstructions',
        data: {},
      })
    );
    return;
  }

  error() {
    this.terminal.write(`${chalk.red('failed')}\n`);
  }

  async message(data) {
    this.terminal.write('\n');
    const parsedMessage = JSON.parse(data.toString());

    await this.handleInstruction(parsedMessage);
  }

  async handleInstruction(message) {
    if (message.type === 'render') {
      this.terminal.write(`${message.data.message}\n`);
      return;
    }

    if (message.type === 'completedInstruction') {
      this.isProcessingInstruction = false;
      this.ws.send(
        JSON.stringify({
          type: 'requestAvailableInstructions',
          data: {},
        })
      );
      return;
    }

    if (message.type === 'requestInstruction') {
      await requestInstruction.process(this, message.data);

      if (!this.isProcessingInstruction) {
        this.ws.send(
          JSON.stringify({
            type: 'requestAvailableInstructions',
            data: {},
          })
        );
      }
      return;
    }
  }
}

module.exports = Game;
