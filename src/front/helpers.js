export function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

export const DEFAULT_TEXT = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Pug</title>
    <script type="text/javascript">
      foo = true;
      bar = function () {};
      if (foo) {
        bar(1 + 5)
      }
    </script>
  </head>
  <body>
    <h1>Jade - node template engine</h1>
    <div id="container" class="col">
      <p>You are amazing</p>
      <p>Jade is a terse and simple
         templating language with a
         strong focus on performance
         and powerful features.</p>
    </div>
  </body>
</html>`

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

export function getFromStorage () {
  return JSON.parse(window.localStorage.getItem(KEY_STORE))
}

export function setOpacityForInput () {
  var tabs = document.getElementById('tabs')
  var spaceValueField = document.getElementById('spaceValueField')

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
