import { ILocalStorageParams, TMapElements, IOptions } from "./types";

export function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

export const collectOptions = (form: HTMLFormElement) =>
  Array.from(new FormData(form)).reduce((options, [key, value]) => {
    if (key === "indent") {
      return {
        ...options,
        [key]: value as "spaces" | "tabs",
      };
    }

    const parsedValue = value === "on" ? true : Number(value);

    return {
      ...options,
      [key]: parsedValue,
    };
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
