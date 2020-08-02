var controller = require('./service.js');

function readInputParameters() {
  var args = process.argv.slice(2);
  console.log(`[INFO] the arguments of the applications ${args}.`);
  return args;
}

async function main() {
  const dataInput = readInputParameters();
  try {
    const result = await controller.getItemAvailableByDateLocation(dataInput);
    if (result && result.length > 0) {
      console.log(result);
    } else {
      console.log(`[INFO] == no results were found with the input arguments!.==`);
    }
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
  }
}

main();
