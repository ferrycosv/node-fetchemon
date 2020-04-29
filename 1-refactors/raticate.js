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


const URL = 'https://pokeapi.co/api/v2/pokemon/20';



(async () => {
  try {
    log('fetching ' + URL + ' ...');
    const res = await nodeFetch(URL);
    clearInterval(dotDotDot);

    log('testing response ...');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 200);

    log('parsing response ...');
    const data = await res.json();

    log('testing data ...');
    assert.strictEqual(data.name, 'raticate');
    assert.strictEqual(data.id, 20);
    assert.strictEqual(data.height, 7);
    assert.deepStrictEqual(data.abilities[2], {
      ability: {
        name: "run-away",
        url: "https://pokeapi.co/api/v2/ability/50/"
      },
      is_hidden: false,
      slot: 1
    });

    log('... PASS!');

  } catch (err) {
    log(err.stack);
  };
})();

const dotDotDot = setInterval(() => {
  log('...');
}, 100);



process.on('SIGINT', function onSIGINT() {
  log('Ctrl-C');
  process.exit(2);
});
