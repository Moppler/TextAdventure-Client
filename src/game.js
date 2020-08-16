const chalk = require('chalk');
const WebSocket = require('ws');

const requestInstruction = require('./requestInstruction');

class Game {
  /**
   * @param {*} config
   * @param {*} terminal
   */
  constructor(config, terminal) {
    this.config = config;
    this.terminal = terminal;

    this.isProcessingInstruction = false;

    this.terminal.clear();
    this.terminal.out.write('Establishing connection to server... ');

    this.ws = new WebSocket(this.config.webSocketAddress);

    this.ws.on('open', this.open.bind(this));
    this.ws.on('error', this.error.bind(this));
    this.ws.on('message', this.message.bind(this));
  }

  open() {
    this.terminal.out.write(chalk.green('connected'));

    this.ws.send(
      JSON.stringify({
        type: 'requestAvailableInstructions',
        data: {},
      })
    );
    return;
  }

  error() {
    this.terminal.out.write(`${chalk.red('failed')}\n`);
  }

  async message(data) {
    this.terminal.out.write('\n');
    const parsedMessage = JSON.parse(data.toString());

    await this.handleInstruction(parsedMessage);
  }

  async handleInstruction(message) {
    if (message.type === 'render') {
      this.terminal.out.write(`${message.data.message}\n`);
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
