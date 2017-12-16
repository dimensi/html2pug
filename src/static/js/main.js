function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

ready(function () {
  const mapOfElements = {
    spaces: document.querySelector('#spaceValue'),
    tabs: document.querySelector('#tabs'),
    bodyless: document.querySelector('#bodyless'),
    noattrcomma: document.querySelector('#noattrcomma'),
    donotencode: document.querySelector('#donotencode'),
    double: document.querySelector('#double')
  }

  /**
     * Создаю html редактор
     * @type {object}
     */
  var htmlAce = ace.edit('html')
  htmlAce.setTheme('ace/theme/chrome')
  htmlAce.getSession().setMode('ace/mode/html')
  htmlAce.$blockScrolling = Infinity
  htmlAce.setFontSize(14)

  /**
     * Создаю jade редактор
     * @type {object}
     */
  var jade = ace.edit('jade')
  jade.setTheme('ace/theme/chrome')
  jade.getSession().setMode('ace/mode/jade')
  jade.$blockScrolling = Infinity
  jade.setFontSize(14)

  /**
     * Передаю пример в html редактор
     * @type {String}
     */
  if (!getFromStorage()) {
    htmlAce.getSession().setValue(defaultText)
  } else {
    setParamsFromStorage(getFromStorage(), htmlAce, mapOfElements)
  }

  /**
     * Функция передает по ajax html код и получает jade
     * @param {String}   html        содержимое htmlAce
     * @param {Bool}   tabs        [description]
     * @param {Int}   spaces      [description]
     * @param {Bool}   bodyless    [description]
     * @param {Bool}   noattrcomma [description]
     */
  function convert (html, options) {
    /**
     * Отправляю POST и поменящаю содержимое в jade
     */
    aja()
      .method('post')
      .url('/convert')
      .body({ html, options })
      .on('200', function (response) {
        jade.getSession().setValue(response.jade)
        if (document.querySelector('#save').checked) {
          saveToStorage({ html, options })
          document.querySelector('#save').checked = false
        }
      })
      .go()
  }

  /**
     * Если выбраны табы, то spaceValueField скрыто
     */
  document.getElementById('tabs-or-space').onclick = function () {
    var tabs = document.getElementById('tabs')
    var spaceValueField = document.getElementById('spaceValueField')

    if (tabs.checked) {
      spaceValueField.style.opacity = 0
    } else {
      spaceValueField.style.opacity = 1
    }
  }

  function iftrue (el) {
    if (el) {
      return true
    } else {
      return false
    }
  }
  /**
     * По кнопке передаю все в функцию
     */
  document.querySelector('#convert').onclick = function () {
    const html = htmlAce.getValue()
    const options = {}

    Object.keys(mapOfElements).forEach(key => {
      const el = mapOfElements[key]
      if (el.type === 'checkbox' || el.type === 'radio') {
        options[key] = iftrue(el.checked)
      }

      if (el.type === 'text') {
        options[key] = el.value
      }
    })

    if (options.tabs) {
      delete options.spaces
    }

    convert(html, options)
  }
})

const keyStore = 'html2pug_params'
function saveToStorage (params) {
  window.localStorage.setItem(keyStore, JSON.stringify(params))
}

function getFromStorage () {
  return JSON.parse(window.localStorage.getItem(keyStore))
}

function setParamsFromStorage (params, htmlEditor, mapOfElements) {
  if (params.html) {
    htmlEditor.getSession().setValue(params.html)
  } else {
    htmlEditor.getSession().setValue(defaultText)
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
}

const defaultText = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Jade</title>
    <script type="text/javascript">
      foo = true;
      bar = function () {};
      if (foo) {
        bar(1 + 5)
      }jQuery
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
