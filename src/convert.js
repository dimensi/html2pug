const html2jade = require('html2jade')

const convert = async (html, options) => {
  const settings = {
    noemptypipe: true,
    ...options
  }

  return new Promise((resolve, reject) => {
    html2jade.convertHtml(html, settings, (err, pug) => {
      if (err) {
        return reject(err)
      }

      resolve(pug)
    })
  })
}

module.exports.convert = convert
