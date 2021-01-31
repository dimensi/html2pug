export function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

/**
 *
 * @param {Object<string, HTMLElement>} mapOfElements
 */
export const collectOptions = mapOfElements =>
  Object.keys(mapOfElements).reduce((options, key) => {
    const el = mapOfElements[key]
    if (el.type === 'checkbox' || el.type === 'radio') {
      options[key] = el.checked
    }

    if (el.type === 'text') {
      options[key] = Number(el.value)
    }

    return options
  }, {})

const KEY_STORE = 'html2pug_params'

export function saveToStorage ({ html, options }) {
  const saveCheckbox = document.querySelector('#save')

  if (!saveCheckbox.checked) return
  const toSave = { html, options }
  window.localStorage.setItem(KEY_STORE, JSON.stringify(toSave))
  saveCheckbox.checked = false
}

function updateOldStorage() {
  const result = JSON.parse(window.localStorage.getItem(KEY_STORE) ?? '{}')
  if (result.options && result.options.bodyless) {
    const options = result.options
    const newOptions = {
      bodyLess: options.bodyless,
      encode: !options.donotencode,
      doubleQuotes: options.double,
      inlineCSS: options.inlineCSS,
      attrComma: !options.noattrcomma,
      nSpaces: options.nspaces ?? 2,
      tabs: options.tabs ?? false,
    }
    window.localStorage.setItem(KEY_STORE, JSON.stringify({
      ...result,
      options: newOptions
    }))
  }
}

export function getFromStorage () {
  updateOldStorage();
  return JSON.parse(window.localStorage.getItem(KEY_STORE) ?? '{}')
}

export function setOpacityForInput () {
  const tabs = document.getElementById('tabs')
  const spaceValueField = document.getElementById('spaceValueField')

  if (tabs.checked) {
    spaceValueField.style.opacity = 0
  } else {
    spaceValueField.style.opacity = 1
  }
}

export function setParamsFromStorage (params, mapOfElements) {
  if (!params.options) {
    return
  }

  Object.keys(params.options).forEach(key => {
    const el = mapOfElements[key]

    if (el.type === 'radio' || el.type === 'checkbox') {
      el.checked = params.options[key]
    }

    if (el.type === 'text') {
      el.value = params.options[key]
    }
  })

  setOpacityForInput()
}
