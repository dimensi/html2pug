const { convert } = require('xhtml2pug')

/**
 *
 * @param noattrcomma
 * @param bodyless
 * @param donotencode
 * @param double
 * @param inlineCSS
 * @param nspaces
 * @param tabs
 * @returns {{ bodyLess: boolean, attrComma: boolean, encode: boolean, doubleQuotes: boolean, inlineCSS: boolean, symbol: string }}
 */
const convertOptions = ({ noattrcomma, bodyless, donotencode, double, inlineCSS, nspaces, tabs } = {}) => ({
  inlineCSS,
  encode: !donotencode,
  attrComma: !noattrcomma,
  doubleQuotes: !!double,
  bodyLess: !!bodyless,
  symbol: tabs ? '\t' : ' '.repeat(nspaces)
})

const wrappedConvert = (html, options) => {
  return convert(html, convertOptions(options))
}

module.exports.convert = wrappedConvert
