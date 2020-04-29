// require dependencies
const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');
const assert = require('assert');

// declare constants
const START = Date.now();
const REPORT_FILE = path.basename(__filename).replace('.js', '-report.txt');

// define logging function
const log = (msg) => {
  const now = `${Date.now() - START} ms: `;
  console.log(now + msg);
  const writeableMsg = !msg ? msg
    : typeof msg === 'string'
      ? msg.split(__dirname).join(' [ ... ] ')
        .split('[31m').join('').split('[32m').join('').split('[39m').join('')
      : JSON.stringify(msg);
  fs.appendFileSync('./' + REPORT_FILE, now + writeableMsg + '\n');
};

// last-resort error logging
process.on('uncaughtException', (err) => log(err));
process.on('unhandledRejection', (err) => log(err));

// (re)initialize report file
fs.writeFileSync(REPORT_FILE, '');
log((new Date()).toLocaleString());


// begin main script

// the pokemon who's previous evolution is "Meowth"



const dotDotDot = setInterval(() => {
  log('...');
}, 100);


process.on('SIGINT', function onSIGINT() {
  log('Ctrl-C');
  process.exit(2);
});
