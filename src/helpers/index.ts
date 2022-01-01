import { ILocalStorageParams, TMapElements, IOptions } from "./types";

export function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

export const collectOptions = (form: HTMLFormElement) =>
  Object.entries(form.elements)
    .filter(([key]) => !/\d/.test(key))
    .reduce((options, [key, element]) => {
      if (key === "indent" && element instanceof RadioNodeList) {
        return {
          ...options,
          [key]: element.value as 'spaces' | 'tabs',
        };
      }

      if (element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)) {
        

        return {
          ...options,
          [key]: element.checked,
        };
      }

      if (element instanceof HTMLInputElement && element.type === 'text') {
        return {
          ...options,
          [key]: parseInt(element.value, 10)
        }
      }

      return options
    }, {} as Partial<IOptions>);

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
