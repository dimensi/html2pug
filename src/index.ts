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
} from "./helpers/helpers";
import { EXAMPLE_HTML } from "./helpers/example-html";
import { TOptions } from "./helpers/types";

const mapOfElements = {
  nSpaces: document.querySelector("#spaceValue"),
  tabs: document.querySelector("#tabs"),
  bodyLess: document.querySelector("#bodyLess"),
  attrComma: document.querySelector("#attrComma"),
  encode: document.querySelector("#encode"),
  doubleQuotes: document.querySelector("#doubleQuotes"),
  inlineCSS: document.querySelector("#inlineCSS"),
} as Record<string, HTMLInputElement>;

const htmlContainer = document.querySelector("#html");
const pugContainer = document.querySelector("#pug");
const switchButton = document.getElementById(
  "tabs-or-space"
) as HTMLInputElement;
const submitButton = document.querySelector("#convert") as HTMLButtonElement;
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
  if (!htmlContainer || !pugContainer) return;

  const restoredParams = getFromStorage();
  if (restoredParams) {
    setParamsFromStorage(restoredParams, mapOfElements);
  }
  /**
   * Creating html editor
   * @type {CodeMirror.Editor}
   */
  const htmlEditor = CodeMirror(htmlContainer, {
    value: (restoredParams && restoredParams.html) || EXAMPLE_HTML,
    mode: "htmlmixed",
    lineNumbers: true,
  });

  /**
   * Creating pug editor
   * @type {CodeMirror.Editor}
   */
  const pugEditor = CodeMirror(pugContainer, {
    mode: "pug",
    lineNumbers: true,
  });

  /**
   * Post text to api for convert html to pug
   * @param {string} html
   * @param {Options} options
   */
  function convert(html: string, { tabs, nSpaces, ...options }: TOptions) {
    const data = { html, options };
    const result = xhtml2pug(html, {
      ...options,
      symbol: tabs ? "\t" : " ".repeat(nSpaces as number),
    });
    pugEditor.setValue(result);
    saveToStorage(data);
  }

  /**
   * Если выбраны табы, то spaceValueField скрыто
   */
  switchButton.addEventListener("click", setOpacityForInput);

  /**
   * По кнопке передаю все в функцию
   */
  submitButton.addEventListener("click", () => {
    const html = htmlEditor.getValue();
    const options = collectOptions(mapOfElements);

    convert(html, options);
  });
});
