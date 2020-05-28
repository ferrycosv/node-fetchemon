// require dependencies
const fs = require("fs");
const path = require("path");
const nodeFetch = require("node-fetch");
const assert = require("assert");

// declare constants
const START = Date.now();
const REPORT_FILE =
  __dirname + "/" + path.basename(__filename).replace(".js", "-report.txt");

// define logging function
const log = (msg) => {
  const now = `${Date.now() - START} ms: `;
  console.log(now + msg);
  if (typeof msg === "string") {
    const cleanedString = msg
      // remove special characters used to print assertion colors in terminal
      .replace(/\[31m|\[32m|\[39m/g, "")
      // remove the file path from error messages for privacy and readability
      .replace(new RegExp(__dirname, "g"), " [ ... ] ");
    fs.appendFileSync(REPORT_FILE, now + cleanedString + "\n");
  } else {
    const stringifiedMsg = JSON.stringify(msg);
    fs.appendFileSync(REPORT_FILE, now + stringifiedMsg + "\n");
  }
};

// log when a user forces the script to exit
process.on("SIGINT", function onSIGINT() {
  log("Ctrl-C");
  process.exit(2);
});

// log uncaught errors
const handleError = (err) => {
  log(err);
  process.exit(1);
};
process.on("uncaughtException", handleError);
process.on("unhandledRejection", handleError);

// (re)initialize report file
fs.writeFileSync(REPORT_FILE, "");
log(new Date().toLocaleString());

// --- begin main script ---

/*
const main = async (URL) => {
  try {
    log('fetching ' + URL + ' ...');
    const dotDotDot = setInterval(() => log('...'), 100);
    const res = await nodeFetch(URL);
    clearInterval(dotDotDot);

    log('testing response ...');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 200);

    log('parsing response ...');
    const data = await res.json();

    log('testing data ...');
    assert.strictEqual(data.name, 'butterfree');
    assert.strictEqual(data.id, 12);
    assert.deepStrictEqual(data.species, {
      name: "butterfree",
      url: "https://pokeapi.co/api/v2/pokemon-species/12/"
    });
    assert.deepStrictEqual(data.forms, [
      {
        name: "butterfree",
        url: "https://pokeapi.co/api/v2/pokemon-form/12/"
      }
    ]);

    log('... PASS!');

  } catch (err) {
    log(err.stack);
  };
};*/

// Refactored

const URL = "https://pokeapi.co/api/v2/pokemon/butterfree";

log("fetching " + URL + " ...");
const dotDotDot = setInterval(() => log("..."), 100);
nodeFetch(URL)
  .then((res) => {
    clearInterval(dotDotDot);
    log("testing response ...");
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 200);
    log("parsing response ...");
    return res.json();
  })
  .then((data) => {
    log("testing data ...");
    assert.strictEqual(data.name, "butterfree");
    assert.strictEqual(data.id, 12);
    assert.deepStrictEqual(data.species, {
      name: "butterfree",
      url: "https://pokeapi.co/api/v2/pokemon-species/12/",
    });
    assert.deepStrictEqual(data.forms, [
      {
        name: "butterfree",
        url: "https://pokeapi.co/api/v2/pokemon-form/12/",
      },
    ]);
    log("... PASS!");
  })
  .catch((err) => {
    log(err.stack);
  });
