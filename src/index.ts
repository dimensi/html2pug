import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/pug/pug.js";
import CodeMirror from "codemirror";
import { convert as xhtml2pug } from "xhtml2pug";

import {
  ready,
  getFromStorage,
  saveToStorage,
  setOpacityForInput,
  setParamsFromStorage,
  collectOptions,
} from "./helpers";
import { EXAMPLE_HTML } from "./example-html";

const mapOfElements = {
  nSpaces: document.querySelector("#spaceValue"),
  tabs: document.querySelector("#tabs"),
  bodyLess: document.querySelector("#bodyLess"),
  attrComma: document.querySelector("#attrComma"),
  encode: document.querySelector("#encode"),
  doubleQuotes: document.querySelector("#doubleQuotes"),
  inlineCSS: document.querySelector("#inlineCSS"),
};

/**
 * @typedef Options
 * @type {object}
 * @prop {boolean} tabs
 * @prop {number} nspaces number of spaces
 * @prop {boolean} bodyless
 * @prop {boolean} noattrcomma
 * @prop {boolean} donotencode
 * @prop {boolean} double
 */

ready(function () {
  const restoredParams = getFromStorage();
  if (restoredParams) {
    setParamsFromStorage(restoredParams, mapOfElements);
  }

  /**
   * Creating html editor
   * @type {CodeMirror.Editor}
   */
  const htmlEditor = CodeMirror(document.querySelector("#html"), {
    value: (restoredParams && restoredParams.html) || EXAMPLE_HTML,
    mode: "htmlmixed",
    lineNumbers: true,
  });

  /**
   * Creating pug editor
   * @type {CodeMirror.Editor}
   */
  const pugEditor = CodeMirror(document.querySelector("#pug"), {
    mode: "pug",
    lineNumbers: true,
  });

  /**
   * Post text to api for convert html to pug
   * @param {string} html
   * @param {Options} options
   */
  function convert(html, { tabs, nSpaces, ...options }) {
    const data = { html, options };
    const result = xhtml2pug(html, {
      ...options,
      symbol: tabs ? '\t' : ' '.repeat(nSpaces)
    })
    pugEditor.setValue(result);
    saveToStorage(data);
  }

  /**
   * Если выбраны табы, то spaceValueField скрыто
   */
  document
    .getElementById("tabs-or-space")
    .addEventListener("click", setOpacityForInput);

  /**
   * По кнопке передаю все в функцию
   */
  document.querySelector("#convert").onclick = function () {
    const html = htmlEditor.getValue();
    const options = collectOptions(mapOfElements);

    convert(html, options);
  };
});
