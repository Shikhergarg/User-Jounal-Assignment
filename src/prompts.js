const loginPrompt = [
  {
    type: 'input',
    message: 'Enter UserName \n',
    name: 'fetchUserName',
  },
  {
    type: 'input',
    message: 'Enter Password \n',
    name: 'fetchPassword',
  },
];
const homePrompt = [
  {
    type: 'number',
    message: 'Enter 1 for Login and 2 for Signup \n',
    name: 'loginPortal',
  },
];
const userPrompt = [
  {
    type: 'number',
    message: 'Enter 1 to print Journal, 2 to add new Journal and 3 for logOut \n',
    name: 'userPanel',
  },
];
const addJournalPrompt = [
  {
    type: 'input',
    message: 'Add Description \n',
    name: 'journalInput',
  },
];
const userNamePrompt = [
  {
    type: 'input',
    message: 'Enter UserName \n',
    name: 'fetchUserName',
  },
];
const passwordPrompt = [
  {
    type: 'input',
    message: 'Enter Password \n',
    name: 'fetchPassword',
  },
];
module.exports = {
  loginPrompt,
  homePrompt,
  userPrompt,
  addJournalPrompt,
  userNamePrompt,
  passwordPrompt,
};
