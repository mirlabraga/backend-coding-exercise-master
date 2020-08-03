const fs = require('fs');
const readline = require('readline');

async function readFile(file) {
  try {
    const fileStream = fs.createReadStream(file);
    return readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
  } catch (error) {
    console.log(error);
    throw new Error(`[ERROR] a error happend when the application try to read the file ${file}`);
  }
}
exports.readFile = readFile;
