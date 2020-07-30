const fs = require('fs');
const readline = require('readline');

async function readFile(file) {

  try {

    const fileStream = fs.createReadStream(file);
    const readInterface = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of readInterface) {
      console.log(`[INFO] line information about vendor/item ${line}.`);
    }
  } catch (error) {
    throw new Error(`[ERROR] a error happend when the application try to read the file ${file}`);
  }
}

async function showItemAvailable(dataInput) {

  const file = dataInput[0];
  const day = dataInput[1];
  const time = dataInput[2];
  const location = dataInput[3];
  const covers = dataInput[4];

  console.log(`[INFO] file: ${file}, day: ${day}, time: ${time}, location: ${location}, covers: ${covers}.`);

  const validate = await validateInput(day, time, location);
  if (validate.length > 0) {
    throw new Error(validate);
  }

  await readFile(file);

}

async function validateInput(day, time, location) {

  const listValidationError = [];
  const patterDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/gm;
  const patterTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gm;
  const patterLocation = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gm;


  if (!day.match(patterDate)) {
    listValidationError.push("The day is not in a valid name format that the service can support.");
  }

  if (!time.match(patterTime)) {
    listValidationError.push("The time is not in a valid name format that the service can support.");
  }

  if (!location.match(patterLocation)) {
    listValidationError.push("The location is not in a valid name format that the service can support.");
  }

  return listValidationError;
}

// async function validate() {
//   const listValidationError = [];

//   if (!name.match(/^([a-z0-9]{5,})$/)) {
//     listValidationError.push("The name is not in a valid name format that the service can support.");
//   }

//   if (!str.match(/[A-Za-z][A-Za-z0-9]*/)) {
//     listValidationError.push("The postcode is not in a valid name format that the service can support.");
//   }

//   return listValidationError.length > 0 ? listValidationError : null;
// }


exports.showItemAvailable = showItemAvailable;
