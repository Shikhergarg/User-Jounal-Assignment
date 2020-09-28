const { encodeAndSave, fethcAndDecodeFile, createNewFile } = require('./utils');
const { graceFullExit } = require('./patch-process');
const path = require('path');
const {
  loginPrompt,
  homePrompt,
  userPrompt,
  addJournalPrompt,
  userNamePrompt,
  passwordPrompt,
} = require('./prompts');

const inquirer = require('inquirer');
const chokidar = require('chokidar');

const usersJournalFile = 'userFile.dat';
const usersJournalFilePath = path.join(__dirname, usersJournalFile);
let userJournals;

const login = async () => {
  let userName;
  while (true) {
    const { fetchUserName: userNameInput, fetchPassword: password } = await inquirer.prompt(
      loginPrompt
    );
    userName = userNameInput;
    if (!userJournals[userName] || userJournals[userName].password !== password) {
      console.log('Sorry Wrong Username or Password Try again \n');
    } else {
      break;
    }
  }
  console.log(`Hi ${userName}!`);
  return userName;
};

const signUp = async () => {
  let newUserName;
  while (true) {
    const { fetchUserName: userNameInput } = await inquirer.prompt(userNamePrompt);
    newUserName = userNameInput;
    if (userJournals[newUserName]) {
      console.log('User already exists Try Again', '\n');
    } else {
      break;
    }
  }
  const { fetchPassword: password } = await inquirer.prompt(passwordPrompt);
  userJournals[newUserName] = {
    password,
    journals: [],
  };
  await encodeAndSave(userJournals, usersJournalFilePath);
  return newUserName;
};

const addJournal = async userName => {
  const { journalInput: journalDescription } = await inquirer.prompt(addJournalPrompt);
  const newJournal = { description: journalDescription, timestamp: new Date().toString() };
  userJournals[userName].journals.unshift(newJournal);
  if (userJournals[userName].journals.length > 50) {
    userJournals[userName].journals.pop();
  }

  await encodeAndSave(userJournals, usersJournalFilePath);
};

const printJournals = userName => {
  (userJournals[userName].journals || []).map(journalEntry => {
    console.log(journalEntry.timestamp, journalEntry.description, '\n');
  });
};

const userPanel = async userName => {
  while (true) {
    const { userPanel: userInput } = await inquirer.prompt(userPrompt);
    let logOut = false;
    switch (userInput) {
      case 1:
        printJournals(userName);
        break;
      case 2:
        await addJournal(userName);
        break;
      case 3:
        logOut = true;
        break;
      default:
        continue;
    }
    if (logOut) {
      break;
    }
  }
};

const main = async () => {
  try {
    userJournals = await fethcAndDecodeFile(usersJournalFilePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      userJournals = {};
      await createNewFile(userJournals, usersJournalFilePath);
    } else {
      throw err;
    }
  }
  chokidar.watch(usersJournalFilePath).on('change', async () => {
    userJournals = await fethcAndDecodeFile(usersJournalFilePath);
  });

  while (true) {
    const { loginPortal: userInput } = await inquirer.prompt(homePrompt);
    let userName;
    switch (userInput) {
      case 1:
        userName = await login();
        break;
      case 2:
        userName = await signUp();
        break;
      default:
        continue;
    }
    await userPanel(userName);
    userName = null;
  }
};

main().catch(err => {
  // should never reach here
  // if we get here then probably there is some unhandled cases,
  // for now do a gracefull exit
  graceFullExit(err);
});
