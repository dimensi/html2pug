const jsdom = require('jsdom-little')

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

function __range__ (left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}

const defaultOptions = () => ({
  entOptions: {
    useNamedReferences: true
  },
  useTabs: false,
  doNotEncode: false,
  nspaces: 2
})

const applyOptions = ({ numeric, nspaces, tabs, donotencode, ...options }) => {
  const newOptions = defaultOptions()
  if (options.numeric != null) { newOptions.entOptions.useNamedReferences = !options.numeric }
  if (options.nspaces != null) { newOptions.nspaces = parseInt(options.nspaces) }
  if (options.tabs != null) { newOptions.useTabs = !!options.tabs }
  if (options.donotencode != null) { newOptions.doNotEncode = !!options.donotencode }
  return { ...newOptions, ...options }
}

function parse (text) {
  return new Promise((resolve, reject) => {
    jsdom.env(text, (errors, window) => {
      if (errors) {
        reject(errors)
      } else {
        resolve(window)
      }
    })
  })
}

const validJadeIdRegExp = /^[\w-]+$/
const validJadeClassRegExp = /^[\w-]+$/

const isValidJadeId = id => {
  id = id ? id.trim() : ''
  return id && validJadeIdRegExp.test(id)
}

const isValidJadeClassName = className => {
  className = className ? className.trim() : ''
  return className && validJadeClassRegExp.test(className)
}

module.exports = {
  __guard__,
  __range__,
  parse,
  applyOptions,
  isValidJadeClassName,
  isValidJadeId
}
