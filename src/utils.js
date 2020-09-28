const fs = require('fs').promises;
const lockfile = require('proper-lockfile');

const sleep = m => new Promise(r => setTimeout(r, m));

const encodeAndSave = async (text, filePath) => {
  const encodeString = Buffer.from(JSON.stringify(text)).toString('base64');
  while (true) {
    const lock = await lockfile.check(filePath);
    if (!lock) {
      break;
    }
    await sleep(200);
  }
  const release = await lockfile.lock(filePath, { stale: 10000 });
  await fs.writeFile(filePath, encodeString);
  release();
};

const fethcAndDecodeFile = async file =>
  JSON.parse(
    Buffer.from(await fs.readFile(file, { encoding: 'utf8', flag: 'r' }), 'base64').toString(
      'ascii'
    ),
    'base64'
  );
const createNewFile = async (text, filePath) => {
  const encodeString = Buffer.from(JSON.stringify(text)).toString('base64');
  await fs.writeFile(filePath, encodeString);
};
module.exports = {
  sleep,
  encodeAndSave,
  fethcAndDecodeFile,
  createNewFile,
};
