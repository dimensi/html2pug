const { convert } = require('xhtml2pug')

const wrappedConvert = ({ html, options: { tabs, nSpaces, ...options } }) => {
  return convert(html, {
    ...options,
    symbol: tabs ? '\t' : ' '.repeat(nSpaces)
  })
}

module.exports.convert = wrappedConvert
