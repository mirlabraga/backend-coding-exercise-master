const fs = require('fs');
const readline = require('readline');
const Vendor = require('./vendor');


async function readFile(file) {
  try {
    const fileStream = fs.createReadStream(file);
    return readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
  } catch (error) {
    throw new Error(`[ERROR] a error happend when the application try to read the file ${file}`);
  }
}

async function findItemAvailable(file) {

  try {

    const readInterface = await readFile(file);
    let vendors = [];
    let vendor = null;

    for await (const line of readInterface) {
      console.log(`[INFO] line information about vendor/item ${line}.`);
      vendor = processLine(line, vendors, vendor);
    }
    console.log(vendors);
  } catch (error) {
    console.log(error);
    throw new Error(`[ERROR] a error happend when the application try to read the line ${file}`);
  }
}

async function processLine(line, vendors, vendor) {

  var fields = line.split(';');

  var field0 = fields[0];
  var field1 = fields[1];
  var field2 = fields[2];

  if (isVendor(field0, field1, field2)) {
    const vendor = new Vendor(field0, field1, field2);
    vendors.push(vendor);
    return vendor;
  } else {
    console.log("item", field0, field1, field2);
    vendor.addItem(new Item(field0, field1, field2));
    return vendor;
  }

  // if (isItem(field0, field1, field2)) {
  //   vendor.addItem(new Item(field0, field1, field2));
  // }

}

async function isVendor(field0, field1, field2) {
  const patterName = /[A-Za-z][A-Za-z0-9]*/gm;
  const patterPostcode = /[A-Za-z][A-Za-z0-9]*/gm;
  const patterMaxCovers = /\d*/gm;

  return field0.match(patterName) && field1.match(patterPostcode) && field2.match(patterMaxCovers);
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

  await findItemAvailable(file);
}

async function validateInput(day, time, location) {

  const listValidationError = [];
  const patterDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/gm;
  const patterTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gm;
  const patterLocation = /[A-Za-z][A-Za-z0-9]*/gm;


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

exports.showItemAvailable = showItemAvailable;
