import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/pug/pug.js";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import { convert as xhtml2pug } from "xhtml2pug";

import {
  ready,
  getFromStorage,
  saveToStorage,
  setParamsFromStorage,
  collectOptions,
} from "./helpers";
import EXAMPLE_HTML from "./example.html?raw";
import { IOptions } from "./helpers/types";

const htmlContainer = document.querySelector("#html");
const pugContainer = document.querySelector("#pug");
const form = document.querySelector("form")!;

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
    setParamsFromStorage(form, restoredParams);
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

  htmlEditor.setSize("100%", "100%");

  /**
   * Creating pug editor
   * @type {CodeMirror.Editor}
   */
  const pugEditor = CodeMirror(pugContainer, {
    mode: "pug",
    lineNumbers: true,
  });

  pugEditor.setSize("100%", "100%");

  /**
   * Post text to api for convert html to pug
   * @param {string} html
   * @param {Options} options
   */
  function convert(
    html: string,
    { nSpaces, indent, save, ...options }: Partial<IOptions>
  ) {
    try {
      const result = xhtml2pug(html, {
        ...options,
        symbol: indent === "tabs" ? "\t" : " ".repeat(nSpaces ?? 2),
      });
      pugEditor.setValue(result);
    } catch (err) {
      pugEditor.setValue((err as Error).message + "\n" + (err as Error).stack);
    }

    if (save) {
      saveToStorage({ html, options: { ...options, nSpaces, indent } });

      const saveCheckbox = document.querySelector("#save") as HTMLInputElement;
      saveCheckbox.checked = false;
    }
  }

  /**
   * По кнопке передаю все в функцию
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const html = htmlEditor.getValue();
    const options = collectOptions(form);
    convert(html, options);
  });
});
