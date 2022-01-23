import { ILocalStorageParams, IOptions } from "./types";

export function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

const defaultOptions: IOptions = {
  attrComma: false,
  bodyLess: false,
  classesAtEnd: false,
  doubleQuotes: false,
  encode: false,
  indent: "spaces",
  inlineCSS: false,
  nSpaces: 2,
  parser: "html",
  save: false,
};

export const collectOptions = (form: HTMLFormElement) => ({
  ...defaultOptions,
  ...Object.fromEntries(
    Array.from(new FormData(form).entries()).map(([key, value]) => [
      key,
      value === "on" ? true : value,
    ])
  ),
});

const KEY_STORE = "html2pug_params";

export function saveToStorage(data: ILocalStorageParams) {
  window.localStorage.setItem(KEY_STORE, JSON.stringify(data));
}

export function getFromStorage(): ILocalStorageParams | null {
  const data = window.localStorage.getItem(KEY_STORE);
  if (!data) return null;
  return JSON.parse(data);
}

export function setParamsFromStorage(
  form: HTMLFormElement,
  params: ILocalStorageParams
) {
  Object.entries(params.options).forEach(([key, value]) => {
    const el = form.elements.namedItem(key);

    if (!el) return;

    if (el instanceof HTMLInputElement && typeof value === "boolean") {
      el.checked = value;
    }
    if (el instanceof RadioNodeList && typeof value === "string") {
      el.value = value;
    }

    if (el instanceof HTMLInputElement && typeof value === "number") {
      el.value = `${value}`;
    }
  });
}
