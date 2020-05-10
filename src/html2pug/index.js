const StringOutput = require('./StringOutput')
const Converter = require('./Converter')
const { applyOptions, parse } = require('./helpers')

async function convertHTML (html, options = {}) {
  // @ts-ignore
  const mergedOptions = applyOptions(options)

  try {
    const window = await parse(html)
    const output = new StringOutput(mergedOptions)
    const converter = new Converter(mergedOptions)
    converter.document(window.document, output)
    return output.final()
  } catch (errors) {
    return errors
  }
};

module.exports = convertHTML
