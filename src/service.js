const fs = require('fs');
const readline = require('readline');
const Vendor = require('./model/vendor');
const Item = require('./model/item');

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

async function findByDateLocation(file, day, time, location, covers) {

  const patterPostcode = /([A-Za-z]{1,})/gm;
  const patterAdvanceTime = /\d\d/gm;

  const splitDate = day.split("/");
  const date = new Date(`${splitDate[1]}/${splitDate[0]}/${splitDate[2]} ${time}`);
  const dateNow = new Date(Date.now());
  const diffTime = date.getTime() - dateNow.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
  const diffHours = diffDays * 24;

  try {

    const vendors = await processFile(file);
    const vendorsResultFilter = vendors
      .filter(vendor => Boolean(vendor.postCode.match(patterPostcode)[0] == (location.match(patterPostcode)[0])) &&
      vendor.maxCovers >= covers);

    return vendorsResultFilter
      .map(vendor => vendor.items)
      .flat()
      .filter(item => item.advanceTime.match(patterAdvanceTime)[0] <= diffHours );

  } catch (error) {
    console.log(error);
    throw new Error(`[ERROR] a error happend when the application try to read the line ${file}`);
  }
}

async function processFile(file) {
  const readInterface = await readFile(file);
  let vendors = [];

  for await (const line of readInterface) {
    if (line) {
      console.log(`[INFO] line information about vendor/item ${line}.`);
      processLine(line, vendors);
    }
  }
  return vendors;
}

async function processLine(line, vendors) {

  var fields = line.split(';');

  const field0 = fields[0];
  const field1 = fields[1];
  const field2 = fields[2];

  if (await isItem(field0, field2)) {
    const beforeVendor = vendors[vendors.length - 1];
    const allergies = (field1) ? field1.split(',') : [];
    beforeVendor.addItem(new Item(field0, allergies, field2));

  } else if (isVendor(field0, field1, field2)) {
    const vendor = new Vendor();
    vendor.addInfo(field0, field1, field2);
    vendors.push(vendor);
  }

}

async function isItem(field0, field2) {

  const patterName = /[A-Za-z ]*/gm;
  const patterAdvanceTime = /\d\dh/gm;

  const isPatterAdvanceTime = (String(field2).match(patterAdvanceTime) !== null &&
    String(field2).match(patterAdvanceTime)[0] !== null);

  return Boolean(String(field0).match(patterName)[0] && isPatterAdvanceTime);
}

async function isVendor(field0, field1, field2) {
  const patterName = /[A-Za-z ]*/gm;
  const patterPostcode = /[A-Za-z][A-Za-z0-9]*/gm;
  const patterMaxCovers = /\d*/gm;

  return field0.match(patterName) && field1.match(patterPostcode) && field2.match(patterMaxCovers);
}

async function getItemAvailableByDateLocation(dataInput) {

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

  return await findByDateLocation(file, day, time, location, covers);
}

async function validateInput(day, time, location) {

  const listValidationError = [];
  const patterDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/gm;
  const patterTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gm;
  const patterLocation = /[A-Za-z][A-Za-z0-9]*/gm;


  if (!day.match(patterDate)) {
    listValidationError.push("The day is not in a valid day format that the service can support.");
  }

  if (!time.match(patterTime)) {
    listValidationError.push("The time is not in a valid time format that the service can support.");
  }

  if (!location.match(patterLocation)) {
    listValidationError.push("The location is not in a valid name format that the service can support.");
  }

  return listValidationError;
}

exports.getItemAvailableByDateLocation = getItemAvailableByDateLocation;
