// experiment with a script that takes CLI args and searches the pokemon API
const nodeFetch = require("node-fetch");

async function searchAPI(paramURL, param) {
  let URL = paramURL;
  let answer = [];
  while (URL) {
    try {
      const res = await nodeFetch(URL);
      const data = await res.json();
      answer = answer.concat(
        await search(
          data.results.map((x) => x.url),
          param
        )
      );
      URL = data.next;
    } catch (err) {
      console.log(err);
    }
  }
  return answer;
}

async function search(itemsArr, param) {
  const x = await Promise.all(
    itemsArr.map(async (y) => {
      try {
        const res2 = await nodeFetch(y);
        const data2 = await res2.json();
        const paramAttributes = Object.keys(param);
        if (!paramAttributes.every({}.hasOwnProperty.bind(data2))) {
          console.log(
            "Input object properties does not match the API response object properties..."
          );
          console.log("Terminating execution...");
          process.exit(1);
        }
        if (paramAttributes.every((curr) => param[curr] === data2[curr]))
          return y;
        return null;
      } catch (err) {
        console.log(err);
      }
    })
  );
  return [...new Set(x.filter(Boolean))];
}

let ans = searchAPI("https://pokeapi.co/api/v2/item/", {
  cost: 3000,
  fling_power: 30,
  fling_effect: null,
  baby_trigger_for: null,
});
ans.then((x) => console.log(x));

ans = searchAPI("https://pokeapi.co/api/v2/move/", {
  accuracy: 85,
  pp: 40,
  priority: 0,
  power: null,
});
ans.then((x) => console.log(x));

ans = searchAPI("https://pokeapi.co/api/v2/pokemon/", {
  height: 13,
  weight: 1,
  base_experience: 62,
});
ans.then((x) => console.log(x));
