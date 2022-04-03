import { JSDOM } from "jsdom";

const domGlobals = ["window"];
const windowGlobals = ["document", "navigator", "location", "XMLHttpRequest"];

export default function (markup, options = {}) {
  const dom = new JSDOM(markup, options);
  const names = [...domGlobals, ...windowGlobals];
  const values = names.map((name) => global[name]);

  for (const name of domGlobals) {
    global[name] = dom[name];
  }

  for (const name of windowGlobals) {
    global[name] = dom.window[name];
  }

  dom.resetGlobals = () => {
    for (const name of names) {
      global[name] = values[name];
    }
  };

  return dom;
}
