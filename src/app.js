var controller = require('./controller.js');

function readInputParameters() {
  var args = process.argv.slice(2);
  console.log(`[INFO] the arguments of the applications ${args}.`);
  return args;
}

async function main() {
  const dataInput = readInputParameters();
  try {
    await controller.showItemAvailable(dataInput);
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
  }
}

main();
