import { convert } from 'xhtml2pug'

export const wrappedConvert = (html, { tabs, nSpaces, ...options }) => {
  return convert(html, {
    ...options,
    symbol: tabs ? '\t' : ' '.repeat(nSpaces)
  })
}
