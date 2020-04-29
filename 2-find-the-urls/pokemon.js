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


const URL = 'https://pokeapi.co/api/v2/_';


log('fetching ' + URL + ' ...');
nodeFetch(URL)
  .then(res => {
    clearInterval(dotDotDot);

    log('testing response ...');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 200);

    log('parsing response ...');
    return res.json()
  })
  .then(data => {
    log('testing data ...');
    assert.strictEqual(data.height, 13);
    assert.strictEqual(data.weight, 1);
    assert.strictEqual(data.base_experience, 62);

    log('... PASS!');
  })
  .catch(err => log(err.stack));


const dotDotDot = setInterval(() => {
  log('...');
}, 100);



process.on('SIGINT', function onSIGINT() {
  log('Ctrl-C');
  process.exit(2);
});
