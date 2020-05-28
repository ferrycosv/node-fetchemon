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

// the pokemon with 71 moves and the abilities "hustle", "rivalry", "poison-point"

// Find the answer

async function searchAPI() {
  let URL = "https://pokeapi.co/api/v2/pokemon/";
  let answer = [];
  while (URL) {
    try {
      const res = await nodeFetch(URL);
      const data = await res.json();
      answer = answer.concat(await search(data.results.map((x) => x.url)));
      URL = data.next;
    } catch (err) {
      console.log(err);
    }
  }
  return answer[0];
}

async function search(itemsArr) {
  const x = await Promise.all(
    itemsArr.map(async (y) => {
      try {
        const res2 = await nodeFetch(y);
        const data2 = await res2.json();
        //asserts to pass
        try {
          assert.strictEqual(data2.abilities.some(x => x.ability.name === "rivalry"), true);
          assert.strictEqual(data2.abilities.some(x => x.ability.name === "hustle"), true);
          assert.strictEqual(data2.abilities.some(x => x.ability.name === "poison-point"), true);
          assert.strictEqual(data2.moves.length, 71);
        } catch (err) {
          return null;
        }
        return y;
      } catch (err) {
        console.log(err);
      }
    })
  );
  return [...new Set(x.filter(Boolean))];
}

const main = async () => {
  try {
    const URL = await searchAPI();
    log("fetching " + URL + " ...");
    const dotDotDot = setInterval(() => log("..."), 100);
    const res = await nodeFetch(URL);
    clearInterval(dotDotDot);
    log("testing response ...");
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 200);
    log("parsing response ...");
    const data = await res.json();
    log("testing data ...");
    assert.strictEqual(data.name, "nidorina");
    assert.strictEqual(data.weight, 200);
    assert.deepStrictEqual(data.species, {
      name: "nidorina",
      url: "https://pokeapi.co/api/v2/pokemon-species/30/"
  });
    assert.strictEqual(data.base_experience, 128);
    assert.strictEqual(data.order, 50);
    log("... PASS!");
  } catch (err) {
    log(err.stack);
  }
};

main();
