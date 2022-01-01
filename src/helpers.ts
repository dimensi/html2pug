import { ILocalStorageParams, TMapElements, TOptions } from "./types"

export function ready (fn: () => void) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

export const collectOptions = (mapOfElements: TMapElements) =>
  Object.keys(mapOfElements).reduce((options, key) => {
    const el = mapOfElements[key]
    
    if (['checkbox', 'radio'].includes(el.getAttribute('type') ?? '')) {
      return {
        ...options,
        [key]: el.checked
      }
    }

    if (el.type === 'text') {
      return {
        ...options,
        [key]: Number(el.value)
      }
    }

    return options
  }, {} as TOptions)

const KEY_STORE = 'html2pug_params'

export function saveToStorage ({ html, options }: ILocalStorageParams) {
  const saveCheckbox = document.querySelector('#save') as HTMLInputElement;

  if (!saveCheckbox.checked) return
  const toSave = { html, options }
  window.localStorage.setItem(KEY_STORE, JSON.stringify(toSave))
  saveCheckbox.checked = false
}


export function getFromStorage (): ILocalStorageParams | null {
  const data = window.localStorage.getItem(KEY_STORE);
  if (!data) return null;
  return JSON.parse(data)
}

export function setOpacityForInput () {
  const tabs = document.getElementById('tabs') as HTMLInputElement
  const spaceValueField = document.getElementById('spaceValueField') as HTMLElement

  if (tabs.checked) {
    spaceValueField.style.opacity = '0'
  } else {
    spaceValueField.style.opacity = '1'
  }
}

export function setParamsFromStorage (params: ILocalStorageParams, mapOfElements: TMapElements) {
  if (!params.options) {
    return
  }

  Object.keys(params.options).forEach(key => {
    const el = mapOfElements[key]

    if (el.type === 'radio' || el.type === 'checkbox') {
      el.checked = params.options[key] as boolean
    }

    if (el.type === 'text') {
      el.value = `${params.options[key]}`
    }
  })

  setOpacityForInput()
}
