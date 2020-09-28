const fs = require('fs');
const path = require('path');
const usersJournalFile = 'userFile.dat.lock';
const graceFullExit = () => {
  console.log('Thanks for using it');
  try {
    fs.unlinkSync(path.join(__dirname, usersJournalFile));
    process.exit(1);
  } catch (error) {
    process.exit(1);
  }
};

process.on('uncaughtException', graceFullExit);
process.on('SIGTERM', graceFullExit);
process.on('SIGINT', graceFullExit);
process.on('SIGHUP', graceFullExit);

module.exports = {
  graceFullExit,
};
