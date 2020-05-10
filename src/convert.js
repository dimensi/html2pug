const html2pug = require('./html2pug')

const convert = (html, options) => {
  const settings = {
    noemptypipe: true,
    ...options
  }
  return html2pug(html, settings)
}

module.exports.convert = convert
