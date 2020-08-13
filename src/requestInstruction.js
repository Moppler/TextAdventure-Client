const prompts = require('prompts');

module.exports = {
  async process(ws, session, instructions) {
    const selectedInstruction = await prompts({
      type: 'autocomplete',
      name: 'instruction',
      message: 'What would you like to do?',
      choices: instructions.availableInstructions.map((instruction) => ({
        title: instruction.name,
        value: instruction.instruction,
      })),
    });

    const instruction = instructions.availableInstructions.find(
      (ins) => ins.instruction === selectedInstruction.instruction
    );

    let args = null;
    if (instruction.arguments) {
      args = await prompts(
        instruction.arguments.map((arg) => {
          if (arg.type === 'select') {
            return {
              type: 'autocomplete',
              name: arg.name,
              message: arg.playerPrompt,
              choices: arg.options.map((option) => ({
                title: option.name,
                value: option.value,
              })),
            };
          }

          if (arg.type === 'text') {
            return {
              type: 'text',
              name: arg.name,
              message: arg.playerPrompt,
            };
          }

          if (arg.type === 'password') {
            return {
              type: 'password',
              name: arg.name,
              message: arg.playerPrompt,
            };
          }
        })
      );
    }

    session.isProcessingInstruction = true;

    ws.send(
      JSON.stringify({
        type: 'issueInstruction',
        data: {
          instructionType: instruction.instruction,
          arguments: args,
        },
      })
    );
    return;
  },
};
