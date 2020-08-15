#!/usr/bin/env node
const Game = require('./game');

const config = {
  webSocketAddress: 'ws://localhost:2230', //'ws://ta.moppler.co.uk:2230',
};

const consoleInterface = {
  clear() {
    console.clear();
  },
  write(message) {
    process.stdout.write(message);
  },
};

new Game(config, consoleInterface);

// // Store current state here
// const session = {
//   isProcessingInstruction: false,
// };

// console.clear();
// process.stdout.write('Establishing connection to server... ');

// const ws = new WebSocket(config.webSocketAddress);

// ws.on('open', function open() {
//   process.stdout.write(chalk.green('connected'));
//   console.log();

//   ws.send(
//     JSON.stringify({
//       type: 'requestAvailableInstructions',
//       data: {},
//     })
//   );
//   return;
// });

// ws.on('error', function error() {
//   process.stdout.write(chalk.red('failed'));
//   console.log();
// });

// //

// ws.on('message', async function incoming(data) {
//   process.stdout.write('\n');
//   const parsedMessage = JSON.parse(data.toString());

//   await handleInstruction(parsedMessage);
// });

// async function handleInstruction(message) {
//   if (message.type === 'render') {
//     console.log(message.data.message);
//     return;
//   }

//   if (message.type === 'completedInstruction') {
//     session.isProcessingInstruction = false;
//     ws.send(
//       JSON.stringify({
//         type: 'requestAvailableInstructions',
//         data: {},
//       })
//     );
//     return;
//   }

//   if (message.type === 'requestInstruction') {
//     await requestInstruction.process(ws, session, message.data);

//     if (!session.isProcessingInstruction) {
//       ws.send(
//         JSON.stringify({
//           type: 'requestAvailableInstructions',
//           data: {},
//         })
//       );
//     }
//     return;
//   }
// }
