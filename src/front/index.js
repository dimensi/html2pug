import 'whatwg-fetch'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/pug/pug'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import './style.css'
import {
  ready,
  getFromStorage,
  saveToStorage,
  DEFAULT_TEXT,
  setOpacityForInput,
  setParamsFromStorage,
  collectOptions
} from './helpers'

const mapOfElements = {
  nspaces: document.querySelector('#spaceValue'),
  tabs: document.querySelector('#tabs'),
  bodyless: document.querySelector('#bodyless'),
  noattrcomma: document.querySelector('#noattrcomma'),
  donotencode: document.querySelector('#donotencode'),
  double: document.querySelector('#double')
}

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
  const restoredParams = getFromStorage()
  if (restoredParams) {
    setParamsFromStorage(restoredParams, mapOfElements)
  }
  /**
   * Creating html editor
   * @type {CodeMirror.Editor}
   */
  const htmlEditor = CodeMirror(document.querySelector('#html'), {
    value: (restoredParams && restoredParams.html) || DEFAULT_TEXT,
    mode: 'htmlmixed',
    lineNumbers: true
  })

  /**
   * Creating pug editor
   * @type {CodeMirror.Editor}
   */
  const pugEditor = CodeMirror(document.querySelector('#pug'), {
    mode: 'pug',
    lineNumbers: true
  })

  /**
   * Post text to server for convert html to pug
   * @param {string} html
   * @param {Options} options
   */
  function convert (html, options) {
    const data = { html, options }
    fetch('/convert', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => res.json())
      .then(({ pug }) => {
        if (pug) {
          pugEditor.setValue(pug)
          saveToStorage(data)
        }
      })
  }

  /**
   * Если выбраны табы, то spaceValueField скрыто
   */
  document
    .getElementById('tabs-or-space')
    .addEventListener('click', setOpacityForInput)

  /**
   * По кнопке передаю все в функцию
   */
  document.querySelector('#convert').onclick = function () {
    const html = htmlEditor.getValue()
    const options = collectOptions(mapOfElements)

    if (options.tabs) {
      delete options.nspaces
    }

    convert(html, options)
  }
})
