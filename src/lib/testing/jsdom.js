import { JSDOM } from "jsdom";

export default function (markup, options = {}) {
  const dom = new JSDOM(markup, options);

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;

  return dom;
}
